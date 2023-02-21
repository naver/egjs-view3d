/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import view3DEffect from "./View3DEffect";
import View3D from "../View3D";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";

class Gamma extends view3DEffect {

  private _gammaPass: ShaderPass | null;

  constructor() {
    super();
  }

  public init(view3D: View3D) {
    return this._gammaPass = new ShaderPass( GammaCorrectionShader );
  }

  public getPass() {
    return this._gammaPass;
  }
}

export default Gamma;
