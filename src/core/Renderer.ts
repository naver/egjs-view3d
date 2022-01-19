/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";
import { findCanvas } from "../utils";
import { EVENTS } from "../const/external";

/**
 * Renderer that renders View3D's Scene
 */
class Renderer {
  private _view3D: View3D;
  private _renderer: THREE.WebGLRenderer;
  private _canvas: HTMLCanvasElement;
  private _clock: THREE.Clock;

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement HTMLCanvasElement} given when creating View3D instance
   * @type HTMLCanvasElement
   * @readonly
   */
  public get canvas() { return this._canvas; }
  /**
   * Current {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext WebGLRenderingContext}
   * @type WebGLRenderingContext
   * @readonly
   */
  public get context() { return this._renderer.context; }
  /**
   * Three.js {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer WebGLRenderer} instance
   * @type THREE.WebGLRenderer
   * @readonly
   */
  public get threeRenderer() { return this._renderer; }
  /**
   * Default render loop of View3D
   * @type {function}
   * @readonly
   */
  public get defaultRenderLoop() { return this._defaultRenderLoop; }
  /**
   * The width and height of the renderer's output canvas
   * @type {object}
   * @param {number} width Width of the canvas
   * @param {number} height Height of the canvas
   * @readonly
   */
  public get size() {
    const canvasSize = this._renderer.getSize(new THREE.Vector2());

    return { width: canvasSize.width, height: canvasSize.y };
  }

  /**
   * Create new Renderer instance
   * @param canvas \<canvas\> element to render 3d model
   */
  public constructor(view3D: View3D) {
    this._view3D = view3D;
    this._canvas = findCanvas(view3D.rootEl, view3D.canvasSelector);

    const renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });

    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = view3D.exposure;
    renderer.outputEncoding = THREE.sRGBEncoding;

    this._renderer = renderer;
    this._clock = new THREE.Clock(false);
    this.enableShadow();
  }

  /**
   * Resize the renderer based on current canvas width / height
   * @returns {void}
   */
  public resize(): void {
    const renderer = this._renderer;
    const canvas = this._canvas;

    if (renderer.xr.isPresenting) return;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);
  }

  public setAnimationLoop(callback: (delta: number, frame?: THREE.XRFrame) => void): void {
    this._clock.start();
    this._renderer.setAnimationLoop((timestamp: number, frame?: THREE.XRFrame) => {
      const delta = this._clock.getDelta();
      callback(delta, frame);
    });
  }

  public stopAnimationLoop(): void {
    this._clock.stop();
    // See https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setAnimationLoop
    this._renderer.setAnimationLoop(null);
  }

  /**
   * Enable shadow map
   */
  public enableShadow() {
    const threeRenderer = this._renderer;

    threeRenderer.shadowMap.enabled = true;
    threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  /**
   * Disable shadow map
   */
  public disableShadow() {
    const threeRenderer = this._renderer;

    threeRenderer.shadowMap.enabled = false;
  }

  private _defaultRenderLoop = (delta: number) => {
    const view3D = this._view3D;
    const threeRenderer = this._renderer;
    const {
      scene,
      camera,
      control,
      autoPlayer,
      animator
    } = view3D;

    const deltaMiliSec = delta * 1000;

    animator.update(delta);
    control.update(deltaMiliSec);
    autoPlayer.update(deltaMiliSec);

    view3D.trigger(EVENTS.BEFORE_RENDER, {
      type: EVENTS.BEFORE_RENDER,
      target: view3D,
      delta: deltaMiliSec
    });

    camera.updatePosition();

    threeRenderer.autoClear = false;
    threeRenderer.clear();

    if (scene.skybox) {
      scene.skybox.updateCamera();
      threeRenderer.render(scene.skybox.scene, scene.skybox.camera);
    }

    threeRenderer.render(scene.root, camera.threeCamera);
    threeRenderer.autoClear = true;

    view3D.trigger(EVENTS.RENDER, {
      type: EVENTS.RENDER,
      target: view3D,
      delta: deltaMiliSec
    });
  };
}

export default Renderer;
