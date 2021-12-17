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
  private _arUIRoot: THREE.Group;
  private _planeVisualizer: ARPlaneVisualizer;

  public get root() { return this._root; }
  public get modelRoot() { return this._modelRoot; }
  public get arUIRoot() { return this._arUIRoot; }

  public constructor(view3D: View3D) {
    this._root = new THREE.Scene();

    this._modelRoot = new THREE.Group();
    this._arUIRoot = new THREE.Group();
    this._planeVisualizer = new ARPlaneVisualizer();

    const root = this._root;
    const modelRoot = this._modelRoot;
    const arUIRoot = this._arUIRoot;
    const planeVisualizer = this._planeVisualizer;

    // Copy all scene objects into model objects
    const originalScene = view3D.scene;

    [...originalScene.root.children].forEach(child => {
      modelRoot.add(child);
    });

    // Copy environment
    root.environment = originalScene.root.environment?.clone() ?? null;

    root.add(modelRoot);
    root.add(arUIRoot);
    root.add(planeVisualizer.mesh);

    // Start with root hidden, as floor should be detected first
    this.hideModel();
  }

  public destroy(view3D: View3D) {
    const modelRoot = this._modelRoot;
    const originalScene = view3D.scene;

    [...modelRoot.children].forEach(child => {
      originalScene.root.add(child);
    });
  }

  /**
   * Make this scene visible
   * @returns {void}
   */
  public showModel(): void {
    // this._modelRoot.visible = true;
  }

  /**
   * Make this scene invisible
   * @returns {void}
   */
  public hideModel(): void {
    // this._modelRoot.visible = false;
  }

  /**
   * Add AR-exclusive object
   */
  public add(...objects: THREE.Object3D[]) {
    this._arUIRoot.add(...objects);
  }

  public setModelPosition(pos: THREE.Vector3) {
    const modelRoot = this._modelRoot;

    modelRoot.position.copy(pos);
    modelRoot.matrixWorldNeedsUpdate = true;

    this._planeVisualizer.mesh.position.copy(pos);
    this._planeVisualizer.mesh.updateMatrixWorld();
  }

  public setModelScale(scalar: number) {
    const modelRoot = this._modelRoot;

    modelRoot.scale.setScalar(scalar);
    modelRoot.matrixWorldNeedsUpdate = true;
  }

  public setFloorLevel(y: number) {
    const modelRoot = this._modelRoot;

    modelRoot.position.setY(y + DEFAULT.SHADOW_Y_OFFSET);
    modelRoot.matrixWorldNeedsUpdate = true;
  }
}

export default ARScene;
