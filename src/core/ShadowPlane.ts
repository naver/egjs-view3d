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
 * @param {number} [darkness=0.5] Darkness of the shadow.
 * @param {number} [mapSize=9] Size of the shadow map. Texture of size (n * n) where n = 2 ^ (mapSize) will be used as shadow map. Should be an integer value.
 * @param {number} [blur=3.5] Blurriness of the shadow.
 * @param {number} [shadowScale=1] Scale of the shadow range. This usually means which height of the 3D model shadow will be affected by.
 * @param {number} [planeScale=2] Scale of the shadow plane. Use higher value if the shadow is clipped.
 */
export interface ShadowOptions {
  darkness: number;
  mapSize: number;
  blur: number;
  shadowScale: number;
  planeScale: number;
}

/**
 * Helper class to easily add shadow plane under your 3D model
 */
class ShadowPlane {
  private _darkness: ShadowOptions["darkness"];
  private _mapSize: ShadowOptions["mapSize"];
  private _blur: ShadowOptions["blur"];
  private _shadowScale: ShadowOptions["shadowScale"];
  private _planeScale: ShadowOptions["planeScale"];

  private _view3D: View3D;
  private _root: THREE.Group;
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
   * Root of the object
   * @readonly
   */
  public get root() { return this._root; }

  /**
   * Darkness of the shadow.
   * @type {number}
   * @default 0.5
   */
  public get darkness() { return this._darkness; }
  /**
   * Size of the shadow map. Texture of size (n * n) where n = 2 ^ (mapSize) will be used as shadow map. Should be an integer value.
   * @type {number}
   * @default 9
   */
  public get mapSize() { return this._mapSize; }
  /**
   * Blurriness of the shadow.
   * @type {number}
   * @default 3.5
   */
  public get blur() { return this._blur; }
  /**
   * Scale of the shadow range. Using higher values will make shadow more even-textured.
   * @type {number}
   * @default 1
   */
  public get shadowScale() { return this._shadowScale; }
  /**
   * Scale of the shadow plane. Use higher value if the shadow is clipped.
   * @type {number}
   * @default 2
   */
  public get planeScale() { return this._planeScale; }

  public set darkness(val: ShadowOptions["darkness"]) {
    (this._plane.material as THREE.MeshBasicMaterial).opacity = val;
    this._darkness = val;
  }

  public set blur(val: ShadowOptions["blur"]) {
    this._blur = val;
  }

  public set shadowScale(val: ShadowOptions["shadowScale"]) {
    this._shadowScale = val;
    const model = this._view3D.model;
    if (model) {
      this.updateDimensions(model);
    }
  }

  /**
   * Create new shadow plane
   * @param {object} options Options
   * @param {number} [options.darkness=0.5] Darkness of the shadow.
   * @param {number} [options.mapSize=9] Size of the shadow map. Texture of size (n * n) where n = 2 ^ (mapSize) will be used as shadow map. Should be an integer value.
   * @param {number} [options.blur=3.5] Blurriness of the shadow.
   * @param {number} [options.shadowScale=1] Scale of the shadow range. This usually means which height of the 3D model shadow will be affected by.
   * @param {number} [options.planeScale=2] Scale of the shadow plane. Use higher value if the shadow is clipped.
   */
  public constructor(view3D: View3D, {
    darkness = 0.5,
    mapSize = 9,
    blur = 3.5,
    shadowScale = 1,
    planeScale = 2
  }: Partial<ShadowOptions> = {}) {
    this._view3D = view3D;
    this._darkness = darkness;
    this._mapSize = mapSize;
    this._blur = blur;
    this._shadowScale = shadowScale;
    this._planeScale = planeScale;

    const threeRenderer = view3D.renderer.threeRenderer;
    const maxTextureSize = Math.min(Math.pow(2, Math.floor(mapSize)), threeRenderer.capabilities.maxTextureSize);

    this._root = new THREE.Group();
    this._renderTarget = new THREE.WebGLRenderTarget(maxTextureSize, maxTextureSize, { format: THREE.RGBAFormat });
    this._blurTarget = new THREE.WebGLRenderTarget(maxTextureSize, maxTextureSize, { format: THREE.RGBAFormat });
    this._renderTarget.texture.generateMipmaps = false;
    this._blurTarget.texture.generateMipmaps = false;

    const shadowCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0);
    shadowCamera.rotation.x = Math.PI / 2;
    this._shadowCamera = shadowCamera;
    this._root.add(shadowCamera);

    const blurCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0);
    this._blurCamera = blurCamera;

    this._setupPlanes();
  }

  public updateDimensions(model: Model) {
    const root = this._root;
    const shadowCam = this._shadowCamera;
    const baseScale = this._planeScale;
    const boundingSphere = model.bbox.getBoundingSphere(new THREE.Sphere());
    const radius = boundingSphere.radius;
    const camSize = baseScale * 2 * radius;
    const shadowScale = this._shadowScale;

    shadowCam.far = shadowScale * (model.bbox.max.y - model.bbox.min.y) / camSize;
    shadowCam.rotation.set(Math.PI / 2, Math.PI, 0, "YXZ");

    root.position.copy(boundingSphere.center).setY(model.bbox.min.y);
    root.scale.setScalar(camSize);

    shadowCam.updateProjectionMatrix();
  }

  public render() {
    this._plane.visible = false;

    const view3D = this._view3D;
    const { renderer, ar } = view3D;
    const shadowCamera = this._shadowCamera;
    const threeRenderer = renderer.threeRenderer;

    const scene = ar.activeSession
      ? ar.activeSession.arScene
      : view3D.scene;

    // disable XR for offscreen rendering
    const xrEnabled = threeRenderer.xr.enabled;
    threeRenderer.xr.enabled = false;

    const sceneRoot = scene.root;
    const initialBackground = sceneRoot.background;
    sceneRoot.background = null;

    // force the depthMaterial to everything
    sceneRoot.overrideMaterial = this._depthMaterial;

    // set renderer clear alpha
    const initialClearAlpha = threeRenderer.getClearAlpha();
    threeRenderer.setClearAlpha(0);

    // render to the render target to get the depths
    const prevRenderTarget = threeRenderer.getRenderTarget();
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
    threeRenderer.xr.enabled = xrEnabled;
    threeRenderer.setRenderTarget(prevRenderTarget);
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

  private _setupPlanes() {
    const root = this._root;
    const planeGeometry = new THREE.PlaneBufferGeometry();
    const planeMat = new THREE.MeshBasicMaterial({
      opacity: this._darkness,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      map: this._renderTarget.texture
    });

    const plane = new THREE.Mesh(planeGeometry, planeMat);
    plane.renderOrder = 1;
    plane.scale.set(-1, -1, 1);
    plane.rotation.order = "YXZ";
    plane.rotation.x = Math.PI / 2;
    this._plane = plane;
    root.add(plane);

    const blurPlane = new THREE.Mesh(planeGeometry);
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
