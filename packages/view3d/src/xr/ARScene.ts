/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";
import Model from "../core/Model";

/**
 * A dedicated scene for WebXR-based AR session
 */
class ARScene {
  private _root: THREE.Scene;
  private _modelRoot: THREE.Group;
  private _modelMovable: THREE.Group;
  private _modelFixed: THREE.Group;
  private _arRoot: THREE.Group;

  public get root() { return this._root; }
  public get modelRoot() { return this._modelRoot; }
  public get modelMovable() { return this._modelMovable; }
  public get arRoot() { return this._arRoot; }

  /** */
  public constructor() {
    this._root = new THREE.Scene();

    this._modelRoot = new THREE.Group();
    this._modelMovable = new THREE.Group();
    this._modelFixed = new THREE.Group();
    this._arRoot = new THREE.Group();

    const root = this._root;
    const modelRoot = this._modelRoot;
    const modelMovable = this._modelMovable;
    const modelFixed = this._modelFixed;
    const arRoot = this._arRoot;

    modelRoot.add(modelMovable);

    root.add(modelRoot, modelFixed, arRoot);
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
    root.environment = originalScene.root.environment;

    // Start with root hidden, as floor should be detected first
    this.hideModel();
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

  /**
   * Remove objects from scene
   */
  public remove(...objects: THREE.Object3D[]) {
    this._arRoot.remove(...objects);
  }

  public setRootPosition(pos: THREE.Vector3) {
    const root = this._root;

    root.position.copy(pos);
  }

  public setWallRotation(quat: THREE.Quaternion) {
    const root = this._root;

    root.quaternion.copy(quat);
  }

  public updateModelRootPosition(model: Model, vertical: boolean) {
    const modelRoot = this._modelRoot;

    if (!vertical) return;

    const modelHeight = model.bbox.max.y - model.bbox.min.y;

    modelRoot.position.setZ(modelHeight / 2);
    modelRoot.position.setY(-model.bbox.min.z);
    modelRoot.rotateX(-Math.PI / 2);
    modelRoot.updateMatrix();
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
    const root = this._root;

    root.scale.setScalar(scalar);
  }
}

export default ARScene;
