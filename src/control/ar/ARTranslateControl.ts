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
 * Options for {@link ARTranslateControl}
 * @interface
 * @property {number} [threshold=0.05] Threshold until translation works, this value is relative to screen size.
 * @property {number} [hoverHeight=0.1] How much model will float from the floor, in meter. Default value is 0.1(10cm).
 * @property {number} [bounceDuration=1000] Bounce-to-floor animation's duration, in milisecond.
 * @property {number} [bounceEasing=EASING.EASE_OUT_BOUNCE] Bounce-to-floor animation's easing function.
 */
export interface ARTranslateControlOptions {
  threshold: number;
  hoverHeight: number;
  bounceDuration: number;
  bounceEasing: (x: number) => number;
}

/**
 * Model's translation(position) control for {@link WebARControl}
 */
class ARTranslateControl implements ARControl {
  // Options
  private _hoverHeight: number;

  // Internal states
  private _hoverPosition = new THREE.Vector3();
  private _floorPosition = new THREE.Vector3();
  private _wallRotation = new THREE.Quaternion();
  private _dragPlane = new THREE.Plane();
  private _enabled = false;
  private _vertical = false;
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
   * How much model will float from the floor, in meter.
   */
  public get hoverHeight() { return this._hoverHeight; }

  public set hoverHeight(val: number) { this._hoverHeight = val; }

  /**
   * Create new instance of ARTranslateControl
   * @param {ARTranslateControlOption} [options={}] Options
   */
  public constructor({
    hoverHeight = 0.1,
    bounceDuration = 1000,
    bounceEasing = EASING.EASE_OUT_BOUNCE
  }: Partial<ARTranslateControlOptions> = {}) {
    this._hoverHeight = hoverHeight;
    this._bounceMotion = new Motion({
      duration: bounceDuration,
      easing: bounceEasing,
      range: DEFAULT.INFINITE_RANGE
    });
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

    const dragPlane = this._dragPlane;
    dragPlane.constant = this._calcDragPlaneConstant(this._floorPosition);

    this._state = STATE.TRANSLATING;
  }

  public deactivate() {
    if (!this._enabled || this._vertical || this._state === STATE.WAITING) {
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

  public init(position: THREE.Vector3, rotation: THREE.Quaternion, vertical: boolean) {
    this._floorPosition.copy(position);
    this._hoverPosition.copy(position);

    const planeNormal = vertical
      ? new THREE.Vector3(0, 1, 0).applyQuaternion(rotation)
      : new THREE.Vector3(0, 1, 0);

    this._dragPlane.normal.copy(planeNormal);
    this._wallRotation.copy(rotation);
    this._vertical = vertical;
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
    const vertical = this._vertical;

    const hitPose = hitResult.results[0] && hitResult.results[0].getPose(referenceSpace);
    const hitMatrix = hitPose && new THREE.Matrix4().fromArray(hitPose.transform.matrix);
    const isFloorHit = hitPose && hitMatrix.elements[5] > 0.75;
    const isWallHit = hitPose && hitMatrix.elements[5] < 0.25;
    const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);
    const hitPosition = hitPose && new THREE.Vector3().setFromMatrixPosition(hitMatrix);

    if (!vertical) {
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
    } else {
      if (frame && (!hitPose || !isWallHit)) {
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
        }
        return;
      }

      const globalUp = new THREE.Vector3(0, 1, 0);
      const hitOrientation = hitPose.transform.orientation;
      const wallNormal = globalUp.clone()
        .applyQuaternion(new THREE.Quaternion(hitOrientation.x, hitOrientation.y, hitOrientation.z, hitOrientation.w))
        .normalize();
      const wallX = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), wallNormal);

      // Update rotation if it differs more than 10deg
      const prevWallNormal = new THREE.Vector3(0, 1, 0).applyQuaternion(this._wallRotation).normalize();
      if (Math.acos(Math.abs(prevWallNormal.dot(wallNormal))) >= Math.PI / 18) {
        const wallMatrix = new THREE.Matrix4().makeBasis(wallX, globalUp, wallNormal);
        const wallEuler = new THREE.Euler(0, 0, 0, "YXZ").setFromRotationMatrix(wallMatrix);

        wallEuler.z = 0;
        wallEuler.x = Math.PI / 2;

        this._wallRotation.setFromEuler(wallEuler);

        dragPlane.normal.copy(new THREE.Vector3(0, 1, 0).applyQuaternion(this._wallRotation));
        dragPlane.constant = this._calcDragPlaneConstant(hitPosition);
      }

      const camToHitDir = new THREE.Vector3().subVectors(hitPosition, camPos).normalize();
      const camToHitRay = new THREE.Ray(camPos, camToHitDir);
      const hitOnDragPlane = camToHitRay.intersectPlane(dragPlane, new THREE.Vector3());

      if (!hitOnDragPlane) return;

      floorPosition.copy(hitOnDragPlane);
    }
  }

  public update({ scene }: XRRenderContext, delta: number) {
    const state = this._state;
    const floorPosition = this._floorPosition;
    const hoverPosition = this._hoverPosition;
    const bounceMotion = this._bounceMotion;
    const vertical = this._vertical;

    if (state === STATE.BOUNCING) {
      bounceMotion.update(delta);
      hoverPosition.setY(floorPosition.y + bounceMotion.val);

      if (bounceMotion.progress >= 1) {
        this._state = STATE.WAITING;
      }
    }

    scene.setRootPosition(floorPosition);

    if (!vertical) {
      scene.setModelHovering(hoverPosition.y - floorPosition.y);
    } else {
      scene.setWallRotation(this._wallRotation);
    }
  }

  private _calcDragPlaneConstant(floor: THREE.Vector3) {
    const vertical = this._vertical;
    const dragPlaneNormal = this._dragPlane.normal.clone();
    const dragPlaneAtZero = new THREE.Plane(dragPlaneNormal, 0);
    const hoverHeight = vertical
      ? 0
      : this._hoverHeight;
    const dragPlaneConstant = -(dragPlaneAtZero.distanceToPoint(floor) + hoverHeight);

    return dragPlaneConstant;
  }
}

export default ARTranslateControl;
