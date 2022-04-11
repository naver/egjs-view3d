/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import * as BROWSER from "../const/browser";
import { DEFAULT_CLASS } from "../const/external";

/**
 * Options for {@link Annotation}
 */
export interface AnnotationOptions {
  element: HTMLElement;
  position: number[];
}

/**
 *
 */
class Annotation {
  private _el: HTMLElement;
  private _position: THREE.Vector3;

  public get element() { return this._el; }
  public get position() { return this._position; }

  /** */
  public constructor(options: AnnotationOptions) {
    this._el = options.element;
    this._position = new THREE.Vector3().fromArray(options.position);

    this._el.draggable = false;

    this.enableClickHandler();
  }

  public enableClickHandler() {
    this._el.addEventListener(BROWSER.EVENTS.CLICK, this._onClick);
  }

  public disableClickHandler() {
    this._el.removeEventListener(BROWSER.EVENTS.CLICK, this._onClick);
  }

  private _onClick = () => {
    this._el.classList.add(DEFAULT_CLASS.ANNOTATION_SELECTED);

    window.addEventListener("click", () => {
      this._el.classList.remove(DEFAULT_CLASS.ANNOTATION_SELECTED);
    }, { once: true, capture: true });
  };
}

export default Annotation;
