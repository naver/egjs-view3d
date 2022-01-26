/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import { EVENTS } from "../const/external";
import { LoadProgressEvent } from "../type/event";
import { ValueOf } from "../type/utils";

import View3DPlugin from "./View3DPlugin";

/**
 * Options for the {@link LoadingBar}
 * @interface
 * @param {string} [type="default"] A type(style) of the loading bar.
 * @param {string} [loadingLabel="Loading 3D Model..."] A text to display while loading 3D model.
 * @param {string} [parsingLabel="Parsing 3D Model..."] A text to display while parsing the model after loading is done.
 * @param {string} [labelColor="#ffffff"] A text color in CSS string
 * @param {string} [barHeight="10px"] Loading bar's height in CSS string
 * @param {string} [barBackground="#bbbbbb"] Loading bar's background color in CSS string
 * @param {string} [barForeground="#3e8ed0"] Loading bar's foreground color in CSS string
 * @param {string} [overlayBackground="rgba(0, 0, 0, 0.3)"] Overlay's background color in CSS string
 */
export interface LoadingBarOptions {
  type: ValueOf<typeof LoadingBar.TYPE>;
  loadingLabel: string;
  parsingLabel: string;
  labelColor: string;
  barHeight: string;
  barBackground: string;
  barForeground: string;
  overlayBackground: string;
}

/**
 * A plugin that displays loading bar while
 */
class LoadingBar implements View3DPlugin {
  /**
   * Available styles of loading bar
   */
  public static TYPE = {
    DEFAULT: "default",
    TOP: "top",
    SPINNER: "spinner"
  } as const;

  private _options: Partial<LoadingBarOptions>;
  private _overlay: HTMLElement | null;

  /**
   * Create new instance of Spinner
   * @param {LoadingBarOptions} [options={}] Options for the Spinner
   */
  public constructor(options: Partial<LoadingBarOptions> = {}) {
    this._options = options;
  }

  public async init(view3D: View3D) {
    view3D.once(EVENTS.LOAD_START, () => {
      this._startLoading(view3D);
    });
  }

  public teardown(view3D: View3D): void {
    this._removeOverlay(view3D);
  }

  private _startLoading = (view3D: View3D) => {
    const {
      type = "default",
      loadingLabel = "Loading 3D Model...",
      parsingLabel = "Parsing 3D Model...",
      labelColor = "#ffffff",
      barHeight = "10px",
      barBackground = "#bbbbbb",
      barForeground = "#3e8ed0",
      overlayBackground = "rgba(0, 0, 0, 0.3)"
    } = this._options;

    const loadingOverlay = document.createElement("div");
    const loadingWrapper = document.createElement("div");
    const loadingLabelEl = document.createElement("div");
    const loadingBar = document.createElement("div");
    const loadingFiller = document.createElement("div");

    loadingOverlay.classList.add("view3d-lb-overlay");
    loadingWrapper.classList.add("view3d-lb-wrapper");
    loadingBar.classList.add("view3d-lb-base");
    loadingLabelEl.classList.add("view3d-lb-label");
    loadingFiller.classList.add("view3d-lb-filler");

    loadingBar.style.height = barHeight;
    loadingOverlay.style.backgroundColor = overlayBackground;
    if (type !== LoadingBar.TYPE.SPINNER) {
      loadingBar.style.backgroundColor = barBackground;
      loadingFiller.style.backgroundColor = barForeground;
    } else {
      loadingBar.classList.add("type-spinner");
    }

    if (type === LoadingBar.TYPE.TOP) {
      loadingOverlay.classList.add("type-top");
    }

    loadingLabelEl.style.color = labelColor;
    loadingLabelEl.innerText = loadingLabel;

    loadingBar.appendChild(loadingFiller);
    loadingWrapper.appendChild(loadingBar);
    loadingWrapper.appendChild(loadingLabelEl);
    loadingOverlay.appendChild(loadingWrapper);
    view3D.rootEl.appendChild(loadingOverlay);

    if (type !== LoadingBar.TYPE.SPINNER) {
      const onProgress = (evt: LoadProgressEvent) => {
        const percentage = 100 * (evt.loaded / evt.total);

        loadingFiller.style.width = `${percentage.toFixed(2)}%`;

        if (evt.loaded === evt.total) {
          loadingLabelEl.innerText = parsingLabel;
        }
      };

      view3D.on(EVENTS.PROGRESS, onProgress);

      view3D.once(EVENTS.LOAD, () => {
        view3D.off(EVENTS.PROGRESS, onProgress);
      });
    }

    view3D.once(EVENTS.LOAD, () => {
      this._removeOverlay(view3D);
    });

    this._overlay = loadingOverlay;
  };

  private _removeOverlay(view3D: View3D) {
    const wrapper = this._overlay;
    if (!wrapper) return;

    if (wrapper.parentElement === view3D.rootEl) {
      view3D.rootEl.removeChild(wrapper);
    }

    this._overlay = null;
  }
}

export default LoadingBar;
