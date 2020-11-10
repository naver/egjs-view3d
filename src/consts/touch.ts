/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

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
