/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";
import AnimationControl from "../control/AnimationControl";
import { toRadian, clamp, circulate, toDegree, getRotatedPosition, isNumber, isString, parseAsBboxRatio } from "../utils";
import * as DEFAULT from "../const/default";
import { AUTO, EVENTS, ZOOM_TYPE } from "../const/external";

import Pose from "./Pose";
import Model from "./Model";

/**
 * Camera that renders the scene of View3D
 */
class Camera {
  private _view3D: View3D;
  private _threeCamera: THREE.PerspectiveCamera;
  private _baseDistance: number;
  private _baseFov: number;
  private _defaultPose: Pose;
  private _currentPose: Pose;
  private _newPose: Pose;
  private _maxTanHalfHFov: number;

  /**
   * Three.js {@link https://threejs.org/docs/#api/en/cameras/PerspectiveCamera PerspectiveCamera} instance
   * @readonly
   * @type THREE.PerspectiveCamera
   */
  public get threeCamera() { return this._threeCamera; }

  /**
   * Camera's default pose(yaw, pitch, zoom, pivot)
   * This will be new currentPose when {@link Camera#reset reset()} is called
   * @readonly
   * @type {Pose}
   */
  public get defaultPose(): Pose { return this._defaultPose; }

  /**
   * Camera's current pose value
   * @readonly
   * @type {Pose}
   */
  public get currentPose(): Pose { return this._currentPose.clone(); }

  /**
   * Camera's new pose that will be applied on the next frame
   * {@link Camera#updatePosition} should be called after changing this value.
   * @type {Pose}
   */
  public get newPose(): Pose { return this._newPose; }

  /**
   * Camera's current yaw
   * {@link Camera#updatePosition} should be called after changing this value.
   * @type {number}
   */
  public get yaw() { return this._currentPose.yaw; }

  /**
   * Camera's current pitch
   * {@link Camera#updatePosition} should be called after changing this value.
   * @type {number}
   */
  public get pitch() { return this._currentPose.pitch; }

  /**
   * Camera's current zoom value
   * {@link Camera#updatePosition} should be called after changing this value.
   * @type {number}
   */
  public get zoom() { return this._currentPose.zoom; }

  /**
   * Camera's disatance from current camera pivot(target)
   * @type {number}
   * @readonly
   */
  public get distance() {
    return this._view3D.control.zoom.type === ZOOM_TYPE.FOV
      ? this._baseDistance
      : this._baseDistance - this._currentPose.zoom;
  }

  /**
   * Camera's default distance from the model center.
   * This will be automatically calculated based on the model size.
   * @type {number}
   * @readonly
   */
  public get baseDistance() { return this._baseDistance; }

  /**
   * Camera's default fov value.
   * This will be automatically chosen when `view3D.fov` is "auto", otherwise it is equal to `view3D.fov`
   * @type {number}
   * @readonly
   */
  public get baseFov() { return this._baseFov; }

  /**
   * Current pivot point of camera rotation
   * @type THREE.Vector3
   * @readonly
   * @see {@link https://threejs.org/docs/#api/en/math/Vector3 THREE#Vector3}
   */
  public get pivot() { return this._currentPose.pivot; }

  /**
   * Camera's focus of view value (vertical)
   * @type number
   * @readonly
   * @see {@link https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.fov THREE#PerspectiveCamera}
   */
  public get fov() { return this._threeCamera.fov; }

  /**
   * Camera's frustum width
   * @type number
   * @readonly
   */
  public get renderWidth() { return this.renderHeight * this._threeCamera.aspect; }

  /**
   * Camera's frustum height
   * @type number
   * @readonly
   */
  public get renderHeight() {
    return 2 * this.distance * Math.tan(toRadian(this._threeCamera.getEffectiveFOV() / 2));
  }

  public set yaw(val: number) { this._newPose.yaw = val; }
  public set pitch(val: number) { this._newPose.pitch = val; }
  public set zoom(val: number) { this._newPose.zoom = val; }
  public set pivot(val: THREE.Vector3) { this._newPose.pivot.copy(val); }
  public set baseFov(val: number) { this._baseFov = val; }

