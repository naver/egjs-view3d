/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import { Composer, PassType } from "./View3DEffect";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";


/**
 * Manager class for effects
 */
class EffectManager {
  private _effectComposer: Composer;

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
    return this._effectComposer.passes.length > 1;
  }

  public set effectComposer(composer: Composer) {
    this._effectComposer = composer;
  }

  constructor(view3D: View3D) {
    const renderer = view3D.renderer.threeRenderer;
    const scene = view3D.scene.root;
    const camera = view3D.camera.threeCamera;

    const effectComposer = this._effectComposer = new EffectComposer(renderer);

    effectComposer.addPass(new RenderPass(scene, camera));
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
}

export default EffectManager;
