/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../View3D";
import Model from "../core/Model";

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
