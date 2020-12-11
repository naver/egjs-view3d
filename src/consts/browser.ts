/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

// Browser related constants

export const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

export const IS_ANDROID = /android/i.test(navigator.userAgent);

export const IS_SAFARI = /safari/i.test(navigator.userAgent);
