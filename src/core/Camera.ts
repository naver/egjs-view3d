/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";
import AnimationControl from "../control/AnimationControl";
import { toRadian, clamp, circulate, toDegree, getRotatedPosition } from "../utils";
import * as DEFAULT from "../const/default";
import { AUTO, EVENTS } from "../const/external";
import { BeforeRenderEvent } from "../type/event";

import Pose from "./Pose";
import Model from "./Model";

/**
 * Camera that renders the scene of View3D
 */
class Camera {
  private _view3D: View3D;
  private _threeCamera: THREE.PerspectiveCamera;
  private _distance: number = 0;
  private _baseFov: number = 45;
  private _defaultPose: Pose;
  private _currentPose: Pose;
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
   * Camera's current yaw
   * {@link Camera#updatePosition} should be called after changing this value, and normally it is called every frame.
   * @type {number}
   */
  public get yaw() { return this._currentPose.yaw; }

  /**
   * Camera's current pitch
   * {@link Camera#updatePosition} should be called after changing this value, and normally it is called every frame.
   * @type {number}
   */
  public get pitch() { return this._currentPose.pitch; }

  /**
   * Camera's current zoom value
   * {@link Camera#updatePosition} should be called after changing this value, and normally it is called every frame.
   * @type {number}
   */
  public get zoom() { return this._currentPose.zoom; }

  /**
   * Camera's default fov value.
   * This will be automatically chosen when `view3D.fov` is "auto", otherwise it is equal to `view3D.fov`
   * @type {number}
   */
  public get baseFov() { return this._baseFov; }

  /**
   * Current pivot point of camera rotation
   * @readonly
   * @type THREE.Vector3
   * @see {@link https://threejs.org/docs/#api/en/math/Vector3 THREE#Vector3}
   */
  public get pivot() { return this._currentPose.pivot; }

  /**
   * Camera's focus of view value (vertical)
   * @type number
   * @see {@link https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.fov THREE#PerspectiveCamera}
   */
  public get fov() { return this._threeCamera.fov; }

  public get pose() { return this._currentPose; }

  /**
   * Camera's frustum width
   * @type number
   */
  public get renderWidth() { return this.renderHeight * this._threeCamera.aspect; }

  /**
   * Camera's frustum height
   * @type number
   */
  public get renderHeight() { return 2 * this._distance * Math.tan(toRadian(this._threeCamera.getEffectiveFOV() / 2)); }

  public set yaw(val: number) { this._currentPose.yaw = val; }
  public set pitch(val: number) { this._currentPose.pitch = val; }
  public set zoom(val: number) { this._currentPose.zoom = val; }
  public set pivot(val: THREE.Vector3) { this._currentPose.pivot = val; }

  /**
   * Create new Camera instance
   * @param canvas \<canvas\> element to render 3d model
   */
  public constructor(view3D: View3D) {
    this._view3D = view3D;
    this._threeCamera = new THREE.PerspectiveCamera();
    this._maxTanHalfHFov = 0;

    this._defaultPose = new Pose(view3D.yaw, view3D.pitch, view3D.initialZoom);
    this._currentPose = this._defaultPose.clone();
  }

  /**
   * Reset camera to default pose
   * @param duration Duration of the reset animation
   * @param easing Easing function for the reset animation
   * @returns Promise that resolves when the animation finishes
   */
  public async reset(duration: number = 0, easing: (x: number) => number = DEFAULT.EASING): Promise<void> {
    const view3D = this._view3D;
    const control = view3D.control;
    const currentPose = this._currentPose;
    const defaultPose = this._defaultPose;

    if (duration <= 0) {
      // Reset camera immediately
      this._currentPose = defaultPose.clone();

      control.sync();

      return Promise.resolve();
    } else {
      // Play the animation
      const resetControl = new AnimationControl(view3D, currentPose, defaultPose);
      resetControl.duration = duration;
      resetControl.easing = easing;
      resetControl.enable();

      control.disable();

      const updateResetControl = (evt: BeforeRenderEvent) => {
        resetControl.update(evt.delta);
      };

      view3D.on(EVENTS.BEFORE_RENDER, updateResetControl);

      return new Promise(resolve => {
        resetControl.onFinished(() => {
          control.sync();
          control.enable();

          view3D.off(EVENTS.BEFORE_RENDER, updateResetControl);

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
        const tanHalfBaseFov = Math.tan(toRadian(this._baseFov / 2));

        this._baseFov = toDegree(2 * Math.atan(heightRatio * tanHalfBaseFov));
      }
    } else {
      this._baseFov = fov;
    }

    control.zoom.updateRange();
  }

  /**
   * Fit camera frame to the given model
   */
  public fit(model: Model, center: "auto" | number[]): void {
    const view3D = this._view3D;
    const camera = this._threeCamera;
    const control = view3D.control;
    const defaultPose = this._defaultPose;
    const bbox = model.bbox;

    const fov = view3D.fov;
    const hfov = fov === AUTO ? DEFAULT.FOV : fov;

    const modelCenter = Array.isArray(center)
      ? new THREE.Vector3().fromArray(center)
      : bbox.getCenter(new THREE.Vector3());

    const maxDistToCenterSquared = center === AUTO
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

    defaultPose.pivot = modelCenter.clone();
    this._distance = effectiveCamDist;

    camera.near = (effectiveCamDist - maxDistToCenter) * 0.1;
    camera.far = (effectiveCamDist + maxDistToCenter) * 10;
    control.zoom.updateRange();
  }

  /**
   * Update camera position base on the {@link Camera#currentPose currentPose} value
   * @returns {void}
   */
  public updatePosition(): void {
    const { control } = this._view3D;
    const threeCamera = this._threeCamera;
    const currentPose = this._currentPose;
    const distance = this._distance;
    const baseFov = this._baseFov;
    const zoomRange = control.zoom.range;

    // Clamp current pose
    currentPose.yaw = circulate(currentPose.yaw, 0, 360);
    currentPose.pitch = clamp(currentPose.pitch, DEFAULT.PITCH_RANGE.min, DEFAULT.PITCH_RANGE.max);
    currentPose.zoom = -(clamp(baseFov - currentPose.zoom, zoomRange.min, zoomRange.max) - baseFov);

    const newCamPos = getRotatedPosition(distance, currentPose.yaw, currentPose.pitch);
    const fov = baseFov - currentPose.zoom;

    newCamPos.add(currentPose.pivot);

    threeCamera.fov = fov;
    threeCamera.position.copy(newCamPos);
    threeCamera.lookAt(currentPose.pivot);
    threeCamera.updateProjectionMatrix();
  }

  private _applyEffectiveFov(fov: number) {
    const camera = this._threeCamera;
    const tanHalfHFov = Math.tan(toRadian(fov / 2));
    const tanHalfVFov = tanHalfHFov * Math.max(1, (this._maxTanHalfHFov / tanHalfHFov) / camera.aspect);

    this._baseFov = toDegree(2 * Math.atan(tanHalfVFov));
  }
}

export default Camera;
