/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

export { ERROR_CODES } from "./error";

export const AUTO = "auto";

/**
 * Event type object with event name strings of {@link View3D}
 * @type {object}
 * @property {"ready"} READY {@link ReadyEvent}
 * @property {"load"} LOAD {@link LoadEvent}
 * @property {"resize"} RESIZE {@link ResizeEvent}
 * @property {"beforeRender"} BEFORE_RENDER {@link BeforeRenderEvent}
 * @property {"render"} RENDER {@link RenderEvent}
 * @property {"progress"} PROGRESS {@link LoadProgressEvent}
 * @property {"quickLookTap"} QUICK_LOOK_TAP {@link QuickLookTapEvent}
 * @property {"arStart"} AR_START {@link ARStartEvent}
 * @property {"arEnd"} AR_END {@link AREndEvent}
 * @property {"arModelPlaced"} AR_MODEL_PLACED {@link ARModelPlacedEvent}
 * @example
 * ```ts
 * import { EVENTS } from "@egjs/view3d";
 * EVENTS.RESIZE; // "resize"
 * ```
 */
export const EVENTS = {
  READY: "ready",
  LOAD: "load",
  MODEL_CHANGE: "modelChange",
  RESIZE: "resize",
  BEFORE_RENDER: "beforeRender",
  RENDER: "render",
  PROGRESS: "progress",
  QUICK_LOOK_TAP: "quickLookTap",
  AR_START: "arStart",
  AR_END: "arEnd",
  AR_MODEL_PLACED: "arModelPlaced"
} as const;

/**
 * Collection of predefined easing functions
 * @type {object}
 * @property {function} SINE_WAVE
 * @property {function} EASE_OUT_CUBIC
 * @property {function} EASE_OUT_BOUNCE
 * @example
 * ```ts
 * import View3D, { EASING } from "@egjs/view3d";
 *
 * new RotateControl({
 *  easing: EASING.EASE_OUT_CUBIC,
 * });
 * ```
 */
export const EASING = {
  SINE_WAVE: (x: number) => Math.sin(x * Math.PI * 2),
  EASE_OUT_CUBIC: (x: number) => 1 - Math.pow(1 - x, 3),
  EASE_OUT_BOUNCE: (x: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
      return n1 * x * x;
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  }
} as const;

/**
 * Available AR session types
 * @type {object}
 * @property {"WebXR"} WEBXR An AR session based on {@link https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API WebXR Device API}
 * @property {"SceneViewer"} SCENE_VIEWER An AR session based on {@link https://developers.google.com/ar/develop/java/scene-viewer Google SceneViewer}, which is only available in Android
 * @property {"QuickLook"} QUICK_LOOK An AR session based on Apple {@link https://developer.apple.com/augmented-reality/quick-look/ AR Quick Look}, which is only available in iOS
 */
export const AR_SESSION_TYPE = {
  WEBXR: "webAR",
  SCENE_VIEWER: "sceneViewer",
  QUICK_LOOK: "quickLook"
} as const;

/**
 * @type {object}
 * @property {"ar_only"} ONLY_AR
 * @property {"3d_only"} ONLY_3D
 * @property {"ar_preferred"} PREFER_AR
 * @property {"3d_preferred"} PREFER_3D
 */
export const SCENE_VIEWER_MODE = {
  ONLY_AR: "ar_only",
  ONLY_3D: "3d_only",
  PREFER_AR: "ar_preferred",
  PREFER_3D: "3d_preferred"
} as const;

/**
 * <img src="https://docs-assets.developer.apple.com/published/b122cc68df/10cb0534-e1f6-42ed-aadb-5390c55ad3ff.png" />
 * @see https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look
 * @property {"plain"} PLAIN
 * @property {"pay"} PAY
 * @property {"buy"} BUY
 * @property {"check-out"} CHECK_OUT
 * @property {"book"} BOOK
 * @property {"donate"} DONATE
 * @property {"subscribe"} SUBSCRIBE
 */
export const QUICK_LOOK_APPLE_PAY_BUTTON_TYPE = {
  PLAIN: "plain",
  PAY: "pay",
  BUY: "buy",
  CHECK_OUT: "check-out",
  BOOK: "book",
  DONATE: "donate",
  SUBSCRIBE: "subscribe"
} as const;

/**
 * Available size of the custom banner
 * @type {object}
 * @property {"small"} SMALL 81pt
 * @property {"medium"} MEDIUM 121pt
 * @property {"large"} LARGE 161pt
 */
export const QUICK_LOOK_CUSTOM_BANNER_SIZE = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large"
} as const;
