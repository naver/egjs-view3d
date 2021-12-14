/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import View3D from "../View3D";
import Model from "../core/Model";
import View3DError from "../core/View3DError";
import { IS_ANDROID } from "../const/browser";
import { MODEL_FORMAT, SCENE_VIEWER_MODE } from "../const/external";
import * as ERROR from "../const/error";
import * as XR from "../const/xr";
import { toBooleanString } from "../utils";
import { LiteralUnion, OptionGetters, ValueOf } from "../type/utils";

import ARSession from "./ARSession";

export interface SceneViewerSessionOptions {
  file: string | null;
  fallbackURL: string | null;
  mode: LiteralUnion<ValueOf<typeof SCENE_VIEWER_MODE>, string>;
  title: string | null;
  link: string | null;
  sound: string | null;
  resizable: boolean;
  vertical: boolean;
  [key: string]: any;
}

/**
 * AR session using Google's scene-viewer
 * @see https://developers.google.com/ar/develop/java/scene-viewer
 */
class SceneViewerSession implements ARSession, OptionGetters<SceneViewerSessionOptions> {
  public readonly isWebXRSession = false;

  // Options
  // As those values are referenced only while entering the session, so I'm leaving this values public
  public file: SceneViewerSessionOptions["file"];
  public fallbackURL: SceneViewerSessionOptions["fallbackURL"];
  public mode: SceneViewerSessionOptions["mode"];
  public title: SceneViewerSessionOptions["title"];
  public link: SceneViewerSessionOptions["link"];
  public sound: SceneViewerSessionOptions["sound"];
  public resizable: SceneViewerSessionOptions["resizable"];
  public vertical: SceneViewerSessionOptions["vertical"];
  public otherParams: Record<string, any>;

  /**
   * Create new instance of SceneViewerSession
   * @see https://developers.google.com/ar/develop/java/scene-viewer
   * @param {object} [params={}] Session params
   * @param {string} [params.file=null] This URL specifies the glTF or glb file that should be loaded into Scene Viewer. This should be URL-escaped. If `null` is given, it will try to use current model shown on the canvas. This behavior only works when the format of the model shown is either "glTF" or "glb".
   * @param {string} [params.fallbackURL=null] This is a Google Chrome feature supported only for web-based implementations. When the Google app com.google.android.googlequicksearchbox is not present on the device, this is the URL that Google Chrome navigates to.
   * @param {string} [params.mode="ar_only"] See [SCENE_VIEWER_MODE](/docs/api/SCENE_VIEWER_MODE) for available modes (also check their [official page](https://developers.google.com/ar/develop/java/scene-viewer) for details).
   * @param {string} [params.title=null] A name for the model. If present, it will be displayed in the UI. The name will be truncated with ellipses after 60 characters.
   * @param {string} [params.link=null] A URL for an external webpage. If present, a button will be surfaced in the UI that intents to this URL when clicked.
   * @param {string} [params.sound=null] A URL to a looping audio track that is synchronized with the first animation embedded in a glTF file. It should be provided alongside a glTF with an animation of matching length. If present, the sound is looped after the model is loaded. This should be URL-escaped.
   * @param {boolean} [params.resizable=true] When set to false, users will not be able to scale the model in the AR experience. Scaling works normally in the 3D experience.
   * @param {boolean} [params.vertical=false] When set to true, users will be able to place the model on a vertical surface.
   */
  public constructor({
    mode = SCENE_VIEWER_MODE.ONLY_AR,
    file = null,
    fallbackURL = null,
    title = null,
    link = null,
    sound = null,
    resizable = true,
    vertical = false,
    ...otherParams
  }: Partial<SceneViewerSessionOptions> = {}) {
    this.file = file;
    this.fallbackURL = fallbackURL;
    this.mode = mode;
    this.title = title;
    this.link = link;
    this.sound = sound;
    this.resizable = resizable;
    this.vertical = vertical;
    this.otherParams = otherParams;
  }

  /**
   * Return the availability of SceneViewerSession.
   * Scene-viewer is available on all android devices with google ARCore installed.
   * @returns {Promise} A Promise that resolves availability of this session(boolean).
   */
  public isAvailable() {
    return Promise.resolve(IS_ANDROID());
  }

  /**
   * Enter Scene-viewer AR session
   */
  public async enter(view3D: View3D) {
    const model = view3D.model!;
    const params: Record<string, string | null> = {
      title: this.title,
      link: this.link,
      sound: this.sound,
      mode: this.mode as string,
      ...this.otherParams
    };

    params.resizable = toBooleanString(this.resizable);
    params.enable_vertical_placement = toBooleanString(this.vertical);

    const file = this.file ?? this._getModelSrc(model);

    if (!file) {
      return Promise.reject(new View3DError(ERROR.MESSAGES.FILE_NOT_SUPPORTED(this.file ?? model.src), ERROR.CODES.FILE_NOT_SUPPORTED));
    }

    params.file = new URL(file, window.location.href).href;

    const fallbackURL = this.fallbackURL;
    const queryString = Object.keys(params)
      .filter(key => params[key] != null)
      .map(key => `${key}=${params[key]}`).join("&");

    const intentURL = params.mode === SCENE_VIEWER_MODE.ONLY_AR
      ? XR.SCENE_VIEWER.INTENT_AR_CORE(queryString, fallbackURL)
      : XR.SCENE_VIEWER.INTENT_SEARCHBOX(queryString, fallbackURL || XR.SCENE_VIEWER.FALLBACK_DEFAULT(queryString));

    const anchor = document.createElement("a") ;
    anchor.href = intentURL;
    anchor.click();
  }

  public exit() {
    // DO NOTHING
  }

  private _getModelSrc(model: Model) {
    // SceneViewer only supports glTF / glb
    return (model.format === MODEL_FORMAT.GLTF || model.format === MODEL_FORMAT.GLB)
      ? model.src
      : null;
  }
}

export default SceneViewerSession;
