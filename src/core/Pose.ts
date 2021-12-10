/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

/**
 * Data class of camera's pose
 */
class Pose {
  public yaw: number;
  public pitch: number;
  public zoom: number;
  public pivot: THREE.Vector3;

  /**
   * Create new instance of pose
   * @param {number} yaw yaw
   * @param {number} pitch pitch
   * @param {number} zoom zoom
   * @param {number[]} pivot pivot
   * @example
   * ```ts
   * import { THREE, Pose } from "@egjs/view3d";
   *
   * const pose = new Pose(180, 45, 150, [5, -1, 3]);
   * ```
   */
  public constructor(
    yaw: number,
    pitch: number,
    zoom: number,
    pivot: number[] = [0, 0, 0]
  ) {
    this.yaw = yaw;
    this.pitch = pitch;
    this.zoom = zoom;
    this.pivot = new THREE.Vector3().fromArray(pivot);
  }

  /**
   * Clone this pose
   * @returns Cloned pose
   */
  public clone(): Pose {
    return new Pose(
      this.yaw, this.pitch, this.zoom,
      this.pivot.toArray(),
    );
  }
}

export default Pose;
