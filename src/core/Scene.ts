/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import Model from "./Model";
import Environment from "~/environments/Environment";
import { STANDARD_MAPS } from "~/consts/internal";
import { findIndex } from "~/utils";

/**
 * Scene that View3D will render.
 * All model datas including Mesh, Lights, etc. will be included on this
 * @category Core
 */
class Scene {
  private _root: THREE.Scene;
  private _userObjects: THREE.Group;
  private _envObjects: THREE.Group;
  private _envs: Environment[];

  /**
   * Root {@link https://threejs.org/docs/#api/en/scenes/Scene THREE.Scene} object
   */
  public get root() { return this._root; }

  /**
   * {@link Environment}s inside scene
   */
  public get environments() { return this._envs; }

  /**
   * Return the visibility of the root scene
   */
  public get visible() { return this._root.visible; }

  /**
   * Create new Scene instance
   */
  constructor() {
    this._root = new THREE.Scene();
    this._userObjects = new THREE.Group();
    this._envObjects = new THREE.Group();
    this._envs = [];

    const root = this._root;
    const userObjects = this._userObjects;
    const envObjects = this._envObjects;

    userObjects.name = "userObjects";
    envObjects.name = "envObjects";

    root.add(userObjects);
    root.add(envObjects);
  }

  /**
   * Update scene to fit the given model
   * @param model model to fit
   * @param override options for specific environments
   */
  public update(model: Model, override?: any): void {
    this._envs.forEach(env => env.fit(model, override));
  }

  /**
   * Reset scene to initial state
   * @returns {void} Nothing
   */
  public reset(): void {
    this.resetModel();
    this.resetEnv();
  }

  /**
   * Fully remove all objects that added by calling {@link Scene#add add()}
   * @returns {void} Nothing
   */
  public resetModel(): void {
    this._removeChildsOf(this._userObjects);
  }

  /**
   * Remove all objects that added by calling {@link Scene#addEnv addEnv()}
   * This will also reset scene background & envmap
   * @returns {void} Nothing
   */
  public resetEnv(): void {
    this._removeChildsOf(this._envObjects);
    this._envs = [];

    this._root.background = null;
    this._root.environment = null;
  }

  /**
   * Add new Three.js {@link https://threejs.org/docs/#api/en/core/Object3D Object3D} into the scene
   * @param object {@link https://threejs.org/docs/#api/en/core/Object3D THREE.Object3D}s to add
   * @returns {void} Nothing
   */
  public add(...object: THREE.Object3D[]): void {
    this._userObjects.add(...object);
  }

  /**
   * Add new {@link Environment} or Three.js {@link https://threejs.org/docs/#api/en/core/Object3D Object3D}s to the scene, which won't be removed after displaying another 3D model
   * @param envs {@link Environment} | {@link https://threejs.org/docs/#api/en/core/Object3D THREE.Object3D}s to add
   * @returns {void} Nothing
   */
  public addEnv(...envs: Array<Environment | THREE.Object3D>): void {
    envs.forEach(env => {
      if ((env as THREE.Object3D).isObject3D) {
        this._envObjects.add(env as THREE.Object3D);
      } else {
        this._envs.push(env as Environment);
        this._envObjects.add(...(env as Environment).objects);
      }
    });
  }

  /**
   * Remove Three.js {@link https://threejs.org/docs/#api/en/core/Object3D Object3D} into the scene
   * @param object {@link https://threejs.org/docs/#api/en/core/Object3D THREE.Object3D}s to add
   * @returns {void} Nothing
   */
  public remove(...object: THREE.Object3D[]): void {
    this._userObjects.remove(...object);
  }

  /**
   * Remove {@link Environment} or Three.js {@link https://threejs.org/docs/#api/en/core/Object3D Object3D}s to the scene, which won't be removed after displaying another 3D model
   * @param envs {@link Environment} | {@link https://threejs.org/docs/#api/en/core/Object3D THREE.Object3D}s to add
   * @returns {void} Nothing
   */
  public removeEnv(...envs: Array<Environment | THREE.Object3D>): void {
    envs.forEach(env => {
      if ((env as THREE.Object3D).isObject3D) {
        this._envObjects.remove(env as THREE.Object3D);
      } else {
        const envIndex = findIndex(env as Environment, this._envs);
        if (envIndex > -1) {
          this._envs.splice(envIndex, 1);
        }
        this._envObjects.remove(...(env as Environment).objects);
      }
    });
  }

  /**
   * Set background of the scene.
   * @see {@link https://threejs.org/docs/#api/en/scenes/Scene.background THREE.Scene.background}
   * @param background A texture to set as background
   * @returns {void} Nothing
   */
  public setBackground(background: THREE.Color | THREE.Texture | THREE.CubeTexture | THREE.WebGLCubeRenderTarget | null): void {
    // Three.js's type definition does not include WebGLCubeRenderTarget, but it works and defined on their document
    // See https://threejs.org/docs/#api/en/scenes/Scene.background
    this._root.background = background as THREE.Texture | null;
  }

  /**
   * Set scene's environment map that affects all physical materials in the scene
   * @see {@link https://threejs.org/docs/#api/en/scenes/Scene.environment THREE.Scene.environment}
   * @param envmap A texture to set as environment map
   * @returns {void} Nothing
   */
  public setEnvMap(envmap: THREE.Texture | THREE.CubeTexture | THREE.WebGLCubeRenderTarget | null): void {
    // Next line written to silence Three.js's warning
    const environment = (envmap as THREE.WebGLCubeRenderTarget).texture ? (envmap as THREE.WebGLCubeRenderTarget).texture : envmap;
    this._root.environment = environment as THREE.Texture | null;
  }

  /**
   * Make this scene visible
   * @returns {void} Nothing
   */
  public show(): void {
    this._root.visible = true;
  }

  /**
   * Make this scene invisible
   * @returns {void} Nothing
   */
  public hide(): void {
    this._root.visible = false;
  }

  private _removeChildsOf(obj: THREE.Object3D) {
    obj.traverse(child => {
      if ((child as any).isMesh) {
        const mesh = child as THREE.Mesh;

        // Release geometry & material memory
        mesh.geometry.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        materials.forEach(mat => {
          STANDARD_MAPS.forEach(map => {
            if (mat[map]) {
              mat[map].dispose();
            }
          });
        });
      }
    });

    while (obj.children.length > 0) {
      obj.remove(obj.children[0]);
    }
  }
}

export default Scene;
