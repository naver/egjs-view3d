/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass";
import View3D from "../../View3D";
import PostProcessing from "./PostProcessing";
import Effects from "./Effects";

export interface SSROptions {
  maxDistance: number;
  blur: boolean;
  opacity: number;
}

class SSREffect extends SSRPass implements Effects {
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

    super({ renderer, camera, scene, groundReflector: null, selects: modelMeshes ?? null });

    this.groundReflector = null;
    this.opacity = opacity;
    this.blur = blur;
    this.maxDistance = maxDistance;
  }

  public off(): void {
    this.enabled = false;
  }

  public on(): void {
    this.enabled = true;
  }

  setOptions(val: Partial<SSROptions>): void {
    const { renderer } = this._view3D;

    for (const key in val) {
      this[key] = val[key];
    }

    renderer.renderSingleFrame();
  }
}

export default SSREffect;
