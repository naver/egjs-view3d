/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import View3D from "../View3D";
import View3DError from "../core/View3DError";
import ARSession from "../xr/ARSession";
import WebARSession from "../xr/WebARSession";
import SceneViewerSession from "../xr/SceneViewerSession";
import QuickLookSession from "../xr/QuickLookSession";
import { getObjectOption } from "../utils";
import { AR_SESSION_TYPE } from "../const/external";
import * as ERROR from "../const/error";

/**
 * ARManager that manages AR sessions
 */
class ARManager {
  private _view3D: View3D;
  private _sessions: ARSession[];

  /**
   * An array of AR sessions that currently in use
   * @type {ARSession[]}
   */
  public get sessions() { return this._sessions; }

  /**
   * Create a new instance of the ARManager
   * @param {View3D} view3d An instance of the View3D
   */
  public constructor(view3d: View3D) {
    this._view3D = view3d;

    this._sessions = this._getSessionsArray();
  }

  /**
   * Return a Promise containing whether any of the added session is available
   * If any of the AR session in current environment, this will return `true`
   * @returns {Promise<boolean>} Availability of the AR session
   */
  public async isAvailable(): Promise<boolean> {
    const results = await Promise.all(this._sessions.map(session => session.isAvailable()));

    return results.some(result => result === true);
  }

  /**
   * Enter XR Session.
   * This should be called from a user interaction.
   */
  public async enter(): Promise<void> {
    const view3D = this._view3D;

    if (!view3D.model || !view3D.initialized) {
      throw new View3DError(ERROR.MESSAGES.NOT_INITIALIZED, ERROR.CODES.NOT_INITIALIZED);
    }

    const sessions = this._sessions;

    for (const session of sessions) {
      try {
        if (await session.isAvailable()) {
          await session.enter();

          return Promise.resolve();
        }
      } catch (err) {} // eslint-disable-line no-empty
    }

    // No sessions were available
    return Promise.reject();
  }

  /**
   * Exit current XR Session.
   */
  public async exit() {
    const sessions = this._sessions;

    await Promise.all(sessions.map(session => session.exit()));
  }

  private _getSessionsArray(): ARSession[] {
    const view3D = this._view3D;
    const options = {
      [AR_SESSION_TYPE.WEBXR]: view3D.webAR,
      [AR_SESSION_TYPE.SCENE_VIEWER]: view3D.sceneViewer,
      [AR_SESSION_TYPE.QUICK_LOOK]: view3D.quickLook
    };
    const constructors = {
      [AR_SESSION_TYPE.WEBXR]: WebARSession,
      [AR_SESSION_TYPE.SCENE_VIEWER]: SceneViewerSession,
      [AR_SESSION_TYPE.QUICK_LOOK]: QuickLookSession
    };
    const priority = view3D.arPriority;

    return priority
      .filter(sessionType => !!options[sessionType])
      .map(sessionType => new constructors[sessionType](view3D, getObjectOption(options[sessionType])));
  }
}

export default ARManager;
