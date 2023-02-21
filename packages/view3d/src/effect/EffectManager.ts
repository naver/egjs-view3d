/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import { AssetKit, Composer, EffectCallback, PassType } from "./View3DEffect";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { View3DEffect } from "./index";

/**
 * Manager class for effects
 * It is the manager for post-processing or various effects
 */
class EffectManager {
  private _view3D: View3D;

  private _effectComposer: Composer;

  private _effects: (View3DEffect | EffectCallback | PassType)[] = [];

  private _customEffectCallback: ((param: AssetKit) => Composer) | null;

  private _isLoadEffect: boolean;

  private _isCustomMode: boolean;

  /**
   * EffectComposer object on three.js or library
   */
  public get effectComposer() {
    return this._effectComposer;
  }

  /**
   * Return whether the current effect is in use or not
   */
  public get isEffect() {
    return this._isLoadEffect || this._isCustomMode;
  }

  /**
   * Return whether the custom mode is in use or not
   * If {@link setCustomEffect} is used, this will be set to true
   */
  public get isCustomMode() {
    return this._isCustomMode;
  }

  /**
   * Return whether the load effect is in use or not.
   * If {@link loadEffects} is used, this will be set to true
   */
  public get isLoadEffect() {
    return this._isLoadEffect;
  }

  /**
   * Returns the array of pass used from {@link loadEffects}.
   */
  public get effects() {
    return this._effects;
  }

  public set effects(val: (View3DEffect | EffectCallback | PassType)[]) {
    this._effects = val;
  }

  public set isCustomMode(val: boolean) {
    this._isCustomMode = val;

    if (this._isLoadEffect) {
      console.error("Cannot use both on 'loadEffects' and 'SetCustomEffect'");
    }
  }

  public set isLoadEffect(val: boolean) {
    this._isLoadEffect = val;

    if (this._isCustomMode) {
      console.error("Cannot use both on 'loadEffects' and 'SetCustomEffect'");
    }
  }

  public set customEffectCallback(val: (param: AssetKit) => Composer) {
    this._customEffectCallback = val;
  }

  public set effectComposer(composer: Composer) {
    this._effectComposer = composer;
  }

  constructor(view3D: View3D) {
    this._view3D = view3D;
    this._isCustomMode = false;
    this._isLoadEffect = false;

    this._initEffectComposer();
  }

  /**
   * Initialize {@link effects}
   * @param effects
   */
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

  /**
   * Update on applied effects.
   * It is removed all applied effects and try again to set them
   */
  public update() {
    const canvasSize = this._view3D.renderer.canvasSize;
    const effects = this._effects;
    const updatedEffect = this.initEffects(effects);

    if (this._isLoadEffect && this._isCustomMode) {
      console.error("Cannot use both on 'loadEffects' and 'SetCustomEffect'");
    }

    this._removeAllPasses();

    if (this._isLoadEffect) {
      updatedEffect.forEach((effect) => {
        this.addPass(effect);
      });
    }

    if (this._isCustomMode) {
      this._initCustomEffect();
    }

    this.resize(canvasSize);
  }

  /**
   * Reset effect to initial state
   */
  public reset() {
    const effectComposer = this._effectComposer;

    this._removeAllPasses();

    effectComposer.reset();
    if (effectComposer.dispose) {
      effectComposer.dispose();
    }

    this._initEffectComposer();

    this._effects = [];
    this._isLoadEffect = false;
    this._isCustomMode = false;
    this._customEffectCallback = null;
  }

  private _initEffectComposer() {
    const view3D = this._view3D;
    const renderer = view3D.renderer.threeRenderer;
    const scene = view3D.scene.root;
    const camera = view3D.camera.threeCamera;

    this._effectComposer = new EffectComposer(renderer);
    this._effectComposer.addPass(new RenderPass(scene, camera));
  }

  private _getAssets() {
    const view3D = this._view3D;
    const scene = view3D.scene.root;
    const renderer = view3D.renderer.threeRenderer;
    const camera = view3D.camera.threeCamera;
    const canvasSize = view3D.renderer.canvasSize;
    const model = view3D.model;

    return {scene, renderer, camera, canvasSize, model};
  }

  private _initCustomEffect() {
    const assets = this._getAssets();

    if (!this._customEffectCallback) return;

    this._effectComposer = this._customEffectCallback(assets);
  }

  private _removeAllPasses() {
    const passes = this._effectComposer.passes;

    passes.forEach((pass) => {
      if (pass.dispose) {
        pass.dispose();
      }
    });

    while (passes.length > 1) {
      this._effectComposer.removePass(passes[passes.length - 1]);
    }

  }

}

export default EffectManager;
