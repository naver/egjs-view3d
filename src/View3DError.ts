/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

class View3DError extends Error {
  constructor(
    public message: string,
    public code: number) {
    super(message);
    Object.setPrototypeOf(this, View3DError.prototype);
    this.name = "View3DError";
  }
}

export default View3DError;
