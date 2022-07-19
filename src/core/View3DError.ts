/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/**
 * Error thrown by View3D
 */
class View3DError extends Error {
  public code: number;

  /**
   * Create new instance of View3DError
   * @param {string} message Error message
   * @param {number} code Error code, see {@link ERROR_CODES}
   */
  public constructor(message: string, code: number) {
    super(message);

    Object.setPrototypeOf(this, View3DError.prototype);

    this.name = "View3DError";
    this.code = code;
  }
}

export default View3DError;
