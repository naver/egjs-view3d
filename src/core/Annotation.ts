/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

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
  }
}

export default Annotation;
