/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import View3D from "../../src/View3D";

/**
 * Interface for XR sessions
 * @category XR
 * @interface
 * @property {boolean} isWebXRSession Returns whether this session is WebXR-based session or not.
 * @property {function} isAvailable Return a Promise of whether this session is available on current device.
 * @property {function} enter Enter this session.
 * @property {function} exit Exit this session.
 */
interface XRSession {
  isWebXRSession: boolean;
  isAvailable: () => Promise<boolean>;
  enter: (view3d: View3D) => Promise<any>;
  exit: (view3d: View3D) => any;
}

export default XRSession;
