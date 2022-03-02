/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import Model from "../../core/Model";
import Motion from "../../core/Motion";
import { Range } from "../../type/utils";

/**
 * Options for {@link FloorIndicator}
 * @interface
 * @property {number} [ringOpacity=0.3] Ring's opacity.
 * @property {number} [dirIndicatorOpacity=1] Direction indicator's opacity.
 * @property {number} [fadeoutDuration=1000] Fadeout animation's duration.
 */
export interface FloorIndicatorOptions {
  ringOpacity: number;
  dirIndicatorOpacity: number;
  fadeoutDuration: number;
}

/**
 * Ring type indicator for showing where the model's at.
 */
class FloorIndicator {
  private _mesh: THREE.Group;
  private _ring: THREE.Mesh;
  private _arrow: THREE.Mesh;
  private _reticle: THREE.Mesh;
  private _animator: Motion;
  private _opacityRange: Range;

  /**
   * Ring mesh
   */
  public get mesh() { return this._mesh; }

  /**
   * Create new instance of FloorIndicator
   * @param {FloorIndicatorOptions} [options={}] Options
   */
  public constructor({
    ringOpacity = 0.3,
    dirIndicatorOpacity = 1,
    fadeoutDuration = 1000
  }: Partial<FloorIndicatorOptions> = {}) {
    const deg10 = Math.PI / 18;

    const ringGeomtry = new THREE.RingGeometry(0.975, 1, 150, 1, -6 * deg10, 30 * deg10);

    ringGeomtry.rotateX(-Math.PI / 2);

    const arrowGeometry = new THREE.RingGeometry(0.96, 1.015, 30, 1, 25 * deg10, 4 * deg10);

    // Create little triangle in ring
    const { position: arrowGeometryPosition } = arrowGeometry.attributes;

    const triangleStartIdx = Math.floor(11 * arrowGeometryPosition.count / 16);
    const triangleEndIdx = Math.floor(13 * arrowGeometryPosition.count / 16);
    const midIndex = Math.floor((triangleEndIdx - triangleStartIdx + 1) / 2);
    const firstY = new THREE.Vector3().fromBufferAttribute(arrowGeometryPosition, triangleStartIdx).y;

    for (let idx = triangleStartIdx; idx < triangleEndIdx; idx++) {
      const vecIndex = idx - triangleStartIdx;
      const offsetAmount = 0.025 * (midIndex - Math.abs(vecIndex - midIndex));

      arrowGeometryPosition.setY(idx, firstY - offsetAmount);
    }

    arrowGeometry.rotateX(-Math.PI / 2);

    const dimmedMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: ringOpacity,
      color: 0xffffff
    });
    const highlightMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: dirIndicatorOpacity,
      color: 0xffffff
    });

    const ring = new THREE.Mesh(ringGeomtry, dimmedMaterial);
    const arrow = new THREE.Mesh(arrowGeometry, highlightMaterial);
    const merged = new THREE.Group();

    merged.add(ring, arrow);
    merged.position.setY(0.0001); // Set Y higher than shadow plane

    this._mesh = merged;
    this._ring = ring;
    this._arrow = arrow;
    this._animator = new Motion({ duration: fadeoutDuration });
    this._opacityRange = {
      min: ringOpacity,
      max: dirIndicatorOpacity
    };

    this.hide();
  }

  public updateSize(model: Model) {
    this._mesh.scale.setScalar(model.bbox.getBoundingSphere(new THREE.Sphere()).radius);
  }

  public update({
    delta,
    rotation
  }: {
    delta: number;
    rotation: THREE.Quaternion;
  }) {
    const mesh = this._mesh;
    const animator = this._animator;

    if (!mesh.visible) return;

    animator.update(delta);

    const minOpacityMat = this._ring.material as THREE.Material;
    const maxOpacityMat = this._arrow.material as THREE.Material;
    const opacityRange = this._opacityRange;

    minOpacityMat.opacity = animator.val * opacityRange.min;
    maxOpacityMat.opacity = animator.val * opacityRange.max;

    if (animator.val <= 0) {
      mesh.visible = false;
    }

    // Update mesh
    mesh.quaternion.copy(rotation);
    mesh.updateMatrix();
  }

  public show() {
    this._mesh.visible = true;
    this._animator.reset(1);
  }

  public hide() {
    this._mesh.visible = false;
  }

  public fadeout() {
    this._animator.setEndDelta(-1);
  }
}

export default FloorIndicator;
