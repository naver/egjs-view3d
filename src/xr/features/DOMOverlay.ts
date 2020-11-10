/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as XR from "~/consts/xr";

/**
 * Manager for WebXR dom-overlay feature
 * @category XR
 */
class DOMOverlay {
  private _root: HTMLElement;
  private _loadingEl: HTMLElement | null;

  /**
   * Overlay root element
   */
  public get root() { return this._root; }
  /**
   * Loading indicator element, if there's any
   */
  public get loadingElement() { return this._loadingEl; }
  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit XRSessionInit} object for dom-overlay feature
   */
  public get features() { return XR.FEATURES.DOM_OVERLAY(this._root); }

  /**
   * Create new DOMOverlay instance
   * @param {object} [options] Options
   * @param {HTMLElement} [options.root] Overlay root element
   * @param {HTMLElement | null} [options.loadingEl] Model loading indicator element which will be invisible after placing model on the floor.
   */
  constructor(options: {
    root: HTMLElement,
    loadingEl: HTMLElement | null,
  }) {
    this._root = options.root;
    this._loadingEl = options.loadingEl;
  }

  /**
   * Return whether dom-overlay feature is available
   */
  public isAvailable() {
    return XR.DOM_OVERLAY_SUPPORTED;
  }

  /**
   * Show loading indicator, if there's any
   */
  public showLoading() {
    if (!this._loadingEl) return;

    this._loadingEl.style.visibility = "visible";
  }

  /**
   * Hide loading indicator, if there's any
   */
  public hideLoading() {
    if (!this._loadingEl) return;

    this._loadingEl.style.visibility = "hidden";
  }
}

export default DOMOverlay;
