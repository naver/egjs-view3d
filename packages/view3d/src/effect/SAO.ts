/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { SAOPass, SAOPassParams } from "three/examples/jsm/postprocessing/SAOPass";
import View3DEffect from "./View3DEffect";
import View3D from "../View3D";

/**
 * Options for the {@link SAO}
 * @interface
 * @param {boolean} [depthTexture=false] - Whether the use of depthTexture.
 * @param {boolean} [useNormals=false] - Whether the use of normals.
 */
export interface SAOOptions extends SAOPassParams {
  depthTexture?: boolean;
  useNormals?: boolean;
}

/**
 * The SAO effect created based on the {@link https://threejs.org/examples/#webgl_postprocessing_sao SAO} post-processing of Three.js.
 */
class SAO extends View3DEffect {

  private _saoPass: SAOPass | null;

  private _options: Partial<SAOPassParams>;

  constructor({ saoIntensity = 0.05, saoKernelRadius = 10, ...options }: Partial<SAOOptions> = {}) {
    super();
    this._saoPass = null;
    this._options = { saoIntensity, saoKernelRadius, ...options };
  }

  public init(view3D: View3D) {
    const scene = view3D.scene.root;
    const camera = view3D.camera.threeCamera;
    const options = this._options;

    const saoPass = this._saoPass = new SAOPass(scene, camera);
    saoPass.params = { ...saoPass.params, ...options };
  }

  public getPass() { return this._saoPass; }
}

export default SAO;
