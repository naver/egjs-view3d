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

  public collect() {
    const view3D = this._view3D;
    const wrapper = this._wrapper;
    const annotationEls = [].slice.apply(wrapper.querySelectorAll(view3D.annotationSelector)) as HTMLElement[];

    const annotations = annotationEls.map(el => {
      const positionStr = el.dataset.position ?? "";
      const position = positionStr.split(" ").map(val => parseFloat(val));

      return new Annotation({
        el,
        position
      });
    });

    this.add(...annotations);
  }

  public render(camera: THREE.PerspectiveCamera) {
    const threeRenderer = this._view3D.renderer.threeRenderer;
    const halfScreenSize = threeRenderer.getSize(new THREE.Vector2()).multiplyScalar(0.5);

    this._list.forEach(annotation => {
      const screenRelPos = annotation.position.clone().project(camera);
      const screenPos = new THREE.Vector2(screenRelPos.x, -screenRelPos.y);

      screenPos.multiply(halfScreenSize);
      screenPos.add(halfScreenSize);

      annotation.el.style.transform = `translate(-50%, -50%) translate(${screenPos.x}px, ${screenPos.y}px)`;
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
