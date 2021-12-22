/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import Pose from "../core/Pose";
import { Range } from "../type/utils";

import { AR_SESSION_TYPE, EASING as EASING_CONST } from "./external";

// Animation
export const EASING = EASING_CONST.EASE_OUT_CUBIC;
export const ANIMATION_DURATION = 300;
export const ANIMATION_LOOP = false;
export const ANIMATION_RANGE: Readonly<Range> = {
  min: 0, max: 1
};

// Camera
export const FOV = 45;
export const CAMERA_POSE: Readonly<Pose> = new Pose(0, 15, 0, [0, 0, 0]);
export const INFINITE_RANGE: Readonly<Range> = {
  min: -Infinity, max: Infinity
};
export const PITCH_RANGE: Readonly<Range> = {
  min: -89.9, max: 89.9
};

export const SHADOW_Y_OFFSET = -0.001;

export const AR_OVERLAY_CLASS = "view3d-ar-overlay";
export const DRACO_DECODER_URL = "https://www.gstatic.com/draco/v1/decoders/";
export const KTX_TRANSCODER_URL = "https://unpkg.com/three@0.134.x/examples/js/libs/basis/";

export const AR_PRIORITY = [
  AR_SESSION_TYPE.WEBXR,
  AR_SESSION_TYPE.SCENE_VIEWER,
  AR_SESSION_TYPE.QUICK_LOOK
];
