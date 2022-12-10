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

import BloomEffect, { BloomOptions } from "./BloomEffect";
import DoFEffect, { DoFOptions } from "./DoFEffect";
import SSAOEffect, { SSAOOptions } from "./SSAOEffect";
import SSREffect, { SSROptions } from "./SSREffect";


export interface PostProcessingOptions {
  SSAO: boolean | Partial<SSAOOptions>;
  DoF: boolean | Partial<DoFOptions>;
  SSR: boolean | Partial<SSROptions>;
  Bloom: boolean | Partial<BloomOptions>;
}

export interface PostProcessingEffects {
  ssaoEffect: SSAOEffect;
  dofEffect: DoFEffect;
  ssrEffect: SSREffect;
  bloomEffect: BloomEffect;
}

class PostProcessing implements View3DPlugin, PostProcessingEffects {

  // Options
  private _ssao: PostProcessingOptions["SSAO"];
  private _dof: PostProcessingOptions["DoF"];
  private _ssr: PostProcessingOptions["SSR"];
  private _bloom: PostProcessingOptions["Bloom"];

  // Effects
  private _ssaoEffect: PostProcessingEffects["ssaoEffect"];
  private _dofEffect: PostProcessingEffects["dofEffect"];
  private _ssrEffect: PostProcessingEffects["ssrEffect"];
  private _bloomEffect: PostProcessingEffects["bloomEffect"];

  private _view3D: View3D;
  private _renderer: THREE.WebGLRenderer;
  private _composer: EffectComposer;

  public get ssaoEffect() { return this._ssaoEffect; }

  public get dofEffect() { return this._dofEffect; }

  public get ssrEffect() { return this._ssrEffect; }

  public get bloomEffect() { return this._bloomEffect; }

  public get composer() { return this._composer; }

  public constructor({
    SSR = false,
    SSAO = false,
    DoF = false,
    Bloom = false
  }: Partial<PostProcessingOptions>) {
    this._ssr = SSR;
    this._ssao = SSAO;
    this._dof = DoF;
    this._bloom = Bloom;
  }

  public async init(view3D: View3D): Promise<void> {
    this._view3D = view3D;
    this._renderer = view3D.renderer.threeRenderer;
    this._composer = new EffectComposer(this._renderer);

    const scene = view3D.scene.root;
    const camera = view3D.camera.threeCamera;
    const composer = this._composer;

    view3D.once("beforeRender", () => {

      composer.addPass(new RenderPass(scene, camera));

      if (this._ssao) {
        const ssaoEffect = this._ssaoEffect = new SSAOEffect(view3D, this, getObjectOption(this._ssao));
        composer.addPass(ssaoEffect);
      }

      if (this._ssr) {
        const ssrEffect = this._ssrEffect = new SSREffect(view3D, this, getObjectOption(this._ssr));
        composer.addPass(ssrEffect);
      }

      if (this._dof) {
        const dofEffect = this._dofEffect = new DoFEffect(view3D, this, getObjectOption(this._dof));
        composer.addPass(dofEffect);
      }

      if (this._bloom) {
        const bloomEffect = this._bloomEffect = new BloomEffect(view3D, this, getObjectOption(this._bloom));
        composer.addPass(bloomEffect);
      } else {
        composer.addPass(new ShaderPass(GammaCorrectionShader));
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
