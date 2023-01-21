/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import View3D from "../View3D";
import * as THREE from "three";
import View3DEffect from "./View3DEffect";

/**
 * Options for the {@link Bloom}
 * @interface
 * @param {number} [strength=0.5] - The strength.
 * @param {number} [radius=0.5] - The size of blur radius.
 * @param {number} [threshold=0.9] - The luminance threshold. Raise this value to mask out darker elements in the scene. Range is [0, 1].
 */
export interface BloomOptions {
  strength: number;
  radius: number;
  threshold: number;
}

/**
 * The Bloom effect created based on the {@link https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html unreal bloom} post-processing of Three.js.
 */
class Bloom extends View3DEffect {

  private _bloomPass: UnrealBloomPass | null;

  private _options: {
    radius: number;
    threshold: number;
    strength: number;
  };

  constructor({ radius = 0.5, threshold = 0.9, strength = 0.5 }: Partial<BloomOptions> = {}) {
    super();

    this._bloomPass = null;
    this._options = {
      radius,
      threshold,
      strength
    };
  }

  public init(view3D: View3D) {
    const { width, height } = view3D.renderer.size;
    const { radius, threshold, strength } = this._options;
    const resolution = new THREE.Vector2(width * window.devicePixelRatio, height * window.devicePixelRatio);

    this._bloomPass = new UnrealBloomPass(resolution, strength, radius, threshold);
  }

  public getPass() { return this._bloomPass; }

}

export default Bloom;
