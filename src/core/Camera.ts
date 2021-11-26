/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";
import AnimationControl from "../controls/AnimationControl";
import { toRadian, clamp, circulate } from "../utils";
import * as DEFAULT from "../consts/default";

import Pose from "./Pose";

/**
 * Camera that renders the scene of View3D
 */
class Camera {
  private _view3D: View3D;
  private _threeCamera: THREE.PerspectiveCamera;
  private _minDistance: number = DEFAULT.MINIMUM_DISTANCE;
  private _maxDistance: number = DEFAULT.MAXIMUM_DISTANCE;
  private _defaultPose: Pose = DEFAULT.CAMERA_POSE;
  private _currentPose: Pose = this._defaultPose.clone();

  /**
   * Three.js {@link https://threejs.org/docs/#api/en/cameras/PerspectiveCamera PerspectiveCamera} instance
   * @readonly
   * @type THREE.PerspectiveCamera
   */
  public get threeCamera() { return this._threeCamera; }

  /**
   * Camera's default pose(yaw, pitch, distance, pivot)
   * This will be new currentPose when {@link Camera#reset reset()} is called
   * @readonly
   * @type Pose
   */
  public get defaultPose(): Readonly<Pose> { return this._defaultPose; }

  /**
   * Camera's current pose value
   * @readonly
   * @type Pose
   */
  public get currentPose(): Pose { return this._currentPose.clone(); }

  /**
   * Camera's current yaw
   * {@link Camera#updatePosition} should be called after changing this value, and normally it is called every frame.
   * @type number
   */
  public get yaw() { return this._currentPose.yaw; }

  /**
   * Camera's current pitch
   * {@link Camera#updatePosition} should be called after changing this value, and normally it is called every frame.
   * @type number
   */
  public get pitch() { return this._currentPose.pitch; }

  /**
   * Camera's current distance
   * {@link Camera#updatePosition} should be called after changing this value, and normally it is called every frame.
   * @type number
   */
  public get distance() { return this._currentPose.distance; }

  /**
   * Current pivot point of camera rotation
   * @readonly
   * @type THREE.Vector3
   * @see {@link https://threejs.org/docs/#api/en/math/Vector3 THREE#Vector3}
   */
  public get pivot() { return this._currentPose.pivot; }

  /**
   * Minimum distance from lookAtPosition
   * @type number
   * @example
   * ```ts
   * import View3D from "@egjs/view3d";
   *
   * const view3d = new View3D("#view3d-canvas");
   * view3d.camera.minDistance = 100;
   * ```
   */
  public get minDistance() { return this._minDistance; }

  /**
   * Maximum distance from lookAtPosition
   * @type number
   * @example
   * ```ts
   * import View3D from "@egjs/view3d";
   *
   * const view3d = new View3D("#view3d-canvas");
   * view3d.camera.maxDistance = 400;
   * ```
   */
  public get maxDistance() { return this._maxDistance; }

  /**
   * Camera's focus of view value
   * @type number
   * @see {@link https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.fov THREE#PerspectiveCamera}
   */
  public get fov() { return this._threeCamera.fov; }

  /**
   * Camera's frustum width on current distance value
   * @type number
   */
  public get renderWidth() { return this.renderHeight * this._threeCamera.aspect; }

  /**
   * Camera's frustum height on current distance value
   * @type number
   */
  public get renderHeight() { return 2 * this.distance * Math.tan(toRadian(this.fov / 2)); }

  public set minDistance(val: number) { this._minDistance = val; }
  public set maxDistance(val: number) { this._maxDistance = val; }
  public set pose(val: Pose) {
    this._currentPose = val;
    this._view3D.control.sync();
  }

  public set yaw(val: number) { this._currentPose.yaw = val; }
  public set pitch(val: number) { this._currentPose.pitch = val; }
  public set distance(val: number) { this._currentPose.distance = val; }
  public set pivot(val: THREE.Vector3) { this._currentPose.pivot = val; }

