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
