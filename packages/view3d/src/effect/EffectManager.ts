import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import View3D from "../View3D";


export interface Composer {
  render(deltaTime?: number): void;

  addPass(pass: unknown): void;

  setSize(width: number, height: number): void;

  passes: unknown[];
  reset(): void;
}

class EffectManager {

  private _view3D: View3D;
  private _effectComposer: Composer;

  public get effectComposer() {
    return this._effectComposer;
  }

  public get isEffect() {
    return this._effectComposer.passes.length > 1;
  }


  public set effectComposer(composer: Composer) {
    this._effectComposer.reset();
    this._effectComposer = composer;
  }

  constructor(view3D: View3D) {
    const renderer = view3D.renderer.threeRenderer;
    this._effectComposer = new EffectComposer(renderer);
    const scene = view3D.scene.root;
    const camera = view3D.camera.threeCamera;

    this.addPass(new RenderPass(scene, camera));
  }

  public addPass(pass: unknown) {
    this._effectComposer.addPass(pass);
  }

  public resize({ width, height }: { width: number; height: number }) {
    this._effectComposer.setSize(width * window.devicePixelRatio, height * window.devicePixelRatio);
  }

}

export default EffectManager;
