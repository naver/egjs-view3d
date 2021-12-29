/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import { GLTFLoader as ThreeGLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";

import View3D from "../View3D";
import Model from "../core/Model";
import { EVENTS } from "../const/external";

const dracoLoader = new DRACOLoader();
const ktx2Loader = new KTX2Loader();

/**
 * GLTFLoader
 */
class GLTFLoader {
  public static async setMeshoptDecoder(meshoptPath: string) {
    return new Promise<void>((resolve, reject) => {
      const scriptTag = document.createElement("script");

      scriptTag.addEventListener("load", async () => {
        await (window as any).MeshoptDecoder.ready;
        GLTFLoader.meshoptDecoder = (window as any).MeshoptDecoder;
        document.body.removeChild(scriptTag);

        resolve();
      });
      scriptTag.addEventListener("error", () => {
        document.body.removeChild(scriptTag);
        reject();
      });
      scriptTag.src = new URL(meshoptPath, location.href).href;

      document.body.appendChild(scriptTag);
    });
  }

  public static meshoptDecoder: any;

  private _view3D: View3D;
  private _loader: ThreeGLTFLoader;

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
  }

  /**
   * Load new GLTF model from the given url
   * @param {string} url URL to fetch glTF/glb file
   * @returns Promise that resolves {@link Model}
   */
  public load(url: string): Promise<Model> {
    const view3D = this._view3D;
    const loader = this._loader;

    dracoLoader.setDecoderPath(view3D.dracoPath);
    ktx2Loader.setTranscoderPath(view3D.ktxPath);

    if (GLTFLoader.meshoptDecoder) {
      loader.setMeshoptDecoder(GLTFLoader.meshoptDecoder);
    }

    return new Promise((resolve, reject) => {
      loader.load(url, gltf => {
        const model = this._parseToModel(gltf, url);
        resolve(model);
      }, evt => {
        view3D.trigger(EVENTS.PROGRESS, { ...evt, target: view3D, type: EVENTS.PROGRESS });
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
    const view3D = this._view3D;
    const loader = this._loader;
    const objectURLs: string[] = [];
    const revokeURLs = () => {
      objectURLs.forEach(url => {
        URL.revokeObjectURL(url);
      });
    };

    dracoLoader.setDecoderPath(view3D.dracoPath);
    ktx2Loader.setTranscoderPath(view3D.ktxPath);

    if (GLTFLoader.meshoptDecoder) {
      loader.setMeshoptDecoder(GLTFLoader.meshoptDecoder);
    }

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

      loader.manager = manager;
      loader.load(gltfURL, gltf => {
        const model = this._parseToModel(gltf, gltfFile.name);
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
