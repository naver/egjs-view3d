import * as THREE from "three";

export default () => {
  const envRoot = new THREE.Group();

  const dirLight = new THREE.DirectionalLight();
  const ambient = new THREE.AmbientLight(undefined, 0.1);

  dirLight.position.set(1, 1, 1);

  envRoot.add(dirLight);
  envRoot.add(ambient);

  return envRoot;
};
