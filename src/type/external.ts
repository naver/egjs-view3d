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

/**
 * Loading option for the .drc model
 * @interface
 * @category Loaders
 * @extends ModelLoadOption
 * @property {string|number} color Color of the loaded model's mesh / points
 * @property {boolean} point Whether to use Three.js's PointsMaterial & Points
 * @property {object} pointOptions An options object for {@link https://threejs.org/docs/#api/en/materials/PointsMaterial THREE.PointsMaterialParameters}
 */
export interface DracoLoadOption extends ModelLoadOption {
  color: string | number;
  point: boolean;
  pointOptions: THREE.PointsMaterialParameters;
}
