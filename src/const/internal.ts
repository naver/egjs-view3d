/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

// Constants that used internally

// Texture map names that used in THREE#MeshStandardMaterial
export const STANDARD_MAPS = [
  "alphaMap",
  "aoMap",
  "bumpMap",
  "displacementMap",
  "emissiveMap",
  "envMap",
  "lightMap",
  "map",
  "metalnessMap",
  "normalMap",
  "roughnessMap"
];

export const CONTROL_EVENTS = {
  HOLD: "hold",
  RELEASE: "release",
  ENABLE: "enable",
  DISABLE: "disable"
} as const;

export enum GESTURE {
  NONE = 0,
  ONE_FINGER_HORIZONTAL = 1,
  ONE_FINGER_VERTICAL = 2,
  ONE_FINGER = 1 | 2,
  TWO_FINGER_HORIZONTAL = 4,
  TWO_FINGER_VERTICAL = 8,
  TWO_FINGER = 4 | 8,
  PINCH = 16,
}