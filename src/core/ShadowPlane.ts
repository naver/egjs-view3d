/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader";

import View3D from "../View3D";

import Model from "./Model";

/**
 * @interface
 * @param {number} [opacity=0.3] Opacity of the shadow.
 * @param {number} [mapSize=9]
 */
export interface ShadowOptions {
  opacity: number;
  mapSize: number;
  baseScale: number;
  blur: number;
}

/**
 * Helper class to easily add shadow plane under your 3D model
 */
class ShadowPlane extends THREE.Object3D {
  private _opacity: ShadowOptions["opacity"];
  private _mapSize: ShadowOptions["mapSize"];
  private _baseScale: ShadowOptions["baseScale"];
  private _blur: ShadowOptions["blur"];

  private _view3D: View3D;
  private _shadowCamera: THREE.OrthographicCamera;
  private _blurCamera: THREE.OrthographicCamera;

  private _renderTarget: THREE.WebGLRenderTarget;
  private _blurTarget: THREE.WebGLRenderTarget;
  private _depthMaterial: THREE.MeshDepthMaterial;
  private _horizontalBlurMaterial: THREE.ShaderMaterial;
  private _verticalBlurMaterial: THREE.ShaderMaterial;
  private _plane: THREE.Mesh;
  private _blurPlane: THREE.Mesh;

  /**
   * Shadow opacity, value can be between 0(invisible) and 1(solid)
   * @type {number}
   * @default 0.3
   */
  public get opacity() { return this._opacity; }
  /**
   * Size of the shadow map. A size of n * n where n = 2 ^ (mapSize) will be used as shadow map texture
   * A smaller value will show more blurry(softer) shadow
   * @type {number}
   * @default 9
   */
  public get mapSize() { return this._mapSize; }

  /**
   * Create new shadow plane
   * @param {object} options Options
   * @param {number} [options.type="VSM"] Type of the shadow.
   * @param {number} [options.opacity=0.3] Opacity of the shadow.
   * @param {number} [options.yaw=0] Y-axis rotation of the light that casts shadow.
   * @param {number} [options.pitch=0] X-axis rotation of the light that casts shadow.
   * @param {number} [options.mapSize=9]
   */
  public constructor(view3D: View3D, {
    opacity = 1,
    mapSize = 9,
    blur = 3.5,
    baseScale = 2
  }: Partial<ShadowOptions> = {}) {
    super();

    this._view3D = view3D;
    this._opacity = opacity;
    this._mapSize = mapSize;
    this._baseScale = baseScale;
    this._blur = blur;

    const threeRenderer = view3D.renderer.threeRenderer;
    const maxTextureSize = Math.min(Math.pow(2, mapSize), threeRenderer.capabilities.maxTextureSize);

    this._renderTarget = new THREE.WebGLRenderTarget(maxTextureSize, maxTextureSize, { format: THREE.RGBAFormat });
    this._blurTarget = new THREE.WebGLRenderTarget(maxTextureSize, maxTextureSize, { format: THREE.RGBAFormat });
    this._renderTarget.texture.generateMipmaps = false;
    this._blurTarget.texture.generateMipmaps = false;

    this._setup();
  }

  public updateDimensions(model: Model) {
    this._updateShadowCamera(model);
  }

  public render() {
    this._plane.visible = false;

    const { scene, renderer } = this._view3D;
    const shadowCamera = this._shadowCamera;
    const sceneRoot = scene.root;
    const threeRenderer = renderer.threeRenderer;
    const initialBackground = sceneRoot.background;
    sceneRoot.background = null;

    // force the depthMaterial to everything
    sceneRoot.overrideMaterial = this._depthMaterial;

    // set renderer clear alpha
    const initialClearAlpha = threeRenderer.getClearAlpha();
    threeRenderer.setClearAlpha(0);

    // render to the render target to get the depths
    threeRenderer.setRenderTarget(this._renderTarget);
    threeRenderer.clear();
    threeRenderer.render(sceneRoot, shadowCamera);

    // and reset the override material
    sceneRoot.overrideMaterial = null;

    this._blurShadow(this._blur);

    // a second pass to reduce the artifacts
    // (0.4 is the minimum blur amout so that the artifacts are gone)
    this._blurShadow(this._blur * 0.4);

    // reset and render the normal scene
    threeRenderer.setRenderTarget(null);
    threeRenderer.setClearAlpha(initialClearAlpha);
    sceneRoot.background = initialBackground;

    this._plane.visible = true;
  }

