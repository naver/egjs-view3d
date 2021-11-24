/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import Motion from "../../Motion";
import { Range } from "~/type/internal";

/**
 * Options for {@link FloorIndicator}
 * @category Controls-AR
 * @interface
 * @property {number} [ringOpacity=0.3] Ring's opacity.
 * @property {number} [dirIndicatorOpacity=1] Direction indicator's opacity.
 * @property {number} [fadeoutDuration=1000] Fadeout animation's duration.
 */
export interface FloorIndicatorOption {
  opacityMin: number;
  opacityMax: number;
  fadeoutDuration: number;
}

/**
 * Ring type indicator for showing where the model's at.
 * @category Controls-AR
 */
class FloorIndicator {
  private _mesh: THREE.Mesh;
  private _animator: Motion;
  private _opacityRange: Range;

  /**
   * Ring mesh
   */
  public get mesh() { return this._mesh; }

  /**
   * Create new instance of FloorIndicator
   * @param {FloorIndicatorOption} [options={}] Options
   */
  constructor({
    ringOpacity = 0.3,
    dirIndicatorOpacity = 1,
    fadeoutDuration = 1000,
  } = {}) {
    const deg10 = Math.PI / 18;

    const dimmedRingGeomtry = new THREE.RingGeometry(0.975, 1, 150, 1, -6 * deg10, 30 * deg10);
    const reticle = new THREE.CircleGeometry(0.1, 30, 0, Math.PI * 2);
    dimmedRingGeomtry.merge(reticle);

    const highlightedRingGeometry = new THREE.RingGeometry(0.96, 1.015, 30, 1, 25 * deg10, 4 * deg10);

    // Create little triangle in ring
    const ringVertices = highlightedRingGeometry.vertices;
    const trianglePart = ringVertices.slice(Math.floor(11 * ringVertices.length / 16), Math.floor(13 * ringVertices.length / 16));
    const firstY = trianglePart[0].y;
    const midIndex = Math.floor(trianglePart.length / 2);
    trianglePart.forEach((vec, vecIdx) => {
      const offsetAmount = 0.025 * (midIndex - Math.abs(vecIdx - midIndex));
      vec.setY(firstY - offsetAmount);
    });

    const indicatorMat = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
    const mergedGeometry = new THREE.Geometry();

    mergedGeometry.merge(dimmedRingGeomtry, indicatorMat, 0);
    mergedGeometry.merge(highlightedRingGeometry, indicatorMat, 1);

    const dimmedMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: ringOpacity,
      color: 0xffffff,
    });
    const highlightMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: dirIndicatorOpacity,
      color: 0xffffff,
    });
    const materials = [dimmedMaterial, highlightMaterial];

    this._mesh = new THREE.Mesh(mergedGeometry, materials);
    this._mesh.matrixAutoUpdate = false;
    this._animator = new Motion({ duration: fadeoutDuration });
    this._opacityRange = {
      min: ringOpacity,
      max: dirIndicatorOpacity,
    };
  }

  public update({
    delta,
    scale,
    position,
    rotation,
  }: {
    delta: number,
    scale: number,
    position: THREE.Vector3,
    rotation: THREE.Quaternion,
  }) {
    const mesh = this._mesh;
    const animator = this._animator;

    if (!this._mesh.visible) return;

    animator.update(delta);

    const materials = this._mesh.material as THREE.Material[];
    const minOpacityMat = materials[0];
    const maxOpacityMat = materials[1];
    const opacityRange = this._opacityRange;

    minOpacityMat.opacity = animator.val * opacityRange.min;
    maxOpacityMat.opacity = animator.val * opacityRange.max;

    if (animator.val <= 0) {
      mesh.visible = false;
    }

    // Update mesh
    mesh.scale.setScalar(scale);
    mesh.position.copy(position);
    mesh.quaternion.copy(rotation);
    mesh.updateMatrix();
  }

  public show() {
    this._mesh.visible = true;
    this._animator.reset(1);
  }

  public fadeout() {
    this._animator.setEndDelta(-1);
  }
}

export default FloorIndicator;
