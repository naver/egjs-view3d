/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/* Types / Interfaces that is needed to be exported to users */

/**
 * Literally, type that can be any function
 */
export type AnyFunction = (...args: any[]) => any;

/**
 * Literally, type that can be any object
 */
export interface AnyObject {
  [key: string]: any;
}

/**
 * Loading option for the model
 * @interface
 * @category Loaders
 * @property {boolean} fixSkinnedBbox Whether to apply inference from skeleton when calculating bounding box
 * This can fix some models with skinned mesh when it has wrong bounding box
 */
export interface ModelLoadOption {
  fixSkinnedBbox: boolean;
}
