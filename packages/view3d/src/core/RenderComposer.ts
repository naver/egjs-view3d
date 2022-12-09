/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import View3D from "../View3D";
import { PostProcessing, View3DPlugin } from "../plugin";

class RenderComposer {
  private _view3D: View3D;
  private _postProcessing: PostProcessing | null;

  public constructor(view3D: View3D) {
    this._view3D = view3D;
    this._postProcessing = this._hasPostProcessing(view3D.plugins);
  }

  public isPostProcessing() {
    return !!this._postProcessing;
  }

  public render() {
    const isPostProcessing = this.isPostProcessing();

    if (isPostProcessing) {
      this._renderPostProcessing();
    } else {
      this._renderDefault();
    }
  }

  private _renderPostProcessing() {
    const postProcessing = this._postProcessing;
    postProcessing?.composer.render();
  }

  private _renderDefault() {
    const view3D = this._view3D;
    const { renderer, scene, camera } = view3D;

    renderer.threeRenderer.render(scene.root, camera.threeCamera);
  }

  private _hasPostProcessing(plugins: View3DPlugin[]) {
    for (const plugin of plugins) {
      if (plugin.constructor.name === "PostProcessing") return plugin as PostProcessing;
    }

    return null;
  }
}

export default RenderComposer;
