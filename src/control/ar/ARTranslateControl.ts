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
  private _modelPosition = new THREE.Vector3();
  private _hoverPosition = new THREE.Vector3();
  private _floorPosition = new THREE.Vector3();
  private _dragPlane = new THREE.Plane();
  private _enabled = true;
  private _state = STATE.WAITING;
  private _initialPos = new THREE.Vector2();
  private _hoverMotion: Motion;
  private _bounceMotion: Motion;

  /**
   * Whether this control is enabled or not
   * @readonly
   */
  public get enabled() { return this._enabled; }
  /**
   * Position including hover/bounce animation offset from the floor.
   * @readonly
   */
  public get modelPosition() { return this._modelPosition.clone(); }
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
    hoverPeriod = 1000,
    hoverEasing = EASING.SINE_WAVE,
    bounceDuration = 1000,
    bounceEasing = EASING.EASE_OUT_BOUNCE
  }: Partial<ARTranslateControlOptions> = {}) {
    this._hoverAmplitude = hoverAmplitude;
    this._hoverHeight = hoverHeight;
    this._hoverMotion = new Motion({
      loop: true,
      duration: hoverPeriod,
      easing: hoverEasing
    });
    this._bounceMotion = new Motion({
      duration: bounceDuration,
      easing: bounceEasing,
      range: DEFAULT.INFINITE_RANGE
    });
  }

  public initFloorPosition(position: THREE.Vector3) {
    this._modelPosition.copy(position);
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
    this._enabled = false;
    this.deactivate();
  }

  public activate({ model }: XRRenderContext) {
    if (!this._enabled) return;

    const modelBbox = model.bbox;
    const modelBboxYOffset = modelBbox.getCenter(new THREE.Vector3()).y - modelBbox.min.y;
    this._dragPlane.set(new THREE.Vector3(0, 1, 0), -(this._floorPosition.y + this._hoverHeight + modelBboxYOffset));

    this._hoverMotion.reset(0);
    this._hoverMotion.setEndDelta(1);
    this._state = STATE.TRANSLATING;
  }

  public deactivate() {
    if (!this._enabled || this._state === STATE.WAITING) {
      this._state = STATE.WAITING;
      return;
    }

    this._state = STATE.BOUNCING;

    const floorPosition = this._floorPosition;
    const modelPosition = this._modelPosition;
    const hoverPosition = this._hoverPosition;
    const bounceMotion = this._bounceMotion;

    const hoveringAmount = modelPosition.y - floorPosition.y;
    bounceMotion.reset(modelPosition.y);
    bounceMotion.setEndDelta(-hoveringAmount);

    // Restore hover pos
    hoverPosition.copy(floorPosition);
    hoverPosition.setY(floorPosition.y + this._hoverHeight);
  }

  public setInitialPos(coords: THREE.Vector2[]) {
    this._initialPos.copy(coords[0]);
  }

  public process({ view3D: view3d, model, frame, referenceSpace, xrCam }: XRRenderContext, { hitResults }: XRInputs) {
    const state = this._state;
    const notActive = state === STATE.WAITING || state === STATE.BOUNCING;
    if (!hitResults || hitResults.length !== 1 || notActive) return;

    const hitResult = hitResults[0];

    const prevFloorPosition = this._floorPosition.clone();
    const floorPosition = this._floorPosition;
    const hoverPosition = this._hoverPosition;
    const hoverHeight = this._hoverHeight;
    const dragPlane = this._dragPlane;

    const modelBbox = model.bbox;
    const modelBboxYOffset = modelBbox.getCenter(new THREE.Vector3()).y - modelBbox.min.y;

    const hitPose = hitResult.results[0] && hitResult.results[0].getPose(referenceSpace);
    const isFloorHit = hitPose && hitPose.transform.matrix[5] >= 0.75;
    const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);

    if (!hitPose || !isFloorHit) {
      // Use previous drag plane if no hit plane is found
      const targetRayPose = frame.getPose(hitResult.inputSource.targetRaySpace, view3d.renderer.threeRenderer.xr.getReferenceSpace());
      const fingerDir = new THREE.Vector3().copy(targetRayPose.transform.position).sub(camPos).normalize();

      const fingerRay = new THREE.Ray(camPos, fingerDir);
      const intersection = fingerRay.intersectPlane(dragPlane, new THREE.Vector3());

      if (intersection) {
        floorPosition.copy(intersection);
        floorPosition.setY(prevFloorPosition.y);
        hoverPosition.copy(intersection);
        hoverPosition.setY(intersection.y - modelBboxYOffset);
      }
      return;
    }

    const hitMatrix = new THREE.Matrix4().fromArray(hitPose.transform.matrix);
    const hitPosition = new THREE.Vector3().setFromMatrixPosition(hitMatrix);

    // Set new floor level when it's increased at least 10cm
    const currentDragPlaneHeight = -dragPlane.constant;
    const hitDragPlaneHeight = hitPosition.y + hoverHeight + modelBboxYOffset;

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
    hoverPosition.setY(hitOnDragPlane.y - modelBboxYOffset);
  }

  public update({ model }: XRRenderContext, delta: number) {
    const state = this._state;
    const modelPosition = this._modelPosition;
    const hoverPosition = this._hoverPosition;
    if (state === STATE.WAITING) return;

    if (state !== STATE.BOUNCING) {
      // Hover
      const hoverMotion = this._hoverMotion;
      hoverMotion.update(delta);

      // Change only x, y component of position
      const hoverOffset = hoverMotion.val * this._hoverAmplitude;
      modelPosition.copy(hoverPosition);
      modelPosition.setY(hoverPosition.y + hoverOffset);
    } else {
      // Bounce
      const bounceMotion = this._bounceMotion;
      bounceMotion.update(delta);

      modelPosition.setY(bounceMotion.val);

      if (bounceMotion.progress >= 1) {
        this._state = STATE.WAITING;
      }
    }

    const modelBbox = model.bbox;
    const modelYOffset = modelBbox.getCenter(new THREE.Vector3()).y - modelBbox.min.y;

    // modelPosition = where model.bbox.min.y should be
    model.scene.position.copy(modelPosition.clone().setY(modelPosition.y + modelYOffset));
  }
}

export default ARTranslateControl;
