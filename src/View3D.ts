/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import Component from "@egjs/component";

import Renderer from "./core/Renderer";
import Scene from "./core/Scene";
import Camera from "./core/Camera";
import AutoResizer from "./core/AutoResizer";
import Model from "./core/Model";
import ModelAnimator from "./core/ModelAnimator";
import ARManager from "./core/ARManager";
import { ShadowOptions } from "./core/ShadowPlane";
import View3DError from "./core/View3DError";
import Preset from "./preset/Preset";
import OrbitControl from "./control/OrbitControl";
import { RotateControlOptions } from "./control/RotateControl";
import { TranslateControlOptions } from "./control/TranslateControl";
import { ZoomControlOptions } from "./control/ZoomControl";
import AutoPlayer, { AutoplayOptions } from "./core/AutoPlayer";
import { WebARSessionOptions } from "./xr/WebARSession";
import { SceneViewerSessionOptions } from "./xr/SceneViewerSession";
import { QuickLookSessionOptions } from "./xr/QuickLookSession";
import { EVENTS, AUTO, AR_SESSION_TYPE } from "./const/external";
import * as DEFAULT from "./const/default";
import * as ERROR from "./const/error";
import * as EVENT_TYPES from "./type/event";
import { View3DPlugin } from "./plugin";
import { getElement, getObjectOption } from "./utils";
import { OptionGetters, ValueOf } from "./type/utils";
import { GLTFLoader } from "./loaders";

/**
 * @interface
 */
export interface View3DEvents {
  [EVENTS.READY]: EVENT_TYPES.ReadyEvent;
  [EVENTS.LOAD]: EVENT_TYPES.LoadEvent;
  [EVENTS.MODEL_CHANGE]: EVENT_TYPES.ModelChangeEvent;
  [EVENTS.RESIZE]: EVENT_TYPES.ResizeEvent;
  [EVENTS.BEFORE_RENDER]: EVENT_TYPES.BeforeRenderEvent;
  [EVENTS.RENDER]: EVENT_TYPES.RenderEvent;
  [EVENTS.PROGRESS]: EVENT_TYPES.LoadProgressEvent;
  [EVENTS.QUICK_LOOK_TAP]: EVENT_TYPES.QuickLookTapEvent;
  [EVENTS.AR_START]: EVENT_TYPES.ARStartEvent;
  [EVENTS.AR_END]: EVENT_TYPES.AREndEvent;
  [EVENTS.AR_MODEL_PLACED]: EVENT_TYPES.ARModelPlacedEvent;
}

/**
 * @interface
 * @see [Options](/docs/options/sources/src) page for detailed information
 */
export interface View3DOptions {
  // Model
  src: string | null;
  dracoPath: string;
  ktxPath: string;
  fixSkinnedBbox: boolean;

  // Control
  fov: typeof AUTO | number;
  center: typeof AUTO | number[];
  yaw: number;
  pitch: number;
  rotate: boolean | Partial<RotateControlOptions>;
  translate: boolean | Partial<TranslateControlOptions>;
  zoom: boolean | Partial<ZoomControlOptions>;
  autoplay: boolean | Partial<AutoplayOptions>;
  scrollable: boolean;
  useGrabCursor: boolean;

  // Environment
  skybox: string | null;
  envmap: string | null;
  background: number | string | null;
  exposure: number;
  preset: Preset | null;
  shadow: boolean | Partial<ShadowOptions>;

  // AR
  webAR: boolean | Partial<WebARSessionOptions>;
  sceneViewer: boolean | Partial<SceneViewerSessionOptions>;
  quickLook: boolean | Partial<QuickLookSessionOptions>;
  arPriority: Array<ValueOf<typeof AR_SESSION_TYPE>>;

  // Others
  canvasSelector: string;
  autoInit: boolean;
  autoResize: boolean;
  useResizeObserver: boolean;
}

/**
 * @extends Component
 * @see https://naver.github.io/egjs-component/
 */
class View3D extends Component<View3DEvents> implements OptionGetters<View3DOptions> {
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
  private _autoPlayer: AutoPlayer;
  private _model: Model | null;
  private _animator: ModelAnimator;
  private _autoResizer: AutoResizer;
  private _arManager: ARManager;

  // Internal States
  private _rootEl: HTMLElement;
  private _initialized: boolean;

  // Options
  private _src: View3DOptions["src"];
  private _dracoPath: View3DOptions["dracoPath"];
  private _ktxPath: View3DOptions["ktxPath"];
  private _fixSkinnedBbox: View3DOptions["fixSkinnedBbox"];

  private _fov: View3DOptions["fov"];
  private _center: View3DOptions["center"];
  private _yaw: View3DOptions["yaw"];
  private _pitch: View3DOptions["pitch"];
  private _rotate: View3DOptions["rotate"];
  private _translate: View3DOptions["translate"];
  private _zoom: View3DOptions["zoom"];
  private _autoplay: View3DOptions["autoplay"];
  private _scrollable: View3DOptions["scrollable"];
  private _useGrabCursor: View3DOptions["useGrabCursor"];