  /**
   * Create new Camera instance
   * @param {View3D} view3D An instance of View3D
   */
  public constructor(view3D: View3D) {
    this._view3D = view3D;
    this._threeCamera = new THREE.PerspectiveCamera();
    this._maxTanHalfHFov = 0;
    this._baseFov = 45;
    this._baseDistance = 0;

    const initialZoom = isNumber(view3D.initialZoom) ? view3D.initialZoom : 0;

    this._defaultPose = new Pose(view3D.yaw, view3D.pitch, initialZoom);
    this._currentPose = this._defaultPose.clone();
    this._newPose = this._currentPose.clone();
  }

  /**
   * Reset camera to default pose
   * @param {number} [duration=0] Duration of the reset animation
   * @param {function} [easing] Easing function for the reset animation
   * @param {Pose} [pose] Pose to reset, camera will reset to `defaultPose` if pose is not given.
   * @returns Promise that resolves when the animation finishes
   */
  public reset(duration: number = 0, easing: (x: number) => number = DEFAULT.EASING, pose?: Pose): Promise<void> {
    const view3D = this._view3D;
    const control = view3D.control;
    const autoPlayer = view3D.autoPlayer;
    const newPose = this._newPose;
    const currentPose = this._currentPose;
    const targetPose = pose ?? this._defaultPose;

    if (duration <= 0) {
      // Reset camera immediately
      newPose.copy(targetPose);
      currentPose.copy(targetPose);

      view3D.renderer.renderSingleFrame();
      control.sync();

      return Promise.resolve();
    } else {
      // Play the animation
      const autoplayEnabled = autoPlayer.enabled;
      const resetControl = new AnimationControl(view3D, currentPose, targetPose);
      resetControl.duration = duration;
      resetControl.easing = easing;
      resetControl.enable();

      if (autoplayEnabled) {
        autoPlayer.disable();
      }
      control.add(resetControl);

      return new Promise(resolve => {
        resetControl.onFinished(() => {
          newPose.copy(targetPose);
          currentPose.copy(targetPose);

          control.remove(resetControl);
          control.sync();

          if (autoplayEnabled) {
            autoPlayer.enableAfterDelay();
          }

          resolve();
        });
      });
    }
  }

  /**
   * Update camera's aspect to given size
   * @param {object} size New size to apply
   * @param {number} [size.width] New width
   * @param {number} [size.height] New height
   * @returns {void}
   */
  public resize(
    { width, height }: { width: number; height: number },
    prevSize: { width: number; height: number } | null = null
  ): void {
    const { control, fov, maintainSize } = this._view3D;
    const threeCamera = this._threeCamera;
    const aspect = width / height;

    threeCamera.aspect = aspect;

    if (fov === AUTO) {
      if (!maintainSize || prevSize == null) {
        this._applyEffectiveFov(DEFAULT.FOV);
      } else {
        const heightRatio = height / prevSize.height;
        const currentZoom = this._currentPose.zoom;
        const tanHalfFov = Math.tan(toRadian((this._baseFov - currentZoom) / 2));

        this._baseFov = toDegree(2 * Math.atan(heightRatio * tanHalfFov)) + currentZoom;
      }
    } else {
      this._baseFov = fov;
    }

    control.zoom.updateRange();
  }

