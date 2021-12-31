/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import Renderer from "../core/Renderer";

/**
 * Texture loader
 */
class TextureLoader {
  private _renderer: Renderer;

  /**
   * Create new TextureLoader instance
   * @param renderer {@link Renderer} instance of View3D
   */
  public constructor(renderer: Renderer) {
    this._renderer = renderer;
  }

  /**
   * Create new {@link https://threejs.org/docs/index.html#api/en/textures/Texture Texture} with given url
   * Texture's {@link https://threejs.org/docs/index.html#api/en/textures/Texture.flipY flipY} property is `true` by Three.js's policy, so be careful when using it as a map texture.
   * @param url url to fetch image
   */
  public load(url: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(url, resolve, undefined, reject);
    });
  }

  /**
   * Create new {@link https://threejs.org/docs/#api/en/renderers/WebGLCubeRenderTarget WebGLCubeRenderTarget} with given equirectangular image url
   * Be sure that equirectangular image has height of power of 2, as it will be resized if it isn't
   * @param url url to fetch equirectangular image
   * @returns WebGLCubeRenderTarget created
   */
  public loadEquirectagularTexture(url: string): Promise<THREE.WebGLRenderTarget> {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(url, skyboxTexture => {
        resolve(this._equirectToCubemap(skyboxTexture));
      }, undefined, reject);
    });
  }

  /**
   * Create new {@link https://threejs.org/docs/#api/en/textures/CubeTexture CubeTexture} with given cubemap image urls
   * Image order should be: px, nx, py, ny, pz, nz
   * @param urls cubemap image urls
   * @returns CubeTexture created
   */
  public loadCubeTexture(urls: string[]): Promise<THREE.CubeTexture> {
    return new Promise((resolve, reject) => {
      const loader = new THREE.CubeTextureLoader();
      loader.load(urls, resolve, undefined, reject);
    });
  }

  /**
   * Create new texture with given HDR(RGBE) image url
   * @param url image url
   * @param isEquirectangular Whether to read this image as a equirectangular texture
   */
  public loadHDRTexture(url: string): Promise<THREE.WebGLRenderTarget> {
    return new Promise((resolve, reject) => {
      const loader = new RGBELoader();

      loader.setCrossOrigin("anonymous");
      loader.load(url, texture => {
        resolve(this._equirectToCubemap(texture));
      }, undefined, reject);
    });
  }

  private _equirectToCubemap(texture: THREE.Texture): THREE.WebGLRenderTarget {
    const pmremGenerator = new THREE.PMREMGenerator(this._renderer.threeRenderer);
    const hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
    pmremGenerator.compileCubemapShader();

    return hdrCubeRenderTarget;
  }
}

export default TextureLoader;
