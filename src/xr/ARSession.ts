/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import View3D from "../View3D";

/**
 * Interface for AR sessions
 * @interface
 * @property {boolean} isWebXRSession Returns whether this session is WebXR-based session or not.
 * @property {function} isAvailable Return a Promise of whether this session is available on current device.
 * @property {function} enter Enter this session.
 * @property {function} exit Exit this session.
 */
interface ARSession {
  isWebXRSession: boolean;
  isAvailable: () => Promise<boolean>;
  enter: (view3d: View3D) => Promise<any>;
  exit: (view3d: View3D) => any;
}

export default ARSession;
