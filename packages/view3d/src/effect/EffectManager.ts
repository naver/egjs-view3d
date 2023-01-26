/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import { Composer, EffectCallback, PassType, SetCustomEffectParam } from "./View3DEffect";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { View3DEffect } from "./index";


/**
 * Manager class for effects
 */
class EffectManager {
  private _effectComposer: Composer;

  private _effects: (View3DEffect | EffectCallback | PassType)[] = [];

  private _isEffect = false;

  private _view3D: View3D;

  private _customEffectCallback: SetCustomEffectParam | null;

  public set customEffectCallback(val: SetCustomEffectParam) { this._customEffectCallback = val; }


  /**
   * EffectComposer object on three.js or library
   */
  public get effectComposer() {
    return this._effectComposer;
  }

  /**
   * Returns whether the current effect is in use or not.
   * The render pass is included by default, so if there are more than one pass, effect is determined to be in use.
   */
  public get isEffect() {
    return this._isEffect;
  }

  public get effects() { return this._effects; }
  public set effects(val: (View3DEffect | EffectCallback | PassType)[]) {
    this._effects = val;
  }
  public set isEffect(val: boolean) { this._isEffect = val; }

  public set effectComposer(composer: Composer) {
    this._effectComposer = composer;
  }

  constructor(view3D: View3D) {
    this._view3D = view3D;
    const renderer = view3D.renderer.threeRenderer;
    const scene = view3D.scene.root;
    const camera = view3D.camera.threeCamera;

    const effectComposer = this._effectComposer = new EffectComposer(renderer);

    effectComposer.addPass(new RenderPass(scene, camera));
  }

  public initEffects(effects: (View3DEffect | EffectCallback | PassType)[]): PassType[] {
    const view3D = this._view3D;
    const assets = this._getAssets();

    const result = effects.map((effect) => {

      if (effect instanceof Function) {
        effect = effect(assets);
      }

      if (effect instanceof View3DEffect) {
        return effect.init(view3D);
      }

      return effect;
    });

    return result;
  }

  /**
   * Add pass to {@link effectComposer}
   * @param pass
   */
  public addPass(pass: PassType) {
    this._effectComposer.addPass(pass);
  }

  /**
   * Resize {@link effectComposer} canvas size and devicePixelRatio
   * @param width
   * @param height
   */
  public resize({ width, height }: { width: number; height: number }) {
    this._effectComposer.setSize(width * window.devicePixelRatio, height * window.devicePixelRatio);
  }

  /**
   * Renders all enabled passes in the order in which they were added.
   *
   * @param {Number} [deltaTime] - The time since the last frame in seconds.
   */
  public render(deltaTime?: number) {

    this._effectComposer.render(deltaTime);
  }

  public update() {
    if (this._customEffectCallback) {
      this._initCustomEffect();
      return;
    }

    const effects = this._effects;
    const updatedEffect = this.initEffects(effects);

    updatedEffect.forEach((effect) => {
      this.addPass(effect);
    });
  }

  public reset() {
    const effectComposer = this._effectComposer;
    const passes = this._effectComposer.passes;

    this._isEffect = false;

    while (passes.length > 1) {
      effectComposer.removePass(passes[passes.length - 1]);
    }

    effectComposer.reset();
  }

  private _getAssets() {
    const view3D = this._view3D;
    const scene = view3D.scene.root;
    const renderer = view3D.renderer.threeRenderer;
    const camera = view3D.camera.threeCamera;
    const canvasSize = view3D.renderer.canvasSize;
    const model = view3D.model;

    return { scene, renderer, camera, canvasSize, model };
  }

  private _initCustomEffect() {
    const assets = this._getAssets();

    if (!this._customEffectCallback) return;

    this._effectComposer = this._customEffectCallback(assets);
  }

}

export default EffectManager;
