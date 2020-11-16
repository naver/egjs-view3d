/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import Model from "~/core/Model";

/**
 * Interface of the environmental objects used by View3D
 * @interface
 * @category Environment
 * @property {Array} objects Actual {@link https://threejs.org/docs/#api/en/core/Object3D THREE.Object3D}s used in this environment.
 * @property {function} fit Fit environment to the given model.
 */
interface Environment {
  objects: THREE.Object3D[];
  fit(model: Model, override?: any): any;
}

export default Environment;
