import * as THREE from "three";
import { LightProbeGenerator } from "three/examples/jsm/lights/LightProbeGenerator";

import View3D from "../View3D";
import { toRadian } from "../utils";

/**
 * Skybox that can renders background in a different scene.
 */
class Skybox {
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
    this._enabled = true;
  }

  /**
   * Enable skybox
   */
  public enable() {
    this._enabled = true;
  }

  /**
   * Disable skybox
   */
  public disable() {
    this._enabled = false;
  }

  /**
   * Update current skybox camera to match main camera & apply rotation
   */
  public updateCamera() {
    const view3D = this._view3D;
    const bgCam = this._camera;
    const camera = view3D.camera;
    const camPos = camera.threeCamera.position;
    const camPosXZ = new THREE.Vector2(camPos.x, camPos.z);
    const pivot = camera.currentPose.pivot;

    camPosXZ.rotateAround(new THREE.Vector2(pivot.x, pivot.z), toRadian(view3D.skyboxRotation));

    bgCam.copy(camera.threeCamera);
    bgCam.position.set(camPosXZ.x, camPos.y, camPosXZ.y);
    bgCam.lookAt(pivot);
    bgCam.updateProjectionMatrix();
  }

  /**
   * Create blurred cubemap texture of the given texture and use that as the skybox
   * @param {THREE.Texture} texture Equirect texture
   * @returns {this}
   */
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

    this._scene.background = cubeRenderTarget.texture;

    return this;
  }

  /**
   * Use the given texture as a skybox scene background
   * @param {THREE.Texture} texture A texture that compatible for scene background
   * @returns {this}
   */
  public useTexture(texture: THREE.Texture) {
    this._scene.background = texture;

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
}

export default Skybox;
