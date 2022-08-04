/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import Motion from "../../core/Motion";
import * as DEFAULT from "../../const/default";
import { getRotationAngle } from "../../utils";
import { XRRenderContext, XRInputs } from "../../type/xr";

import ARControl from "./ARControl";


/**
 * Options for {@link ARSwirlControl}
 * @interface
 * @param {number} [scale=1] Scale(speed) factor of the rotation
 */
export interface ARSwirlControlOptions {
  scale: number;
}

/**
 * One finger swirl control on single axis
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
  private _enabled = false;
  private _active = false;

  private _prevPos = new THREE.Vector2();
  private _fromQuat = new THREE.Quaternion();
  private _toQuat = new THREE.Quaternion();

  private _motion: Motion;

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
   * @param {ARSwirlControlOptions} [options={}] Options
   * @param {number} [options.scale=1] Scale(speed) factor of the rotation
   * @param {boolean} [options.showIndicator=true] Whether to show rotation indicator or not.
   */
  public constructor({
    scale = 1
  }: Partial<ARSwirlControlOptions> = {}) {
    this._motion = new Motion({ range: DEFAULT.INFINITE_RANGE });
    this._userScale = scale;
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

  public activate() {
    if (!this._enabled) return;

    this._active = true;
  }

  public deactivate() {
    this._active = false;
  }

  public updateAxis(axis: THREE.Vector3) {
    this._axis.copy(axis);
  }

  public setInitialPos(coords: THREE.Vector2[]) {
    this._prevPos.copy(coords[0]);
  }

  public process({ scene, xrCam }: XRRenderContext, { coords }: XRInputs) {
    if (!this._active || coords.length !== 1) return;

    const prevPos = this._prevPos;
    const motion = this._motion;

    const coord = coords[0];

    const modelPos = scene.modelMovable.getWorldPosition(new THREE.Vector3());
    const ndcModelPos = new THREE.Vector2().fromArray(modelPos.project(xrCam).toArray());

    // Get the rotation angle with the model's NDC coordinates as the center.
    const rotationAngle = getRotationAngle(ndcModelPos, prevPos, coord) * this._userScale;
    const rotation = new THREE.Quaternion().setFromAxisAngle(this._axis, rotationAngle);
    const interpolated = this._getInterpolatedQuaternion();

    this._fromQuat.copy(interpolated);
    this._toQuat.premultiply(rotation);

    motion.reset(0);
    motion.setEndDelta(1);

    prevPos.copy(coord);
  }

  public update({ scene }: XRRenderContext, deltaTime: number) {
    if (!this._active) return;

    const motion = this._motion;
    motion.update(deltaTime);

    const interpolated = this._getInterpolatedQuaternion();

    this.rotation.copy(interpolated);
    scene.setModelRotation(interpolated);
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
