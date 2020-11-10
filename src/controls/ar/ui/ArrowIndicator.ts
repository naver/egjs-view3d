/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import { range } from "~/utils";

/**
 * Options for {@link ArrowIndicator}
 * @category Controls-AR
 * @interface
 * @property {string | number | THREE.Color} [color=0xffffff] Arrow color
 */
export interface ArrowIndicatorOption {
  color: string | number | THREE.Color;
}

/**
 * Arrow indicator for AR model translatioon.
 * @category Controls-AR
 */
class ArrowIndicator {
  private _arrows: THREE.Group[];
  private _obj: THREE.Group;

  /**
   * {@link https://threejs.org/docs/index.html#api/en/objects/Group THREE.Group} object that contains arrows.
   */
  public get object() { return this._obj; }

  /**
   * Create new ArrowIndicator
   * @param {ArrowIndicatorOption} [options={}] Options
   */
  constructor({
    color = 0xffffff,
  }: Partial<ArrowIndicatorOption> = {}) {
    const bodyGeometry = new THREE.CylinderBufferGeometry(0.1, 0.1, 1);
    const coneGeometry = new THREE.CylinderBufferGeometry(0, 0.5, 1, 30, 1);

    bodyGeometry.translate(0, 0.5, 0);
    coneGeometry.translate(0, 1.5, 0);

    const body = new THREE.Mesh(bodyGeometry, new THREE.MeshBasicMaterial({ color }));
    const cone = new THREE.Mesh(coneGeometry, new THREE.MeshBasicMaterial({ color }));
    const arrow = new THREE.Group();

    arrow.add(body);
    arrow.add(cone);

    this._arrows = [arrow];

    this._obj = new THREE.Group();
    this._obj.add(arrow);

    range(3).forEach(idx => {
      const copied = arrow.clone(true);
      copied.rotateZ(Math.PI / 2 * (idx + 1));
      this._obj.add(copied);
      this._arrows.push(copied);
    });

    this.hide();
  }

  /**
   * Show indicator
   */
  public show() {
    this._obj.visible = true;
  }

  /**
   * Hide indicator
   */
  public hide() {
    this._obj.visible = false;
  }

  /**
   * Change the center of the arrows to a given position
   * @param position Position to set as center of the arrows
   */
  public updatePosition(position: THREE.Vector3) {
    this._obj.position.copy(position);
  }

  /**
   * Update the arrow's offset from the center
   * @param offset Offset vector.
   */
  public updateOffset(offset: THREE.Vector3) {
    this._arrows.forEach((arrow, idx) => {
      const facingDirection = new THREE.Vector3(0, 1, 0).applyQuaternion(arrow.quaternion);
      const facingOffset = facingDirection.multiply(offset);

      arrow.position.copy(facingOffset);
    });
  }

  /**
   * Update arrow's scale
   * @param scale Scale vector
   */
  public updateScale(scale: number) {
    this._arrows.forEach(arrow => arrow.scale.setScalar(scale));
  }

  /**
   * Update arrow's rotation.
   * @param rotation Quaternion value to rotate arrows.
   */
  public updateRotation(rotation: THREE.Quaternion) {
    this._obj.quaternion.copy(rotation);
  }
}

export default ArrowIndicator;
