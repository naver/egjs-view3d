/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/**
 * Error codes of {@link View3DError}
 * @type object
 * @property {0} WRONG_TYPE The given value's type is not expected
 * @property {1} ELEMENT_NOT_FOUND The element with given CSS selector does not exist
 * @property {2} CANVAS_NOT_FOUND The element given is not a \<canvas\> element
 * @property {3} WEBGL_NOT_SUPPORTED The browser does not support WebGL
 * @property {4} PROVIDE_SRC_FIRST `init()` is called before setting `src`
 * @property {5} FILE_NOT_SUPPORTED The given file is not supported
 * @property {6} NOT_INITIALIZED The action is called before the component is initialized
 * @property {7} MODEL_FAIL_TO_LOAD The 3D model failed to load
 */
export const ERROR_CODES: {
  [key in keyof typeof MESSAGES]: number;
} = {
  WRONG_TYPE: 0,
  ELEMENT_NOT_FOUND: 1,
  CANVAS_NOT_FOUND: 2,
  WEBGL_NOT_SUPPORTED: 3,
  PROVIDE_SRC_FIRST: 4,
  FILE_NOT_SUPPORTED: 5,
  NOT_INITIALIZED: 6,
  MODEL_FAIL_TO_LOAD: 7
};

export const MESSAGES = {
  WRONG_TYPE: (val: any, types: string[]) => `${typeof val} is not a ${types.map(type => `"${type}"`).join(" or ")}.`,
  ELEMENT_NOT_FOUND: (query: string) => `Element with selector "${query}" not found.`,
  CANVAS_NOT_FOUND: "The canvas element was not found inside the given root element.",
  WEBGL_NOT_SUPPORTED: "WebGL is not supported on this browser.",
  PROVIDE_SRC_FIRST: "\"src\" should be provided before initialization.",
  FILE_NOT_SUPPORTED: (src: string) => `Given file "${src}" is not supported.`,
  NOT_INITIALIZED: "View3D is not initialized yet.",
  MODEL_FAIL_TO_LOAD: (url: string) => `Failed to load/parse the 3D model with the given url: "${url}". Check "loadError" event for actual error instance.`
};

export default {
  CODES: ERROR_CODES,
  MESSAGES
};
