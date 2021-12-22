/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";

interface View3DPlugin {
  init(view3D: View3D): Promise<void>;
}

export default View3DPlugin;
