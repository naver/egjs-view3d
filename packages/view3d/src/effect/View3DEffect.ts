/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import { Pass } from "three/examples/jsm/postprocessing/Pass";

/**
 * Effect for View3D
 * @interface
 */
interface View3DEffect {
  getPass(): Pass | null;
  init(view3D: View3D): Promise<void>;

}

export default View3DEffect;
