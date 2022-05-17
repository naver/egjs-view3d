import * as THREE from "three";
import { LightProbeGenerator } from "three/examples/jsm/lights/LightProbeGenerator";

import View3D from "../View3D";

/**
 * Skybox that can renders background in a different scene.
 */
class Skybox {
  public static getDefaultEnv(renderer: THREE.WebGLRenderer) {
    const tempScene = new THREE.Scene();

    const pointLight = new THREE.PointLight(0x999999, 1.2);
    const ambient = new THREE.AmbientLight(0x999999, 0.4);
    tempScene.add(pointLight, ambient);

    const topLight1 = new THREE.RectAreaLight(0xffffff, 10, 1, 1);
    topLight1.position.set(-1, 4.3, 1);
    topLight1.lookAt(-1, 5, 1);
    tempScene.add(topLight1);

    const frontLight = new THREE.RectAreaLight(0xffffff, 10, 1, 1);
    frontLight.position.set(-1, 0.5, 4.5);
    frontLight.lookAt(-1, 0.5, 5);
    tempScene.add(frontLight);

    const backLight = new THREE.RectAreaLight(0xffffff, 10, 1, 1);
    backLight.position.set(2.5, -2, -4.5);
    backLight.lookAt(2.5, -2, -5);
    tempScene.add(backLight);

    const boxGeo = new THREE.BoxBufferGeometry();
    const boxMat = new THREE.MeshStandardMaterial({
      side: THREE.BackSide
    });
    const box = new THREE.Mesh(boxGeo, boxMat);

    box.scale.setScalar(10);
    tempScene.add(box);

    const obstacleMat = new THREE.MeshStandardMaterial();
    const obstacle = new THREE.Mesh(boxGeo, obstacleMat);
    obstacle.position.set(4.5, 0, -4.5);
    obstacle.scale.set(2, 10, 2);
    tempScene.add(obstacle);

    const obstacle2 = new THREE.Mesh(boxGeo, obstacleMat);
    obstacle2.position.set(-4, 0, -4);
    obstacle2.scale.set(4, 10, 4);
    tempScene.add(obstacle2);

    const obstacle3 = new THREE.Mesh(boxGeo, obstacleMat);
    obstacle3.position.set(4, 0, 4);
    obstacle3.scale.set(4, 10, 4);
    tempScene.add(obstacle3);

    const generator = new THREE.PMREMGenerator(renderer);

    return generator.fromScene(tempScene);
  }

  private _view3D: View3D;
  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _enabled: boolean;

  public get scene() { return this._scene; }
  public get camera() { return this._camera; }
  public get enabled() { return this._enabled; }

  /** */
  public constructor(view3D: View3D) {
    this._view3D = view3D;
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera();
    this._enabled = false;
  }

  public init() {
    const view3D = this._view3D;

    if (view3D.useDefaultEnv) {
      const env = Skybox.getDefaultEnv(view3D.renderer.threeRenderer);

      this._scene.background = env.texture;
      view3D.scene.root.environment = env.texture;

      this.enable();
    }
  }

  /**
   * Enable skybox rendering
   */
  public enable() {
    this._enabled = true;
    this._view3D.renderer.renderSingleFrame();
  }

  /**
   * Disable skybox rendering
   */
  public disable() {
    this._enabled = false;
    this._view3D.renderer.renderSingleFrame();
  }

  /**
   * Dispose the current skybox
   */
  public dispose() {
    this._disposeOldSkybox();
  }

  /**
   * Update current skybox camera to match main camera & apply rotation
   */
  public updateCamera() {
    const view3D = this._view3D;
    const bgCam = this._camera;
    const camera = view3D.camera;
    const pivot = camera.currentPose.pivot;

    bgCam.copy(camera.threeCamera);
    bgCam.lookAt(pivot);
    bgCam.updateProjectionMatrix();
  }

  /**
   * Create blurred cubemap texture of the given texture and use that as the skybox
   * @param {THREE.Texture} texture Equirect texture
   * @returns {this}
   */
  public useBlurredHDR(texture: THREE.Texture) {
    this._disposeOldSkybox();

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

    this._scene.background = cubeRenderTarget.texture;
    this._view3D.renderer.renderSingleFrame();

    return this;
  }

  /**
   * Use the given texture as a skybox scene background
   * @param {THREE.Texture} texture A texture that compatible for scene background
   * @returns {this}
   */
  public useTexture(texture: THREE.Texture) {
    this._scene.background = texture;
    this._view3D.renderer.renderSingleFrame();

    return this;
  }

  /**
   * Use the given color as a skybox scene background
   * @param {number | string} color A hexadecimal number or string that represents color
   * @returns {this}
   */
  public useColor(color: number | string) {
    this._scene.background = new THREE.Color(color);

    return this;
  }

  private _disposeOldSkybox() {
    const skyboxTexture = this._scene.background;

    if (!skyboxTexture) return;

    (skyboxTexture as THREE.Texture).dispose();
    this._scene.background = null;
  }
}

export default Skybox;
