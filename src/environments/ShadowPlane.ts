/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import Model from "~/core/Model";
import Environment from "./Environment";

/**
 * Helper class to easily add shadow plane under your 3D model
 * @category Environment
 * @example
 * import View3D, { ShadowPlane } from "@egjs/view3d";
 *
 * const view3d = new View3D("#view3d-canvas");
 * const shadowPlane = new ShadowPlane();
 * view3d.scene.addEnv(shadowPlane);
 */
class ShadowPlane implements Environment {
  // Developers can change those values if they know what they're doing
  // So I'm leaving those values public

  /**
   * Geometry of the shadow plane
   * @see https://threejs.org/docs/#api/en/geometries/PlaneGeometry
   */
  public geometry: THREE.PlaneGeometry;
  /**
   * Material of the shadow plane
   * @see https://threejs.org/docs/#api/en/materials/ShadowMaterial
   */
  public material: THREE.ShadowMaterial;
  /**
   * Mesh of the shadow plane
   * @see https://threejs.org/docs/#api/en/objects/Mesh
   */
  public mesh: THREE.Mesh;

  public get objects() { return [this.mesh]; }

  /**
   * Shadow opacity, value can be between 0(invisible) and 1(solid)
   * @type number
   */
  public get opacity() {
    return this.material.opacity;
  }

  public set opacity(val: number) {
    this.material.opacity = val;
  }

  /**
   * Create new shadow plane
   * @param {object} options Options
   * @param {number} [options.size=10000] Size of the shadow plane
   * @param {number} [options.opacity=0.3] Opacity of the shadow
   */
  constructor({
    size = 10000,
    opacity = 0.3,
  } = {}) {
    this.geometry = new THREE.PlaneGeometry(size, size, 100, 100);
    this.material = new THREE.ShadowMaterial({ opacity });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    const mesh = this.mesh;
    mesh.rotateX(-Math.PI / 2);
    mesh.receiveShadow = true;
  }

  /**
   * Fit shadow plane's size & position to given model
   * @param model Model to fit
   */
  public fit(model: Model, {
    floorPosition,
    floorRotation = new THREE.Quaternion(0, 0, 0, 1),
  }: Partial<{
    floorPosition: THREE.Vector3,
    floorRotation: THREE.Quaternion,
  }> = {}): void {
    const modelPosition = model.scene.position;
    const localYAxis = new THREE.Vector3(0, 1, 0).applyQuaternion(floorRotation);

    // Apply position
    if (floorPosition) {
      // Apply a tiny offset to prevent z-fighting with original model
      this.mesh.position.copy(floorPosition.clone().add(localYAxis.clone().multiplyScalar(0.001)));
    } else {
      const modelBbox = model.bbox;
      const modelBboxYOffset = modelBbox.getCenter(new THREE.Vector3()).y - modelBbox.min.y;
      const modelFloor = new THREE.Vector3().addVectors(
        modelPosition,
        // Apply a tiny offset to prevent z-fighting with original model
        localYAxis.multiplyScalar(-modelBboxYOffset + 0.0001),
      );
      this.mesh.position.copy(modelFloor);
    }

    // Apply rotation
    const rotX90 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    const shadowRotation = new THREE.Quaternion().multiplyQuaternions(floorRotation, rotX90);

    this.mesh.quaternion.copy(shadowRotation);
    this.mesh.updateMatrix();
  }
}

export default ShadowPlane;
