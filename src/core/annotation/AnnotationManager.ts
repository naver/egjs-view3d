/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../../View3D";
import { DEFAULT_CLASS } from "../../const/external";
import { CONTROL_EVENTS } from "../../const/internal";
import { getNullableElement, toDegree } from "../../utils";

import Annotation from "./Annotation";
import PointAnnotation from "./PointAnnotation";
import FaceAnnotation from "./FaceAnnotation";

/**
 * Manager class for {@link Annotation}
 */
class AnnotationManager {
  private _view3D: View3D;
  private _list: Annotation[];
  private _wrapper: HTMLElement;

  /**
   * List of annotations
   * @type {Annotation[]}
   * @readonly
   */
  public get list() { return this._list; }

  /**
   * Wrapper element for annotations
   * @type {HTMLElement}
   * @readonly
   */
  public get wrapper() { return this._wrapper; }

  /** */
  public constructor(view3D: View3D) {
    this._view3D = view3D;
    this._list = [];
    this._wrapper = getNullableElement(view3D.annotationWrapper, view3D.rootEl) || this._createWrapper();
  }

  /**
   * Initialize and collect annotations from the wrapper
   */
  public init() {
    const view3D = this._view3D;

    view3D.control.controls.forEach(control => {
      control.on({
        [CONTROL_EVENTS.HOLD]: this._onInput
      });
    });
  }

  public destroy() {
    this._list.forEach(annotation => {
      annotation.disableEvents();
    });
  }

  public resize() {
    this._list.forEach(annotation => {
      annotation.resize();
    });
  }

  public collect() {
    const view3D = this._view3D;
    const wrapper = this._wrapper;
    const annotationEls = [].slice.apply(wrapper.querySelectorAll(view3D.annotationSelector)) as HTMLElement[];

    const annotations = annotationEls.map(element => {
      const focusStr = element.dataset.focus;
      const focus = focusStr
        ? focusStr.split(" ").map(val => parseFloat(val))
        : [];
      const focusDuration = element.dataset.duration
        ? parseFloat(element.dataset.duration)
        : void 0;
      const commonOptions = {
        element,
        focus,
        focusDuration
      };

      if (element.dataset.meshIndex) {
        const meshIndex = parseFloat(element.dataset.meshIndex);
        const faceIndex = element.dataset.faceIndex
          ? parseFloat(element.dataset.faceIndex)
          : void 0;

        return new FaceAnnotation(view3D, {
          ...commonOptions,
          meshIndex,
          faceIndex
        });
      } else {
        const positionStr = element.dataset.position;
        const position = positionStr
          ? positionStr.split(" ").map(val => parseFloat(val))
          : [];

        return new PointAnnotation(view3D, {
          ...commonOptions,
          position
        });
      }
    });

    annotations.forEach(annotation => {
      annotation.enableEvents();
    });

    this._list.push(...annotations);
  }

  /**
   * Render annotations
   */
  public render() {
    const view3D = this._view3D;

    if (!view3D.model) return;

    const camera = view3D.camera;
    const threeRenderer = view3D.renderer.threeRenderer;
    const screenSize = threeRenderer.getSize(new THREE.Vector2());
    const halfScreenSize = screenSize.clone().multiplyScalar(0.5);
    const threeCamera = camera.threeCamera;
    const camPos = threeCamera.position;
    const camPivot = camera.pivot;
    const breakpoints = view3D.annotationBreakpoints;

    // Sort by distance most far to camera (descending)
    const annotationsDesc = [...this._list]
      .filter(annotation => annotation.renderable)
      .map(annotation => {
        const position = annotation.position;

        return {
          annotation,
          position,
          distToCameraSquared: camPos.distanceToSquared(position)
        };
      }).sort((a, b) => b.distToCameraSquared - a.distToCameraSquared);

    const pivotToCamDir = new THREE.Vector3().subVectors(camPos, camPivot).normalize();
    const breakpointKeysDesc = Object.keys(breakpoints)
      .map(val => parseFloat(val))
      .sort((a, b) => b - a);

    annotationsDesc.forEach(({ annotation, position }, idx) => {
      if (!annotation.element) return;

      const screenRelPos = position.clone().project(threeCamera);
      const screenPos = new THREE.Vector2(screenRelPos.x, -screenRelPos.y);
      const pivotToAnnotationDir = new THREE.Vector3().subVectors(position, camPivot).normalize();
      const camToAnnotationDegree = toDegree(Math.abs(Math.acos(pivotToAnnotationDir.dot(pivotToCamDir))));

      screenPos.multiply(halfScreenSize);
      screenPos.add(halfScreenSize);

      for (const breakpoint of breakpointKeysDesc) {
        if (camToAnnotationDegree >= breakpoint) {
          annotation.setOpacity(breakpoints[breakpoint]);
          break;
        }
      }

      annotation.render({
        position,
        renderOrder: idx,
        screenPos,
        screenSize
      });
    });
  }

  /**
   * Add new annotation to the scene
   * @param {Annotation} annotations Annotations to add
   */
  public add(...annotations: Annotation[])  {
    annotations.forEach(annotation => {
      annotation.enableEvents();
    });

    this._list.push(...annotations);
  }

  /**
   * Remove annotation at the given index
   */
  public remove(index: number): Annotation | null {
    const removed = this._list.splice(index, 1)[0];

    if (!removed) return null;

    removed.destroy();

    return removed;
  }

  /**
   * Remove all hotspots
   */
  public reset() {
    const annotations = this._list;
    const removed = annotations.splice(0, annotations.length);

    removed.forEach(annotation => {
      annotation.destroy();
    });
  }

  private _createWrapper(): HTMLElement {
    const view3D = this._view3D;
    const wrapper = document.createElement("div");

    wrapper.classList.add(DEFAULT_CLASS.ANNOTATION_WRAPPER);
    view3D.rootEl.appendChild(wrapper);

    return wrapper;
  }

  private _onInput = () => {
    const annotations = this._list;

    annotations.forEach(annotation => {
      const el = annotation.element;

      if (!el) return;

      annotation.unfocus();
    });
  };
}

export default AnnotationManager;
