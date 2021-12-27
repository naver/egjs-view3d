/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";
import * as DEFAULT from "../const/default";
import { MAX_SAFE_INTEGER } from "../const/browser";
import { clamp, getRotatedPosition } from "../utils";
import { OptionGetters } from "../type/utils";

import Model from "./Model";

/**
 * @interface
 */
export interface ShadowOptions {
  opacity: number;
  hardness: number;
  yaw: number;
  pitch: number;
}

/**
 * Helper class to easily add shadow plane under your 3D model
 */
class ShadowPlane implements OptionGetters<ShadowOptions> {
  private _hardness: ShadowOptions["hardness"];
  private _yaw: ShadowOptions["yaw"];
  private _pitch: ShadowOptions["pitch"];

  private _geometry: THREE.PlaneGeometry;
  private _material: THREE.Material;
  private _mesh: THREE.Mesh;
  private _light: THREE.DirectionalLight;
  private _maxHardness: number;

  /**
   * Shadow plane mesh
   * @type {THREE.Mesh}
   * @readonly
   */
  public get mesh() { return this._mesh; }
  /**
   * Shadow light
   * @type {THREE.DirectionalLight}
   * @readonly
   */
  public get light() { return this._light; }

  /**
   * Shadow opacity, value can be between 0(invisible) and 1(solid)
   * @type {number}
   * @default 0.3
   */
  public get opacity() { return this._material.opacity; }
  /**
   * Hardness of the shadow. Should be integer greater than 0, and lower the softer the shadow is.
   * @type {number}
   * @default 6
   */
  public get hardness() { return this._hardness; }
  /**
   * Y-axis rotation of the shadow.
   * @type {number}
   * @default 0
   */
  public get yaw() { return this._yaw; }
  /**
   * X-axis rotation of the shadow.
   * @type {number}
   * @default 0
   */
  public get pitch() { return this._pitch; }

  public set opacity(val: number) {
    this._material.opacity = val;
  }

  /**
   * Create new shadow plane
   * @param {object} options Options
   * @param {number} [options.opacity=0.3] Opacity of the shadow.
   * @param {number} [options.hardness=6] Hardness of the shadow. Should be integer greater than 0, and lower the softer the shadow is.
   * @param {number} [options.yaw=0] Y-axis rotation of the shadow.
   * @param {number} [options.pitch=0] X-axis rotation of the shadow.
   */
  public constructor(view3D: View3D, {
    opacity = 0.3,
    hardness = 6,
    yaw = 0,
    pitch = 0
  }: Partial<ShadowOptions> = {}) {
    this._hardness = hardness;
    this._yaw = yaw;
    this._pitch = pitch;

    this._geometry = new THREE.PlaneBufferGeometry(2, 2);
    this._material = new THREE.ShadowMaterial({ opacity, fog: false });
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._light = new THREE.DirectionalLight();

    const mesh = this._mesh;
    mesh.rotateX(-Math.PI / 2);
    mesh.position.setY(DEFAULT.SHADOW_Y_OFFSET); // Move slightly below model, to prevent z-fighting
    mesh.scale.setScalar(2 ** 32 - 1);
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "ShadowPlane-Mesh";

    const light = this._light;

    light.intensity = 0;
    light.target = mesh;
    light.castShadow = true;
    light.name = "ShadowPlane-Light";

    const maxTexSize = view3D.renderer.threeRenderer.capabilities.maxTextureSize;
    this._maxHardness = Math.round(Math.log(maxTexSize) / Math.log(2));

    this._updateSoftnessLevel();
  }

  public update(model: Model) {
    this._updatePlaneScale(model);
    this._updateLightPosition(model);
  }

  private _updateSoftnessLevel() {
    const light = this._light;

    const hardness = clamp(Math.floor(this._hardness), 1, this._maxHardness);
    const shadowSize = Math.pow(2, hardness);

    light.shadow.mapSize.set(shadowSize, shadowSize);
  }

  private _updatePlaneScale(model: Model) {
    const mesh = this._mesh;
    const modelBbox = model.bbox;
    const boxPoints = [modelBbox.min.x, modelBbox.min.z, modelBbox.max.x, modelBbox.max.z]
      .map(val => Math.abs(val));

    const maxVal = Math.max(...boxPoints);

    mesh.scale.setScalar(100 * maxVal);
  }

  private _updateLightPosition(model: Model) {
    const light = this._light;
    const scale = 1.5;
    const shadowCam = light.shadow.camera;
    const yaw = this._yaw;
    const pitch = this._pitch;
    const boundingSphere = model.bbox.getBoundingSphere(new THREE.Sphere());
    const radius = boundingSphere.radius;

    const newPosition = getRotatedPosition(radius, yaw, 90 - pitch);

    light.position.copy(newPosition);

    shadowCam.near = 0;
    shadowCam.far = MAX_SAFE_INTEGER;
    shadowCam.left = -scale * radius;
    shadowCam.right = scale * radius;
    shadowCam.top = scale * radius;
    shadowCam.bottom = -scale * radius;
  }
}

export default ShadowPlane;
