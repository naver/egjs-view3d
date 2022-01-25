/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import { EVENTS } from "../const/external";
import { LoadProgressEvent } from "../type/event";

import View3DPlugin from "./View3DPlugin";

/**
 * Options for the {@link LoadingBar}
 * @interface
 */
export interface LoadingBarOptions {
  renderText: (fileName: string) => string;
}

/**
 *
 */
class LoadingBar implements View3DPlugin {
  private _options: Partial<LoadingBarOptions>;
  private _wrapper: HTMLElement | null;

  /**
   * Create new instance of Spinner
   * @param {object} [options={}] Options for the Spinner
   */
  public constructor(options: Partial<LoadingBarOptions> = {}) {
    this._options = options;
  }

  public async init(view3D: View3D) {
    const loadingOverlay = document.createElement("div");
    const loadingWrapper = document.createElement("div");
    const loadingLabel = document.createElement("div");
    const loadingBar = document.createElement("div");
    const loadingFiller = document.createElement("div");

    loadingLabel.innerHTML = "Loading 3D Model...";

    loadingOverlay.className = "view3d-lb-overlay";
    loadingWrapper.className = "view3d-lb-wrapper";
    loadingBar.className = "view3d-lb-base";
    loadingLabel.className = "view3d-lb-label";
    loadingFiller.className = "view3d-lb-filler";

    loadingBar.appendChild(loadingFiller);
    loadingWrapper.appendChild(loadingBar);
    loadingWrapper.appendChild(loadingLabel);
    loadingOverlay.appendChild(loadingWrapper);
    view3D.rootEl.appendChild(loadingOverlay);

    const onProgress = (evt: LoadProgressEvent) => {
      const percentage = 100 * (evt.loaded / evt.total);

      loadingFiller.style.width = `${percentage.toFixed(2)}%`;

      if (evt.loaded === evt.total) {
        loadingLabel.innerHTML = "Parsing 3D Model...";

        loadingBar.classList.add("is-spinning");
      }
    };

    view3D.on(EVENTS.PROGRESS, onProgress);

    view3D.once(EVENTS.LOAD, () => {
      view3D.off(EVENTS.PROGRESS, onProgress);

      this._removeWrapper(view3D);
    });

    this._wrapper = loadingOverlay;
  }

  public teardown(view3D: View3D): void {
    this._removeWrapper(view3D);
  }

  private _removeWrapper(view3D: View3D) {
    const wrapper = this._wrapper;
    if (!wrapper) return;

    if (wrapper.parentElement === view3D.rootEl) {
      view3D.rootEl.removeChild(wrapper);
    }

    this._wrapper = null;
  }
}

export default LoadingBar;
