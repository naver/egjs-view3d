/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import * as DEFAULT from "../../const/default";
import shaderVS from "../../shader/ar-plane-visualizer.vs";
import shaderFS from "../../shader/ar-plane-visualizer.fs";

class PlaneVisualizer{
  private _geometry: THREE.PlaneGeometry;
  private _material: THREE.RawShaderMaterial;
  private _mesh: THREE.Mesh;

  public get mesh() { return this._mesh; }

  public constructor() {
    this._geometry = new THREE.PlaneBufferGeometry(1, 1);
    this._material = new THREE.RawShaderMaterial({
      vertexShader: shaderVS,
      fragmentShader: shaderFS,
      transparent: true
    });

    this._geometry.rotateX(-Math.PI / 2);
    this._geometry.translate(0, DEFAULT.SHADOW_Y_OFFSET, 0);

    this._mesh = new THREE.Mesh(this._geometry, this._material);

    this.hide();
  }

  public show() {
    this._mesh.visible = true;
  }

  public hide() {
    this._mesh.visible = false;
  }
}

export default PlaneVisualizer;
