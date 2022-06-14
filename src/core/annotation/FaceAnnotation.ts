/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../../View3D";
import Pose from "../Pose";
import AnimationControl from "../../control/AnimationControl";
import { DEFAULT_CLASS } from "../../const/external";
import { getAttributeScale, getSkinnedVertex, range } from "../../utils";
import { TypedArray } from "../../type/utils";

import Annotation, { AnnotationOptions } from "./Annotation";

/**
 * Options for {@link FaceAnnotation}s
 * @interface
 */
export interface FaceAnnotationOptions extends AnnotationOptions {
  meshIndex: number;
  faceIndex: number;
}

/**
 *
 */
class FaceAnnotation extends Annotation {
  private _meshIndex: number;
  private _faceIndex: number;
  private _trackingControl: AnimationControl | null;

  public get position() { return this._getPosition(); }
  public get renderable() { return !!this._element && this._meshIndex >= 0 && this._faceIndex >= 0; }

  public get meshIndex() { return this._meshIndex; }
  public get faceIndex() { return this._faceIndex; }

  /** */
  public constructor(view3D: View3D, {
    meshIndex = -1,
    faceIndex = -1,
    ...commonOptions
  }: Partial<FaceAnnotationOptions> = {}) {
    super(view3D, commonOptions);

    this._meshIndex = meshIndex;
    this._faceIndex = faceIndex;
    this._trackingControl = null;
  }

  public async focus(): Promise<void> {
    const el = this._element;

    if (el) {
      el.classList.add(DEFAULT_CLASS.ANNOTATION_SELECTED);
    }

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
  }

  public unfocus(): void {
    const el = this._element;
    const { control } = this._view3D;
    const trackingControl = this._trackingControl;

    if (el) {
      el.classList.remove(DEFAULT_CLASS.ANNOTATION_SELECTED);
    }

    if (trackingControl) {
      control.sync();
      control.remove(trackingControl);

      trackingControl.destroy();
      this._trackingControl = null;
    }
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
    const vertices = this._getVertices();
    if (!vertices) return new THREE.Vector3();

    const animated = this._getAnimatedVertices(vertices);

    return animated.reduce((summed, vertex) => {
      return summed.add(vertex);
    }, new THREE.Vector3()).divideScalar(3);
  }

  private _getAnimatedVertices(vertices: THREE.Vector3[]) {
    const model = this._view3D.model!;
    const faceIndex = this._faceIndex;
    const mesh = model.meshes[this._meshIndex];
    const indexes = mesh.geometry.getIndex()!;
    const face = (indexes.array as TypedArray).slice(3 * faceIndex, 3 * faceIndex + 3);

    if ((mesh as THREE.SkinnedMesh).isSkinnedMesh) {
      const geometry = mesh.geometry;
      const positions = geometry.attributes.position;
      const skinWeights = geometry.attributes.skinWeight;

      const positionScale = getAttributeScale(positions);
      const skinWeightScale = getAttributeScale(skinWeights);

      vertices.forEach((vertex, idx) => {
        const posIdx = face[idx];
        const transformed = getSkinnedVertex(posIdx, mesh as THREE.SkinnedMesh, positionScale, skinWeightScale);

        vertex.copy(transformed);
      });
    } else {
      vertices.forEach(vertex => {
        vertex.applyMatrix4(mesh.matrixWorld);
      });
    }

    return vertices;
  }

  private _getVertices() {
    const view3D = this._view3D;
    const meshIndex = this._meshIndex;
    const faceIndex = this._faceIndex;
    const model = view3D.model;

    if (!model || meshIndex < 0 || faceIndex < 0) return null;

    const mesh = model.meshes[meshIndex];
    const indexes = mesh?.geometry.index?.array;
    const face = indexes
      ? range(3).map(idx => indexes[3 * faceIndex + idx])
      : null;

    if (!mesh || !indexes || !face || face.some(val => val == null)) return null;

    const position = mesh.geometry.getAttribute("position");
    const vertices = face.map((index: number) => {
      return new THREE.Vector3().fromBufferAttribute(position, index);
    });

    return vertices;
  }
}

export default FaceAnnotation;
