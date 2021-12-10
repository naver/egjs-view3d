/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";
import Model from "../core/Model";
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
  private _material: THREE.ShadowMaterial;
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
    mesh.position.setY(-0.001); // Move slightly below model, to prevent z-fighting
    mesh.scale.setScalar(100);
    mesh.receiveShadow = true;

    const light = this._light;
    const maxTexSize = view3D.renderer.threeRenderer.capabilities.maxTextureSize;
    const shadowSize = Math.min(1024, maxTexSize);

    light.position.set(0, 1, 0);
    light.castShadow = true;
    light.shadow.mapSize.set(shadowSize, shadowSize);
  }

  /**
   * Fit shadow plane's size & position to given model
   * @param model Model to fit
   */
  public fit(model: Model, {
    floorPosition,
    floorRotation = new THREE.Quaternion(0, 0, 0, 1)
  }: Partial<{
    floorPosition: THREE.Vector3;
    floorRotation: THREE.Quaternion;
  }> = {}): void {
    const mesh = this._mesh;
    const modelPosition = model.scene.position;
    const localYAxis = new THREE.Vector3(0, 1, 0).applyQuaternion(floorRotation);

    // Apply position
    if (floorPosition) {
      // Apply a tiny offset to prevent z-fighting with original model
      mesh.position.copy(floorPosition.clone().add(localYAxis.clone().multiplyScalar(0.001)));
    } else {
      const modelBbox = model.bbox;
      const modelBboxYOffset = modelBbox.getCenter(new THREE.Vector3()).y - modelBbox.min.y;
      const modelFloor = new THREE.Vector3().addVectors(
        modelPosition,
        // Apply a tiny offset to prevent z-fighting with original model
        localYAxis.multiplyScalar(-modelBboxYOffset + 0.0001),
      );
      mesh.position.copy(modelFloor);
    }

    // Apply rotation
    const rotX90 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    const shadowRotation = new THREE.Quaternion().multiplyQuaternions(floorRotation, rotX90);

    mesh.quaternion.copy(shadowRotation);
    mesh.updateMatrix();
  }
}

export default ShadowPlane;
