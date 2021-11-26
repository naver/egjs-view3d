/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

/**
 * Options for {@link RotationIndicator}
 * @interface
 * @property {string | number | THREE.Color} [ringColor=0xffffff] Ring color
 * @property {string | number | THREE.Color} [axisColor=0xffffff] Axis color
 */
export interface RotationIndicatorOption {
  ringColor: string | number | THREE.Color;
  axisColor: string | number | THREE.Color;
}

/**
 * Rotation indicator for ARHoverSession
 */
class RotationIndicator {
  private _ring: THREE.Mesh;
  private _axis: THREE.Line;
  private _obj: THREE.Group;

  /**
   * {@link https://threejs.org/docs/index.html#api/en/objects/Group THREE.Group} object that contains ring & axis.
   */
  public get object() { return this._obj; }

  /**
   * Create new RotationIndicator
   * @param {RotationIndicatorOption} [options={}] Options
   */
  public constructor({
    ringColor = 0xffffff,
    axisColor = 0xffffff
  }: Partial<RotationIndicatorOption> = {}) {
    const ringGeometry = new THREE.RingGeometry(0.99, 1, 150, 1, 0, Math.PI * 2);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: ringColor, side: THREE.DoubleSide });

    this._ring = new THREE.Mesh(ringGeometry, ringMaterial);

    const axisVertices = [
      new THREE.Vector3(0, 0, -1000),
      new THREE.Vector3(0, 0, +1000)
    ];
    const axisGeometry = new THREE.BufferGeometry().setFromPoints(axisVertices);
    const axisMaterial = new THREE.LineBasicMaterial({ color: axisColor });

    this._axis = new THREE.Line(axisGeometry, axisMaterial);

    this._obj = new THREE.Group();
    this._obj.add(this._ring);
    this._obj.add(this._axis);

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
   * Change the position of the indicator
   * @param position New position
   */
  public updatePosition(position: THREE.Vector3) {
    this._obj.position.copy(position);
  }

  /**
   * Update scale of the ring
   * @param scale New scale
   */
  public updateScale(scale: number) {
    this._ring.scale.setScalar(scale);
  }

  /**
   * Update indicator's rotation
   * @param rotation Quaternion value set as new rotation.
   */
  public updateRotation(rotation: THREE.Quaternion) {
    this._obj.quaternion.copy(rotation);
  }
}

export default RotationIndicator;
