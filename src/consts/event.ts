/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

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
};

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.button
export enum MOUSE_BUTTON {
  LEFT,
  MIDDLE,
  RIGHT,
}
