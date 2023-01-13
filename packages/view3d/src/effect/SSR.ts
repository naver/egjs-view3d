import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass";
import View3D from "../View3D";
import View3DEffect from "./View3DEffect";


export interface SSROptions {

}

class SSR implements View3DEffect {

  private _ssrPass: SSRPass | null;

  constructor() {

    this._ssrPass = null;

  }
  public async init(view3D: View3D): Promise<void> {
    const renderer = view3D.renderer.threeRenderer;
    const scene = view3D.scene.root;
    const camera = view3D.camera.threeCamera;

    console.log(this._ssrPass);

    this._ssrPass = new SSRPass({ groundReflector: null, selects: null, renderer, scene, camera });
  }
  public getPass() {
    console.log(this._ssrPass);
    return this._ssrPass;
  }


}

export default SSR;
