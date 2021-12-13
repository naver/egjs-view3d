/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
export type ValueOf<T> = T[keyof T];
export type LiteralUnion<T extends U, U = string> = T | (Pick<U, never> & {_?: never});
export type NoBoolean<T> = T extends boolean ? never : T;

export type OptionGetters<T> = {
  [key in keyof T]: T[key]
};


export interface Range {
  min: number;
  max: number;
}

export interface ControlEvents {
  hold: void;
  release: void;
  enable: void;
  disable: void;
}
