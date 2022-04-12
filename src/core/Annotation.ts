/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../View3D";
import * as BROWSER from "../const/browser";
import * as DEFAULT from "../const/default";
import { DEFAULT_CLASS } from "../const/external";
import { directionToYawPitch, toDegree } from "../utils";

import Pose from "./Pose";

/**
 * Options for {@link Annotation}
 */
export interface AnnotationOptions {
  element: HTMLElement;
  position: number[];
  focus: number[];
}

/**
 *
 */
class Annotation {
  private _view3D: View3D;
  private _el: HTMLElement;
  private _position: THREE.Vector3;
  private _focus: THREE.Vector3 | null;

  public get element() { return this._el; }
  public get position() { return this._position; }

  /** */
  public constructor(view3D: View3D, options: AnnotationOptions) {
    this._view3D = view3D;
    this._el = options.element;
    this._position = new THREE.Vector3().fromArray(options.position);
    this._focus = options.focus.length > 0
      ? new THREE.Vector3().fromArray(options.focus)
      : null;

    this._el.draggable = false;

    this.enableEvents();
  }

  public enableEvents() {
    this._el.addEventListener(BROWSER.EVENTS.CLICK, this._onClick);
    this._el.addEventListener(BROWSER.EVENTS.WHEEL, this._onWheel);
  }

  public disableEvents() {
    this._el.removeEventListener(BROWSER.EVENTS.CLICK, this._onClick);
    this._el.removeEventListener(BROWSER.EVENTS.WHEEL, this._onWheel);
  }

  private _onClick = () => {
    const { camera } = this._view3D;
    const focus = this._focus;
    let targetPose: Pose;

    this._el.classList.add(DEFAULT_CLASS.ANNOTATION_SELECTED);

    if (focus) {
      targetPose = new Pose(focus.x, focus.y, focus.z, this._position.toArray());
    } else {
      const modelToPos = this._calculateNormalFromModelCenter();
      const { yaw, pitch } = directionToYawPitch(modelToPos);

      targetPose = new Pose(toDegree(yaw), toDegree(pitch), 0, this._position.toArray());
    }

    if (!targetPose.equals(camera.currentPose)) {
      void camera.reset(1000, DEFAULT.EASING, targetPose);
    }

    window.addEventListener("click", () => {
      this._el.classList.remove(DEFAULT_CLASS.ANNOTATION_SELECTED);
    }, { once: true, capture: true });
  };

  private _onWheel = (evt: WheelEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  private _calculateNormalFromModelCenter(): THREE.Vector3 {
    const view3D = this._view3D;
    const model = view3D.model;
    const center = model
      ? model.bbox.getCenter(new THREE.Vector3())
      : new THREE.Vector3();

    return new THREE.Vector3().subVectors(this._position, center).normalize();
  }
}

export default Annotation;
