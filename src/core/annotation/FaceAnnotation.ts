/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../../View3D";
import Pose from "../Pose";
import AnimationControl from "../../control/AnimationControl";
import { getAnimatedFace } from "../../utils";

import Annotation, { AnnotationOptions } from "./Annotation";

/**
 * Options for {@link FaceAnnotation}s
 * @interface
 */
export interface FaceAnnotationOptions extends AnnotationOptions {
  meshIndex: number;
  faceIndex: number;
  weights: number[];
}

/**
 * {@link Annotation} that tracks position of mesh face(triangle)
 */
class FaceAnnotation extends Annotation {
  private _meshIndex: number;
  private _faceIndex: number;
  private _weights: number[];
  private _trackingControl: AnimationControl | null;

  public get position() { return this._getPosition(); }
  public get renderable() { return !!this._element && this._meshIndex >= 0 && this._faceIndex >= 0; }

  public get meshIndex() { return this._meshIndex; }
  public get faceIndex() { return this._faceIndex; }
  public get weights() { return this._weights; }

  /** */
  public constructor(view3D: View3D, {
    meshIndex = -1,
    faceIndex = -1,
    weights = [...new Array(3)].map(() => 1 / 3),
    ...commonOptions
  }: Partial<FaceAnnotationOptions> = {}) {
    super(view3D, commonOptions);

    this._meshIndex = meshIndex;
    this._faceIndex = faceIndex;
    this._weights = weights;
    this._trackingControl = null;
  }

  public async focus(): Promise<void> {
    if (this._focusing) return;

    const view3D = this._view3D;
    const { camera, control } = view3D;
    const focus = this._getFocus();
    const position = this._getPosition();

    const targetPose = new Pose(focus.x, focus.y, focus.z, position.toArray());
    const trackingControl = new AnimationControl(view3D, camera.currentPose, targetPose, {
      duration: this._focusDuration,
      disableOnFinish: false
    });

    this._trackingControl = trackingControl;

    trackingControl.enable();
    control.add(trackingControl);

    window.addEventListener("click", () => {
      this.unfocus();
    }, { once: true, capture: true });

    this._onFocus();
  }

  public unfocus(): void {
    if (!this._focusing) return;

    const { control } = this._view3D;
    const trackingControl = this._trackingControl;

    if (trackingControl) {
      control.sync();
      control.remove(trackingControl);

      trackingControl.destroy();
      this._trackingControl = null;
    }

    this._onUnfocus();
  }

  public render(params: Parameters<Annotation["render"]>[0]) {
    super.render(params);

    const trackingControl = this._trackingControl;
    if (!trackingControl) return;

    const { camera } = this._view3D;
    const focus = this._getFocus();
    const position = this._getPosition();

    const targetPose = new Pose(focus.x, focus.y, focus.z, position.toArray());

    trackingControl.changeStartEnd(camera.currentPose, targetPose);
    trackingControl.reset();
  }

  public toJSON() {
    return {
      meshIndex: this._meshIndex,
      faceIndex: this._faceIndex,
      focus: this._focus,
      duration: this._focusDuration
    };
  }

  private _getPosition(): THREE.Vector3 {
    const model = this._view3D.model;
    const meshIndex = this._meshIndex;
    const faceIndex = this._faceIndex;
    const weights = this._weights;

    const animatedVertices = getAnimatedFace(model, meshIndex, faceIndex);

    if (!animatedVertices) return new THREE.Vector3();

    // barycentric
    return new THREE.Vector3()
      .addScaledVector(animatedVertices[0], weights[0])
      .addScaledVector(animatedVertices[1], weights[1])
      .addScaledVector(animatedVertices[2], weights[2]);
  }
}

export default FaceAnnotation;
