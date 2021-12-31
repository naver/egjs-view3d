/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";
import TextureLoader from "../loader/TextureLoader";
import { STANDARD_MAPS } from "../const/internal";
import { getObjectOption } from "../utils";

import ShadowPlane from "./ShadowPlane";

/**
 * Scene that View3D will render.
 * All model datas including Mesh, Lights, etc. will be included on this
 */
class Scene {
  private _view3D: View3D;
  private _root: THREE.Scene;
  private _shadowPlane: ShadowPlane;
  private _userObjects: THREE.Group;
  private _envObjects: THREE.Group;
  private _fixedObjects: THREE.Group;

  /**
   * Root {@link https://threejs.org/docs/#api/en/scenes/Scene THREE.Scene} object
   */
  public get root() { return this._root; }

  /**
   * Shadow plane & light
   * @type {ShadowPlane}
   */
  public get shadowPlane() { return this._shadowPlane; }

  /**
   * Group that contains volatile user objects
   */
  public get userObjects() { return this._userObjects; }

  /**
   * Group that contains non-volatile user objects
   */
  public get envObjects() { return this._envObjects; }

  /**
   * Group that contains objects that View3D manages
   */
  public get fixedObjects() { return this._fixedObjects; }

  /**
   * Create new Scene instance
   */
  public constructor(view3D: View3D) {
    this._view3D = view3D;
    this._root = new THREE.Scene();
    this._userObjects = new THREE.Group();
    this._envObjects = new THREE.Group();
    this._fixedObjects = new THREE.Group();
    this._shadowPlane = new ShadowPlane(view3D, getObjectOption(view3D.shadow));

    const root = this._root;
    const userObjects = this._userObjects;
    const envObjects = this._envObjects;
    const fixedObjects = this._fixedObjects;
    const shadowPlane = this._shadowPlane;

    userObjects.name = "userObjects";
    envObjects.name = "envObjects";
    fixedObjects.name = "fixedObjects";

    root.add(userObjects, envObjects, fixedObjects);

    if (view3D.shadow) {
      fixedObjects.add(shadowPlane.mesh, shadowPlane.light);
    }
  }

  /**
   * Reset scene to initial state
   * @param {object} options Options
   * @param {boolean} [options.volatileOnly=true] Remove only volatile objects
   * @returns {void}
   */
  public reset({
    volatileOnly = true
  } = {}): void {
    this._removeChildsOf(this._userObjects);

    if (!volatileOnly) {
      this._removeChildsOf(this._envObjects);
    }
  }

  /**
   * Add new Three.js {@link https://threejs.org/docs/#api/en/core/Object3D Object3D} into the scene
   * @param object {@link https://threejs.org/docs/#api/en/core/Object3D THREE.Object3D}s to add
   * @param volatile If set to true, objects will be removed after displaying another 3D model
   * @returns {void}
   */
  public add(object: THREE.Object3D | THREE.Object3D[], volatile: boolean = true): void {
    const objRoot = volatile
      ? this._userObjects
      : this._envObjects;

    const objects = Array.isArray(object) ? object : [object];

    objRoot.add(...objects);
  }

  /**
   * Remove Three.js {@link https://threejs.org/docs/#api/en/core/Object3D Object3D} into the scene
   * @param object {@link https://threejs.org/docs/#api/en/core/Object3D THREE.Object3D}s to add
   * @returns {void}
   */
  public remove(object: THREE.Object3D | THREE.Object3D[]): void {
    const objects = Array.isArray(object) ? object : [object];

    this._root.remove(...objects);
  }

  /**
   * Set background of the scene.
   * @param background A color / image url to set as background
   * @returns {Promise<void>}
   */
  public async setBackground(background: number | string): Promise<void> {
    const root = this._root;

    if (typeof background === "number" || background.charAt(0) === "#") {
      root.background = new THREE.Color(background);
    } else {
      const textureLoader = new TextureLoader(this._view3D.renderer);
      const texture = await textureLoader.load(background);

      texture.encoding = THREE.sRGBEncoding;

      root.background = texture;
    }
  }

  /**
   * Set scene's skybox, which both affects background & envmap
   * @param url An URL to equirectangular image
   * @returns {Promise<void>}
   */
  public async setSkybox(url: string | null): Promise<void> {
    const root = this._root;

    if (url) {
      const textureLoader = new TextureLoader(this._view3D.renderer);
      const renderTarget = await textureLoader.loadHDRTexture(url);

      root.background = renderTarget.texture;
      root.environment = renderTarget.texture;
    } else {
      root.background = null;
      root.environment = null;
    }
  }

  /**
   * Set scene's environment map that affects all physical materials in the scene
   * @param url An URL to equirectangular image
   * @returns {void}
   */
  public async setEnvMap(url: string | null): Promise<void> {
    if (url) {
      const textureLoader = new TextureLoader(this._view3D.renderer);
      const renderTarget = await textureLoader.loadHDRTexture(url);

      this._root.environment = renderTarget.texture;
    } else {
      this._root.environment = null;
    }
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
