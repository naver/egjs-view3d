/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import View3D from "../View3D";
import Model from "../core/Model";

/**
 * DracoLoader
 * @category Loaders
 */
class DracoLoader {
  private _view3D: View3D;

  public constructor(view3D: View3D) {
    this._view3D = view3D;
  }

  /**
   * Load new DRC model from the given url
   * @param url URL to fetch .drc file
   * @param options Options for a loaded model
   * @returns Promise that resolves {@link Model}
   */
  public load(url: string): Promise<Model> {
    const loader = new DRACOLoader();
    loader.setCrossOrigin("anonymous");
    loader.setDecoderPath(this._view3D.dracoPath);
    loader.manager = new THREE.LoadingManager();

    return new Promise((resolve, reject) => {
      loader.load(url, geometry => {
        const model = this._parseToModel(geometry);
        loader.dispose();
        resolve(model);
      }, undefined, err => {
        loader.dispose();
        reject(err);
      });
    });
  }

  private _parseToModel(geometry: THREE.BufferGeometry, {
    color = 0xffffff,
    point = false,
    pointOptions = {}
  } = {}): Model {
    geometry.computeVertexNormals();

    const material = point
      ? new THREE.PointsMaterial({ color, ...pointOptions })
      : new THREE.MeshStandardMaterial({ color });
    const mesh = point
      ? new THREE.Points(geometry, material)
      : new THREE.Mesh(geometry, material);

    const model = new Model({
      scenes: [mesh]
    });

    return model;
  }
}

export default DracoLoader;
