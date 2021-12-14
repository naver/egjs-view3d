/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

export { CODES as ERROR_CODES } from "./error";

export const AUTO = "auto";

/**
 * Event type object with event name strings of {@link View3D}
 * @type {object}
 * @property {"ready"} READY ready event
 * @property {"load"} LOAD load event
 * @property {"resize"} RESIZE resize event
 * @property {"beforeRender"} BEFORE_RENDER beforeRender event
 * @property {"render"} RENDER render event
 * @property {"progress"} PROGRESS progress event
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
  PROGRESS: "progress"
} as const;

/**
 * Supported model formats
 * @property {"gltf"} GLTF
 * @property {"glb"} GLB
 * @property {"drc"} DRC
 * @property {"usdz"} USDZ
 */
export const MODEL_FORMAT = {
  GLTF: "gltf",
  GLB: "glb",
  DRC: "drc",
  USDZ: "usdz"
} as const;

/**
 * @type {object}
 * @see https://www.iana.org/assignments/media-types/media-types.xhtml#model
 * @property {"gltf"} model/gltf+json
 * @property {"glb"} model/gltf-binary
 */
export const MODEL_MIME = {
  "model/gltf-binary": MODEL_FORMAT.GLB,
  "model/gltf+json": MODEL_FORMAT.GLTF
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
 * ![https://docs-assets.developer.apple.com/published/b122cc68df/10cb0534-e1f6-42ed-aadb-5390c55ad3ff.png](button types)
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
