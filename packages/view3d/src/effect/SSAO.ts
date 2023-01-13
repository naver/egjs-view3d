import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
import View3D from "../View3D";
import View3DEffect from "./View3DEffect";

class SSAO implements View3DEffect {

  private _ssaoPass: SSAOPass | null;


  constructor() {

  }
  public getPass() {
    return this._ssaoPass;
  }
  public async init(view3D: View3D) {
    const camera = view3D.camera.threeCamera;
    const scene = view3D.scene.root;
    this._ssaoPass = new SSAOPass(scene, camera);
  }

}

export default SSAO;
