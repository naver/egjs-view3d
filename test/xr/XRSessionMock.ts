import XRSession from "~/xr/XRSession";
import View3D from "~/View3D";

class XRSessionMock implements XRSession {
  public isWebXRSession = true;
  public session = {
    addEventListener: () => {},
    removeEventListener: () => {},
    requestReferenceSpace: () => Promise.resolve(),
    requestHitTestSource: () => Promise.resolve(),
  };

  private _isAvailable: boolean;
  private _canEnter: boolean;

  constructor({
    isAvailable = true,
    canEnter = true,
  } = {}) {
    this._isAvailable = isAvailable;
    this._canEnter = canEnter;
  }

  public isAvailable() { return Promise.resolve(this._isAvailable); }
  public enter(view3d: View3D) {
    return this._canEnter ? Promise.resolve() : Promise.reject();
  }
  public exit(view3d: View3D) {}
};

export default XRSessionMock;
