/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import Environment from "./Environment";
import Model from "~/core/Model";
import { getBoxPoints } from "~/utils";

/**
 * THREE.DirectionalLight wrapper that will automatically update its shadow size to model
 * Shadow is enabled by default, use {@link AutoDirectionalLight#disableShadow disableShadow} to disable it
 * @category Environment
 */
class AutoDirectionalLight implements Environment {
  private _light: THREE.DirectionalLight;
  private _direction: THREE.Vector3; // Direction to light, from (0, 0, 0)

  /**
   * Array of lights that used in this preset
   * @see https://threejs.org/docs/#api/en/lights/Light
   */
  public get objects(): THREE.Object3D[] {
    return [this._light, this._light.target];
  }

  /**
   * The actual THREE.DirectionalLight
   * @type THREE#DirectionalLight
   * @see https://threejs.org/docs/#api/en/lights/DirectionalLight
   */
  public get light() { return this._light; }

  /**
   * Position of the light
   * @type THREE#Vector3
   * @see https://threejs.org/docs/#api/en/math/Vector3
   */
  public get position() { return this._light.position; }

  public get direction() { return this._direction; }

  /**
   * Create new instance of AutoDirectionalLight
   * @param [color="#ffffff"] Color of the light
   * @param [intensity=1] Intensity of the light
   * @param {object} [options={}] Additional options
   * @param {THREE.Vector3} [options.direction=new THREE.Vector3(-1, -1, -1)] Direction of the light
   */
  constructor(color: string | number | THREE.Color = "#ffffff", intensity: number = 1, {
    direction = new THREE.Vector3(-1, -1, -1),
  } = {}) {
    this._light = new THREE.DirectionalLight(color, intensity);

    // Set the default position ratio of the directional light
    const light = this._light;
    light.castShadow = true; // Is enabled by default
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.matrixAutoUpdate = false;

    this._direction = direction.clone().normalize();
  }

  /**
   * Make light cast a shadow
   */
  public enableShadow() {
    this._light.castShadow = true;
  }

  /**
   * Make light don't cast a shadow
   */
  public disableShadow() {
    this._light.castShadow = false;
  }

  /**
   * Modify light's position & shadow camera size from model's bounding box
   * @param model Model to fit size
   * @param scale Scale factor for shadow camera size
   */
  public fit(model: Model, {
    scale = 1.5,
  } = {}) {
    const bbox = model.bbox;
    const light = this._light;
    const direction = this._direction;
    const boxSize = bbox.getSize(new THREE.Vector3()).length();
    const boxCenter = bbox.getCenter(new THREE.Vector3());

    // Position fitting
    const newPos = new THREE.Vector3().addVectors(boxCenter, direction.clone().negate().multiplyScalar(boxSize * 0.5));
    light.position.copy(newPos);
    light.target.position.copy(boxCenter);
    light.updateMatrix();

    // Shadowcam fitting
    const shadowCam = light.shadow.camera;
    shadowCam.near = 0;
    shadowCam.far = 2 * boxSize;
    shadowCam.position.copy(newPos);
    shadowCam.lookAt(boxCenter);

    shadowCam.left = -1;
    shadowCam.right = 1;
    shadowCam.top = 1;
    shadowCam.bottom = -1;

    shadowCam.updateMatrixWorld();
    shadowCam.updateProjectionMatrix();

    const bboxPoints = getBoxPoints(bbox);
    const projectedPoints = bboxPoints.map(position => position.project(shadowCam));
    const screenBbox = new THREE.Box3().setFromPoints(projectedPoints);

    shadowCam.left *= -scale * screenBbox.min.x;
    shadowCam.right *= scale * screenBbox.max.x;
    shadowCam.top *= scale * screenBbox.max.y;
    shadowCam.bottom *= -scale * screenBbox.min.y;

    shadowCam.updateProjectionMatrix();
  }
}

export default AutoDirectionalLight;
