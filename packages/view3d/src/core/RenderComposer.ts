/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import View3D from "../View3D";

class RenderComposer {
  private _view3D: View3D;

  public constructor(view3D: View3D) {
    this._view3D = view3D;
  }

  public render() {
    const isPostProcessing = this._view3D.effectManager.hasEffect;

    if (isPostProcessing) {
      this._renderPostProcessing();
    } else {
      this._renderDefault();
    }
  }

  private _renderPostProcessing() {
    const effectManager = this._view3D.effectManager;
    effectManager.composer.render();
  }

  private _renderDefault() {
    const view3D = this._view3D;
    const { renderer, scene, camera } = view3D;

    renderer.threeRenderer.render(scene.root, camera.threeCamera);
  }
}

export default RenderComposer;
