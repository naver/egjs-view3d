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
  public isAvailable() {
    return XR.DOM_OVERLAY_SUPPORTED();
  }

  public getFeatures(rootEl: HTMLElement | null) {
    return XR.FEATURES.DOM_OVERLAY(rootEl);
  }

  // /**
  //  * Show loading indicator, if there's any
  //  */
  // public showLoading() {
  //   if (!this._loadingEl) return;

  //   this._loadingEl.style.visibility = "visible";
  // }

  // /**
  //  * Hide loading indicator, if there's any
  //  */
  // public hideLoading() {
  //   if (!this._loadingEl) return;

  //   this._loadingEl.style.visibility = "hidden";
  // }
}

export default DOMOverlay;
