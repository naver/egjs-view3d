/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../View3D";
import { DEFAULT_CLASS } from "../const/external";
import { getNullableElement } from "../utils";

import Annotation from "./Annotation";

/**
 * Manager class for {@link HotSpot}
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

  /** */
  public constructor(view3D: View3D) {
    this._view3D = view3D;
    this._list = [];
    this._wrapper = getNullableElement(view3D.annotationWrapper, view3D.rootEl) || this._createWrapper();
  }

  /**
   * Collect annotations from the wrapper
   */
  public collect() {
    const view3D = this._view3D;
    const wrapper = this._wrapper;
    const annotationEls = [].slice.apply(wrapper.querySelectorAll(view3D.annotationSelector)) as HTMLElement[];

    let defaultAnnotationIdx = 1;
    const annotations = annotationEls.map(el => {
      const positionStr = el.dataset.position ?? "";
      const position = positionStr.split(" ").map(val => parseFloat(val));

      if (el.classList.contains(DEFAULT_CLASS.ANNOTATION_DEFAULT), el.innerHTML === "") {
        el.innerHTML = `${defaultAnnotationIdx}`;
        defaultAnnotationIdx += 1;
      }

      return new Annotation({
        element: el,
        position
      });
    });

    this.add(...annotations);
  }

  /**
   * Render annotations
   * @param {THREE.PerspectiveCamera} camera Current rendering camera
   */
  public render(camera: THREE.PerspectiveCamera) {
    const threeRenderer = this._view3D.renderer.threeRenderer;
    const halfScreenSize = threeRenderer.getSize(new THREE.Vector2()).multiplyScalar(0.5);
    const camPos = camera.position;

    // Sort by distance most far to camera (descending)
    const annotations = [...this._list].map(annotation => {
      return {
        annotation,
        distToCameraSquared: camPos.distanceToSquared(annotation.position)
      };
    }).sort((a, b) => b.distToCameraSquared - a.distToCameraSquared)
      .map(({ annotation }) => annotation);

    annotations.forEach((annotation, idx) => {
      const el = annotation.element;
      const screenRelPos = annotation.position.clone().project(camera);
      const screenPos = new THREE.Vector2(screenRelPos.x, -screenRelPos.y);

      screenPos.multiply(halfScreenSize);
      screenPos.add(halfScreenSize);

      el.style.zIndex = `${idx + 1}`;
      el.style.transform = `translate(-50%, -50%) translate(${screenPos.x}px, ${screenPos.y}px)`;
    });
  }

  /**
   * Add new annotation to the scene
   * @param {AnnotationOptions} annotation Annotations to add
   */
  public add(...annotations: Annotation[]) {
    this._list.push(...annotations);
  }

  /**
   * Remove annotation at the given index
   */
  public remove(index: number) {
    this._list.splice(index, 1);
  }

  /**
   * Remove all hotspots
   */
  public reset() {
    const items = this._list;
    items.splice(0, items.length);
  }

  private _createWrapper(): HTMLElement {
    const view3D = this._view3D;
    const wrapper = document.createElement("div");

    wrapper.classList.add(DEFAULT_CLASS.ANNOTATION_WRAPPER);
    view3D.rootEl.appendChild(wrapper);

    return wrapper;
  }
}

export default AnnotationManager;
