/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import Motion from "../../core/Motion";
import * as DEFAULT from "../../const/default";
import { EASING } from "../../const/external";
import { XRRenderContext, XRInputs } from "../../type/xr";

import ARControl from "./ARControl";

enum STATE {
  WAITING,
  TRANSLATING,
  BOUNCING,
}

/**
 * Options for {@link ARFloorTranslateControl}
 * @interface
 * @property {number} [threshold=0.05] Threshold until translation works, this value is relative to screen size.
 * @property {number} [hoverAmplitude=0.01] How much model will hover up and down, in meter. Default value is 0.01(1cm).
 * @property {number} [hoverHeight=0.1] How much model will float from the floor, in meter. Default value is 0.1(10cm).
 * @property {number} [hoverPeriod=1000] Hover cycle's period, in milisecond.
 * @property {function} [hoverEasing=EASING.SINE_WAVE] Hover animation's easing function.
 * @property {number} [bounceDuration=1000] Bounce-to-floor animation's duration, in milisecond.
 * @property {number} [bounceEasing=EASING.EASE_OUT_BOUNCE] Bounce-to-floor animation's easing function.
 */
export interface ARTranslateControlOptions {
  threshold: number;
  hoverAmplitude: number;
  hoverHeight: number;
  hoverPeriod: number;
  hoverEasing: (x: number) => number;
  bounceDuration: number;
  bounceEasing: (x: number) => number;
}

/**
 * Model's translation(position) control for {@link ARFloorControl}
 */
class ARTranslateControl implements ARControl {
  // Options
  private _hoverAmplitude: number;
  private _hoverHeight: number;

  // Internal states
  private _hoverPosition = new THREE.Vector3();
  private _floorPosition = new THREE.Vector3();
  private _dragPlane = new THREE.Plane();
  private _enabled = true;
  private _state = STATE.WAITING;
  private _initialPos = new THREE.Vector2();
  private _bounceMotion: Motion;

  /**
   * Whether this control is enabled or not
   * @readonly
   */
  public get enabled() { return this._enabled; }
  /**
   * Last detected floor position
   * @readonly
   */
  public get floorPosition() { return this._floorPosition.clone(); }
  /**
   * How much model will hover up and down, in meter.
   */
  public get hoverAmplitude() { return this._hoverAmplitude; }
  /**
   * How much model will float from the floor, in meter.
   */
  public get hoverHeight() { return this._hoverHeight; }

  public set hoverAmplitude(val: number) { this._hoverAmplitude = val; }
  public set hoverHeight(val: number) { this._hoverHeight = val; }

  /**
   * Create new instance of ARTranslateControl
   * @param {ARFloorTranslateControlOption} [options={}] Options
   */
  public constructor({
    hoverAmplitude = 0.01,
    hoverHeight = 0.1,
    bounceDuration = 1000,
    bounceEasing = EASING.EASE_OUT_BOUNCE
  }: Partial<ARTranslateControlOptions> = {}) {
    this._hoverAmplitude = hoverAmplitude;
    this._hoverHeight = hoverHeight;
    this._bounceMotion = new Motion({
      duration: bounceDuration,
      easing: bounceEasing,
      range: DEFAULT.INFINITE_RANGE
    });
  }

  public initFloorPosition(position: THREE.Vector3) {
    this._floorPosition.copy(position);
    this._hoverPosition.copy(position);
    this._hoverPosition.setY(position.y + this._hoverHeight);
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
    this.deactivate();
    this._enabled = false;
  }

  public activate() {
    if (!this._enabled) return;

    this._dragPlane.set(new THREE.Vector3(0, 1, 0), -(this._floorPosition.y + this._hoverHeight));
    this._state = STATE.TRANSLATING;
  }

  public deactivate() {
    if (!this._enabled || this._state === STATE.WAITING) {
      this._state = STATE.WAITING;
      return;
    }

    this._state = STATE.BOUNCING;

    const floorPosition = this._floorPosition;
    const hoverPosition = this._hoverPosition;
    const bounceMotion = this._bounceMotion;

    const hoveringAmount = hoverPosition.y - floorPosition.y;
    bounceMotion.reset(hoveringAmount);
    bounceMotion.setEndDelta(-hoveringAmount);
  }

  public setInitialPos(coords: THREE.Vector2[]) {
    this._initialPos.copy(coords[0]);
  }

  public process({ frame, referenceSpace, xrCam }: XRRenderContext, { hitResults }: XRInputs) {
    const state = this._state;
    const notActive = state === STATE.WAITING || state === STATE.BOUNCING;
    if (!hitResults || hitResults.length !== 1 || notActive) return;

    const hitResult = hitResults[0];

    const prevFloorPosition = this._floorPosition.clone();
    const floorPosition = this._floorPosition;
    const hoverPosition = this._hoverPosition;
    const hoverHeight = this._hoverHeight;
    const dragPlane = this._dragPlane;

    const hitPose = hitResult.results[0] && hitResult.results[0].getPose(referenceSpace);
    const isFloorHit = hitPose && hitPose.transform.matrix[5] >= 0.75;
    const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);

    if (frame && (!hitPose || !isFloorHit)) {
      // Use previous drag plane if no hit plane is found
      const targetRayPose = frame.getPose(hitResult.inputSource.targetRaySpace, referenceSpace);
      if (!targetRayPose) return;

      const rayPos = targetRayPose.transform.position;
      const fingerPos = new THREE.Vector3(rayPos.x, rayPos.y, rayPos.z);
      const fingerDir = fingerPos.sub(camPos).normalize();

      const fingerRay = new THREE.Ray(camPos, fingerDir);
      const intersection = fingerRay.intersectPlane(dragPlane, new THREE.Vector3());

      if (intersection) {
        floorPosition.copy(intersection);
        floorPosition.setY(prevFloorPosition.y);
        hoverPosition.copy(intersection);
      }
      return;
    }

    const hitMatrix = new THREE.Matrix4().fromArray(hitPose.transform.matrix);
    const hitPosition = new THREE.Vector3().setFromMatrixPosition(hitMatrix);

    // Set new floor level when it's increased at least 10cm
    const currentDragPlaneHeight = -dragPlane.constant;
    const hitDragPlaneHeight = hitPosition.y + hoverHeight;

    if (hitDragPlaneHeight - currentDragPlaneHeight > 0.1) {
      dragPlane.constant = -hitDragPlaneHeight;
    }

    const camToHitDir = new THREE.Vector3().subVectors(hitPosition, camPos).normalize();
    const camToHitRay = new THREE.Ray(camPos, camToHitDir);
    const hitOnDragPlane = camToHitRay.intersectPlane(dragPlane, new THREE.Vector3());

    if (!hitOnDragPlane) return;

    floorPosition.copy(hitOnDragPlane);
    floorPosition.setY(hitPosition.y);
    hoverPosition.copy(hitOnDragPlane);
  }

  public update({ scene }: XRRenderContext, delta: number) {
    const state = this._state;
    const floorPosition = this._floorPosition;
    const hoverPosition = this._hoverPosition;

    if (state === STATE.BOUNCING) {
      const bounceMotion = this._bounceMotion;

      bounceMotion.update(delta);
      hoverPosition.setY(floorPosition.y + bounceMotion.val);

      if (bounceMotion.progress >= 1) {
        this._state = STATE.WAITING;
      }
    }

    scene.setRootPosition(floorPosition);
    scene.setModelHovering(hoverPosition.y - floorPosition.y);
  }
}

export default ARTranslateControl;