  private _skybox: View3DOptions["skybox"];
  private _envmap: View3DOptions["envmap"];
  private _background: View3DOptions["background"];
  private _exposure: View3DOptions["exposure"];
  private _preset: View3DOptions["preset"];
  private _shadow: View3DOptions["shadow"];

  private _webAR: View3DOptions["webAR"];
  private _sceneViewer: View3DOptions["sceneViewer"];
  private _quickLook: View3DOptions["quickLook"];
  private _arPriority: View3DOptions["arPriority"];

  private _canvasSelector: View3DOptions["canvasSelector"];
  private _autoInit: View3DOptions["autoInit"];
  private _autoResize: View3DOptions["autoResize"];
  private _useResizeObserver: View3DOptions["useResizeObserver"];

  // Internal Components Getter
  /**
   * {@link Renderer} instance of the View3D
   * @type {Renderer}
   * @readonly
   */
  public get renderer() { return this._renderer; }
  /**
   * {@link Scene} instance of the View3D
   * @type {Scene}
   * @readonly
   */
  public get scene() { return this._scene; }
  /**
   * {@link Camera} instance of the View3D
   * @type {Camera}
   * @readonly
   */
  public get camera() { return this._camera; }
  /**
   * {@link OrbitControl} instance of the View3D
   * @type {OrbitControl}
   * @readonly
   */
  public get control() { return this._control; }
  /**
   * {@link AutoPlayer} instance of the View3D
   * @type {AutoPlayer}
   * @readonly
   */
  public get autoPlayer() { return this._autoPlayer; }
  /**
   * Current {@link Model} displaying. `null` if nothing is displayed on the canvas.
   * @type {Model | null}
   * @readonly
   */
  public get model() { return this._model; }
  /**
   * {@link ModelAnimator} instance of the View3D
   * @type {ModelAnimator}
   * @readonly
   */
  public get animator() { return this._animator; }
  /**
   * {@link ARManager} instance of the View3D
   * @type {ARManager}
   * @readonly
   */
  public get ar() { return this._arManager; }

  // Internal State Getter
  public get rootEl() { return this._rootEl; }
  public get initialized() { return this._initialized; }

  // Options Getter
  /**
   * Source URL to fetch 3D model from
   * For further information, check our [Tutorial](/docs/loading-model) page
   * @type {string | null}
   * @default null
   */
  public get src() { return this._src; }
  public get dracoPath() { return this._dracoPath; }
  public get ktxPath() { return this._ktxPath; }
  public get fixSkinnedBbox() { return this._fixSkinnedBbox; }
  public get fov() { return this._fov; }
  public get center() { return this._center; }
  public get yaw() { return this._yaw; }
  public get pitch() { return this._pitch; }
  public get rotate() { return this._rotate; }
  public get translate() { return this._translate; }
  public get zoom() { return this._zoom; }
  public get autoplay() { return this._autoplay; }
  public get scrollable() { return this._scrollable; }
  public get useGrabCursor() { return this._useGrabCursor; }
  public get skybox() { return this._skybox; }
  public get envmap() { return this._envmap; }
  public get background() { return this._background; }
  public get exposure() { return this._exposure; }
  public get preset() { return this._preset; }
  public get shadow() { return this._shadow; }
  public get webAR() { return this._webAR; }
  public get sceneViewer() { return this._sceneViewer; }
  public get quickLook() { return this._quickLook; }
  public get arPriority() { return this._arPriority; }
  public get canvasSelector() { return this._canvasSelector; }
  /**
   * Call {@link View3D#init init()} automatically when creating View3D's instance
   * This option won't work if `src` is not given
   * @type {boolean}
   * @default true
   * @readonly
   */
  public get autoInit() { return this._autoInit; }
  /**
   * Whether to automatically call {@link View3D#resize resize()} when the canvas element's size is changed
   * @type {boolean}
   * @default true
   */
  public get autoResize() { return this._autoResize; }
  /**
   * Whether to listen {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver ResizeObserver}'s event instead of Window's {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event resize} event when using the `autoResize` option
   * @type {boolean}
   * @default true
   */
  public get useResizeObserver() { return this._useResizeObserver; }

  public set useGrabCursor(val: View3DOptions["useGrabCursor"]) {
    this._useGrabCursor = val;
    this._control.updateCursor();
  }

