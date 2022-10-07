/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../View3D";
import { DEFAULT_CLASS } from "../const/external";
import { CONTROL_EVENTS } from "../const/internal";
import * as BROWSER from "../const/browser";
import { getNullableElement, toDegree } from "../utils";

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
   * Init AnnotationManager
   */
  public init() {
    const view3D = this._view3D;

    view3D.control.controls.forEach(control => {
      control.on({
        [CONTROL_EVENTS.HOLD]: this._onInput
      });
    });
  }

  /**
   * Destroy all annotations & event handlers
   */
  public destroy() {
    this._view3D.control.controls.forEach(control => {
      control.off({
        [CONTROL_EVENTS.HOLD]: this._onInput
      });
    });

    this.reset();
  }

  /**
   * Resize annotations
   */
  public resize() {
    this._list.forEach(annotation => {
      annotation.resize();
    });
  }

  /**
   * Collect annotations inside the wrapper element
   */
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

    this.add(...annotations);
  }

  /**
   * Load annotation JSON from URL
   * @param {string} url URL to annotations json
   */
  public load(url: string): Promise<Annotation[]> {
    const fileLoader = new THREE.FileLoader();

    return new Promise((resolve, reject) => {
      fileLoader.load(url, json => {
        const data = JSON.parse(json as string);
        const parsed = this.parse(data);

        this.add(...parsed);

        resolve(parsed);
      }, undefined, error => {
        reject(error);
      });
    });
  }

  /**
   * Parse an array of annotation data
   * @param {object[]} data An array of annotation data
   */
  public parse(data: {
    baseFov: number;
    baseDistance: number;
    items: Array<{
      meshIndex: number | null;
      faceIndex: number;
      position: number[] | null;
      focus: number[];
      focusOffset: number[];
      duration: number;
      label: string | null;
    }>;
  }): Annotation[] {
    const view3D = this._view3D;
    const { baseFov, baseDistance, items } = data;
    const annotations = items.map(annotationData => {
      const { meshIndex, faceIndex, position, ...commonData } = annotationData;
      const element = this._createDefaultAnnotationElement(annotationData.label);

      if (meshIndex != null && faceIndex != null) {
        return new FaceAnnotation(view3D, {
          meshIndex,
          faceIndex,
          ...commonData,
          baseFov,
          baseDistance,
          element
        });
      } else {
        return new PointAnnotation(view3D, {
          position: position!,
          ...commonData,
          baseFov,
          baseDistance,
          element
        });
      }
    });

    return annotations;
  }

  /**
   * Render annotations
   */
  public render(camera?: THREE.PerspectiveCamera, size?: THREE.Vector2) {
    const view3D = this._view3D;
    const model = view3D.model;

    if (!model) return;

    const screenSize = size ?? view3D.renderer.canvasSize;
    const halfScreenSize = screenSize.clone().multiplyScalar(0.5);
    const threeCamera = camera ?? view3D.camera.threeCamera;
    const camPos = threeCamera.position;
    const modelCenter = model.center;
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

    const centerToCamDir = new THREE.Vector3().subVectors(camPos, modelCenter).normalize();
    const breakpointKeysDesc = Object.keys(breakpoints)
      .map(val => parseFloat(val))
      .sort((a, b) => b - a);

    annotationsDesc.forEach(({ annotation, position }, idx) => {
      if (!annotation.element) return;

      const screenRelPos = position.clone().project(threeCamera);
      const screenPos = new THREE.Vector2(screenRelPos.x, -screenRelPos.y);
      const centerToAnnotationDir = new THREE.Vector3().subVectors(position, modelCenter).normalize();
      const camToAnnotationDegree = toDegree(Math.abs(Math.acos(centerToAnnotationDir.dot(centerToCamDir))));

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
    const wrapper = this._wrapper;

    annotations.forEach(annotation => {
      annotation.enableEvents();

      if (annotation.element && annotation.element.parentElement !== wrapper) {
        wrapper.appendChild(annotation.element);
      }
    });

    this._list.push(...annotations);
  }

  /**
   * Remove annotation at the given index
   * @param {number} index Index of the annotation to remove
   */
  public remove(index: number): Annotation | null {
    const removed = this._list.splice(index, 1)[0];

    if (!removed) return null;

    removed.destroy();

    return removed;
  }

  /**
   * Remove all annotations
   */
  public reset() {
    const annotations = this._list;
    const removed = annotations.splice(0, annotations.length);

    removed.forEach(annotation => {
      annotation.destroy();
    });
  }

  /**
   * Save annotations as JSON
   */
  public toJSON() {
    const view3D = this._view3D;
    const annotations = this._list;
    const items = annotations.map(annotation => ({
      ...annotation.toJSON(),
      label: annotation.element?.querySelector(`.${DEFAULT_CLASS.ANNOTATION_TOOLTIP}`)?.innerHTML || null
    }));
    const size = view3D.renderer.size;
    const aspect = Math.max(size.height / size.width, 1);

    return {
      baseFov: view3D.camera.baseFov,
      baseDistance: view3D.camera.baseDistance,
      aspect,
      items
    };
  }

  private _createWrapper(): HTMLElement {
    const view3D = this._view3D;
    const wrapper = document.createElement(BROWSER.EL_DIV);

    wrapper.classList.add(DEFAULT_CLASS.ANNOTATION_WRAPPER);
    view3D.rootEl.appendChild(wrapper);

    return wrapper;
  }

  private _createDefaultAnnotationElement(label: string | null): HTMLElement {
    const annotation = document.createElement(BROWSER.EL_DIV);

    annotation.classList.add(DEFAULT_CLASS.ANNOTATION);
    annotation.classList.add(DEFAULT_CLASS.ANNOTATION_DEFAULT);

    if (label) {
      const tooltip = document.createElement(BROWSER.EL_DIV);
      tooltip.classList.add(DEFAULT_CLASS.ANNOTATION_TOOLTIP);
      tooltip.classList.add(DEFAULT_CLASS.ANNOTATION_DEFAULT);
      tooltip.innerHTML = label;
      annotation.appendChild(tooltip);
    }

    return annotation;
  }

  private _onInput = () => {
    const annotations = this._list;

    annotations.forEach(annotation => {
      annotation.handleUserInput();
    });
  };
}

export default AnnotationManager;
