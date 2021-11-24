/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

/**
 * Data class of camera's pose
 */
class Pose {
  /**
   * Create new instance of pose
   * @param yaw yaw
   * @param pitch pitch
   * @param distance distance
   * @param pivot pivot
   * @see https://threejs.org/docs/#api/en/math/Vector3
   * @example
   * import { THREE, Pose } from "@egjs/view3d";
   *
   * const pose = new Pose(180, 45, 150, new THREE.Vector3(5, -1, 3));
   */
  public constructor(
    public yaw: number,
    public pitch: number,
    public distance: number,
    public pivot: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
  ) {}

  /**
   * Clone this pose
   * @returns Cloned pose
   */
  public clone(): Pose {
    return new Pose(
      this.yaw, this.pitch, this.distance,
      this.pivot.clone(),
    );
  }
}

export default Pose;
