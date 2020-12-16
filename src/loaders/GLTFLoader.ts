/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import { GLTFLoader as ThreeGLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import Model from "~/core/Model";
import * as DEFAULT from "~/consts/default";
import View3D from "~/View3D";
import { ShadowPlane, AutoDirectionalLight } from "~/environments";
import { ModelLoadOption } from "~/types/external";

/**
 * GLTFLoader
 * @category Loaders
 */
class GLTFLoader {
  private _loader: ThreeGLTFLoader;
  private _dracoLoader: DRACOLoader;

  public get loader() { return this._loader; }
  public get dracoLoader() { return this._dracoLoader; }

  /**
   * Create a new instance of GLTFLoader
   */
  constructor() {
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
  public load(url: string, options: Partial<ModelLoadOption> = {}): Promise<Model> {
    const loader = this._loader;
    loader.manager = new THREE.LoadingManager();

    return new Promise((resolve, reject) => {
      loader.load(url, gltf => {
        const model = this._parseToModel(gltf, options);
        resolve(model);
      }, undefined, err => {
        reject(err);
      });
    });
  }

  /**
   * Load preset generated from View3D editor.
   * @param viewer Instance of the {@link View3D}.
   * @param url Preset url
   * @param {object} options Options
   * @param {string} [options.path] Base path for additional files.
   * @param {function} [options.onLoad] Callback which called after each model LOD is loaded.
   * @returns {Model} Model instance with highest LOD
   */
  public loadPreset(viewer: View3D, url: string, options: Partial<{
    path: string;
    onLoad: (model: Model, lodIndex: number) => any;
  }> = {}): Promise<Model> {
    const loader = this._loader;
    const fileLoader = new THREE.FileLoader();

    return fileLoader.loadAsync(url)
      .then(jsonRaw => {
        return new Promise((resolve, reject) => {
          const json = JSON.parse(jsonRaw);
          const baseURL = THREE.LoaderUtils.extractUrlBase(url);

          // Reset
          viewer.scene.reset();
          viewer.camera.reset();
          viewer.animator.reset();

          const modelOptions = json.model;
          const cameraOptions = json.camera;
          const environmentOptions = json.env;

          viewer.camera.setDefaultPose({
            yaw: cameraOptions.yaw,
            pitch: cameraOptions.pitch,
          });
          viewer.camera.minDistance = cameraOptions.distanceRange[0];
          viewer.camera.maxDistance = cameraOptions.distanceRange[1];

          if (environmentOptions.background) {
            viewer.scene.setBackground(new THREE.Color(environmentOptions.background));
          }

          const shadowPlane = new ShadowPlane();
          shadowPlane.opacity = environmentOptions.shadow.opacity;
          viewer.scene.addEnv(shadowPlane);

          const ambientOptions = environmentOptions.ambient;
          const ambient = new THREE.AmbientLight(new THREE.Color(ambientOptions.color), ambientOptions.intensity);
          viewer.scene.addEnv(ambient);

          const lightOptions = [environmentOptions.light1, environmentOptions.light2, environmentOptions.light3];
          lightOptions.forEach(lightOption => {
            const lightDirection = new THREE.Vector3(lightOption.x, lightOption.y, lightOption.z).negate();
            const directional = new AutoDirectionalLight(new THREE.Color(lightOption.color), lightOption.intensity, {
              direction: lightDirection,
            });
            directional.light.castShadow = lightOption.castShadow;
            directional.light.updateMatrixWorld();
            viewer.scene.addEnv(directional);
          });

          let isFirstLoad = true;
          const loadFlags = json.LOD.map(() => false) as boolean[];
          json.LOD.forEach((fileName: string, lodIndex: number) => {
            const glbURL = this._resolveURL(`${baseURL}${fileName}`, options.path || "");

            loader.load(glbURL, gltf => {
              loadFlags[lodIndex] = true;
              const higherLODLoaded = loadFlags.slice(lodIndex + 1).some(loaded => loaded);
              if (higherLODLoaded) return;

              const model = this._parseToModel(gltf);

              viewer.display(model, {
                size: modelOptions.size,
                resetView: isFirstLoad,
              });
              isFirstLoad = false;

              model.castShadow = modelOptions.castShadow;
              model.receiveShadow = modelOptions.receiveShadow;

              if (options.onLoad) {
                options.onLoad(model, lodIndex);
              }
              if (lodIndex === json.LOD.length - 1) {
                resolve(model);
              }
            }, undefined, err => {
              reject(err);
            });
          });
        })
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
    fixSkinnedBbox = false,
  }: Partial<ModelLoadOption> = {}): Model {
    const model = new Model({
      scenes: gltf.scenes,
      animations: gltf.animations,
      fixSkinnedBbox,
    });

    model.meshes.forEach(mesh => {
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat: THREE.MeshStandardMaterial) => {
        if (mat.map) {
          mat.map.encoding = THREE.sRGBEncoding;
        }
      });
    });

    return model;
  }

  // Grabbed from three.js/GLTFLoader
  // Original code: https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/GLTFLoader.js#L1221
  // License: MIT
  private _resolveURL(url: string, path: string): string {
    // Invalid URL
    if ( typeof url !== "string" || url === "" ) return "";

    // Host Relative URL
    if ( /^https?:\/\//i.test( path ) && /^\//.test( url ) ) {

      path = path.replace( /(^https?:\/\/[^\/]+).*/i, "$1" );

    }

    // Absolute URL http://,https://,//
    if ( /^(https?:)?\/\//i.test( url ) ) return url;

    // Data URI
    if ( /^data:.*,.*$/i.test( url ) ) return url;

    // Blob URL
    if ( /^blob:.*$/i.test( url ) ) return url;

    // Relative URL
    return path + url;
  }
}

export default GLTFLoader;