  /**
   * Fit camera frame to the given model
   */
  public fit(model: Model): void {
    const view3D = this._view3D;
    const camera = this._threeCamera;
    const defaultPose = this._defaultPose;
    const control = view3D.control;
    const pivot = view3D.pivot;
    const bbox = model.bbox;

    const fov = view3D.fov;
    const hfov = fov === AUTO ? DEFAULT.FOV : fov;

    const modelCenter = model.center;
    const maxDistToCenterSquared = view3D.ignoreCenterOnFit || view3D.center === AUTO
      ? new THREE.Vector3().subVectors(bbox.max, bbox.min).lengthSq() / 4
      : model.reduceVertices((dist, vertice) => {
        return Math.max(dist, vertice.distanceToSquared(modelCenter));
      }, 0);

    const maxDistToCenter = Math.sqrt(maxDistToCenterSquared);
    const effectiveCamDist = maxDistToCenter / Math.sin(toRadian(hfov / 2));

    const maxTanHalfHFov = model.reduceVertices((res, vertex) => {
      const distToCenter = new THREE.Vector3().subVectors(vertex, modelCenter);
      const radiusXZ = Math.hypot(distToCenter.x, distToCenter.z);

      return Math.max(res, radiusXZ / (effectiveCamDist - Math.abs(distToCenter.y)));
    }, 0);

    if (fov === AUTO) {
      // Cache for later use in resize
      this._maxTanHalfHFov = maxTanHalfHFov;
      this._applyEffectiveFov(hfov);
    } else {
      this._maxTanHalfHFov = fov;
    }

    defaultPose.pivot = pivot === AUTO
      ? modelCenter.clone()
      : parseAsBboxRatio(pivot, bbox);
    this._baseDistance = effectiveCamDist;

    camera.near = (effectiveCamDist - maxDistToCenter) * 0.1;
    camera.far = (effectiveCamDist + maxDistToCenter) * 10;
    control.zoom.updateRange();

    if (!isNumber(view3D.initialZoom)) {
      const baseFov = this._baseFov;
      const modelBbox = model.bbox;
      const alignAxis = view3D.initialZoom.axis;
      const targetRatio = view3D.initialZoom.ratio;
      const bboxDiff = new THREE.Vector3().subVectors(modelBbox.max, modelBbox.min);
      const axisDiff = bboxDiff[alignAxis];
      const newViewHeight = alignAxis === "y"
        ? axisDiff / targetRatio
        : axisDiff / (targetRatio * camera.aspect);
      const camDist = alignAxis !== "z"
        ? effectiveCamDist - bboxDiff.z / 2
        : effectiveCamDist - bboxDiff.x / 2;
      const newFov = toDegree(2 * Math.atan(newViewHeight / (2 * camDist)));

      defaultPose.zoom = baseFov - newFov;
    } else {
      defaultPose.zoom = view3D.initialZoom;
    }
  }

  /**
   * Update camera position
   * @returns {void}
   */
  public updatePosition(): void {
    const view3D = this._view3D;
    const control = view3D.control;
    const threeCamera = this._threeCamera;
    const currentPose = this._currentPose;
    const newPose = this._newPose;
    const baseFov = this._baseFov;
    const baseDistance = this._baseDistance;
    const isFovZoom = control.zoom.type === ZOOM_TYPE.FOV;

    const prevPose = currentPose.clone();

    // Clamp current pose
    currentPose.yaw = circulate(newPose.yaw, 0, 360);
    currentPose.pitch = clamp(newPose.pitch, DEFAULT.PITCH_RANGE.min, DEFAULT.PITCH_RANGE.max);
    currentPose.zoom = newPose.zoom;
    currentPose.pivot.copy(newPose.pivot);

    const fov = isFovZoom
      ? baseFov - currentPose.zoom
      : baseFov;
    const distance = isFovZoom
      ? baseDistance
      : baseDistance - currentPose.zoom;

    const newCamPos = getRotatedPosition(distance, currentPose.yaw, currentPose.pitch);

    newCamPos.add(currentPose.pivot);

    threeCamera.fov = fov;
    threeCamera.position.copy(newCamPos);
    threeCamera.lookAt(currentPose.pivot);
    threeCamera.updateProjectionMatrix();

    newPose.copy(currentPose);

    view3D.trigger(EVENTS.CAMERA_CHANGE, {
      type: EVENTS.CAMERA_CHANGE,
      target: view3D,
      pose: currentPose.clone(),
      prevPose
    });
  }

  private _applyEffectiveFov(fov: number) {
    const camera = this._threeCamera;
    const tanHalfHFov = Math.tan(toRadian(fov / 2));
    const tanHalfVFov = tanHalfHFov * Math.max(1, (this._maxTanHalfHFov / tanHalfHFov) / camera.aspect);

    this._baseFov = toDegree(2 * Math.atan(tanHalfVFov));
  }

  private _parseBboxRatioOption(arr: Array<number | string>, bbox: THREE.Box3) {
    const min = bbox.min.toArray();
    const size = new THREE.Vector3().subVectors(bbox.max, bbox.min).toArray();

    return arr.map((val, idx) => {
      if (!isString(val)) return val;

      const ratio = parseFloat(val) * 0.01;

      return min[idx] + ratio * size[idx];
    });
  }
}

export default Camera;
