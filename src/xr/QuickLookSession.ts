/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import { IS_IOS, IS_SAFARI } from "../const/browser";
import { QUICKLOOK_SUPPORTED } from "../const/xr";

import ARSession from "./ARSession";

/**
 * AR Session using Apple AR Quick Look Viewer
 * @see https://developer.apple.com/augmented-reality/quick-look/
 */
class QuickLookSession implements ARSession {
  /**
   * Whether it's webxr-based session or not
   * @type false
   */
  public readonly isWebXRSession = false;

  private _file: string;
  private _allowsContentScaling: boolean;

  /**
   * Create new instance of QuickLookSession
   * @param {object} [options] Quick Look options
   * @param {string} [options.file] USDZ file's location URL.
   * @param {boolean} [options.allowsContentScaling=true] Whether to allow content scaling.
   */
  public constructor({
    file,
    allowsContentScaling = true
  }: {
    file: string;
    allowsContentScaling?: boolean;
  }) {
    this._file = file;
    this._allowsContentScaling = allowsContentScaling;
  }

  /**
   * Return the availability of QuickLookSession.
   * QuickLook AR is available on iOS12+ on Safari & Chrome browser
   * Note that iOS Chrome won't show up QuickLook AR when it's local dev environment
   * @returns {Promise} A Promise that resolves availability of this session(boolean).
   */
  public isAvailable() {
    // This can handle all WebKit based browsers including iOS Safari & iOS Chrome
    return Promise.resolve(QUICKLOOK_SUPPORTED() && IS_IOS && IS_SAFARI);
  }

  /**
   * Enter QuickLook AR Session
   */
  public enter() {
    const anchor = document.createElement("a") ;
    anchor.setAttribute("rel", "ar");
    anchor.appendChild(document.createElement("img"));

    const usdzURL = new URL(this._file, window.location.toString());
    if (!this._allowsContentScaling) {
      usdzURL.hash = "allowsContentScaling=0";
    }

    anchor.setAttribute("href", usdzURL.toString());
    anchor.click();

    return Promise.resolve();
  }

  public exit() {
    // DO NOTHING
  }
}

export default QuickLookSession;
