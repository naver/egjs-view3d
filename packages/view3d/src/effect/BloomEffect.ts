/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import View3D from "../View3D";
import { Effects } from "./Effects";

export interface BloomOptions {
  strength: number;
  threshold: number;
  radius: number;
}

class BloomEffect extends UnrealBloomPass implements Effects {
  order: number;
  private _view3D: View3D;

  public constructor(view3D: View3D, {
    threshold = 0.3,
    strength = 0.5,
    radius = 0.5
  }: Partial<BloomOptions> = {}) {

    super(new THREE.Vector2(300, 150), strength, radius, threshold);

    view3D.on("resize", () => {
      const { width, height } = view3D.renderer.canvasSize;
      this.resolution = new THREE.Vector2(width, height);
    });
  }


  public off(): void {
    this.enabled = false;
  }

  public on(): void {
    this.enabled = true;
  }

  public setOptions(val: Partial<BloomOptions>): void {
    const { renderer } = this._view3D;

    for (const key in val) {
      this[key] = val[key];
    }

    renderer.renderSingleFrame();
  }
}

export default BloomEffect;
