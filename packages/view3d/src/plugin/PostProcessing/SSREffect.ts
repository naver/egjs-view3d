import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass";

import View3D from "../../View3D";

import PostProcessing from "./PostProcessing";
import Effects from "./Effects";

export interface SSROptions {
  maxDistance: number;
  blur: boolean;
  opacity: number;
}

class SSREffect implements Effects {
  public ssr: SSRPass;
  private _view3D: View3D;

  public constructor(view3D: View3D, postProcessing: PostProcessing, {
    opacity = 0.5,
    blur = true,
    maxDistance = 0.1
  }: Partial<SSROptions>) {

    const camera = view3D.camera.threeCamera;
    const renderer = view3D.renderer.threeRenderer;
    const scene = view3D.scene.root;
    const modelMeshes = view3D.model?.meshes;

    const ssr = this.ssr = new SSRPass({
      camera,
      renderer,
      scene,
      groundReflector: null,
      selects: modelMeshes ?? null
    });

    ssr.opacity = opacity;
    ssr.blur = blur;
    ssr.maxDistance = maxDistance;
  }

  public off(): void {
    this.ssr.enabled = false;
  }

  public on(): void {
    this.ssr.enabled = true;
  }

  setOptions(val: unknown): void {
    console.log(val);
  }

}

export default SSREffect;
