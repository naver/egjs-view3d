/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import View3D from "../View3D";
import * as BROWSER from "../const/browser";
import { createLoadingContext } from "../utils";

import Loader from "./Loader";

/**
 * Texture loader
 */
class TextureLoader extends Loader {
  /**
   * Create new TextureLoader instance
   * @param {View3D} view3D An instance of View3D
   */
  public constructor(view3D: View3D) {
    super(view3D);
  }

  /**
   * Create new {@link https://threejs.org/docs/index.html#api/en/textures/Texture Texture} with given url
   * Texture's {@link https://threejs.org/docs/index.html#api/en/textures/Texture.flipY flipY} property is `true` by Three.js's policy, so be careful when using it as a map texture.
   * @param url url to fetch image
   */
  public load(url: string): Promise<THREE.Texture> {
    const view3D = this._view3D;

    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      const loadingContext = createLoadingContext(view3D, url);

      loader.setCrossOrigin(BROWSER.ANONYMOUS);
      loader.load(url, resolve, evt => this._onLoadingProgress(evt, url, loadingContext), err => {
        loadingContext.initialized = true;
        reject(err);
      });
    });
  }

  /**
   * Create new texture with given HDR(RGBE) image url
   * @param url image url
   */
  public loadHDRTexture(url: string): Promise<THREE.Texture> {
    const view3D = this._view3D;

    return new Promise((resolve, reject) => {
      const loader = new RGBELoader();
      if (!view3D.renderer.capabilities.halfFloat) {
        loader.type = THREE.FloatType;
      }
      const loadingContext = createLoadingContext(view3D, url);

      loader.setCrossOrigin(BROWSER.ANONYMOUS);
      loader.load(url, texture => {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        resolve(texture);
      }, evt => this._onLoadingProgress(evt, url, loadingContext), err => {
        loadingContext.initialized = true;
        reject(err);
      });
    });
  }
}

export default TextureLoader;
