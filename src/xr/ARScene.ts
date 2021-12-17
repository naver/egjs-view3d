/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";
import * as DEFAULT from "../const/default";

import ARPlaneVisualizer from "./ARPlaneVisualizer";
class ARScene {
  private _root: THREE.Scene;
  private _modelRoot: THREE.Group;
  private _modelMovable: THREE.Group;
  private _modelFixed: THREE.Group;
  private _arRoot: THREE.Group;
  private _planeVisualizer: ARPlaneVisualizer;

  public get root() { return this._root; }
  public get modelMovable() { return this._modelMovable; }
  public get arRoot() { return this._arRoot; }

  public constructor() {
    this._root = new THREE.Scene();

    this._modelRoot = new THREE.Group();
    this._modelMovable = new THREE.Group();
    this._modelFixed = new THREE.Group();
    this._arRoot = new THREE.Group();
    this._planeVisualizer = new ARPlaneVisualizer();

    const root = this._root;
    const modelMovable = this._modelMovable;
    const modelFixed = this._modelFixed;
    const arRoot = this._arRoot;
    const planeVisualizer = this._planeVisualizer;

    root.add(modelMovable, modelFixed, arRoot, planeVisualizer.mesh);

    // Start with root hidden, as floor should be detected first
    this.hideModel();
  }

  public init(view3D: View3D) {
    const root = this._root;
    const modelMovable = this._modelMovable;
    const modelFixed = this._modelFixed;

    // Copy all scene objects into model objects
    const originalScene = view3D.scene;

    modelMovable.add(originalScene.userObjects, originalScene.envObjects);
    modelFixed.add(originalScene.fixedObjects);

    // Copy environment
    root.environment = originalScene.root.environment?.clone() ?? null;
  }

  public destroy(view3D: View3D) {
    const modelMovable = this._modelMovable;
    const modelFixed = this._modelFixed;
    const originalScene = view3D.scene;

    [...modelMovable.children, ...modelFixed.children].forEach(child => {
      originalScene.root.add(child);
    });
  }

  /**
   * Make this scene visible
   * @returns {void}
   */
  public showModel(): void {
    this._modelRoot.visible = true;
  }

  /**
   * Make this scene invisible
   * @returns {void}
   */
  public hideModel(): void {
    this._modelRoot.visible = false;
  }

  /**
   * Add AR-exclusive object
   */
  public add(...objects: THREE.Object3D[]) {
    this._arRoot.add(...objects);
  }

  public setRootPosition(pos: THREE.Vector3) {
    const root = this._root;

    root.position.copy(pos);
  }

  public setModelHovering(hoverAmount: number) {
    const modelMovable = this._modelMovable;

    modelMovable.position.setY(hoverAmount);
  }

  public setModelRotation(quat: THREE.Quaternion) {
    const modelMovable = this._modelMovable;

    modelMovable.quaternion.copy(quat);
  }

  public setModelScale(scalar: number) {
    const modelMovable = this._modelMovable;

    modelMovable.scale.setScalar(scalar);
  }
}

export default ARScene;
