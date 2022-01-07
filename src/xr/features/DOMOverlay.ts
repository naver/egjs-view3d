/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as XR from "../../const/xr";

/**
 * Manager for WebXR dom-overlay feature
 */
class DOMOverlay {
  /**
   * Return whether dom-overlay feature is available
   */
  public static isAvailable() {
    return XR.DOM_OVERLAY_SUPPORTED();
  }

  private _root: HTMLElement | null = null;

  public get root() { return this._root; }

  public destroy() {
    this._root = null;
  }

  public getFeatures(root: HTMLElement) {
    this._root = root;

    return XR.FEATURES.DOM_OVERLAY(root);
  }
}

export default DOMOverlay;
