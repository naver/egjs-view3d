/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */


import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass";
import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass";
import { Reflector } from "three/examples/jsm/objects/ReflectorForSSRPass";
import { Mesh } from "three/src/Three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";


import View3D from "../View3D";
import { getObjectOption } from "../utils";

export interface SsaoOptions {
  kernelRadius: number;
  kernelSize: number;
  maxDistance: number;
  minDistance: number;
}

export interface BloomOptions {
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

  // effect component
  private _bloomComponent:  UnrealBloomPass | undefined;

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
    this._isPostProcessing = this._checkIsPostProcessing();
    this._renderer = this._view3D.renderer.threeRenderer;
    this._composer = new EffectComposer(this._renderer);

    const scene = this._scene = this._view3D.scene.root;
    const camera = this._camera = this._view3D.camera.threeCamera;

    if (!this._isPostProcessing) return;

    view3D.once("beforeRender", () => {
      const {width, height} = this._view3D.renderer.canvasSize;

      this.composer.setSize(width * window.devicePixelRatio, height * window.devicePixelRatio);

      const renderPass = new RenderPass(scene, camera);
      this.composer.addPass(renderPass);

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
        this._bloomComponent = this._addBloom(getObjectOption(this._view3D.bloom));
      }

    });
  }

  public setBloomOptions(val: Partial<BloomOptions>) {
    const bloomComponent = this._bloomComponent;
    if (!bloomComponent ) {
      return new Error("Bloom is not applied");
    }

    for (const key in val) {
      bloomComponent[key] = val[key];
    }

  }

  private _setFXAA() {
    const effectFXAA = new ShaderPass( FXAAShader );

    const pixelRatio = this._view3D.renderer.threeRenderer.getPixelRatio();
    const {width, height} = this._view3D.renderer.canvasSize;
    effectFXAA.renderToScreen = false;

    effectFXAA.material.uniforms.resolution.value.x = 1 / ( width * pixelRatio );
    effectFXAA.material.uniforms.resolution.value.y = 1 / ( height * pixelRatio );
    this.composer.addPass( effectFXAA );
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

  private _checkIsPostProcessing() {
    const {dof, bloom, ssr, ssao} = this._view3D;
    return !!dof || !!bloom || !!ssr || !!ssao;
  }

  private _addBloom({threshold = 0, strength = 0.3, radius = 0.5}: Partial<BloomOptions>) {
    const {width, height} = this._view3D.renderer.canvasSize;

    const bloomPass = new UnrealBloomPass(new Vector2(width, height), 1.5, 0.4, 0.85);

    bloomPass.threshold = threshold;
    bloomPass.strength = strength;
    bloomPass.radius = radius;

    this.composer.addPass(bloomPass);
    return bloomPass;
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
