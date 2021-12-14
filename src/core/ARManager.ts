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
import { ValueOf } from "../type/utils";

/**
 * ARManager that manages AR sessions
 */
class ARManager {
  private _view3D: View3D;
  private _sessions: Record<ValueOf<typeof AR_SESSION_TYPE>, ARSession>;
  private _currentSession: ARSession | null;

  /**
   * Current entry session. Note that only the "WebXR" session can be assigned to this property.
   * @type {ARSession | null}
   */
  public get currentSession() { return this._currentSession; }

  /**
   * Object with all AR sessions
   * @type {object}
   * @property {WebARSession} webAR WebARSession
   * @property {SceneViewerSession} sceneViewer SceneViewerSession
   * @property {QuickLookSession} quickLook QuickLookSession
   */
  public get sessions() { return this._sessions; }

  /**
   * Create a new instance of the ARManager
   * @param view3d Instance of the View3D
   */
  public constructor(view3d: View3D) {
    this._view3D = view3d;

    this._sessions = {
      [AR_SESSION_TYPE.WEBXR]: new WebARSession(getObjectOption(view3d.webAR)),
      [AR_SESSION_TYPE.SCENE_VIEWER]: new SceneViewerSession(getObjectOption(view3d.sceneViewer)),
      [AR_SESSION_TYPE.QUICK_LOOK]: new QuickLookSession(getObjectOption(view3d.quickLook))
    };

    this._currentSession = null;
  }

  /**
   * Return a Promise containing whether any of the added session is available
   */
  public async isAvailable(): Promise<boolean> {
    const sessions = this._getSessionsArray();
    const results = await Promise.all(sessions.map(session => session.isAvailable()));

    return results.some(result => result === true);
  }

  /**
   * Enter XR Session.
   * This should be called from a user interaction.
   */
  public async enter(): Promise<void> {
    const view3D = this._view3D;

    if (!view3D.initialized) {
      throw new View3DError(ERROR.MESSAGES.NOT_INITIALIZED, ERROR.CODES.NOT_INITIALIZED);
    }

    const sessions = this._getSessionsArray();

    for (const session of sessions) {
      try {
        if (await session.isAvailable()) {
          await session.enter(view3D);

          // Entered safely
          if (session.isWebXRSession) {
            // Non-webxr sessions are ignored
            this._currentSession = session;
            (session as WebARSession).once("end", () => {
              this._currentSession = null;
            });
          }
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
    const currentSession = this._currentSession;

    if (currentSession) {
      await currentSession.exit(this._view3D);
      this._currentSession = null;
    }
  }

  private _getSessionsArray(): ARSession[] {
    const view3D = this._view3D;
    const sessions = this._sessions;
    const options = {
      [AR_SESSION_TYPE.WEBXR]: view3D.webAR,
      [AR_SESSION_TYPE.SCENE_VIEWER]: view3D.sceneViewer,
      [AR_SESSION_TYPE.QUICK_LOOK]: view3D.quickLook
    };
    const priority = view3D.arPriority;

    return priority
      .filter(sessionType => !!options[sessionType])
      .map(sessionType => sessions[sessionType]);
  }
}

export default ARManager;
