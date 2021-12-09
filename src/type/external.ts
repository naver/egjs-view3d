/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/* Types / Interfaces that is needed to be exported to users */

/**
 * Literally, type that can be any function
 * @typedef
 */
export type AnyFunction = (...args: any[]) => any;

/**
 * Literally, type that can be any object
 * @interface
 */
export interface AnyObject {
  [key: string]: any;
}
