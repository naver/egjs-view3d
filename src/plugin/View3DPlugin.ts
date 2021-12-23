/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";

/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */

abstract class View3DPlugin {
  public async init(view3D: View3D): Promise<void> {}
  public async teardown(view3D: View3D): Promise<void> {}
}

/* eslint-enable */

export default View3DPlugin;
