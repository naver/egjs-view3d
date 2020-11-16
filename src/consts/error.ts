/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/**
 * Error codes of {@link View3DError}
 * @name ERROR_CODES
 * @memberof Constants
 * @type object
 * @property {number} WRONG_TYPE 0
 * @property {number} ELEMENT_NOT_FOUND 1
 * @property {number} CANVAS_NOT_FOUND 2
 * @property {number} WEBGL_NOT_SUPPORTED 3
 * @property {number} ADD_CONTROL_FIRST 4
 * @property {number} PROVIDE_WIDTH_OR_HEIGHT 5
 */
export const CODES: {
  [key in keyof typeof MESSAGES]: number;
} = {
  WRONG_TYPE: 0,
  ELEMENT_NOT_FOUND: 1,
  ELEMENT_NOT_CANVAS: 2,
  WEBGL_NOT_SUPPORTED: 3,
  ADD_CONTROL_FIRST: 4,
  PROVIDE_WIDTH_OR_HEIGHT: 5,
};

export const MESSAGES = {
  WRONG_TYPE: (val: any, types: string[]) => `${typeof val} is not a ${types.map(type => `"${type}"`).join(" or ")}.`,
  ELEMENT_NOT_FOUND: (query: string) => `Element with selector "${query}" not found.`,
  ELEMENT_NOT_CANVAS: (el: HTMLElement) => `Given element <${el.tagName}> is not a canvas.`,
  WEBGL_NOT_SUPPORTED: "WebGL is not supported on this browser.",
  ADD_CONTROL_FIRST: "Control is enabled before setting a target element.",
  PROVIDE_WIDTH_OR_HEIGHT: "Either width or height should be given.",
};
