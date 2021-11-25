/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

class View3DError extends Error {
  public code: number;

  public constructor(message: string, code: number) {
    super(message);

    Object.setPrototypeOf(this, View3DError.prototype);

    this.name = "View3DError";
    this.code = code;
  }
}

export default View3DError;
