/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../View3D";
import ARScene from "../xr/ARScene";

export interface XRRenderContext {
  view3D: View3D;
  scene: ARScene;
  session: THREE.XRSession;
  delta: number;
  vertical: boolean;
  frame?: THREE.XRFrame;
  referenceSpace: THREE.XRReferenceSpace;
  xrCam: THREE.PerspectiveCamera;
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
