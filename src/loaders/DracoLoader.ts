/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import Model from "../core/Model";
import * as DEFAULT from "../const/default";
import { DracoLoadOption } from "../type/external";

/**
 * DracoLoader
 */
class DracoLoader {
  /**
   * Load new DRC model from the given url
   * @param url URL to fetch .drc file
   * @param options Options for a loaded model
   * @returns Promise that resolves {@link Model}
   */
  public load(url: string, options: Partial<DracoLoadOption> = {}): Promise<Model> {
    const loader = new DRACOLoader();
    loader.setCrossOrigin("anonymous");
    loader.setDecoderPath(DEFAULT.DRACO_DECODER_URL);
    loader.manager = new THREE.LoadingManager();

    return new Promise((resolve, reject) => {
      loader.load(url, geometry => {
        const model = this._parseToModel(geometry, options);
        loader.dispose();
        resolve(model);
      }, undefined, err => {
        loader.dispose();
        reject(err);
      });
    });
  }

  private _parseToModel(geometry: THREE.BufferGeometry, {
    fixSkinnedBbox = false,
    color = 0xffffff,
    point = false,
    pointOptions = {}
  }: Partial<DracoLoadOption> = {}): Model {
    geometry.computeVertexNormals();

    const material = point
      ? new THREE.PointsMaterial({ color, ...pointOptions })
      : new THREE.MeshStandardMaterial({ color });
    const mesh = point
      ? new THREE.Points(geometry, material)
      : new THREE.Mesh(geometry, material);

    const model = new Model({
      scenes: [mesh],
      fixSkinnedBbox
    });

    return model;
  }
}

export default DracoLoader;
