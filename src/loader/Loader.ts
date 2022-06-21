/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import { EVENTS } from "../const/external";

/**
 * Base class for all loaders that View3D uses
 */
abstract class Loader {
  protected _view3D: View3D;

  /** */
  public constructor(view3D: View3D) {
    this._view3D = view3D;
  }

  protected _onLoadingProgress = (
    evt: ProgressEvent,
    src: string,
    context: View3D["loadingContext"][0]
  ) => {
    const view3D = this._view3D;

    context.initialized = true;
    context.lengthComputable = evt.lengthComputable;
    context.loaded = evt.loaded;
    context.total = evt.total;

    view3D.trigger(EVENTS.PROGRESS, {
      type: EVENTS.PROGRESS,
      target: view3D,
      src,
      lengthComputable: evt.lengthComputable,
      loaded: evt.loaded,
      total: evt.total
    });
  };
}

export default Loader;
