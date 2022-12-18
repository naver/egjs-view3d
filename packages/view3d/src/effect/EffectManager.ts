import View3D from "../View3D";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { Effects } from "./Effects";

type EffectsName = "SSAOEffect" | "SSREffect" | "DoFEffect" | "BloomEffect";

class EffectManager {
  private _view3D: View3D;
  private _composer: EffectComposer;
  private _renderer;
  private _orderEffects: Record<EffectsName, number> = {
    SSAOEffect: 1,
    SSREffect: 2,
    DoFEffect: 3,
    BloomEffect: 4
  };
  private _activatedEffects: Record<EffectsName, boolean> = {
    BloomEffect: false,
    SSREffect: false,
    SSAOEffect: false,
    DoFEffect: false
  };

  public get composer() { return this._composer; }

  public get effects() { return this._activatedEffects; }

  public get hasEffect() { return this._composer.passes.length > 1; }

  constructor(view3D: View3D) {
    this._view3D = view3D;
    const renderer = this._renderer = view3D.renderer;
    const composer = this._composer = new EffectComposer(renderer.threeRenderer);
    const scene = view3D.scene.root;
    const camera = view3D.camera.threeCamera;

    composer.addPass(new RenderPass(scene, camera));

    view3D.on("resize", () => {
      const { width, height } = renderer.canvasSize;
      composer.setSize(width * window.devicePixelRatio, height * window.devicePixelRatio);
    });
  }

  public add(effect: Effects) {
    const passes = this._composer.passes;
    const orderEffects = this._orderEffects;
    const activatedEffects = this._activatedEffects;

    const effectName = effect.constructor.name;
    const effectOrder = orderEffects[effectName];

    if (activatedEffects[effectName]) return;

    for (let i = 1; i < passes.length; i++) {
      const passName = passes[i].constructor.name;
      const currentPassOrder = orderEffects[passName];

      if (effectOrder < currentPassOrder) {
        this._insertPass(effect, i);
        return;
      }
    }

    this._insertPass(effect);
  }

  private _insertPass(effect: Effects, index?: number) {
    const activatedEffects = this._activatedEffects;
    const effectName = effect.constructor.name;

    activatedEffects[effectName] = true;

    if (index) {
      this._composer.insertPass(effect, index);
    } else {
      this._composer.addPass(effect);
    }
  }
}

export default EffectManager;
