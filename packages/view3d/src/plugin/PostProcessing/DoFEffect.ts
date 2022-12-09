/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass";

import View3D from "../../View3D";

import PostProcessing from "./PostProcessing";
import Effects from "./Effects";

export interface DoFOptions {
  near: number;
  far: number;
  focus: number;
  aperture: number;
  maxblur: number;
}

class DoFEffect extends BokehPass implements Effects {
  public dof: BokehPass;
  private _view3D: View3D;

  public constructor(view3D: View3D, postProcessing: PostProcessing, {
    focus = 5,
    aperture = 0.01,
    maxblur = 0.01,
    near,
    far
  }: Partial<DoFOptions>) {
    const camera = view3D.camera.threeCamera;
    const scene = view3D.scene.root;
    const { width, height } = view3D.renderer.canvasSize;

    super(scene, camera, { maxblur, aperture, focus, width, height });
    this._view3D = view3D;

    if (near) {
      camera.near = near;
    }

    if (far) {
      camera.far = far;
    }

  }

  public off(): void { this.dof.enabled = false; }

  public on(): void {
    this.dof.enabled = true;
  }

  public setOptions(val: Partial<DoFOptions>): void {
    const { renderer } = this._view3D;
    const camera = this.camera as THREE.PerspectiveCamera;
    const target = this.uniforms;

    for (const key in val) {
      const value = val[key];

      if (key === "far" || key === "near") {
        camera[key] = value;
        continue;
      }

      target[key].value = val[key];
    }


    renderer.renderSingleFrame();
  }


}

export default DoFEffect;
