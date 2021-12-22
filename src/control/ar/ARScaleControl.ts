/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import Motion from "../../core/Motion";
import { XRRenderContext, XRInputs } from "../../type/xr";

import ARControl from "./ARControl";
import ScaleUI from "./ScaleUI";

/**
 * Options for {@link ARScaleControl}
 * @interface
 * @property {number} [min=0.05] Minimum scale, default is 0.05(5%)
 * @property {number} [max=2] Maximum scale, default is 2(200%)
 */
export interface ARScaleControlOptions {
  min: number;
  max: number;
}

/**
 * Model's scale controller which works on AR(WebXR) mode.
 */
class ARScaleControl implements ARControl {
  // TODO: add option for "user scale"

  // Internal states
  private _motion: Motion;
  private _enabled = false;
  private _active = false;
  private _prevCoordDistance = -1;
  private _scaleMultiplier = 1;
  private _ui = new ScaleUI();

  /**
   * Whether this control is enabled or not
   * @readonly
   */
  public get enabled() { return this._enabled; }
  public get scale() { return this._scaleMultiplier; }
  public get ui() { return this._ui; }

  public get scaleMultiplier() { return this._scaleMultiplier; }
  /**
   * Range of the scale
   * @readonly
   */
  public get range() { return this._motion.range; }

  /**
   * Create new instance of ARScaleControl
   * @param {ARScaleControlOptions} [options={}] Options
   * @param {number} [options.min=0.05] Minimum scale, default is 0.05(5%)
   * @param {number} [options.max=2] Maximum scale, default is 2(200%)
   */
  public constructor({
    min = 0.05,
    max = 2
  }: Partial<ARScaleControlOptions> = {}) {
    this._motion = new Motion({ duration: 0, range: { min, max } });
    this._motion.reset(1); // default scale is 1(100%)
    this._ui = new ScaleUI();
  }

  public setInitialPos(coords: THREE.Vector2[]) {
    this._prevCoordDistance = new THREE.Vector2().subVectors(coords[0], coords[1]).length();
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
    this.deactivate();
  }

  public activate(ctx: XRRenderContext) {
    this._active = true;
    this._ui.show();
    this._updateUIPosition(ctx);
  }

  public deactivate() {
    this._active = false;
    this._ui.hide();
    this._prevCoordDistance = -1;
  }

  public process(ctx: XRRenderContext, { coords }: XRInputs) {
    if (coords.length !== 2 || !this._enabled || !this._active) return;

    const motion = this._motion;
    const distance = new THREE.Vector2().subVectors(coords[0], coords[1]).length();
    const delta = (distance - this._prevCoordDistance);

    motion.setEndDelta(delta);
    this._prevCoordDistance = distance;

    this._updateUIPosition(ctx);
  }

  public update({ scene }: XRRenderContext, deltaTime: number) {
    if (!this._enabled || !this._active) return;

    const motion = this._motion;
    motion.update(deltaTime);

    this._scaleMultiplier = motion.val;
    this._ui.updateScale(this._scaleMultiplier);

    scene.setModelScale(this._scaleMultiplier);
  }

  private _updateUIPosition({ model, scene, xrCam, vertical }: XRRenderContext) {
    // Update UI
    const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);
    const modelHeight = vertical
      ? model.bbox.getBoundingSphere(new THREE.Sphere()).radius
      : model.bbox.max.y - model.bbox.min.y;

    this._ui.updatePosition(scene.root.quaternion, camPos, modelHeight);
  }
}

export default ARScaleControl;
