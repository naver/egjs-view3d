import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import View3D from "../View3D";
import * as THREE from "three";
import View3DEffect from "./View3DEffect";

export interface BloomOptions {
  strength: number;
  radius: number;
  threshold: number;
}
class Bloom implements View3DEffect {
  private _bloomPass: UnrealBloomPass | null;
  private _options: {
    radius: number;
    threshold: number;
    strength: number;
  };
  constructor({ radius = 0.5, threshold = 0.5, strength = 0.5 }: Partial<BloomOptions> = {}) {
    this._bloomPass = null;
    this._options = {
      radius,
      threshold,
      strength
    };
  }

  public async init(view3D: View3D) {
    const { width, height } = view3D.renderer.size;

    const resolution = new THREE.Vector2(width * window.devicePixelRatio, height * window.devicePixelRatio);

    const { radius, threshold, strength } = this._options;
    this._bloomPass = new UnrealBloomPass(resolution, strength, radius, threshold);
  }

  public getPass() {
    return this._bloomPass;
  }

}

export default Bloom;
