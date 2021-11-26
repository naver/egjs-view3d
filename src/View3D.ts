/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import Component from "@egjs/component";

import Renderer from "./core/Renderer";
import Scene from "./core/Scene";
import Camera from "./core/Camera";
import AutoResizer from "./core/AutoResizer";
import ModelLoader from "./core/ModelLoader";
import Model from "./core/Model";
import ModelAnimator from "./core/ModelAnimator";
import OrbitControl from "./controls/OrbitControl";
import { EVENTS } from "./consts/external";
import * as DEFAULT from "./consts/default";
import * as EVENT_TYPES from "./type/event";
import { getCanvas } from "./utils";
import { LiteralUnion } from "./type/internal";

/**
 * @interface
 */
export interface View3DEvents {
  ready: EVENT_TYPES.ReadyEvent;
  load: EVENT_TYPES.LoadEvent;
  resize: EVENT_TYPES.ResizeEvent;
  beforeRender: EVENT_TYPES.BeforeRenderEvent;
  afterRender: EVENT_TYPES.AfterRenderEvent;
}

/**
 * @interface
 * @property {string | null} src
 * @property {string} format
 * @property {boolean} autoInit
 * @property {boolean} autoResize
 * @see {@link /Options Options} page for detailed information
 */
export interface View3DOptions {
  src: string | null;
  format: LiteralUnion<"auto">;
  autoInit: boolean;
  autoResize: boolean;
  useResizeObserver: boolean;
}

