/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/**
 * Error codes of {@link View3DError}
 * @type object
 * @property {number} WRONG_TYPE 0
 * @property {number} ELEMENT_NOT_FOUND 1
 * @property {number} CANVAS_NOT_FOUND 2
 * @property {number} WEBGL_NOT_SUPPORTED 3
 * @property {number} PROVIDE_SRC_FIRST 4
 * @property {number} PROVIDE_WIDTH_OR_HEIGHT 5
 * @property {number} FORMAT_NOT_SUPPORTED 6
 * @property {number} FILE_NOT_SUPPORTED 7
 * @property {number} NOT_INITIALIZED 8
 */
export const ERROR_CODES: {
  [key in keyof typeof MESSAGES]: number;
} = {
  WRONG_TYPE: 0,
  ELEMENT_NOT_FOUND: 1,
  CANVAS_NOT_FOUND: 2,
  WEBGL_NOT_SUPPORTED: 3,
  PROVIDE_SRC_FIRST: 4,
  PROVIDE_WIDTH_OR_HEIGHT: 5,
  FORMAT_NOT_SUPPORTED: 6,
  FILE_NOT_SUPPORTED: 7,
  NOT_INITIALIZED: 8,
  MODEL_FAIL_TO_LOAD: 9
};

export const MESSAGES = {
  WRONG_TYPE: (val: any, types: string[]) => `${typeof val} is not a ${types.map(type => `"${type}"`).join(" or ")}.`,
  ELEMENT_NOT_FOUND: (query: string) => `Element with selector "${query}" not found.`,
  CANVAS_NOT_FOUND: "The canvas element was not found inside the given root element.",
  WEBGL_NOT_SUPPORTED: "WebGL is not supported on this browser.",
  PROVIDE_SRC_FIRST: "\"src\" should be provided before initialization.",
  PROVIDE_WIDTH_OR_HEIGHT: "Either width or height should be given.",
  FORMAT_NOT_SUPPORTED: (format: string) => `Given format "${format}" is not supported or invalid.`,
  FILE_NOT_SUPPORTED: (src: string) => `Given file "${src}" is not supported.`,
  NOT_INITIALIZED: "View3D is not initialized yet.",
  MODEL_FAIL_TO_LOAD: (url: string) => `Failed to load/parse the 3D model with the given url: "${url}". Check "loadError" event for actual error instance.`
};

export default {
  CODES: ERROR_CODES,
  MESSAGES
};
