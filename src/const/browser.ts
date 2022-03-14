/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

// Browser related constants

export const IS_IOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent)
  || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

export const IS_ANDROID = () => /android/i.test(navigator.userAgent);

export const EVENTS = {
  MOUSE_DOWN: "mousedown",
  MOUSE_MOVE: "mousemove",
  MOUSE_UP: "mouseup",
  TOUCH_START: "touchstart",
  TOUCH_MOVE: "touchmove",
  TOUCH_END: "touchend",
  WHEEL: "wheel",
  RESIZE: "resize",
  CONTEXT_MENU: "contextmenu",
  MOUSE_ENTER: "mouseenter",
  MOUSE_LEAVE: "mouseleave",
  LOAD: "load",
  ERROR: "error"
} as const;

export const CURSOR = {
  GRAB: "grab",
  GRABBING: "grabbing",
  NONE: ""
} as const;

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.button
export enum MOUSE_BUTTON {
  LEFT,
  MIDDLE,
  RIGHT
}

export const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER  || 9007199254740991;
export const ANONYMOUS = "anonymous";
