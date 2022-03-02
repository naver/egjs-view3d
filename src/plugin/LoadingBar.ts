/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import { EVENTS } from "../const/external";
import { LoadStartEvent } from "../type/event";
import { ValueOf } from "../type/utils";

import View3DPlugin from "./View3DPlugin";

/**
 * Options for the {@link LoadingBar}
 * @interface
 * @param {string} [type="default"] A type(style) of the loading bar.
 * @param {string} [loadingLabel="Loading 3D Model..."] A text to display while loading 3D model.
 * @param {string} [parsingLabel="Parsing 3D Model..."] A text to display while parsing the model after loading is done.
 * @param {string} [labelColor="#ffffff"] A text color in CSS string.
 * @param {string} [barWidth="70%"] Loading bar's width in CSS string. This is only applicable for type "default"
 * @param {string} [barHeight="10px"] Loading bar's height in CSS string.
 * @param {string} [barBackground="#bbbbbb"] Loading bar's background color in CSS string. This is not applicable to type "spinner"
 * @param {string} [barForeground="#3e8ed0"] Loading bar's foreground color in CSS string.
 * @param {string} [spinnerWidth="30%"] Spinner's width in CSS string. This is only applicable for type "spinner"
 * @param {string} [overlayBackground="rgba(0, 0, 0, 0.3)"] Overlay's background color in CSS string. This is not applicable to type "top"
 */
export interface LoadingBarOptions {
  type: ValueOf<typeof LoadingBar.TYPE>;
  loadingLabel: string;
  parsingLabel: string;
  labelColor: string;
  barWidth: string;
  barHeight: string;
  barBackground: string;
  barForeground: string;
  spinnerWidth: string;
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
    view3D.on(EVENTS.LOAD_START, this._startLoading);
  }

  public teardown(view3D: View3D): void {
    view3D.off(EVENTS.LOAD_START, this._startLoading);
    this._removeOverlay(view3D);
  }

  private _startLoading = ({ target: view3D, level }: LoadStartEvent) => {
    if (level !== 0) return;

    const {
      type = "default",
      loadingLabel = "Loading 3D Model...",
      parsingLabel = "Parsing 3D Model...",
      labelColor = "#ffffff",
      barWidth = "70%",
      barHeight = "10px",
      barBackground = "#bbbbbb",
      barForeground = "#3e8ed0",
      spinnerWidth = "30%",
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

    loadingOverlay.style.backgroundColor = overlayBackground;
    if (type !== LoadingBar.TYPE.SPINNER) {
      loadingBar.style.height = barHeight;
      loadingBar.style.backgroundColor = barBackground;
      loadingFiller.style.backgroundColor = barForeground;
    } else {
      loadingBar.classList.add("type-spinner");
      loadingBar.style.width = spinnerWidth;
      loadingBar.style.paddingTop = spinnerWidth;
      loadingFiller.style.borderWidth = barHeight;
      loadingFiller.style.borderColor = barForeground;
      loadingFiller.style.borderLeftColor = "transparent";
    }

    if (type === LoadingBar.TYPE.TOP) {
      loadingOverlay.classList.add("type-top");
    } else if (type === LoadingBar.TYPE.DEFAULT) {
      loadingBar.style.width = barWidth;
    }

    loadingLabelEl.style.color = labelColor;
    loadingLabelEl.innerText = loadingLabel;

    loadingBar.appendChild(loadingFiller);
    loadingWrapper.appendChild(loadingBar);
    loadingWrapper.appendChild(loadingLabelEl);
    loadingOverlay.appendChild(loadingWrapper);
    view3D.rootEl.appendChild(loadingOverlay);

    if (type !== LoadingBar.TYPE.SPINNER) {
      const onProgress = () => {
        if (!view3D.loadingContext.every(ctx => ctx.initialized)) return;

        const [loaded, total] = view3D.loadingContext
          .filter(ctx => ctx.lengthComputable)
          .reduce((values, ctx) => {
            values[0] += ctx.loaded;
            values[1] += ctx.total;
            return values;
          }, [0, 0]);

        if (total <= 0) return;

        const percentage = 100 * (loaded / total);

        loadingFiller.style.width = `${percentage.toFixed(2)}%`;

        if (loaded === total) {
          loadingLabelEl.innerText = parsingLabel;
        }
      };

      view3D.on(EVENTS.PROGRESS, onProgress);

      view3D.once(EVENTS.LOAD_FINISH, () => {
        view3D.off(EVENTS.PROGRESS, onProgress);
      });
    }

    view3D.once(EVENTS.LOAD_FINISH, () => {
      this._removeOverlay(view3D);
    });

    this._overlay = loadingOverlay;
  };

  private _removeOverlay(view3D: View3D) {
    const overlay = this._overlay;
    if (!overlay) return;

    if (overlay.parentElement === view3D.rootEl) {
      view3D.rootEl.removeChild(overlay);
    }

    this._overlay = null;
  }
}

export default LoadingBar;
