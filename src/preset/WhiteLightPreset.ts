import * as THREE from "three";

import View3D from "../View3D";

class WhiteLightPreset {
  public init(view3D: View3D) {
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    // const hemiLight = new THREE.HemisphereLight();
    const ambient = new THREE.AmbientLight(undefined, 0.1);

    view3D.scene.add([dirLight, ambient], false);
  }
}

export default WhiteLightPreset;
