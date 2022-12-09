import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";

import View3D from "../../View3D";

import PostProcessing from "./PostProcessing";
import Effects from "./Effects";

export interface SSAOOptions {
  kernelRadius: number;
  kernelSize: number;
  maxDistance: number;
  minDistance: number;
}

class SSAOEffect implements Effects {
  public ssao: SSAOPass;
  private _view3D: View3D;

  public constructor(view3D: View3D, postProcessing: PostProcessing, {
    kernelRadius = 1,
    maxDistance = 5,
    minDistance = 0,
    kernelSize = 1
  }: Partial<SSAOOptions> = {}) {
    this._view3D = view3D;
    const scene = view3D.scene.root;
    const camera = view3D.camera.threeCamera;
    const ssao = this.ssao = new SSAOPass(scene, camera);
    ssao.kernelRadius = kernelRadius;
    ssao.kernelSize = kernelSize;
    ssao.maxDistance = maxDistance;
    ssao.minDistance = minDistance;
    // ssao.output = parseInt(SSAOPass.OUTPUT.SSAO);
  }

  public setOptions(val: Partial<SSAOOptions>) {
    const ssao = this.ssao;

    console.log(ssao);
    for (const key in val) {
      ssao[key] = val[key];
    }

    this._view3D.renderer.renderSingleFrame();
  }

  public off(): void {
    this.ssao.enabled = false;
  }

  public on(): void {
    this.ssao.enabled = true;
  }

}

export default SSAOEffect;
