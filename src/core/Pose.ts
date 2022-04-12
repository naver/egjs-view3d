/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import { circulate } from "../utils";

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

  /**
   * Copy values from the other pose
   * @param {Pose} pose pose to copy
   */
  public copy(pose: Pose) {
    this.yaw = pose.yaw;
    this.pitch = pose.pitch;
    this.zoom = pose.zoom;
    this.pivot.copy(pose.pivot);
  }

  /**
   * Return whether values of this pose is equal to other pose
   * @param {Pose} pose pose to check
   */
  public equals(pose: Pose): boolean {
    const { yaw, pitch, zoom, pivot } = this;

    return circulate(yaw, 0, 360) === circulate(pose.yaw, 0, 360)
      && pitch === pose.pitch
      && zoom === pose.zoom
      && pivot.equals(pose.pivot);
  }
}

export default Pose;
