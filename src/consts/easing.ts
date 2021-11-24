/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/**
 * Collection of easing functions
 * @namespace EASING
 * @example
 * import View3D, { RotateControl, EASING } from "@egjs/view3d";
 *
 * new RotateControl({
 *  easing: EASING.EASE_OUT_CUBIC,
 * });
 */

/**
 * @memberof EASING
 * @name SINE_WAVE
 */
export const SINE_WAVE = (x: number) => Math.sin(x * Math.PI * 2);
/**
 * @memberof EASING
 * @name EASE_OUT_CUBIC
 */
export const EASE_OUT_CUBIC = (x: number) => 1 - Math.pow(1 - x, 3);
/**
 * @memberof EASING
 * @name EASE_OUT_BOUNCE
 */
export const EASE_OUT_BOUNCE = (x: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
};
