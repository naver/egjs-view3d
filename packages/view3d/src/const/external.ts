/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

export { ERROR_CODES } from "./error";

/**
 * "auto"
 * @type {"auto"}
 */
export const AUTO = "auto";

/**
 * Event type object with event name strings of {@link View3D}
 * @type {object}
 * @property {"ready"} READY {@link /docs/events/ready Ready event}
 * @property {"loadStart"} LOAD_START {@link /docs/events/loadStart Load start event}
 * @property {"load"} LOAD {@link /docs/events/load Load event}
 * @property {"loadError"} LOAD_ERROR {@link /docs/events/loadError Load error event}
 * @property {"resize"} RESIZE {@link /docs/events/resize Resize event}
 * @property {"beforeRender"} BEFORE_RENDER {@link /docs/events/beforeRender Before render event}
 * @property {"render"} RENDER {@link /docs/events/render Render event}
 * @property {"progress"} PROGRESS {@link /docs/events/progress Progress event}
 * @property {"inputStart"} INPUT_START {@link /docs/events/inputStart Input start event}
 * @property {"inputEnd"} INPUT_END {@link /docs/events/inputEnd Input end event}
 * @property {"cameraChange"} CAMERA_CHANGE {@link /docs/events/cameraChange Camera change event}
 * @property {"animationStart"} ANIMATION_START {@link /docs/events/animationStart Animation start event}
 * @property {"animationLoop"} ANIMATION_LOOP {@link /docs/events/animationLoop Animation loop event}
 * @property {"animationFinished"} ANIMATION_FINISHED {@link /docs/events/animationFinished Animation finished event}
 * @property {"annotationFocus"} ANNOTATION_FOCUS {@link /docs/events/annotationFocus Annotation focus event}
 * @property {"annotationUnfocus"} ANNOTATION_UNFOCUS {@link /docs/events/annotationUnfocus Annotation unfocus event}
 * @property {"quickLookTap"} QUICK_LOOK_TAP {@link /docs/events/quickLookTap Quick Look Tap event}
 * @property {"arStart"} AR_START {@link /docs/events/arStart AR start evemt}
 * @property {"arEnd"} AR_END {@link /docs/events/arEnd AR end event}
 * @property {"arModelPlaced"} AR_MODEL_PLACED {@link /docs/events/arModelPlaced AR model placed event}
 * @example
 * ```ts
 * import { EVENTS } from "@egjs/view3d";
 * EVENTS.RESIZE; // "resize"
 * ```
 */
export const EVENTS = {
  READY: "ready",
  LOAD_START: "loadStart",
  LOAD: "load",
  LOAD_ERROR: "loadError",
  LOAD_FINISH: "loadFinish",
  MODEL_CHANGE: "modelChange",
  RESIZE: "resize",
  BEFORE_RENDER: "beforeRender",
  RENDER: "render",
  PROGRESS: "progress",
  INPUT_START: "inputStart",
  INPUT_END: "inputEnd",
  CAMERA_CHANGE: "cameraChange",
  ANIMATION_START: "animationStart",
  ANIMATION_LOOP: "animationLoop",
  ANIMATION_FINISHED: "animationFinished",
  ANNOTATION_FOCUS: "annotationFocus",
  ANNOTATION_UNFOCUS: "annotationUnfocus",
  AR_START: "arStart",
  AR_END: "arEnd",
  AR_MODEL_PLACED: "arModelPlaced",
  QUICK_LOOK_TAP: "quickLookTap"
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
 * Default class names that View3D uses
 * @type {object}
 * @property {"view3d-wrapper"} WRAPPER A class name for wrapper element
 * @property {"view3d-canvas"} CANVAS A class name for canvas element
 * @property {"view3d-poster"} POSTER A class name for poster element
 * @property {"view3d-ar-overlay"} AR_OVERLAY A class name for AR overlay element
 * @property {"view3d-annotation-wrapper"} ANNOTATION_WRAPPER A class name for annotation wrapper element
 * @property {"view3d-annotation"} ANNOTATION A class name for annotation element
 * @property {"default"} ANNOTATION_DEFAULT A class name for default style annotation element
 * @property {"selected"} ANNOTATION_SELECTED A class name for selected annotation element
 * @property {"flip-x"} ANNOTATION_FLIP_X A class name for annotation element which has tooltip on the left side
 * @property {"flip-y"} ANNOTATION_FLIP_Y A class name for annotation element which has tooltip on the bottom side
 * @property {"ctx-lost"} CTX_LOST A class name for canvas element which will be added on context lost
 */
export const DEFAULT_CLASS = {
  WRAPPER: "view3d-wrapper",
  CANVAS: "view3d-canvas",
  POSTER: "view3d-poster",
  AR_OVERLAY: "view3d-ar-overlay",
  ANNOTATION_WRAPPER: "view3d-annotation-wrapper",
  ANNOTATION: "view3d-annotation",
  ANNOTATION_TOOLTIP: "view3d-annotation-tooltip",
  ANNOTATION_DEFAULT: "default",
  ANNOTATION_SELECTED: "selected",
  ANNOTATION_HIDDEN: "hidden",
  ANNOTATION_FLIP_X: "flip-x",
  ANNOTATION_FLIP_Y: "flip-y",
  CTX_LOST: "ctx-lost"
} as const;

/**
 * Possible values for the toneMapping option.
 * This is used to approximate the appearance of high dynamic range (HDR) on the low dynamic range medium of a standard computer monitor or mobile device's screen.
 * @type {object}
 * @property {THREE.LinearToneMapping} LINEAR
 * @property {THREE.ReinhardToneMapping} REINHARD
 * @property {THREE.CineonToneMapping} CINEON
 * @property {THREE.ACESFilmicToneMapping} ACES_FILMIC
 */
export const TONE_MAPPING = {
  LINEAR: THREE.LinearToneMapping,
  REINHARD: THREE.ReinhardToneMapping,
  CINEON: THREE.CineonToneMapping,
  ACES_FILMIC: THREE.ACESFilmicToneMapping
};

/**
 * Types of zoom control
 * @type {object}
 * @property {"fov"} FOV Zoom by chaning fov(field-of-view). This will prevent camera from going inside the model.
 * @property {"distance"} DISTANCE Zoom by changing camera distance from the model.
 */
export const ZOOM_TYPE = {
  FOV: "fov",
  DISTANCE: "distance"
};

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

/**
 * Input types
 * @type {object}
 * @property {0} ROTATE Rotate input
 * @property {1} TRANSLATE Translate input
 * @property {2} ZOOM Zoom input
 */
export const INPUT_TYPE = {
  ROTATE: 0,
  TRANSLATE: 1,
  ZOOM: 2
} as const;

/**
 * Animation repeat modes
 * @type {object}
 * @property {"one"} ONE Repeat single animation
 * @property {"none"} NONE Pause on animation's last frame
 * @property {"all"} ALL Repeat all animations
 */
export const ANIMATION_REPEAT_MODE = {
  ONE: "one",
  NONE: "none",
  ALL: "all"
} as const;
