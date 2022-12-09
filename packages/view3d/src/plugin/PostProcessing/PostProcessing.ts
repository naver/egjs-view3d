/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";

import View3D from "../../View3D";
import { getObjectOption } from "../../utils";
import View3DPlugin from "../View3DPlugin";

import UnrealBloomEffect, { UnrealBloomOptions } from "./UnrealBloomEffect";
import DoFEffect, { DoFOptions } from "./DoFEffect";
import SSAOEffect, { SSAOOptions } from "./SSAOEffect";
import SSREffect, { SSROptions } from "./SSREffect";


export interface PostProcessingOptions {
  ssao: boolean | Partial<SSAOOptions>;
  dof: boolean | Partial<DoFOptions>;
  ssr: boolean | Partial<SSROptions>;
  unrealBloom: boolean | Partial<UnrealBloomOptions>;
}

export interface PostProcessingEffects {
  ssaoEffect: SSAOEffect;
  dofEffect: DoFEffect;
  ssrEffect: SSREffect;
  unrealBloomEffect: UnrealBloomEffect;
}


class PostProcessing implements View3DPlugin, PostProcessingEffects {
  private _ssao: PostProcessingOptions["ssao"];
  private _dof: PostProcessingOptions["dof"];
  private _ssr: PostProcessingOptions["ssr"];
  private _unrealBloom: PostProcessingOptions["unrealBloom"];
  private _view3D: View3D;
  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _renderer: THREE.WebGLRenderer;

  public constructor({
    ssr = false,
    ssao = false,
    dof = false,
    unrealBloom = false
  }: Partial<PostProcessingOptions>) {
    this._ssr = ssr;
    this._ssao = ssao;
    this._dof = dof;
    this._unrealBloom = unrealBloom;
  }

  // Effects
  private _ssaoEffect: PostProcessingEffects["ssaoEffect"];
  private _dofEffect: PostProcessingEffects["dofEffect"];
  private _ssrEffect: PostProcessingEffects["ssrEffect"];
  private _unrealBloomEffect: PostProcessingEffects["unrealBloomEffect"];
  private _composer: EffectComposer;

  public get ssaoEffect() {
    return this._ssaoEffect;
  }

  public get dofEffect() {
    return this._dofEffect;
  }

  public get ssrEffect() {
    return this._ssrEffect;
  }

  public get unrealBloomEffect() {
    return this._unrealBloomEffect;
  }

  public get composer() {
    return this._composer;
  }

  public async init(view3D: View3D): Promise<void> {
    this._view3D = view3D;
    this._renderer = view3D.renderer.threeRenderer;
    this._composer = new EffectComposer(this._renderer);

    const scene = this._scene = view3D.scene.root;
    const camera = this._camera = view3D.camera.threeCamera;
    const composer = this._composer;

    view3D.once("beforeRender", () => {
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      if (this._ssao) {
        const ssaoEffect = this._ssaoEffect = new SSAOEffect(view3D, this, getObjectOption(this._ssao));
        composer.addPass(ssaoEffect.ssao);
      }

      if (this._ssr) {
        const ssrEffect = this._ssrEffect = new SSREffect(view3D, this, getObjectOption(this._ssr));
        composer.addPass(ssrEffect.ssr);
      }

      if (this._dof) {
        const dofEffect = this._dofEffect = new DoFEffect(view3D, this, getObjectOption(this._dof));
        composer.addPass(dofEffect);
      }

      if (this._unrealBloom) {
        const bloomEffect = this._unrealBloomEffect = new UnrealBloomEffect(view3D, this, getObjectOption(this._unrealBloom));
        composer.addPass(bloomEffect);
      } else {
        const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
        composer.addPass(gammaCorrectionPass);
      }

      this._view3D.renderer.renderSingleFrame();
    });

    view3D.on("resize", () => {
      this.resize();
    });
  }

  public resize() {
    const { width, height } = this._view3D.renderer.canvasSize;
    this.composer.setSize(width * window.devicePixelRatio, height * window.devicePixelRatio);
  }

  public teardown(view3D: View3D): void {
    this.composer.passes.forEach((pass) => {
      this.composer.removePass(pass);
    });
  }

}

export default PostProcessing;
