/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import Motion from "~/controls/Motion";
import RotationIndicator from "../ui/RotationIndicator";
import * as DEFAULT from "~/consts/default";
import * as TOUCH from "~/consts/touch";
import { XRRenderContext, XRContext, XRInputs } from "~/types/internal";
import { getRotationAngle } from "~/utils";
import ARControl from "./ARControl";

/**
 * Options for {@link ARSwirlControl}
 * @category Controls-AR
 * @interface
 * @property {number} [scale=1] Scale(speed) factor of the rotation
 * @property {boolean} [showIndicator=true] Whether to show rotation indicator or not.
 */
export interface ARSwirlControlOption {
  scale: number;
  showIndicator: boolean;
}

/**
 * One finger swirl control on single axis
 * @category Controls-AR
 */
class ARSwirlControl implements ARControl {
  /**
   * Current rotation value
   */
  public readonly rotation = new THREE.Quaternion();

  // Options
  private _userScale: number;

  // Internal States
  private _axis = new THREE.Vector3(0, 1, 0);
  private _enabled = true;
  private _active = false;

  private _prevPos = new THREE.Vector2();
  private _fromQuat = new THREE.Quaternion();
  private _toQuat = new THREE.Quaternion();

  private _motion: Motion;
  private _rotationIndicator: RotationIndicator | null;

  /**
   * Whether this control is enabled or not.
   * @readonly
   */
  public get enabled() { return this._enabled; }
  /**
   * Scale(speed) factor of this control.
   */
  public get scale() { return this._userScale; }

  public set scale(val: number) { this._userScale = val; }

  /**
   * Create new ARSwirlControl
   * @param {ARSwirlControlOption} [options={}] Options
   */
  constructor({
    scale = 1,
    showIndicator = true,
  }: Partial<ARSwirlControlOption> = {}) {
    this._motion = new Motion({ range: DEFAULT.INFINITE_RANGE });
    this._userScale = scale;

    if (showIndicator) {
      this._rotationIndicator = new RotationIndicator();
    }
  }

  public init({ view3d }: XRRenderContext) {
    const initialRotation = view3d.model!.scene.quaternion;
    this.updateRotation(initialRotation);

    if (this._rotationIndicator) {
      view3d.scene.add(this._rotationIndicator.object);
    }
  }

  public destroy({ view3d }: XRContext) {
    if (this._rotationIndicator) {
      view3d.scene.remove(this._rotationIndicator.object);
    }
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

  public activate({ view3d }: XRRenderContext, gesture: TOUCH.GESTURE) {
    if (!this._enabled) return;

    this._active = true;

    const model = view3d.model!;
    const rotationIndicator = this._rotationIndicator;

    if (rotationIndicator) {
      rotationIndicator.show();
      rotationIndicator.updatePosition(model.bbox.getCenter(new THREE.Vector3()));
      rotationIndicator.updateScale(model.size / 2);
      rotationIndicator.updateRoation(model.scene.quaternion);
    }
  }

  public deactivate() {
    this._active = false;

    if (this._rotationIndicator) {
      this._rotationIndicator.hide();
    }
  }

  public updateAxis(axis: THREE.Vector3) {
    this._axis.copy(axis);
  }

  public setInitialPos(coords: THREE.Vector2[]) {
    this._prevPos.copy(coords[0]);
  }

  public process({ view3d, xrCam }: XRRenderContext, { coords }: XRInputs) {
    if (!this._active || coords.length !== 1) return;

    const prevPos = this._prevPos;
    const motion = this._motion;

    const model = view3d.model!;
    const coord = coords[0];

    const modelPos = model.scene.position.clone();
    const ndcModelPos = new THREE.Vector2().fromArray(modelPos.project(xrCam).toArray());

    // Get the rotation angle with the model's NDC coordinates as the center.
    const rotationAngle = getRotationAngle(ndcModelPos, prevPos, coord);
    const rotation = new THREE.Quaternion().setFromAxisAngle(this._axis, rotationAngle);
    const interpolated = this._getInterpolatedQuaternion();

    this._fromQuat.copy(interpolated);
    this._toQuat.premultiply(rotation);

    motion.reset(0);
    motion.setEndDelta(1);

    prevPos.copy(coord);
  }

  public update({ model }: XRRenderContext, deltaTime: number) {
    if (!this._active) return;

    const motion = this._motion;
    motion.update(deltaTime);

    const interpolated = this._getInterpolatedQuaternion();

    this.rotation.copy(interpolated);
    model.scene.quaternion.copy(interpolated);
  }

  private _getInterpolatedQuaternion(): THREE.Quaternion {
    const motion = this._motion;
    const toEuler = this._toQuat;
    const fromEuler = this._fromQuat;

    const progress = motion.val;

    return new THREE.Quaternion().copy(fromEuler).slerp(toEuler, progress);
  }
}

export default ARSwirlControl;
