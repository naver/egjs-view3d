import * as THREE from "three";
import { LightProbeGenerator } from "three/examples/jsm/lights/LightProbeGenerator";

import View3D from "../View3D";

/**
 * Skybox texture generator
 */
class Skybox {
  public static createDefaultEnv(renderer: THREE.WebGLRenderer) {
    const envScene = new THREE.Scene();

    const point = new THREE.PointLight(0xffffff, 0.8, 20);
    point.decay = 2;
    point.position.set(0, 7, 0);
    envScene.add(point);

    const boxGeo = new THREE.BoxBufferGeometry(1, 1, 1);
    const boxMat = new THREE.MeshStandardMaterial({
      side: THREE.BackSide
    });
    const box = new THREE.Mesh(boxGeo, boxMat);

    box.castShadow = false;
    box.scale.set(15, 45, 15);
    box.position.set(0, 20, 0);
    envScene.add(box);

    const topLight = Skybox._createRectAreaLightSource({
      intensity: 4.5,
      width: 4,
      height: 4
    });
    topLight.position.set(0, 2.5, 0);
    topLight.rotateX(Math.PI / 2);

    const frontLightIntensity = 3;
    const frontLight0 = Skybox._createRectAreaLightSource({
      intensity: frontLightIntensity,
      width: 2,
      height: 2
    });
    frontLight0.position.set(0, 1, 4);
    frontLight0.lookAt(0, 0, 0);

    const frontLight1 = Skybox._createRectAreaLightSource({
      intensity: frontLightIntensity,
      width: 2,
      height: 2
    });
    frontLight1.position.set(-4, 1, 1);
    frontLight1.lookAt(0, 0, 0);

    const frontLight2 = Skybox._createRectAreaLightSource({
      intensity: frontLightIntensity,
      width: 2,
      height: 2
    });
    frontLight2.position.set(4, 1, 1);
    frontLight2.lookAt(0, 0, 0);

    const backLight1 = Skybox._createRectAreaLightSource({
      intensity: 2.5,
      width: 2,
      height: 2
    });
    backLight1.position.set(1.5, 1, -4);
    backLight1.lookAt(0, 0, 0);

    const backLight2 = Skybox._createRectAreaLightSource({
      intensity: 2.5,
      width: 2,
      height: 2
    });
    backLight2.position.set(-1.5, 1, -4);
    backLight2.lookAt(0, 0, 0);

    envScene.add(
      topLight,
      frontLight0,
      frontLight1,
      frontLight2,
      backLight1,
      backLight2
    );

    const outputEncoding = renderer.outputEncoding;
    const toneMapping = renderer.toneMapping;

    renderer.outputEncoding = THREE.LinearEncoding;
    renderer.toneMapping = THREE.NoToneMapping;

    const renderTarget = new THREE.PMREMGenerator(renderer).fromScene(envScene, 0.035);

    renderer.outputEncoding = outputEncoding;
    renderer.toneMapping = toneMapping;

    return renderTarget.texture;
  }

  /**
   * Create blurred cubemap texture of the given texture and use that as the skybox
   * @param {THREE.Texture} texture Equirect texture
   * @returns {this}
   */
  public static createBlurredHDR(view3D: View3D, texture: THREE.Texture) {
    const threeRenderer = view3D.renderer.threeRenderer;
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

  private static _createRectAreaLightSource({
    intensity,
    width,
    height
  }: {
    intensity: number;
    width: number;
    height: number;
  }) {
    const planeBufferGeo = new THREE.PlaneBufferGeometry(width, height);
    const mat = new THREE.MeshBasicMaterial();
    mat.color.setScalar(intensity);

    return new THREE.Mesh(planeBufferGeo, mat);
  }
}

export default Skybox;
