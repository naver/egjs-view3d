/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";

/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */

/**
 * Plugin for View3D
 * @interface
 */
interface View3DPlugin {
  init(view3D: View3D): Promise<void>;
  teardown(view3D: View3D): void;
}

/* eslint-enable */

export default View3DPlugin;