  public set fov(val: number) {
    this._threeCamera.fov = val;
    this._threeCamera.updateProjectionMatrix();
  }

  /**
   * Create new Camera instance
   * @param canvas \<canvas\> element to render 3d model
   */
  public constructor(view3D: View3D) {
    this._view3D = view3D;
    this._threeCamera = new THREE.PerspectiveCamera();
  }

  /**
   * Reset camera to default pose
   * @param duration Duration of the reset animation
   * @param easing Easing function for the reset animation
   * @returns Promise that resolves when the animation finishes
   */
  public reset(duration: number = 0, easing: (x: number) => number = DEFAULT.EASING): Promise<void> {
    const view3D = this._view3D;
    const currentPose = this._currentPose;
    const defaultPose = this._defaultPose;

    if (duration <= 0) {
      // Reset camera immediately
      this._currentPose = defaultPose.clone();

      view3D.control.sync();

      return Promise.resolve();
    } else {
      // Plaay the animation
      const resetControl = new AnimationControl(view3D, currentPose, defaultPose);
      resetControl.duration = duration;
      resetControl.easing = easing;

      // TODO: DISABLE CONTROLS
      // FIXME: START ANIMATION

      return new Promise(resolve => {
        resetControl.onFinished(() => {
          view3D.control.sync();
          // TODO: ENABLE CONTROLS
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
  public resize(size: { width: number; height: number }): void {
    const cam = this._threeCamera;
    const aspect = size.width / size.height;

    cam.aspect = aspect;
    cam.updateProjectionMatrix();
  }

  /**
   * Set default position of camera relative to the 3d model
   * New default pose will be used when {@link Camera#reset reset()} is called
   * @param newDefaultPose new default pose to apply
   * @returns {void}
   */
  public setDefaultPose(newDefaultPose: Partial<{
    yaw: number;
    pitch: number;
    distance: number;
    pivot: THREE.Vector3;
  }>): void {
    const defaultPose = this._defaultPose;
    const { yaw, pitch, distance, pivot } = newDefaultPose;

    if (yaw != null) {
      defaultPose.yaw = yaw;
    }
    if (pitch != null) {
      defaultPose.pitch = pitch;
    }
    if (distance != null) {
      defaultPose.distance = distance;
    }
    if (pivot != null) {
      defaultPose.pivot = pivot;
    }
  }

  /**
   * Update camera position base on the {@link Camera#currentPose currentPose} value
   * @returns {void}
   */
  public updatePosition(): void {
    this._clampCurrentPose();

    const threeCamera = this._threeCamera;
    const pose = this._currentPose;

    const yaw = toRadian(pose.yaw);
    const pitch = toRadian(pose.pitch);
    // Should use minimum distance to prevent distance becomes 0, which makes whole x,y,z to 0 regardless of pose
    const distance = Math.max(pose.distance + this._minDistance, DEFAULT.MINIMUM_DISTANCE);

    const newCamPos = new THREE.Vector3(0, 0, 0);
    newCamPos.y = distance * Math.sin(pitch);
    newCamPos.z = distance * Math.cos(pitch);

    newCamPos.x = newCamPos.z * Math.sin(-yaw);
    newCamPos.z = newCamPos.z * Math.cos(-yaw);

    newCamPos.add(pose.pivot);

    threeCamera.position.copy(newCamPos);
    threeCamera.lookAt(pose.pivot);
    threeCamera.updateProjectionMatrix();
  }

  private _clampCurrentPose() {
    const currentPose = this._currentPose;

    currentPose.yaw = circulate(currentPose.yaw, 0, 360);
    currentPose.pitch = clamp(currentPose.pitch, DEFAULT.PITCH_RANGE.min, DEFAULT.PITCH_RANGE.max);
    currentPose.distance = clamp(currentPose.distance, this._minDistance, this._maxDistance);
  }
}

export default Camera;
