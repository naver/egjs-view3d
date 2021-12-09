/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

export { CODES as ERROR_CODES } from "./error";

export const AUTO = "auto";

/**
 * Event type object with event name strings of {@link View3D}
 * @ko {@link View3D}의 이벤트 이름 문자열들을 담은 객체
 * @type {object}
 * @property {"ready"} READY ready event<ko>ready 이벤트</ko>
 * @property {"load"} LOAD load event<ko>load 이벤트</ko>
 * @property {"resize"} RESIZE resize event<ko>resize 이벤트</ko>
 * @property {"beforeRender"} BEFORE_RENDER beforeRender event<ko>beforeRender 이벤트</ko>
 * @property {"render"} RENDER render event<ko>render 이벤트</ko>
 * @example
 * ```ts
 * import { EVENTS } from "@egjs/view3d";
 * EVENTS.RESIZE; // "resize"
 * ```
 */
export const EVENTS = {
  READY: "ready",
  LOAD: "load",
  DISPLAY: "display",
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
 */
export const MODEL_FORMAT = {
  GLTF: "gltf",
  GLB: "glb",
  DRC: "drc"
} as const;

/**
 * @see https://www.iana.org/assignments/media-types/media-types.xhtml#model
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
};
