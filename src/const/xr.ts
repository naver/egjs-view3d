/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/* eslint-disable @typescript-eslint/naming-convention */
declare global {
  interface Window {
    XRSession: any;
    XRDOMOverlayState: any;
  }
}
/* eslint-enable */

export const QUICK_LOOK_SUPPORTED = () => {
  const anchorEl = document.createElement("a");
  return anchorEl.relList && anchorEl.relList.supports && anchorEl.relList.supports("ar");
};
export const WEBXR_SUPPORTED = navigator.xr && navigator.xr.isSessionSupported;
export const HIT_TEST_SUPPORTED = window.XRSession && window.XRSession.prototype.requestHitTestSource;
export const DOM_OVERLAY_SUPPORTED = window.XRDOMOverlayState != null;

export const SESSION = {
  AR: "immersive-ar",
  VR: "immersive-vr"
} as const;

export const REFERENCE_SPACE = {
  LOCAL: "local",
  LOCAL_FLOOR: "local-floor",
  VIEWER: "viewer"
} as const;

export const EVENTS = {
  SELECT_START: "selectstart",
  SELECT: "select",
  SELECT_END: "selectend"
} as const;

export const INPUT_PROFILE = {
  TOUCH: "generic-touchscreen"
} as const;

export const FEATURES = {
  HIT_TEST: { requiredFeatures: ["hit-test"] },
  DOM_OVERLAY: (root: HTMLElement) => ({
    optionalFeatures: ["dom-overlay"],
    domOverlay: { root }
  })
} as const;

// For type definition
export const EMPTY_FEATURES: {
  requiredFeatures?: any[];
  optionalFeatures?: any[];
  [key: string]: any;
} = {};

export const AR_SESSION_TYPE = {
  WEBXR: "WebXR",
  SCENE_VIEWER: "SceneViewer",
  QUICK_LOOK: "QuickLook"
} as const;

export const SCENE_VIEWER = {
  INTENT_AR_CORE: (params: string, fallback: string | null) => `intent://arvr.google.com/scene-viewer/1.1?${params}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;${fallback ? `S.browser_fallback_url=${fallback};` : ""}end;`,
  INTENT_SEARCHBOX: (params: string, fallback: string) => `intent://arvr.google.com/scene-viewer/1.1?${params}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;${fallback ? `S.browser_fallback_url=${fallback};` : ""}end;`,
  FALLBACK_DEFAULT: (params: string) => `https://arvr.google.com/scene-viewer?${params}`
} as const;
