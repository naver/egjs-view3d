/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import RotationIndicator from "../ui/RotationIndicator";
import Motion from "../../../controls/Motion";
import * as DEFAULT from "../../../consts/default";
import * as TOUCH from "../../../consts/touch";
import { XRRenderContext, XRContext, XRInputs } from "../../../type/internal";

import ARControl from "./ARControl";

enum STATE {
  WAITING,
  ROTATE_HORIZONTAL,
  ROTATE_VERTICAL,
}

/**
 * Options for {@link ARSwipeControl}
 * @category Controls-AR
 * @interface
 * @property {number} [scale=1] Scale(speed) factor of the rotation
 */
export interface ARSwipeControlOption {
  scale: number;
}

/**
 * Two finger swipe control
 * @category Controls-AR
 */
class ARSwipeControl implements ARControl {
  /**
   * Current rotation value
   */
  public readonly rotation = new THREE.Quaternion();

  // Options
  private _userScale: number;

  // Internal States
  private _state = STATE.WAITING;
  private _enabled = true;
  private _active = false;

  private _prevPos = new THREE.Vector2();
  private _fromQuat = new THREE.Quaternion();
  private _toQuat = new THREE.Quaternion();

  private _horizontalAxis = new THREE.Vector3();
  private _verticalAxis = new THREE.Vector3();

  private _motion: Motion;
  private _rotationIndicator: RotationIndicator;

  /**
   * Whether this control is enabled or not.
   * @readonly
   */
  public get enabled() { return this._enabled; }
  /**
   * Scale(speed) factor of this control.
   */
  public get scale() { return this._userScale; }
  public get horizontalAxis() { return this._horizontalAxis; }
  public get verticalAxis() { return this._verticalAxis; }

  public set scale(val: number) { this._userScale = val; }

  /**
   * Create new ARSwipeControl
   * @param {ARSwipeControlOption} [options={}] Options
   */
  public constructor({
    scale = 1
  }: Partial<{
    scale: number;
  }> = {}) {
    this._motion = new Motion({ range: DEFAULT.INFINITE_RANGE });
    this._rotationIndicator = new RotationIndicator();
    this._userScale = scale;
  }

  public init({ view3d }: XRRenderContext) {
    const initialRotation = view3d.model!.scene.quaternion;
    this.updateRotation(initialRotation);
    view3d.scene.add(this._rotationIndicator.object);
  }

  public destroy({ view3d }: XRContext) {
    view3d.scene.remove(this._rotationIndicator.object);
  }

  public updateRotation(rotation: THREE.Quaternion) {
    this.rotation.copy(rotation);
    this._fromQuat.copy(rotation);
    this._toQuat.copy(rotation);
  }

  /**
   * Enable this control
   */
  public enable() {
    this._enabled = true;
  }

  /**
   * Disable this control
   */
  public disable() {
    this._enabled = false;
  }

  public updateAxis(horizontal: THREE.Vector3, vertical: THREE.Vector3) {
    this._horizontalAxis.copy(horizontal);
    this._verticalAxis.copy(vertical);
  }

  public activate({ view3d }: XRRenderContext, gesture: TOUCH.GESTURE) {
    if (!this._enabled) return;

    const model = view3d.model!;
    const rotationIndicator = this._rotationIndicator;

    this._active = true;
    rotationIndicator.show();
    rotationIndicator.updatePosition(model.bbox.getCenter(new THREE.Vector3()));
    rotationIndicator.updateScale(model.size / 2);

    if (gesture === TOUCH.GESTURE.TWO_FINGER_HORIZONTAL) {
      rotationIndicator.updateRotation(
        model.scene.quaternion.clone()
          .multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0))),
      );
      this._state = STATE.ROTATE_HORIZONTAL;
    } else if (gesture === TOUCH.GESTURE.TWO_FINGER_VERTICAL) {
      rotationIndicator.updateRotation(
        model.scene.quaternion.clone()
          .multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0))),
      );
      this._state = STATE.ROTATE_VERTICAL;
    }
  }

  public deactivate() {
    this._active = false;
    this._rotationIndicator.hide();
    this._state = STATE.WAITING;
  }

  public setInitialPos(coords: THREE.Vector2[]) {
    if (coords.length < 2) return;
    this._prevPos.set(
      (coords[0].x + coords[1].x) / 2,
      (coords[0].y + coords[1].y) / 2,
    );
  }

  public process(ctx: XRRenderContext, { coords }: XRInputs) {
    if (!this._active || coords.length !== 2) return;

    const state = this._state;
    const prevPos = this._prevPos;
    const motion = this._motion;
    const scale = this._userScale;

    const middlePos = new THREE.Vector2(
      (coords[0].x + coords[1].x) / 2,
      (coords[0].y + coords[1].y) / 2,
    );
    const posDiff = new THREE.Vector2().subVectors(prevPos, middlePos);

    const rotationAxis = state === STATE.ROTATE_HORIZONTAL
      ? this._horizontalAxis
      : this._verticalAxis;
    const rotationAngle = state === STATE.ROTATE_HORIZONTAL
      ? posDiff.x * scale
      : -posDiff.y * scale;

    const rotation = new THREE.Quaternion().setFromAxisAngle(rotationAxis, rotationAngle);
    const interpolated = this._getInterpolatedQuaternion();

    this._fromQuat.copy(interpolated);
    this._toQuat.premultiply(rotation);

    motion.reset(0);
    motion.setEndDelta(1);

    prevPos.copy(middlePos);
  }

  public update({ model }: XRRenderContext, deltaTime: number) {
    const motion = this._motion;
    motion.update(deltaTime);

    const interpolated = this._getInterpolatedQuaternion();

    this.rotation.copy(interpolated);
    model.scene.quaternion.copy(this.rotation);
  }

  private _getInterpolatedQuaternion(): THREE.Quaternion {
    const motion = this._motion;
    const toEuler = this._toQuat;
    const fromEuler = this._fromQuat;

    const progress = motion.val;

    return new THREE.Quaternion().copy(fromEuler).slerp(toEuler, progress);
  }
}

export default ARSwipeControl;
