/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import View3D from "../View3D";
import ARSession from "../xr/ARSession";
import WebARSession from "../xr/WebARSession";

/**
 * ARManager that manages AR sessions
 */
class ARManager {
  private _view3d: View3D;
  private _sessions: ARSession[];
  private _currentSession: ARSession | null;

  /**
   * Array of {@link XRSession}s added
   */
  public get sessions() { return this._sessions; }
  /**
   * Current entry session. Note that only WebXR type session can be returned.
   */
  public get currentSession() { return this._currentSession; }

  /**
   * Create a new instance of the ARManager
   * @param view3d Instance of the View3D
   */
  public constructor(view3d: View3D) {
    this._view3d = view3d;
    this._sessions = [];
    this._currentSession = null;
  }

  /**
   * Return a Promise containing whether any of the added session is available
   */
  public async isAvailable(): Promise<boolean> {
    const results = await Promise.all(this._sessions.map(session => session.isAvailable()));

    return results.some(result => result === true);
  }

  /**
   * Add new {@link XRSession}.
   * The XRSession's order added is the same as the order of entry.
   * @param xrSession XRSession to add
   */
  public addSession(...xrSession: ARSession[]) {
    this._sessions.push(...xrSession);
  }

  /**
   * Enter XR Session.
   */
  public async enter(): Promise<void> {
    return this._enterSession(0, []);
  }

  /**
   * Exit current XR Session.
   */
  public exit() {
    if (this._currentSession) {
      this._currentSession.exit(this._view3d);
      this._currentSession = null;
    }
  }

  private async _enterSession(sessionIdx: number, errors: any[]) {
    const view3d = this._view3d;
    const sessions = this._sessions;

    if (sessionIdx >= sessions.length) {
      if (errors.length < 1) {
        errors.push(new Error("No sessions available"));
      }
      return Promise.reject(errors);
    }

    const xrSession = sessions[sessionIdx];
    const isSessionAvailable = await xrSession.isAvailable();
    if (!isSessionAvailable) {
      return this._enterSession(sessionIdx + 1, errors);
    }

    return await xrSession.enter(view3d).then(() => {
      if (xrSession.isWebXRSession) {
        // Non-webxr sessions are ignored
        this._currentSession = xrSession;
        (xrSession as WebARSession).session.addEventListener("end", () => {
          this._currentSession = null;
        });
      }
      return errors;
    }).catch(e => {
      errors.push(e);
      return this._enterSession(sessionIdx + 1, errors);
    });
  }
}

export default ARManager;
