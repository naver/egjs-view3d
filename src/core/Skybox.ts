import * as THREE from "three";

import View3D from "../View3D";
import skyboxVS from "../shader/skybox.vs";
import skyboxFS from "../shader/skybox.fs";

class Skybox {
  private _view3D: View3D;
  private _enabled: boolean;
  private _cubeTarget: THREE.WebGLCubeRenderTarget | null;
  private _skyboxMesh: THREE.Mesh;
  private _skyboxMat: THREE.ShaderMaterial;

  public get enabled() { return this._enabled; }

  public constructor(view3D: View3D) {
    this._view3D = view3D;
    this._enabled = false;
    this._cubeTarget = null;

    this._skyboxMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(THREE.ShaderLib.cube.uniforms),
      vertexShader: skyboxVS,
      fragmentShader: skyboxFS,
      side: THREE.BackSide,
      depthTest: false,
      depthWrite: false,
      fog: false,
      lights: false
    });
    this._skyboxMat.extensions.shaderTextureLOD = true;

    this._skyboxMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this._skyboxMat);
  }

  public render() {
    if (!this._enabled || !this._cubeTarget) return;

    const view3D = this._view3D;
    const threeRenderer = view3D.renderer.threeRenderer;
    const threeCamera = view3D.camera.threeCamera;
    const skyboxMesh = this._skyboxMesh;

    skyboxMesh.matrixWorld.copyPosition(threeCamera.matrixWorld);
    threeRenderer.render(skyboxMesh, view3D.camera.threeCamera);
  }

  public useBlurredHDR(texture: THREE.Texture) {
    const cubeTarget = this._cubemapBlurred(texture);

    this._skyboxMat.uniforms.envMap.value = cubeTarget.texture;
    this._skyboxMat.needsUpdate = true;

    this._cubeTarget = cubeTarget;
    this._enabled = true;

    return cubeTarget.texture;
  }

  private _pmremBlurred(texture: THREE.Texture) {
    const view3D = this._view3D;
    const sigma = view3D.skyboxBlur === true
      ? 0.04
      : view3D.skyboxBlur as number;
    const envScene = new THREE.Scene();
    envScene.background = texture;

    const pmremGenerator = new THREE.PMREMGenerator(view3D.renderer.threeRenderer);
    const renderTarget = pmremGenerator.fromScene(envScene, sigma);

    return renderTarget as THREE.WebGLCubeRenderTarget;
  }

  private _cubemapBlurred(texture: THREE.Texture) {
    const view3D = this._view3D;
    const threeRenderer = view3D.renderer.threeRenderer;

    const origMipmaps = texture.generateMipmaps;
    const origMinFilter = texture.minFilter;
    const origMagFilter = texture.magFilter;

    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(texture.image.width)
      .fromEquirectangularTexture(threeRenderer, texture);

    texture.generateMipmaps = origMipmaps;
    texture.minFilter = origMinFilter;
    texture.magFilter = origMagFilter;

    return cubeRenderTarget;
  }
}

export default Skybox;
