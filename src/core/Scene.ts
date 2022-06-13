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
import Skybox from "./Skybox";

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
   * @readonly
   */
  public get root() { return this._root; }

  /**
   * Shadow plane & light
   * @type {ShadowPlane}
   * @readonly
   */
  public get shadowPlane() { return this._shadowPlane; }

  /**
   * Group that contains volatile user objects
   * @readonly
   */
  public get userObjects() { return this._userObjects; }

  /**
   * Group that contains non-volatile user objects
   * @readonly
   */
  public get envObjects() { return this._envObjects; }

  /**
   * Group that contains objects that View3D manages
   * @readonly
   */
  public get fixedObjects() { return this._fixedObjects; }

  /**
   * Create new Scene instance
   * @param {View3D} view3D An instance of View3D
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
      fixedObjects.add(shadowPlane.root);
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

    this._userObjects.remove(...objects);
    this._envObjects.remove(...objects);
  }

  /**
   * Set background of the scene.
   * @param background A color / image url to set as background
   * @returns {Promise<void>}
   */
  public async setBackground(background: number | string): Promise<void> {
    const view3D = this._view3D;
    const root = this._root;

    if (typeof background === "number" || background.charAt(0) === "#") {
      root.background = new THREE.Color(background);
    } else {
      const textureLoader = new TextureLoader(view3D);
      const texture = await textureLoader.load(background);

      texture.encoding = THREE.sRGBEncoding;
      root.background = texture;
    }

    view3D.renderer.renderSingleFrame();
  }

  /**
   * Set scene's skybox, which both affects background & envmap
   * @param url An URL to equirectangular image
   * @returns {Promise<void>}
   */
  public async setSkybox(url: string | null): Promise<void> {
    const root = this._root;
    const view3D = this._view3D;

    // Destroy previous skybox
    if (root.background && (root.background as THREE.Texture).isTexture) {
      (root.background as THREE.Texture).dispose();
    }

    if (url) {
      const textureLoader = new TextureLoader(view3D);
      const texture = await textureLoader.loadHDRTexture(url);

      if (view3D.skyboxBlur) {
        root.background = Skybox.createBlurredHDR(view3D, texture);
      } else {
        root.background = texture;
      }

      root.environment = texture;
    } else {
      root.background = null;
      root.environment = null;
    }

    view3D.renderer.renderSingleFrame();
  }

  /**
   * Set scene's environment map that affects all physical materials in the scene
   * @param url An URL to equirectangular image
   * @returns {void}
   */
  public async setEnvMap(url: string | null): Promise<void> {
    const view3D = this._view3D;
    const root = this._root;

    if (url) {
      const textureLoader = new TextureLoader(view3D);
      const texture = await textureLoader.loadHDRTexture(url);

      root.environment = texture;
    } else {
      root.environment = null;
    }

    view3D.renderer.renderSingleFrame();
  }

  /**
   * @internal
   */
  public initTextures() {
    const {
      skybox,
      envmap,
      background,
      useDefaultEnv
    } = this._view3D;
    const tasks: Array<Promise<any>> = [];

    if (useDefaultEnv) {
      this.setDefaultEnv();
    }

    const hasEnvmap = skybox || envmap;
    if (hasEnvmap) {
      const loadEnv = skybox
        ? this.setSkybox(skybox)
        : this.setEnvMap(envmap);

      tasks.push(loadEnv);
    }

    if (!skybox && background) {
      tasks.push(this.setBackground(background));
    }

    return tasks;
  }

  /**
   * @internal
   */
  public setDefaultEnv() {
    const renderer = this._view3D.renderer;
    const defaultEnv = Skybox.createDefaultEnv(renderer.threeRenderer);
    this._root.environment = defaultEnv;
  }

  private _removeChildsOf(obj: THREE.Object3D) {
    obj.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
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