  /**
   * Creates new View3D instance.
   * @param root A root element or selector of it to initialize View3D
   * @param {View3DOptions} [options={}] An options object for View3D
   * @throws {View3DError}
   * |code|condition|
   * |---|---|
   * |{@link ERROR_CODE WRONG_TYPE}|When the root is not either string or HTMLElement|
   * |{@link ERROR_CODE ELEMENT_NOT_FOUND}|When the element with given CSS selector does not exist|
   * |{@link ERROR_CODE ELEMENT_NOT_CANVAS}|When the element given is not a \<canvas\> element|
   * |{@link ERROR_CODE WEBGL_NOT_SUPPORTED}|When the browser does not support WebGL|
   */
  public constructor(root: string | HTMLElement, {
    src = null,
    dracoPath = DEFAULT.DRACO_DECODER_URL,
    ktxPath = DEFAULT.KTX_TRANSCODER_URL,
    fixSkinnedBbox = false,
    skybox = null,
    envmap = null,
    background = null,
    fov = AUTO,
    center = AUTO,
    yaw = 0,
    pitch = 0,
    rotate = {},
    translate = {},
    zoom = {},
    preset = null,
    exposure = 1,
    shadow = true,
    autoplay = false,
    scrollable = false,
    useGrabCursor = true,
    webAR = true,
    sceneViewer = true,
    quickLook = true,
    arPriority = DEFAULT.AR_PRIORITY,
    canvasSelector = "canvas",
    autoInit = true,
    autoResize = true,
    useResizeObserver = true
  }: Partial<View3DOptions> = {}) {
    super();

    this._rootEl = getElement(root);

    // Bind options
    this._src = src;
    this._dracoPath = dracoPath;
    this._ktxPath = ktxPath;
    this._fixSkinnedBbox = fixSkinnedBbox;

    this._fov = fov;
    this._center = center;
    this._yaw = yaw;
    this._pitch = pitch;
    this._rotate = rotate;
    this._translate = translate;
    this._zoom = zoom;
    this._autoplay = autoplay;
    this._scrollable = scrollable;
    this._useGrabCursor = useGrabCursor;

    this._skybox = skybox;
    this._envmap = envmap;
    this._background = background;
    this._exposure = exposure;
    this._preset = preset;
    this._shadow = shadow;

    this._webAR = webAR;
    this._sceneViewer = sceneViewer;
    this._quickLook = quickLook;
    this._arPriority = arPriority;

    this._canvasSelector = canvasSelector;
    this._autoInit = autoInit;
    this._autoResize = autoResize;
    this._useResizeObserver = useResizeObserver;

    // Create internal components
    this._renderer = new Renderer(this);
    this._camera = new Camera(this);
    this._control = new OrbitControl(this);
    this._scene = new Scene(this);
    this._animator = new ModelAnimator(this._scene.userObjects);
    this._autoPlayer = new AutoPlayer(this, getObjectOption(autoplay));
    this._autoResizer = new AutoResizer(this);
    this._arManager = new ARManager(this);

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
    this._renderer.stopAnimationLoop();
    this._control.destroy();
    this._autoResizer.disable();
  }

  /**
   * Initialize View3d & load 3D model
   * @fires View3D#load
   * @returns {Promise<void>}
   */
  public async init() {
    if (!this._src) {
      throw new View3DError(ERROR.MESSAGES.PROVIDE_SRC_FIRST, ERROR.CODES.PROVIDE_SRC_FIRST);
    }

    if (this._autoResize) {
      this._autoResizer.enable();
    }

    const scene = this._scene;
    const skybox = this._skybox;
    const envmap = this._envmap;
    const background = this._background;

    const tasks: [Promise<Model>, ...Array<Promise<any>>] = [
      this._loadModel(this._src)
    ];

    // Load & set skybox / envmap before displaying model
    if (skybox) {
      tasks.push(scene.setSkybox(skybox));
    } else if (envmap) {
      tasks.push(scene.setEnvMap(envmap));
    }

    if (!skybox && background) {
      tasks.push(scene.setBackground(background));
    }

    const [model] = await Promise.all(tasks);

    this._display(model);

    this._control.enable();
    if (this._autoplay) {
      this._autoPlayer.enable();
    }
    this._preset?.init(this);

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
   * @param {string} src Source URL to fetch 3D model from
   */
  public async load(src: string) {
    if (this._initialized) {
      const model = await this._loadModel(src);

      this._src = src;

      this._display(model);
    } else {
      this._src = src;

      await this.init();
    }
  }

  public async loadPlugins(...plugins: View3DPlugin[]) {
    return Promise.all(plugins.map(plugin => plugin.init(this)));
  }

  private async _loadModel(src: string) {
    const loader = new GLTFLoader(this);
    const model = await loader.load(src);

    this.trigger(EVENTS.LOAD, {
      target: this,
      model
    });

    return model;
  }

  private _display(model: Model): void {
    const renderer = this._renderer;
    const scene = this._scene;
    const camera = this._camera;
    const animator = this._animator;
    const inXR = renderer.threeRenderer.xr.isPresenting;

    scene.reset();
    scene.add(model.scene);
    scene.shadowPlane.updateLightPosition(model);

    camera.fit(model, this._center);
    void camera.reset(0);

    animator.reset();
    animator.setClips(model.animations);

    if (model.animations.length > 0) {
      animator.play(0);
    }

    this._model = model;

    if (!inXR) {
      renderer.stopAnimationLoop();
      renderer.setAnimationLoop(renderer.defaultRenderLoop);
    } else {
      const activeSession = this._arManager.activeSession;

      if (activeSession) {
        activeSession.control.syncTargetModel(model);
      }
    }

    this.trigger(EVENTS.MODEL_CHANGE, {
      target: this,
      model
    });
  }
}

export default View3D;