/**
 * Yet another 3d model viewer
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
  private _control: OrbitControl;
  private _animator: ModelAnimator;
  private _autoResizer: AutoResizer;

  // Options
  private _src: View3DOptions["src"];
  private _format: View3DOptions["format"];
  private _autoInit: View3DOptions["autoInit"];
  private _autoResize: View3DOptions["autoResize"];
  private _useResizeObserver: View3DOptions["useResizeObserver"];

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
   * {@link OrbitControl} instance of the View3D
   * @type {OrbitControl}
   */
  public get control() { return this._control; }
  /**
   * {@link ModelAnimator} instance of the View3D
   * @type {ModelAnimator}
   */
  public get animator() { return this._animator; }

  // Options Getter
  /**
   * Source URL to fetch 3D model from
   * For further information, check our [Tutorial](/docs/loading-model) page
   * @ko 3D 모델을 가져올 URL 주소
   * 자세한 설명은 [튜토리얼](/docs/loading-model) 페이지를 참조해주세요
   * @type {string | null}
   * @default null
   */
  public get src() { return this._src; }
  /**
   * File extension format of the 3D model (glTF, glb, ...)
   * If `"auto"` is given, View3D will try to detect the format of the 3D model with the name of `src` URL
   * @ko 3D 모델의 파일 확장자 형식 (glTF, glb, ...)
   * 값으로 `"auto"`가 주어졌을 경우, View3D는 자동으로 확장자 추론을 시도합니다
   * @type {string}
   * @default "auto"
   */
  public get format() { return this._format; }
  /**
   * Call {@link View3D#init init()} automatically when creating View3D's instance
   * This option won't work if `src` is not given
   * @ko Flicking 인스턴스를 생성할 때 자동으로 {@link Flicking#init init()}를 호출합니다
   * 이 옵션은 `src` 값이 주어지지 않았을 경우 동작하지 않습니다
   * @type {boolean}
   * @default true
   * @readonly
   */
  public get autoInit() { return this._autoInit; }
  /**
   * Whether to automatically call {@link View3D#resize resize()} when the canvas element's size is changed
   * @ko 캔버스 엘리먼트의 크기 변경시 {@link View3D#resize resize()} 메소드를 자동으로 호출할지 여부를 설정합니다
   * @type {boolean}
   * @default true
   */
  public get autoResize() { return this._autoResize; }
  /**
   * Whether to listen {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver ResizeObserver}'s event instead of Window's {@link https://developer.mozilla.org/ko/docs/Web/API/Window/resize_event resize} event when using the `autoResize` option
   * @ko autoResize 옵션 사용시 {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver ResizeObserver}의 이벤트를 Window객체의 {@link https://developer.mozilla.org/ko/docs/Web/API/Window/resize_event resize} 이벤트 대신 수신할지 여부를 설정합니다
   * @type {boolean}
   * @default true
   */
  public get useResizeObserver() { return this._useResizeObserver; }

  // Internal State Getter
  public get initialized() { return this._initialized; }

  /**
   * Creates new View3D instance.
   * @param canvasEl A canvas element or selector of it to initialize View3D<ko>View3D를 초기화할 캔버스 엘리먼트 혹은 선택자</ko>
   * @param {View3DOptions} [options={}] An options object for View3D<ko>View3D에 적용할 옵션 오브젝트</ko>
   * @throws {View3DError}
   * |code|condition|
   * |---|---|
   * |{@link ERROR_CODE WRONG_TYPE}|When the root is not either string or HTMLElement|
   * |{@link ERROR_CODE ELEMENT_NOT_FOUND}|When the element with given CSS selector does not exist|
   * |{@link ERROR_CODE ELEMENT_NOT_CANVAS}|When the element given is not a \<canvas\> element|
   * |{@link ERROR_CODE WEBGL_NOT_SUPPORTED}|When the browser does not support WebGL|
   * <ko>
   *
   * |code|조건|
   * |---|---|
   * |{@link ERROR_CODE WRONG_TYPE}|루트 엘리먼트가 string이나 HTMLElement가 아닐 경우|
   * |{@link ERROR_CODE ELEMENT_NOT_FOUND}|주어진 CSS selector로 엘리먼트를 찾지 못했을 경우|
   * |{@link ERROR_CODE ELEMENT_NOT_CANVAS}|주어진 엘리먼트가 캔버스 엘리먼트가 아닐 경우|
   * |{@link ERROR_CODE WEBGL_NOT_SUPPORTED}|브라우저가 WebGL을 지원하지 않을 경우|
   *
   * </ko>
   */
  public constructor(canvasEl: string | HTMLElement, {
    src = null,
    format = "auto",
    autoInit = true,
    autoResize = true
  }: Partial<View3DOptions> = {}) {
    super();
    const canvas = getCanvas(canvasEl);

    // Create internal components
    this._renderer = new Renderer(canvas);
    this._camera = new Camera(this);
    this._control = new OrbitControl(this);
    this._scene = new Scene();
    this._animator = new ModelAnimator(this._scene.root);
    this._autoResizer = new AutoResizer(this);

    // Bind options
    this._src = src;
    this._format = format;
    this._autoInit = autoInit;
    this._autoResize = autoResize;

    if (src && autoInit) {
      void this.init();
    }
  }

  /**
   * Destroy View3D instance and remove all events attached to it
   * @returns {void}
   */
  public destroy(): void {
    this._scene.reset();
    this._control.destroy();
    this._autoResizer.disable();
  }

  /**
   * Initialize View3d & load 3D model
   * @fires View3D#load
   * @returns {Promise<void>}
   */
  public async init() {
    if (this._autoResize) {
      this._autoResizer.enable();
    }

    await this.load(this._src!, this._format);
    this._control.enable();

    this._initialized = true;
    this.trigger(EVENTS.READY, { target: this });
  }

  /**
   * Resize View3D instance to fit current canvas size
   * @returns {void}
   */
  public resize() {
    this._renderer.resize();

    const newSize = this._renderer.size;
    this._camera.resize(newSize);
    this._control.resize(newSize);

    this.trigger(EVENTS.RESIZE, { ...newSize, target: this });
  }

  /**
   * Load a new 3D model and replace it with the current one
   * @param {string} src Source URL to fetch 3D model from<ko>3D 모델을 가져올 URL 주소</ko>
   * @param {string} [format="auto"] File extension format of the 3D model (glTF, glb, ...)
   * If `"auto"` is given, View3D will try to detect the format of the 3D model with the name of `src` URL
   * <ko>3D 모델의 파일 확장자 형식 (glTF, glb, ...)
   * 값으로 `"auto"`가 주어졌을 경우, View3D는 자동으로 확장자 추론을 시도합니다</ko>
   */
  public async load(src: string, format: View3DOptions["format"] = "auto") {
    const loader = new ModelLoader(this);
    const model = await loader.load(src, format);

    this._src = src;
    this._format = format;

    this._display(model);
  }

  /**
   * View3D's basic render loop function
   * @param delta Number of seconds passed since last frame
   */
  public renderLoop = (delta: number) => {
    const renderer = this._renderer;
    const scene = this._scene;
    const camera = this._camera;
    const control = this._control;
    const animator = this._animator;

    const deltaMiliSec = delta * 1000;

    animator.update(delta);
    control.update(deltaMiliSec);

    this.trigger(EVENTS.BEFORE_RENDER, {
      target: this
    });
    camera.updatePosition();
    renderer.render(scene, camera);
    this.trigger(EVENTS.AFTER_RENDER, {
      target: this
    });
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
  private _display(model: Model, {
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

    scene.add(model.scene);
    animator.setClips(model.animations);

    scene.update(model);

    renderer.stopAnimationLoop();
    renderer.setAnimationLoop(this.renderLoop);
  }
}

export default View3D;
