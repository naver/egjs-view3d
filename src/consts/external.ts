/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

export { CODES as ERROR_CODES } from "./error";

/**
 * Event type object with event name strings of {@link View3D}
 * @ko {@link View3D}의 이벤트 이름 문자열들을 담은 객체
 * @type {object}
 * @property {"resize"} RESIZE resize event<ko>resize 이벤트</ko>
 * @property {"beforeRender"} BEFORE_RENDER beforeRender event<ko>beforeRender 이벤트</ko>
 * @property {"afterRender"} AFTER_RENDER afterRender event<ko>afterRender 이벤트</ko>
 * @example
 * ```ts
 * import { EVENTS } from "@egjs/view3d";
 * EVENTS.RESIZE; // "resize"
 * ```
 */
export const EVENTS = {
  RESIZE: "resize",
  BEFORE_RENDER: "beforeRender",
  AFTER_RENDER: "afterRender"
} as const;
