import * as THREE from "three";

import View3D from "../View3D";
import AutoDirectionalLight from "../environment/AutoDirectionalLight";

class AfternoonPreset {
  public init(view3D: View3D) {
    const dirLight = new AutoDirectionalLight(0xffffff, 1, {
      direction: new THREE.Vector3(0, -1, 0)
    });
    const hemiLight = new THREE.HemisphereLight();
    const ambient = new THREE.AmbientLight(undefined, 0.1);

    dirLight.fit(view3D.model!);

    view3D.scene.addEnv(dirLight, hemiLight, ambient);
  }
}

export default AfternoonPreset;
