import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import View3D from "../../View3D";

import PostProcessing from "./PostProcessing";
import Effects from "./Effects";

export interface UnrealBloomOptions {
  strength: number;
  threshold: number;
  radius: number;
}

class UnrealBloomEffect extends UnrealBloomPass implements Effects {
  public unrealBloom: UnrealBloomPass;
  private _view3D: View3D;

  public constructor(view3D: View3D, postProcessing: PostProcessing, {
    threshold = 0.3,
    strength = 0.5,
    radius = 0.5
  }: Partial<UnrealBloomOptions> = {}) {
    const { width, height } = view3D.renderer.canvasSize;
    super(new THREE.Vector2(width, height), strength, radius, threshold);
  }

  public off(): void {
    this.unrealBloom.enabled = false;
  }

  public on(): void {
    this.unrealBloom.enabled = true;
  }


  public setOptions(val: Partial<UnrealBloomOptions>): void {
    const { renderer } = this._view3D;

    for (const key in val) {
      this[key] = val[key];
    }

    renderer.renderSingleFrame();
  }
}

export default UnrealBloomEffect;
