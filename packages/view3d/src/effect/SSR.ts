/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import View3DEffect from "./View3DEffect";
import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass";
import * as THREE from "three";

/**
 * Options for the {@link SSR}
 * @interface
 * @param {THREE.Mesh[] | null} [selects=null] - Target meshes to be used SSR. If is null, applied to all meshes.
 */
export interface SSROptions {
  selects: THREE.Mesh[] | null;
}

/**
 * The SSR effect created based on the {@link https://threejs.org/examples/webgl_postprocessing_ssr.html ssr} post-processing of Three.js.
 */
class SSR extends View3DEffect {

  private _ssrPass: SSRPass | null;

  private _options: SSROptions;

  constructor({ selects = null }: Partial<SSROptions> = {}) {
    super();

    this._ssrPass = null;
    this._options = {
      selects,
    };

  }
  public init(view3D: View3D) {
    const renderer = view3D.renderer.threeRenderer;
    const scene = view3D.scene.root;
    const camera = view3D.camera.threeCamera;
    const { selects } = this._options;

    return this._ssrPass = new SSRPass({ groundReflector: null, selects, renderer, scene, camera});
  }

  public getPass() { return this._ssrPass; }
}

export default SSR;
