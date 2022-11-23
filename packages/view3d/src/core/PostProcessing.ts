/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass";
import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass";
import { Reflector } from "three/examples/jsm/objects/ReflectorForSSRPass";
import { Mesh } from "three/src/Three";

import View3D from "../View3D";
import { getObjectOption } from "../utils";

export interface SsaoOptions {
  kernelRadius: number;
  kernelSize: number;
  maxDistance: number;
  minDistance: number;
}

export interface BloomOptions {
  exposure: number;
  strength: number;
  threshold: number;
  radius: number;
}

export interface DoFOptions {
  focus: number;
  aperture: number;
  maxblur: number;
}

export interface SsrOptions {
  groundReflector: Reflector | null;
  selects: Mesh[] | null;
}

class PostProcessing {
  private _view3D: View3D;
  private _composer: EffectComposer;
  private _scene: Scene;
  private _camera: PerspectiveCamera;
  private _renderer: WebGLRenderer;
  private _isPostProcessing: boolean;

  public get composer() {
    return this._composer;
  }

  /**
   * whether using post-processing.
   * @type {boolean}
   * @readonly
   */
  public get isPostProcessing() {
    return this._isPostProcessing;
  }

  public constructor(view3D: View3D) {
    this._view3D = view3D;
    this._isPostProcessing = this._checkIsPostProcessing()
    this._renderer = this._view3D.renderer.threeRenderer;
    this._composer = new EffectComposer(this._renderer);

    const scene = this._scene = this._view3D.scene.root;
    const camera = this._camera = this._view3D.camera.threeCamera;

    this.composer.addPass(new RenderPass(scene, camera));

    view3D.once("beforeRender", () => {
      const {width, height} = this._view3D.renderer.canvasSize;
      this.composer.setSize(width, height);

      if (this._view3D.ssr) {
        this._addSsr(getObjectOption(this._view3D.ssr));
      }

      if (this._view3D.ssao) {
        this._addSSao(getObjectOption(this._view3D.ssao));
      }

      if (this._view3D.dof) {
        this._addDoF(getObjectOption(this._view3D.dof));
      }

      if (this._view3D.bloom) {
        this._addBloom(getObjectOption(this._view3D.bloom));
      }
    });
  }

  private _addSSao({
    kernelRadius = 1,
    maxDistance = 5,
    minDistance = 1,
    kernelSize = 1
  }: Partial<SsaoOptions> = {}) {
    const scene = this._scene;
    const camera = this._camera;

    const ssaoPass = new SSAOPass(scene, camera);
    ssaoPass.kernelRadius = kernelRadius;
    ssaoPass.kernelSize = kernelSize;
    ssaoPass.maxDistance = maxDistance;
    ssaoPass.minDistance = minDistance;

    this.composer.addPass(ssaoPass);
  }

  private _checkIsPostProcessing(){
    const {dof, bloom, ssr, ssao} = this._view3D;
    return !!dof || !!bloom || !!ssr || !!ssao;
  }

  private _addBloom({threshold = 1, strength = 1, radius = 1, exposure = 1}: Partial<BloomOptions>) {
    const {width, height} = this._view3D.renderer.canvasSize;

    const bloomPass = new UnrealBloomPass(new Vector2(width, height), 1.5, 0.4, 0.85);

    bloomPass.threshold = threshold;
    bloomPass.strength = strength;
    bloomPass.radius = radius;

    this.composer.addPass(bloomPass);
  }

  private _addDoF({maxblur = 0.01, aperture = 0.025, focus = 1.0}: Partial<DoFOptions>) {
    const scene = this._scene;
    const camera = this._camera;


    const bokehPass = new BokehPass(scene, camera, {
      focus,
      aperture,
      maxblur
    });

    this.composer.addPass(bokehPass);
  }

  private _addSsr({selects = null, groundReflector = null}: Partial<SsrOptions>) {
    const camera = this._camera;
    const renderer = this._renderer;
    const scene = this._scene;

    const ssrPass = new SSRPass({
      camera,
      renderer,
      scene,
      groundReflector,
      selects
    });

    this._composer.addPass(ssrPass);
  }
}

export default PostProcessing;
