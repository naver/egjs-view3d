/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../../View3D";
import Pose from "../Pose";
import * as DEFAULT from "../../const/default";
import { DEFAULT_CLASS } from "../../const/external";
import { directionToYawPitch, toDegree } from "../../utils";

import Annotation, { AnnotationOptions } from "./Annotation";

/**
 * Options for {@link PointAnnotation}s
 */
export interface PointAnnotationOptions extends AnnotationOptions {
  position: number[];
}

/**
 * {@link Annotation} that stays at one point
 */
class PointAnnotation extends Annotation {
  private _position: THREE.Vector3;

  public get position() { return this._position; }

  /** */
  public constructor(view3D: View3D, {
    position = [],
    ...commonOptions
  }: Partial<PointAnnotationOptions> = {}) {
    super(view3D, commonOptions);

    this._position = new THREE.Vector3().fromArray(position);
  }

  public async focus() {
    const { camera } = this._view3D;
    const el = this._element;
    const focus = this._focus;

    let targetPose: Pose;

    if (focus.length > 0) {
      const focusVector = this._getFocus();
      const position = this._position;

      targetPose = new Pose(focusVector.x, focusVector.y, focusVector.z, position.toArray());
    } else {
      const modelToPos = this._calculateNormalFromModelCenter();
      const { yaw, pitch } = directionToYawPitch(modelToPos);

      targetPose = new Pose(toDegree(yaw), toDegree(pitch), 0, this._position.toArray());
    }

    if (el) {
      el.classList.add(DEFAULT_CLASS.ANNOTATION_SELECTED);

      window.addEventListener("click", () => {
        this.unfocus();
      }, { once: true, capture: true });
    }

    if (!targetPose.equals(camera.currentPose)) {
      return camera.reset(this._focusDuration, DEFAULT.EASING, targetPose);
    } else {
      return Promise.resolve();
    }
  }

  public unfocus(): void {
    const el = this._element;

    if (!el) return;
    el.classList.remove(DEFAULT_CLASS.ANNOTATION_SELECTED);
  }

  public toJSON() {
    return {
      position: this._position.toArray(),
      focus: this._focus,
      duration: this._focusDuration
    };
  }

  private _calculateNormalFromModelCenter(): THREE.Vector3 {
    const view3D = this._view3D;
    const model = view3D.model;
    const center = model
      ? model.bbox.getCenter(new THREE.Vector3())
      : new THREE.Vector3();

    return new THREE.Vector3().subVectors(this._position, center).normalize();
  }
}

export default PointAnnotation;
