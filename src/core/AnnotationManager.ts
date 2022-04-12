/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../View3D";
import { DEFAULT_CLASS } from "../const/external";
import { CONTROL_EVENTS } from "../const/internal";
import { getNullableElement, losePrecision, toDegree } from "../utils";

import Annotation, { AnnotationOptions } from "./Annotation";

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
    const wrapper = this._wrapper;
    const annotationEls = [].slice.apply(wrapper.querySelectorAll(view3D.annotationSelector)) as HTMLElement[];

    const annotations = annotationEls.map(el => {
      const positionStr = el.dataset.position;
      const focusStr = el.dataset.focus;
      const position = positionStr
        ? positionStr.split(" ").map(val => parseFloat(val))
        : [];
      const focus = focusStr
        ? focusStr.split(" ").map(val => parseFloat(val))
        : [];

      return new Annotation(view3D, {
        element: el,
        position,
        focus
      });
    });

    view3D.control.controls.forEach(control => {
      control.on({
        [CONTROL_EVENTS.HOLD]: this._onInput
      });
    });

    this._list.push(...annotations);
  }

  public destroy() {
    this._list.forEach(annotation => {
      annotation.disableEvents();
    });
  }

  /**
   * Render annotations
   */
  public render() {
    const view3D = this._view3D;

    if (!view3D.model) return;

    const camera = view3D.camera;
    const threeRenderer = view3D.renderer.threeRenderer;
    const halfScreenSize = threeRenderer.getSize(new THREE.Vector2()).multiplyScalar(0.5);
    const threeCamera = camera.threeCamera;
    const camPos = threeCamera.position;
    const camPivot = camera.pivot;
    const breakpoints = {
      ...view3D.annotationBreakpoints,
      0: 1
    };

    // Sort by distance most far to camera (descending)
    const annotations = [...this._list].map(annotation => {
      return {
        annotation,
        distToCameraSquared: camPos.distanceToSquared(annotation.position)
      };
    }).sort((a, b) => b.distToCameraSquared - a.distToCameraSquared)
      .map(({ annotation }) => annotation);

    const pivotToCamDir = new THREE.Vector3().subVectors(camPos, camPivot).normalize();
    const breakpointKeysDesc = Object.keys(breakpoints)
      .map(val => parseFloat(val))
      .sort((a, b) => b - a);

    annotations.forEach((annotation, idx) => {
      const el = annotation.element;
      const screenRelPos = annotation.position.clone().project(threeCamera);
      const screenPos = new THREE.Vector2(screenRelPos.x, -screenRelPos.y);
      const pivotToAnnotationDir = new THREE.Vector3().subVectors(annotation.position, camPivot).normalize();

      const camToAnnotationDegree = toDegree(Math.abs(Math.acos(pivotToAnnotationDir.dot(pivotToCamDir))));

      for (const breakpoint of breakpointKeysDesc) {
        if (camToAnnotationDegree > breakpoint) {
          el.style.opacity = breakpoints[breakpoint];
          break;
        }
      }

      screenPos.multiply(halfScreenSize);
      screenPos.add(halfScreenSize);

      el.style.zIndex = `${idx + 1}`;
      el.style.transform = `translate(-50%, -50%) translate(${screenPos.x}px, ${screenPos.y}px)`;

      const screenX = losePrecision(screenRelPos.x, 10);
      const screenY = losePrecision(screenRelPos.y, 10);

      if (screenY < 0) {
        el.classList.add(DEFAULT_CLASS.ANNOTATION_FLIP_Y);
      } else {
        el.classList.remove(DEFAULT_CLASS.ANNOTATION_FLIP_Y);
      }

      if (screenX > 0) {
        el.classList.add(DEFAULT_CLASS.ANNOTATION_FLIP_X);
      } else {
        el.classList.remove(DEFAULT_CLASS.ANNOTATION_FLIP_X);
      }
    });
  }

  /**
   * Add new annotation to the scene
   * @param {AnnotationOptions} annotations Annotations to add
   */
  public add(...annotations: AnnotationOptions[]): Annotation[] {
    const view3D = this._view3D;
    const newAnnotations = annotations.map(options => new Annotation(view3D, options));
    this._list.push(...newAnnotations);

    return newAnnotations;
  }

  /**
   * Remove annotation at the given index
   */
  public remove(index: number): Annotation | null {
    const removed = this._list.splice(index, 1)[0];

    if (removed.element.parentElement === this._wrapper) {
      this._wrapper.removeChild(removed.element);
    }

    return removed || null;
  }

  /**
   * Remove all hotspots
   */
  public reset() {
    const annotations = this._list;
    annotations.splice(0, annotations.length);
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
      annotation.element.classList.remove(DEFAULT_CLASS.ANNOTATION_SELECTED);
    });
  };
}

export default AnnotationManager;
