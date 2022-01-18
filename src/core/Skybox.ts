import * as THREE from "three";
import { LightProbeGenerator } from "three/examples/jsm/lights/LightProbeGenerator";

import View3D from "../View3D";

class Skybox {
  private _view3D: View3D;

  public constructor(view3D: View3D) {
    this._view3D = view3D;
  }

  public useBlurredHDR(texture: THREE.Texture) {
    const threeRenderer = this._view3D.renderer.threeRenderer;
    const bgScene = new THREE.Scene();
    bgScene.background = texture;

    // To prevent exposure applied twice
    const origExposure = threeRenderer.toneMappingExposure;
    threeRenderer.toneMappingExposure = 1;

    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      encoding: THREE.sRGBEncoding,
      format: THREE.RGBAFormat
    });

    const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);

    cubeCamera.update(threeRenderer, bgScene);
    const lightProbe = LightProbeGenerator.fromCubeRenderTarget(threeRenderer, cubeRenderTarget);

    const skyboxMat = new THREE.MeshStandardMaterial({
      side: THREE.BackSide
    });

    const geometry = new THREE.IcosahedronBufferGeometry(1, 4);
    const skyboxScene = new THREE.Scene();
    const skyboxMesh = new THREE.Mesh(geometry, skyboxMat);

    const normals = geometry.getAttribute("normal");

    for (let i = 0; i < normals.count; i++) {
      normals.setXYZ(i, -normals.getX(i), -normals.getY(i), -normals.getZ(i));
    }

    skyboxScene.add(skyboxMesh);
    skyboxScene.add(lightProbe);

    cubeCamera.update(threeRenderer, skyboxScene);
    threeRenderer.toneMappingExposure = origExposure;

    return cubeRenderTarget.texture;
  }
}

export default Skybox;
