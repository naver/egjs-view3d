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
import Annotation from "../annotation/Annotation";
import { ANNOTATION_EXTRA, CUSTOM_TEXTURE_LOD_EXTENSION, STANDARD_MAPS, TEXTURE_LOD_EXTRA, VARIANT_EXTENSION } from "../const/internal";
import { createLoadingContext } from "../utils";

import Loader from "./Loader";

const dracoLoader = new DRACOLoader();
const ktx2Loader = new KTX2Loader();

/**
 * glTF/glb 3D model loader
 */
class GLTFLoader extends Loader {
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

  private _loader: ThreeGLTFLoader;

  /**
   * Create a new instance of GLTFLoader
   */
  public constructor(view3D: View3D) {
    super(view3D);

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
    const loadingContext = createLoadingContext(view3D, url);

    dracoLoader.setDecoderPath(view3D.dracoPath);
    ktx2Loader.setTranscoderPath(view3D.ktxPath);

    if (GLTFLoader.meshoptDecoder) {
      loader.setMeshoptDecoder(GLTFLoader.meshoptDecoder);
    }

    loader.manager = THREE.DefaultLoadingManager;

    return new Promise((resolve, reject) => {
      try {
        loader.load(url, async gltf => {
          const model = await this._parseToModel(gltf, url);
          resolve(model);
        }, evt => this._onLoadingProgress(evt, url, loadingContext), err => {
          loadingContext.initialized = true;
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
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
        if (/^data:.*,.*$/i.test(fileURL)) return fileURL;

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

      const loadingContext = createLoadingContext(view3D, gltfURL);

      loader.manager = manager;
      loader.load(gltfURL, async gltf => {
        const model = await this._parseToModel(gltf, gltfFile.name);
        revokeURLs();
        resolve(model);
      }, evt => this._onLoadingProgress(evt, gltfURL, loadingContext), err => {
        loadingContext.initialized = true;
        revokeURLs();
        reject(err);
      });
    });
  }

  private async _parseToModel(gltf: GLTF, src: string): Promise<Model> {
    const view3D = this._view3D;
    const fixSkinnedBbox = view3D.fixSkinnedBbox;

    gltf.scenes.forEach(scene => {
      scene.traverse(obj => {
        obj.frustumCulled = false;
      });
    });

    const maxTextureSize = view3D.renderer.threeRenderer.capabilities.maxTextureSize;
    const meshes: THREE.Mesh[] = [];

    gltf.scenes.forEach(scene => {
      scene.traverse(obj => {
        if ((obj as any).isMesh) {
          meshes.push(obj as THREE.Mesh);
        }
      });
    });

    const materials = meshes.reduce((allMaterials, mesh) => {
      return [...allMaterials, ...(Array.isArray(mesh.material) ? mesh.material : [mesh.material])];
    }, []);

    const textures: THREE.Texture[] = materials.reduce((allTextures, material) => {
      return [
        ...allTextures,
        ...STANDARD_MAPS.filter(map => material[map]).map(mapName => material[mapName])
      ];
    }, []);

    const associations = gltf.parser.associations;
    const gltfJSON = gltf.parser.json;

    const gltfTextures = textures
      .filter(texture => associations.has(texture))
      .map(texture => {
        return gltfJSON.textures[associations.get(texture)!.textures!];
      });

    const texturesByLevel: Array<Array<{
      index: number;
      texture: THREE.Texture;
    }>> = Array.from(new Set(gltfTextures).values()).reduce((levels, texture, texIdx) => {
      const hasExtension = texture.extensions && texture.extensions[CUSTOM_TEXTURE_LOD_EXTENSION];
      const hasExtra = texture.extras && texture.extras[TEXTURE_LOD_EXTRA];

      if (!hasExtension && !hasExtra) return levels;

      const currentTexture = textures[texIdx];
      const lodLevels: Array<{ index: number; size: number }> = hasExtension
        ? texture.extensions[CUSTOM_TEXTURE_LOD_EXTENSION].levels
        : texture.extras[TEXTURE_LOD_EXTRA].levels;

      lodLevels.forEach(({ index, size }, level) => {
        if (size > maxTextureSize) return;
        if (!levels[level]) {
          levels[level] = [];
        }

        levels[level].push({ index, texture: currentTexture });
      });

      return levels;
    }, []);

    const loaded = texturesByLevel.map(() => false);

    texturesByLevel.forEach(async (levelTextures, level) => {
      // Change textures when all texture of the level loaded
      const texturesLoaded = await Promise.all(levelTextures.map(({ index }) => gltf.parser.getDependency("texture", index) as Promise<THREE.Texture>));
      const higherLevelLoaded = loaded.slice(level + 1).some(val => !!val);

      loaded[level] = true;

      if (higherLevelLoaded) return;

      texturesLoaded.forEach((texture, index) => {
        const origTexture = levelTextures[index].texture;
        origTexture.image = texture.image;
        origTexture.needsUpdate = true;
        view3D.renderer.renderSingleFrame();
      });
    });

    const annotations: Annotation[] = [];

    if (gltf.parser.json.extras && gltf.parser.json.extras[ANNOTATION_EXTRA]) {
      const data = gltf.parser.json.extras[ANNOTATION_EXTRA];

      annotations.push(...view3D.annotation.parse(data));
    }

    const userData = gltf.userData ?? {};
    const extensions = userData.gltfExtensions ?? {};
    const variants = extensions[VARIANT_EXTENSION] ? extensions[VARIANT_EXTENSION].variants : [];

    const model = new Model({
      src,
      scenes: gltf.scenes,
      center: view3D.center,
      annotations,
      parser: gltf.parser,
      animations: gltf.animations,
      variants,
      fixSkinnedBbox
    });

    if (view3D.variant) {
      await model.selectVariant(view3D.variant);
    }

    return model;
  }
}

export default GLTFLoader;
