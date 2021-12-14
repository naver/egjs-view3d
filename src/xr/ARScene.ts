/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";

class ARScene {
  private _root: THREE.Scene;
  private _modelObjects: THREE.Group;
  private _arObjects: THREE.Group;

  public get root() { return this._root; }

  public constructor(view3D: View3D) {
    this._root = new THREE.Scene();

    this._modelObjects = new THREE.Group();
    this._arObjects = new THREE.Group();

    const root = this._root;
    const modelObjects = this._modelObjects;
    const arObjects = this._arObjects;

    // Copy all scene objects into model objects
    const modelScene = view3D.scene;

    modelScene.root.children.forEach(child => {
      this._modelObjects.add(child);
    });

    // Copy environment
    this._root.environment = modelScene.root.environment?.clone() ?? null;

    root.add(modelObjects);
    root.add(arObjects);

    // Start with root hidden, as floor should be detected first
    this.hide();
  }

  public destroy(view3D: View3D) {
    const modelScene = view3D.scene;

    this._modelObjects.children.forEach(child => {
      modelScene.root.add(child);
    });
  }

  /**
   * Make this scene visible
   * @returns {void}
   */
  public show(): void {
    this._root.visible = true;
  }

  /**
   * Make this scene invisible
   * @returns {void}
   */
  public hide(): void {
    this._root.visible = false;
  }

  /**
   * Add AR-exclusive object
   */
  public add(...objects: THREE.Object3D[]) {
    this._arObjects.add(...objects);
  }
}

export default ARScene;
