/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import { IS_ANDROID } from "../../src/consts/browser";
import * as XR from "../../src/consts/xr";

import XRSession from "./XRSession";

/**
 * AR session using Google's scene-viewer
 * @see https://developers.google.com/ar/develop/java/scene-viewer
 */
class SceneViewerSession implements XRSession {
  public readonly isWebXRSession = false;

  /**
   * Create new instance of SceneViewerSession
   * @see https://developers.google.com/ar/develop/java/scene-viewer
   * @param params Session params
   * @param {string} [params.file] This URL specifies the glTF or glb file that should be loaded into Scene Viewer. This should be URL-escaped.
   * @param {string} [params.browser_fallback_url] This is a Google Chrome feature supported only for web-based implementations. When the Google app com.google.android.googlequicksearchbox is not present on the device, this is the URL that Google Chrome navigates to.
   * @param {string} [params.mode="ar_only"] See {@link https://developers.google.com/ar/develop/java/scene-viewer} for available modes.
   * @param {string} [params.title] A name for the model. If present, it will be displayed in the UI. The name will be truncated with ellipses after 60 characters.
   * @param {string} [params.link] A URL for an external webpage. If present, a button will be surfaced in the UI that intents to this URL when clicked.
   * @param {string} [params.sound] A URL to a looping audio track that is synchronized with the first animation embedded in a glTF file. It should be provided alongside a glTF with an animation of matching length. If present, the sound is looped after the model is loaded. This should be URL-escaped.
   * @param {string} [params.resizable=true] When set to false, users will not be able to scale the model in the AR experience. Scaling works normally in the 3D experience.
   */
  public constructor(public params: {
    file: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    browser_fallback_url?: string;
    mode?: "3d_preferred" | "3d_only" | "ar_preferred" | "ar_only" | string;
    title?: string;
    link?: string;
    sound?: string;
    resizable?: "true" | "false" | boolean;
    [key: string]: any;
  }) {
    if (!this.params.mode) {
      // Default mode is "ar_only", which should use com.google.ar.core package
      this.params.mode = "ar_only";
    }
  }

  /**
   * Return the availability of SceneViewerSession.
   * Scene-viewer is available on all android devices with google ARCore installed.
   * @returns {Promise} A Promise that resolves availability of this session(boolean).
   */
  public isAvailable() {
    return Promise.resolve(IS_ANDROID);
  }

  /**
   * Enter Scene-viewer AR session
   */
  public enter() {
    const params = Object.assign({}, this.params);
    const fallback = params.browser_fallback_url;
    delete params.browser_fallback_url;

    const resizable = params.resizable;
    delete params.resizable;
    if (resizable === true) {
      params.resizable = "true";
    } else if (resizable === false) {
      params.resizable = "false";
    } else if (resizable) {
      params.resizable = resizable;
    }

    const queryString = Object.keys(params)
      .filter(key => params[key] != null)
      .map(key => `${key}=${params[key]}`).join("&");

    const intentURL = params.mode === "ar_only"
      ? XR.SCENE_VIEWER.INTENT_AR_CORE(queryString, fallback)
      : XR.SCENE_VIEWER.INTENT_SEARCHBOX(queryString, fallback || XR.SCENE_VIEWER.FALLBACK_DEFAULT(queryString));

    const anchor = document.createElement("a") ;
    anchor.href = intentURL;
    anchor.click();

    return Promise.resolve();
  }

  public exit() {
    // DO NOTHING
  }
}

export default SceneViewerSession;