  private _blurShadow(amount: number) {
    const { renderer } = this._view3D;
    const blurCamera = this._blurCamera;
    const threeRenderer = renderer.threeRenderer;
    const blurPlane = this._blurPlane;
    const renderTarget = this._renderTarget;
    const blurTarget = this._blurTarget;
    const horizontalBlurMaterial = this._horizontalBlurMaterial;
    const verticalBlurMaterial = this._verticalBlurMaterial;

    blurPlane.visible = true;

    // blur horizontally and draw in the renderTargetBlur
    horizontalBlurMaterial.uniforms.tDiffuse.value = renderTarget.texture;
    horizontalBlurMaterial.uniforms.h.value = amount * 1 / 256;
    horizontalBlurMaterial.needsUpdate = true;
    blurPlane.material = horizontalBlurMaterial;

    threeRenderer.setRenderTarget(blurTarget);
    threeRenderer.render(blurPlane, blurCamera);

    // blur vertically and draw in the main renderTarget
    verticalBlurMaterial.uniforms.tDiffuse.value = blurTarget.texture;
    verticalBlurMaterial.uniforms.v.value = amount * 1 / 256;
    verticalBlurMaterial.needsUpdate = true;
    blurPlane.material = verticalBlurMaterial;

    threeRenderer.setRenderTarget(renderTarget);
    threeRenderer.render(blurPlane, blurCamera);

    blurPlane.visible = false;
  }

  private _updateShadowCamera(model: Model) {
    const shadowCam = this._shadowCamera;
    const baseScale = this._baseScale;
    const boundingSphere = model.bbox.getBoundingSphere(new THREE.Sphere());
    const radius = boundingSphere.radius;
    const camSize = baseScale * 2 * radius;

    shadowCam.near = 0;
    shadowCam.far = (model.bbox.max.y - model.bbox.min.y) / camSize;
    shadowCam.rotation.set(Math.PI / 2, Math.PI, 0, "YXZ");

    this.position.copy(boundingSphere.center).setY(model.bbox.min.y);
    this.scale.setScalar(camSize);

    shadowCam.updateProjectionMatrix();
  }

  private _setup() {
    const shadowCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5);
    shadowCamera.rotation.x = Math.PI / 2;
    this._shadowCamera = shadowCamera;
    this.add(shadowCamera);

    const blurCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0);
    this._blurCamera = blurCamera;

    const geometry = new THREE.PlaneBufferGeometry();
    const planeMat = new THREE.MeshBasicMaterial({
      opacity: this._opacity,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      map: this._renderTarget.texture
    });

    const plane = new THREE.Mesh(geometry, planeMat);
    plane.renderOrder = 1;
    plane.scale.set(-1, -1, 1);
    plane.rotation.order = "YXZ";
    plane.rotation.x = Math.PI / 2;
    this._plane = plane;
    this.add(plane);

    const blurPlane = new THREE.Mesh(geometry);
    this._blurPlane = blurPlane;

    const depthMaterial = new THREE.MeshDepthMaterial();
    depthMaterial.onBeforeCompile = shader => {
      shader.fragmentShader = `
        ${shader.fragmentShader.replace(
    "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );",
    "gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * opacity );"
  )}`;
    };
    this._depthMaterial = depthMaterial;

    const horizontalBlurMaterial = new THREE.ShaderMaterial(HorizontalBlurShader);
    horizontalBlurMaterial.depthTest = false;
    this._horizontalBlurMaterial = horizontalBlurMaterial;

    const verticalBlurMaterial = new THREE.ShaderMaterial(VerticalBlurShader);
    verticalBlurMaterial.depthTest = false;
    this._verticalBlurMaterial = verticalBlurMaterial;
  }
}

export default ShadowPlane;
