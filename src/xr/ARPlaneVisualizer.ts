/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

class ARPlaneVisualizer{
  private _geometry: THREE.PlaneGeometry;
  private _material: THREE.ShadowMaterial;
  private _mesh: THREE.Mesh;

  public get mesh() { return this._mesh; }

  public constructor() {
    this._geometry = new THREE.PlaneBufferGeometry(1, 1);
    this._material = new THREE.MeshBasicMaterial({ transparent: true, color: 0xffff00, opacity: 0.3 });

    this._geometry.rotateX(-Math.PI / 2);

    this._mesh = new THREE.Mesh(this._geometry, this._material);
  }
}

export default ARPlaneVisualizer;
