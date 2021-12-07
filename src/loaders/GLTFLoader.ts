/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import { GLTFLoader as ThreeGLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import View3D from "../View3D";
import Model from "../core/Model";
import { EVENTS } from "../const/external";
import * as DEFAULT from "../const/default";
import { ModelLoadOption } from "../type/external";

/**
 * GLTFLoader
 */
class GLTFLoader {
  private _loader: ThreeGLTFLoader;
  private _dracoLoader: DRACOLoader;

  public get loader() { return this._loader; }
  public get dracoLoader() { return this._dracoLoader; }

  /**
   * Create a new instance of GLTFLoader
   */
  public constructor() {
    this._loader = new ThreeGLTFLoader();
    this._dracoLoader = new DRACOLoader();

    const loader = this._loader;
    loader.setCrossOrigin("anonymous");

    const dracoLoader = this._dracoLoader;
    dracoLoader.setDecoderPath(DEFAULT.DRACO_DECODER_URL);
    loader.setDRACOLoader(dracoLoader);
  }

  /**
   * Load new GLTF model from the given url
   * @param url URL to fetch glTF/glb file
   * @param options Options for a loaded model
   * @returns Promise that resolves {@link Model}
   */
  public load(view3D: View3D, url: string, options: Partial<ModelLoadOption> = {}): Promise<Model> {
    const loader = this._loader;
    loader.manager = new THREE.LoadingManager();

    return new Promise((resolve, reject) => {
      loader.load(url, gltf => {
        const model = this._parseToModel(gltf, options);
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
   * @param options Options for a loaded model
   * @returns Promise that resolves {@link Model}
   */
  public loadFromFiles(files: File[], options: Partial<ModelLoadOption> = {}): Promise<Model> {
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
          const blob = filesMap.get(fileName);
          const blobURL = URL.createObjectURL(blob);
          objectURLs.push(blobURL);

          return blobURL;
        }

        return fileURL;
      });

      const loader = this._loader;
      loader.manager = manager;
      loader.load(gltfURL, gltf => {
        const model = this._parseToModel(gltf, options);
        resolve(model);
        revokeURLs();
      }, undefined, err => {
        reject(err);
        revokeURLs();
      });
    });
  }

  /**
   * Parse from array buffer
   * @param data glTF asset to parse, as an ArrayBuffer or JSON string.
   * @param path The base path from which to find subsequent glTF resources such as textures and .bin data files.
   * @param options Options for a loaded model
   * @returns Promise that resolves {@link Model}
   */
  public parse(data: ArrayBuffer, path: string, options: Partial<ModelLoadOption> = {}): Promise<Model> {
    const loader = this._loader;
    loader.manager = new THREE.LoadingManager();

    return new Promise((resolve, reject) => {
      loader.parse(data, path, gltf => {
        const model = this._parseToModel(gltf, options);
        resolve(model);
      }, err => {
        reject(err);
      });
    });
  }

  private _parseToModel(gltf: GLTF, {
    fixSkinnedBbox = false
  }: Partial<ModelLoadOption> = {}): Model {
    const model = new Model({
      scenes: gltf.scenes,
      animations: gltf.animations,
      fixSkinnedBbox
    });

    model.meshes.forEach(mesh => {
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat: THREE.MeshStandardMaterial) => {
        if (mat.map) {
          // mat.map.encoding = THREE.sRGBEncoding;
        }
      });
    });

    return model;
  }
}

export default GLTFLoader;
