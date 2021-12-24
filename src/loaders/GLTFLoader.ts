/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import { GLTFLoader as ThreeGLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

import View3D from "../View3D";
import Model from "../core/Model";
import { EVENTS } from "../const/external";

const dracoLoader = new DRACOLoader();
const ktx2Loader = new KTX2Loader();

/**
 * GLTFLoader
 */
class GLTFLoader {
  private _view3D: View3D;
  private _loader: ThreeGLTFLoader;

  public get loader() { return this._loader; }
  public get dracoLoader() { return dracoLoader; }
  public get ktx2Loader() { return ktx2Loader; }

  /**
   * Create a new instance of GLTFLoader
   */
  public constructor(view3D: View3D) {
    this._view3D = view3D;
    this._loader = new ThreeGLTFLoader();

    const loader = this._loader;

    loader.setCrossOrigin("anonymous");
    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(ktx2Loader.detectSupport(view3D.renderer.threeRenderer));
    loader.setMeshoptDecoder(MeshoptDecoder);
  }

  /**
   * Load new GLTF model from the given url
   * @param url URL to fetch glTF/glb file
   * @returns Promise that resolves {@link Model}
   */
  public load(url: string): Promise<Model> {
    const view3D = this._view3D;
    const loader = this._loader;

    loader.manager = new THREE.LoadingManager();
    dracoLoader.setDecoderPath(view3D.dracoPath);
    ktx2Loader.setTranscoderPath(view3D.ktxPath);

    return new Promise((resolve, reject) => {
      loader.load(url, gltf => {
        const model = this._parseToModel(gltf, url);
        resolve(model);
      }, evt => {
        view3D.trigger(EVENTS.PROGRESS, { ...evt, target: view3D });
      }, err => {
        reject(err);
      });
    });
  }

  /**
   * Load new GLTF model from the given files
   * @param files Files that has glTF/glb and all its associated resources like textures and .bin data files
   * @returns Promise that resolves {@link Model}
   */
  public loadFromFiles(files: File[]): Promise<Model> {
    const objectURLs: string[] = [];
    const revokeURLs = () => {
      objectURLs.forEach(url => {
        URL.revokeObjectURL(url);
      });
    };

    return new Promise((resolve, reject) => {
      if (files.length <= 0) {
        reject(new Error("No files found"));
        return;
      }

      const gltfFile = files.find(file => /\.(gltf|glb)$/i.test(file.name));
      if (!gltfFile) {
        reject(new Error("No glTF file found"));
        return;
      }

      const filesMap = new Map<string, File>();
      files.forEach(file => {
        filesMap.set(file.name, file);
      });

      const gltfURL = URL.createObjectURL(gltfFile);

      objectURLs.push(gltfURL);

      const manager = new THREE.LoadingManager();
      manager.setURLModifier(fileURL => {
        const fileNameResult = /[^\/|\\]+$/.exec(fileURL);
        const fileName = (fileNameResult && fileNameResult[0]) || "";

        if (filesMap.has(fileName)) {
          const blob = filesMap.get(fileName)!;
          const blobURL = URL.createObjectURL(blob);
          objectURLs.push(blobURL);

          return blobURL;
        }

        return fileURL;
      });

      const loader = this._loader;
      loader.manager = manager;
      loader.load(gltfURL, gltf => {
        const model = this._parseToModel(gltf, gltfURL);
        resolve(model);
        revokeURLs();
      }, undefined, err => {
        reject(err);
        revokeURLs();
      });
    });
  }

  private _parseToModel(gltf: GLTF, src: string): Model {
    const fixSkinnedBbox = this._view3D.fixSkinnedBbox;

    const model = new Model({
      src,
      scenes: gltf.scenes,
      animations: gltf.animations,
      fixSkinnedBbox
    });

    return model;
  }
}

export default GLTFLoader;
