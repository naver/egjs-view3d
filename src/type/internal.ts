/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../View3D";
import Model from "../core/Model";

export type ValueOf<T> = T[keyof T];
export type LiteralUnion<T extends U, U = string> = T | (Pick<U, never> & {_?: never});

export interface Range {
  min: number;
  max: number;
}

export interface XRContext {
  view3d: View3D;
  model: Model;
  session: Readonly<any>;
}

export interface XRRenderContext extends XRContext {
  delta: number;
  frame: Readonly<any>;
  referenceSpace: Readonly<any>;
  xrCam: Readonly<THREE.PerspectiveCamera>;
  size: {
    width: number;
    height: number;
  };
}

export interface XRInputs {
  coords: THREE.Vector2[];
  inputSources: any[];
  hitResults?: any[];
}
