/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import EventEmitter from "./core/EventEmitter";
import Renderer from "./core/Renderer";
import Scene from "./core/Scene";
import Camera from "./core/camera/Camera";
import Model from "./core/Model";
import ModelAnimator from "./core/ModelAnimator";
import XRManager from "./core/XRManager";
import { EVENTS } from "./consts/event";
import * as DEFAULT from "./consts/default";
import { getCanvas } from "./utils";

/**
 * Yet another 3d model viewer
 * @category Core
 * @mermaid
 * classDiagram
 *   class View3D
 *     View3D *-- Camera
 *     View3D *-- Renderer
 *     View3D *-- Scene
 *     View3D *-- ModelAnimator
 *     Camera *-- Controller
 * @event resize
 * @event beforeRender
 * @event afterRender
 */
class View3D extends EventEmitter<{
  resize: {
    width: number;
    height: number;
    target: View3D;
  };
  beforeRender: View3D;
  afterRender: View3D;
}> {
  /**
   * Current version of the View3D
   */
  public static VERSION: string = "#__VERSION__#";

  private _model: Model | null;
  private _renderer: Renderer;
  private _scene: Scene;
  private _camera: Camera;
  private _animator: ModelAnimator;
  private _xr: XRManager;

  /**
   * {@link Renderer} instance of the View3D
   * @type {Renderer}
   */
  public get renderer() { return this._renderer; }
  /**
   * {@link Scene} instance of the View3D
   * @type {Scene}
   */
  public get scene() { return this._scene; }
  /**
   * {@link Camera} instance of the View3D
   * @type {Camera}
   */
  public get camera() { return this._camera; }
  /**
   * {@link Controller} instance of the Camera
   * @type {Controller}
   */
  public get controller() { return this._camera.controller; }
  /**
   * {@link ModelAnimator} instance of the View3D
   * @type {ModelAnimator}
   */
  public get animator() { return this._animator; }
  /**
   * {@link XRManager} instance of the View3D
   * @type {XRManager}
   */
  public get xr() { return this._xr; }
  /**
   * {@link Model} that View3D is currently showing
   * @type {Model|null}
   */
  public get model() { return this._model; }

  /**
   * Creates new View3D instance
   * @example
   * import View3D, { ERROR_CODES } from "@egjs/view3d";
   *
   * try {
   *   const view3d = new View3D("#wrapper")
   * } catch (e) {
   *   if (e.code === ERROR_CODES.ELEMENT_NOT_FOUND) {
   *     console.error("Element not found")
   *   }
   * }
   * @throws {View3DError} `CODES.WRONG_TYPE`<br/>When the parameter is not either string or the canvas element.
   * @throws {View3DError} `CODES.ELEMENT_NOT_FOUND`<br/>When the element with given query does not exist.
   * @throws {View3DError} `CODES.ELEMENT_NOT_CANVAS`<br/>When the element given is not a \<canvas\> element.
   * @throws {View3DError} `CODES.WEBGL_NOT_SUPPORTED`<br/>When browser does not support WebGL.
   * @see Model
   * @see Camera
   * @see Renderer
   * @see Scene
   * @see Controller
   * @see XRManager
   */
  constructor(el: string | HTMLCanvasElement) {
    super();
    const canvas = getCanvas(el);

    this._renderer = new Renderer(canvas);
    this._camera = new Camera(canvas);
    this._scene = new Scene();
    this._animator = new ModelAnimator(this._scene.root);
    this._xr = new XRManager(this);
    this._model = null;

    this.resize();

    window.addEventListener(EVENTS.RESIZE, this.resize);
  }

  /**
   * Destroy View3D instance and remove all events attached to it
   * @returns {void} Nothing
   */
  public destroy(): void {
    this._scene.reset();
    this.controller.clear();
    this._model = null;

    window.removeEventListener(EVENTS.RESIZE, this.resize);
  }

  /**
   * Resize View3D instance to fit current canvas size
   * @method
   * @returns {void} Nothing
   */
  public resize = (): void => {
    this._renderer.resize();

    const newSize = this._renderer.size;
    this._camera.resize(newSize);

    this.emit("resize", { ...newSize, target: this });
  }

  /**
   * Display the given model.
   * This method will remove the current displaying model, and reset the camera & control to default position.
   * View3D can only show one model at a time
   * @param model {@link Model} instance to show
   * @param {object} [options={}] Display options
   * @param {number} [options.applySize=true] Whether to change model size to given "size" option.
   * @param {number} [options.size=80] Size of the model to show as.
   * @param {boolean} [options.resetView=true] Whether to reset the view to the camera's default pose.
   * @returns {void} Nothing
   */
  public display(model: Model, {
    applySize = true,
    size = DEFAULT.MODEL_SIZE,
    resetView = true,
  } = {}): void {
    const renderer = this._renderer;
    const scene = this._scene;
    const camera = this._camera;
    const animator = this._animator;

    if (applySize) {
      model.size = size;
    }
    // model.moveToOrigin();

    scene.resetModel();

    if (resetView) {
      camera.reset();
    }

    animator.reset();

    this._model = model;

    scene.add(model.scene);
    animator.setClips(model.animations);

    scene.update(model);

    renderer.stopAnimationLoop();
    renderer.setAnimationLoop(this.renderLoop);
  }

  /**
   * View3D's basic render loop function
   * @param delta Number of seconds passed since last frame
   */
  public renderLoop = (delta: number) => {
    const renderer = this._renderer;
    const scene = this._scene;
    const camera = this._camera;
    const controller = this.controller;
    const animator = this._animator;

    animator.update(delta);
    controller.update(delta);

    this.emit("beforeRender", this);
    renderer.render(scene, camera);
    this.emit("afterRender", this);
  }
}

export default View3D;
