/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import View3D from "../View3D";
import View3DError from "../core/View3DError";
import WebARSession from "../xr/WebARSession";
import SceneViewerSession from "../xr/SceneViewerSession";
import QuickLookSession from "../xr/QuickLookSession";
import { getObjectOption } from "../utils";
import { AR_SESSION_TYPE, EVENTS } from "../const/external";
import ERROR from "../const/error";

const sessionCtors = {
  [AR_SESSION_TYPE.WEBXR]: WebARSession,
  [AR_SESSION_TYPE.SCENE_VIEWER]: SceneViewerSession,
  [AR_SESSION_TYPE.QUICK_LOOK]: QuickLookSession
};

/**
 * ARManager that manages AR sessions
 */
class ARManager {
  private _view3D: View3D;
  private _activeSession: WebARSession | null;

  public get activeSession() { return this._activeSession; }

  /**
   * Create a new instance of the ARManager
   * @param {View3D} view3D An instance of the View3D
   */
  public constructor(view3D: View3D) {
    this._view3D = view3D;
    this._activeSession = null;

    view3D.on(EVENTS.AR_START, ({ session }) => {
      this._activeSession = session;
    });

    view3D.on(EVENTS.AR_END, () => {
      this._activeSession = null;
    });
  }

  /**
   * Return a Promise containing whether any of the added session is available
   * If any of the AR session in current environment, this will return `true`
   * @returns {Promise<boolean>} Availability of the AR session
   */
  public async isAvailable(): Promise<boolean> {
    const sessions = this._getSesssionClasses();

    const results = await Promise.all(sessions.map(session => session.isAvailable()));

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

    const sessions = this._getSesssionClasses();

    for (const session of sessions) {
      try {
        if (await session.isAvailable()) {
          const sessionInstance = new session(view3D, getObjectOption(view3D[session.type]) as any);

          await sessionInstance.enter();

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
    const activeSession = this._activeSession;

    activeSession?.exit();
  }

  private _getSesssionClasses() {
    return this._getUsingSessionTypes()
      .map(sessionType => sessionCtors[sessionType]);
  }

  private _getUsingSessionTypes() {
    const view3D = this._view3D;
    const priority = view3D.arPriority;

    return priority.filter(sessionType => !!view3D[sessionType]);
  }
}

export default ARManager;
