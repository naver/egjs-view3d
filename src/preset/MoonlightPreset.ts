import * as THREE from "three";

import View3D from "../View3D";

class MoonlightPreset {
  public init(view3D: View3D) {
    const skyColor = 0x232533;
    const bgColor = 0x393B47;
    const floorColor = 0xd7cec7;
    const root = view3D.scene.root;

    const spotLight = new THREE.SpotLight(skyColor, 1, 0, Math.PI / 12, 0.1, 2);
    spotLight.castShadow = true;
    spotLight.power = 5;
    spotLight.position.set(0.5, 1.75, 0.5);
    spotLight.shadow.mapSize.setScalar(1024);

    const spotLight2 = spotLight.clone();
    spotLight2.castShadow = false;
    spotLight2.position.set(-0.5, 1.75, 0.5);

    const spotLight3 = spotLight2.clone();
    spotLight3.position.set(0, 1.75, -0.5 * Math.SQRT2);

    const spotLight4 = spotLight2.clone();
    spotLight4.position.set(0, 15, 0);

    const hemiLight = new THREE.HemisphereLight(skyColor, bgColor, 0.3);

    const floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1),
      new THREE.MeshStandardMaterial({ color: floorColor })
    );

    floor.translateY(-0.01);
    floor.scale.setScalar(1000);
    floor.rotateX(-Math.PI / 2);

    root.fog = new THREE.FogExp2(bgColor, 0.5);
    root.background = new THREE.Color(bgColor);
    view3D.scene.addEnv(spotLight, hemiLight, spotLight2, spotLight3, spotLight4, floor);
  }
}

export default MoonlightPreset;
