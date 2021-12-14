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
 * @property {number} PROVIDE_WIDTH_OR_HEIGHT 4
 * @property {number} FORMAT_NOT_SUPPORTED 5
 * @property {number} FILE_NOT_SUPPORTED 6
 */
export const CODES: {
  [key in keyof typeof MESSAGES]: number;
} = {
  WRONG_TYPE: 0,
  ELEMENT_NOT_FOUND: 1,
  ELEMENT_NOT_CANVAS: 2,
  WEBGL_NOT_SUPPORTED: 3,
  PROVIDE_WIDTH_OR_HEIGHT: 4,
  FORMAT_NOT_SUPPORTED: 5,
  FILE_NOT_SUPPORTED: 6
};

export const MESSAGES = {
  WRONG_TYPE: (val: any, types: string[]) => `${typeof val} is not a ${types.map(type => `"${type}"`).join(" or ")}.`,
  ELEMENT_NOT_FOUND: (query: string) => `Element with selector "${query}" not found.`,
  ELEMENT_NOT_CANVAS: (el: HTMLElement) => `Given element <${el.tagName}> is not a canvas.`,
  WEBGL_NOT_SUPPORTED: "WebGL is not supported on this browser.",
  PROVIDE_WIDTH_OR_HEIGHT: "Either width or height should be given.",
  FORMAT_NOT_SUPPORTED: (format: string) => `Given format "${format}" is not supported or invalid`,
  FILE_NOT_SUPPORTED: (src: string) => `Given file "${src}" is not supported.`
};
