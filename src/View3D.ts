/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import Component from "@egjs/component";

import Renderer from "./core/Renderer";
import Scene from "./core/Scene";
import Camera from "./core/camera/Camera";
import Model from "./core/Model";
import ModelAnimator from "./core/ModelAnimator";
import { EVENTS } from "./consts/external";
import * as BROWSER from "./consts/browser";
import * as DEFAULT from "./consts/default";
import * as EVENT_TYPES from "./type/event";
import { getCanvas } from "./utils";

/**
 * @interface
 */
export interface View3DEvents {
  resize: EVENT_TYPES.ResizeEvent;
  beforeRender: EVENT_TYPES.BeforeRenderEvent;
  afterRender: EVENT_TYPES.AfterRenderEvent;
}

/**
 * @interface
 */
export interface View3DOptions {
  url: string | null;
  autoInit: boolean;
  autoResize: boolean;
}

/**
 * Yet another 3d model viewer
 * @category Core
 */
class View3D extends Component<View3DEvents> {
  /**
   * Current version of the View3D
   * @type {string}
   * @readonly
   */
  public static readonly VERSION: string = "#__VERSION__#";

  // Internal Components
  private _renderer: Renderer;
  private _scene: Scene;
  private _camera: Camera;
  private _animator: ModelAnimator;

  // Options
  private _url: View3DOptions["url"];
  private _autoInit: View3DOptions["autoInit"];
  private _autoResize: View3DOptions["autoResize"];

  // Internal States
  private _initialized: boolean;

  // Internal Components Getter
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

  // Options Getter
  public get url() { return this._url; }
  public get autoInit() { return this._autoInit; }
  public get autoResize() { return this._autoResize; }

  /**
   * Creates new View3D instance
   * @param canvasEl A canvas element or selector of it to initialize View3D<ko>View3D를 초기화할 캔버스 엘리먼트 혹은 선택자</ko>
   * @param {object} [options={}] An options object for View3D<ko>View3D에 적용할 옵션 오브젝트</ko>
   * @example
   * ```ts
   * import View3D, { ERROR_CODES } from "@egjs/view3d";
   *
   * try {
   *   const view3d = new View3D("#wrapper")
   * } catch (e) {
   *   if (e.code === ERROR_CODES.ELEMENT_NOT_FOUND) {
   *     console.error("Element not found")
   *   }
   * }
   * ```
   * @throws {View3DError} `CODES.WRONG_TYPE`<br/>When the parameter is not either string or the canvas element.
   * @throws {View3DError} `CODES.ELEMENT_NOT_FOUND`<br/>When the element with given query does not exist.
   * @throws {View3DError} `CODES.ELEMENT_NOT_CANVAS`<br/>When the element given is not a \<canvas\> element.
   * @throws {View3DError} `CODES.WEBGL_NOT_SUPPORTED`<br/>When browser does not support WebGL.
   */
  public constructor(canvasEl: string | HTMLElement, {
    url = null,
    autoInit = true,
    autoResize = true
  }: Partial<View3DOptions>) {
    super();
    const canvas = getCanvas(canvasEl);

    // Create internal components
    this._renderer = new Renderer(canvas);
    this._camera = new Camera(canvas);
    this._scene = new Scene();
    this._animator = new ModelAnimator(this._scene.root);

    // Bind options
    this._url = url;
    this._autoInit = autoInit;
    this._autoResize = autoResize;

    if (url && autoInit) {
      this.init();
    }
  }

  /**
   * Destroy View3D instance and remove all events attached to it
   * @returns {void}
   */
  public destroy(): void {
    this._scene.reset();
    this.controller.clear();

    window.removeEventListener(BROWSER.EVENTS.RESIZE, this.resize);
  }

  public init() {

  }

  /**
   * Resize View3D instance to fit current canvas size
   * @method
   * @returns {void}
   */
  public resize = (): void => {
    this._renderer.resize();

    const newSize = this._renderer.size;
    this._camera.resize(newSize);

    this.trigger(EVENTS.RESIZE, { ...newSize, target: this });
  };

  /**
   * Display the given model.
   * This method will remove the current displaying model, and reset the camera & control to default position.
   * View3D can only show one model at a time
   * @param model {@link Model} instance to show
   * @param {object} [options={}] Display options
   * @param {number} [options.applySize=true] Whether to change model size to given "size" option.
   * @param {number} [options.size=80] Size of the model to show as.
   * @param {boolean} [options.resetView=true] Whether to reset the view to the camera's default pose.
   * @returns {void}
   */
  public display(model: Model, {
    applySize = true,
    size = DEFAULT.MODEL_SIZE,
    resetView = true
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
      void camera.reset();
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

    this.trigger(EVENTS.BEFORE_RENDER, this);
    renderer.render(scene, camera);
    this.trigger(EVENTS.AFTER_RENDER, this);
  };
}

export default View3D;
