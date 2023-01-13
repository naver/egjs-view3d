import { SAOPass, SAOPassParams } from "three/examples/jsm/postprocessing/SAOPass";
import View3DEffect from "./View3DEffect";
import View3D from "../View3D";

class SAO implements View3DEffect {
  private _saoPass: SAOPass | null;
  private _options: Partial<SAOPassParams>;
  constructor(options: Partial<SAOPassParams> = {}) {
    this._saoPass = null;
    this._options = { saoIntensity: 0.05, saoKernelRadius: 10, ...options };
  }
  public getPass() {
    return this._saoPass;
  }
  public async init(view3D: View3D) {
    const scene = view3D.scene.root;
    const camera = view3D.camera.threeCamera;
    const options = this._options;
    const saoPass = this._saoPass = new SAOPass(scene, camera);


    saoPass.params = { ...saoPass.params, ...options };
  }
}

export default SAO;
