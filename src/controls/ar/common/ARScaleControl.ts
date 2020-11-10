/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import ARControl from "./ARControl";
import Motion from "~/controls/Motion";
import ScaleUI from "../ui/ScaleUI";
import * as TOUCH from "~/consts/touch";
import { XRRenderContext, XRContext, XRInputs } from "~/types/internal";

/**
 * Options for {@link ARScaleControl}
 * @category Controls-AR
 * @interface
 * @property {number} [min=0.05] Minimum scale, default is 0.05(5%)
 * @property {number} [max=2] Maximum scale, default is 2(200%)
 */
export interface ARScaleControlOption {
  min: number;
  max: number;
}

/**
 * Model's scale controller which works on AR(WebXR) mode.
 * @category Controls-AR
 */
class ARScaleControl implements ARControl {
  // TODO: add option for "user scale"

  // Internal states
  private _motion: Motion;
  private _enabled = true;
  private _active = false;
  private _prevCoordDistance = -1;
  private _scaleMultiplier = 1;
  private _initialScale = new THREE.Vector3();
  private _ui = new ScaleUI();

  /**
   * Whether this control is enabled or not
   * @readonly
   */
  public get enabled() { return this._enabled; }
  public get scale() {
    return this._initialScale.clone().multiplyScalar(this._scaleMultiplier);
  }
  public get scaleMultiplier() { return this._scaleMultiplier; }
  /**
   * Range of the scale
   * @readonly
   */
  public get range() { return this._motion.range; }

  /**
   * Create new instance of ARScaleControl
   * @param {ARScaleControlOption} [options={}] Options
   */
  constructor({
    min = 0.05,
    max = 2,
  } = {}) {
    this._motion = new Motion({ duration: 0, range: { min, max } });
    this._motion.reset(1); // default scale is 1(100%)
    this._ui = new ScaleUI();
  }

  public init({ view3d }: XRRenderContext) {
    this._initialScale.copy(view3d.model!.scene.scale);
    view3d.scene.add(this._ui.mesh);
  }

  public destroy({ view3d }: XRContext) {
    view3d.scene.remove(this._ui.mesh);
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

  public activate(ctx: XRRenderContext, gesture: TOUCH.GESTURE) {
    this._active = true;
    this._ui.show();
    this._updateUIPosition(ctx);
  }

  public deactivate() {
    this._active = false;
    this._ui.hide();
    this._prevCoordDistance = -1;
  }

  /**
   * Update scale range
   * @param min Minimum scale
   * @param max Maximum scale
   */
  public setRange(min: number, max: number) {
    this._motion.range = { min, max };
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

  public update({ model }: XRRenderContext, deltaTime: number) {
    if (!this._enabled || !this._active) return;

    const motion = this._motion;
    motion.update(deltaTime);

    this._scaleMultiplier = motion.val;
    this._ui.updateScale(this._scaleMultiplier);

    model.scene.scale.copy(this.scale);
  }

  private _updateUIPosition({ view3d, xrCam }: XRRenderContext) {
    // Update UI
    const model = view3d.model!;
    const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);
    const uiPos = model.scene.position.clone().setY(model.bbox.max.y);

    this._ui.updatePosition(uiPos, camPos);
  }
}

export default ARScaleControl;
