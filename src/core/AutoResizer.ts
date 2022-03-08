/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import View3D from "../View3D";
import * as BROWSER from "../const/browser";

class AutoResizer {
  private _view3d: View3D;
  private _enabled: boolean;
  private _resizeObserver: ResizeObserver | null;

  public get enabled() { return this._enabled; }

  public constructor(view3d: View3D) {
    this._view3d = view3d;
    this._enabled = false;
    this._resizeObserver = null;
  }

  public enable(): this {
    const view3d = this._view3d;

    if (this._enabled) {
      this.disable();
    }

    if (view3d.useResizeObserver && !!window.ResizeObserver) {
      const canvasEl = view3d.renderer.canvas;
      const canvasBbox = canvasEl.getBoundingClientRect();
      const resizeImmediate = canvasBbox.width !== 0 || canvasBbox.height !== 0;

      const resizeObserver = new ResizeObserver(resizeImmediate ? this._skipFirstResize : this._onResize);

      // This will automatically call `resize` for the first time
      resizeObserver.observe(canvasEl);

      this._resizeObserver = resizeObserver;
    } else {
      view3d.resize();
      window.addEventListener(BROWSER.EVENTS.RESIZE, this._onResize);
    }

    this._enabled = true;

    return this;
  }

  public disable(): this {
    if (!this._enabled) return this;

    const resizeObserver = this._resizeObserver;
    if (resizeObserver) {
      resizeObserver.disconnect();
      this._resizeObserver = null;
    } else {
      window.removeEventListener(BROWSER.EVENTS.RESIZE, this._onResize);
    }

    this._enabled = false;

    return this;
  }

  private _onResize = () => {
    this._view3d.resize();
  };

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private _skipFirstResize = (() => {
    let isFirstResize = true;

    return (() => {
      if (isFirstResize) {
        isFirstResize = false;

        return;
      }
      this._onResize();
    });
  })();
}

export default AutoResizer;
