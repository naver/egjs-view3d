/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import Pose from "../core/Pose";
import { Range } from "../type/internal";

import { EASING as EASING_CONST } from "./external";

// View3D Options
export const FORMAT = "auto";

// Animation
export const EASING = EASING_CONST.EASE_OUT_CUBIC;
export const ANIMATION_DURATION = 300;
export const ANIMATION_LOOP = false;
export const ANIMATION_RANGE: Readonly<Range> = {
  min: 0, max: 1
};

// Camera
export const CAMERA_POSE: Readonly<Pose> = new Pose(0, 15, 100, new THREE.Vector3(0, 0, 0));
export const INFINITE_RANGE: Readonly<Range> = {
  min: -Infinity, max: Infinity
};
export const PITCH_RANGE: Readonly<Range> = {
  min: -89.9, max: 89.9
};
export const DISTANCE_RANGE: Readonly<Range> = {
  min: 0, max: 500
};

export const MINIMUM_DISTANCE = 0.0001; // 1mm
export const MAXIMUM_DISTANCE = 500;
export const NULL_ELEMENT: HTMLElement | string | null = null;
export const DRACO_DECODER_URL = "https://www.gstatic.com/draco/v1/decoders/";
