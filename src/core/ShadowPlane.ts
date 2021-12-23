/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";
import * as DEFAULT from "../const/default";
import { OptionGetters } from "../type/utils";

/**
 * @interface
 */
export interface ShadowOptions {
  opacity: number;
}

/**
 * Helper class to easily add shadow plane under your 3D model
 */
class ShadowPlane implements OptionGetters<ShadowOptions> {
  private _geometry: THREE.PlaneGeometry;
  private _material: THREE.Material;
  private _mesh: THREE.Mesh;
  private _light: THREE.DirectionalLight;

  public get mesh() { return this._mesh; }
  public get light() { return this._light; }

  /**
   * Shadow opacity, value can be between 0(invisible) and 1(solid)
   * @type number
   */
  public get opacity() {
    return this._material.opacity;
  }

  public set opacity(val: number) {
    this._material.opacity = val;
  }

  /**
   * Create new shadow plane
   * @param {object} options Options
   * @param {number} [options.opacity=0.3] Opacity of the shadow
   */
  public constructor(view3D: View3D, {
    opacity = 0.3
  }: Partial<ShadowOptions> = {}) {
    this._geometry = new THREE.PlaneBufferGeometry();
    this._material = new THREE.ShadowMaterial({ opacity, fog: false });
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._light = new THREE.DirectionalLight();

    const mesh = this._mesh;
    mesh.rotateX(-Math.PI / 2);
    mesh.position.setY(DEFAULT.SHADOW_Y_OFFSET); // Move slightly below model, to prevent z-fighting
    mesh.scale.setScalar(100);
    mesh.receiveShadow = true;
    mesh.name = "ShadowPlane-Mesh";

    const light = this._light;
    const maxTexSize = view3D.renderer.threeRenderer.capabilities.maxTextureSize;
    const shadowSize = Math.min(1024, maxTexSize);

    light.position.set(0, 1, 0);
    light.target = mesh;
    light.castShadow = true;
    light.shadow.mapSize.set(shadowSize, shadowSize);
    light.name = "ShadowPlane-Light";
  }
}

export default ShadowPlane;
