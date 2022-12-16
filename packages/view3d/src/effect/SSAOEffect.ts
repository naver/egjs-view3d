/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
import View3D from "../View3D";
import { Effects } from "./EffectManager";


export interface SSAOOptions {
  kernelRadius: number;
  kernelSize: number;
  maxDistance: number;
  minDistance: number;
}

class SSAOEffect extends SSAOPass implements Effects {

  private _view3D: View3D;

  public constructor(view3D: View3D, {
    kernelRadius = 1,
    maxDistance = 5,
    minDistance = 0,
    kernelSize = 1
  }: Partial<SSAOOptions> = {}) {
    const scene = view3D.scene.root;
    const camera = view3D.camera.threeCamera;

    super(scene, camera);
    this._view3D = view3D;
    this.kernelRadius = kernelRadius;
    this.kernelSize = kernelSize;
    this.maxDistance = maxDistance;
    this.minDistance = minDistance;
  }

  public off(): void {
    this.enabled = false;
  }

  public on(): void {
    this.enabled = true;
  }

  public setOptions(val: Partial<SSAOOptions>) {
    const { renderer } = this._view3D;

    for (const key in val) {
      this[key] = val[key];
    }

    renderer.renderSingleFrame();
  }

}

export default SSAOEffect;
