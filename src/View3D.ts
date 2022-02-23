/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";
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
import OrbitControl from "./control/OrbitControl";
import { RotateControlOptions } from "./control/RotateControl";
import { TranslateControlOptions } from "./control/TranslateControl";
import { ZoomControlOptions } from "./control/ZoomControl";
import AutoPlayer, { AutoplayOptions } from "./core/AutoPlayer";
import { WebARSessionOptions } from "./xr/WebARSession";
import { SceneViewerSessionOptions } from "./xr/SceneViewerSession";
import { QuickLookSessionOptions } from "./xr/QuickLookSession";
import { EVENTS, AUTO, AR_SESSION_TYPE, DEFAULT_CLASS, TONE_MAPPING } from "./const/external";
import * as DEFAULT from "./const/default";
import ERROR from "./const/error";
import * as EVENT_TYPES from "./type/event";
import { View3DPlugin } from "./plugin";
import { getElement, getObjectOption } from "./utils";
import { LiteralUnion, OptionGetters, ValueOf } from "./type/utils";
import { GLTFLoader } from "./loader";

/**
 * @interface
 * @see [Events](/docs/events/ready) page for detailed information
 */
export interface View3DEvents {
  [EVENTS.READY]: EVENT_TYPES.ReadyEvent;
  [EVENTS.LOAD_START]: EVENT_TYPES.LoadStartEvent;
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
 * @see [Options](/docs/options/model/src) page for detailed information
 */
export interface View3DOptions {
  // Model
  src: string | string[] | null;
  iosSrc: string | null;
  dracoPath: string;
  ktxPath: string;
  meshoptPath: string | null;
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
  wheelScrollable: boolean;
  useGrabCursor: boolean;

  // Environment
  skybox: string | null;
  envmap: string | null;
  background: number | string | null;
  exposure: number;
  shadow: boolean | Partial<ShadowOptions>;
  skyboxBlur: boolean;
  toneMapping: LiteralUnion<ValueOf<typeof TONE_MAPPING>, THREE.ToneMapping>;

  // AR
  webAR: boolean | Partial<WebARSessionOptions>;
  sceneViewer: boolean | Partial<SceneViewerSessionOptions>;
  quickLook: boolean | Partial<QuickLookSessionOptions>;
  arPriority: Array<ValueOf<typeof AR_SESSION_TYPE>>;

  // Others
  poster: string | null;
  canvasSelector: string;
  autoInit: boolean;
  autoResize: boolean;
  useResizeObserver: boolean;
  on: Partial<View3DEvents>;
  plugins: View3DPlugin[];
}

/**
 * @extends Component
 * @see https://naver.github.io/egjs-component/
 */
class View3D extends Component<View3DEvents> implements OptionGetters<Omit<View3DOptions, "on">> {
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
  private _plugins: View3DPlugin[];
  private _initialized: boolean;

  // Options
  private _src: View3DOptions["src"];
  private _iosSrc: View3DOptions["iosSrc"];
  private _dracoPath: View3DOptions["dracoPath"];
  private _ktxPath: View3DOptions["ktxPath"];
  private _meshoptPath: View3DOptions["meshoptPath"];
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
  private _wheelScrollable: View3DOptions["scrollable"];
  private _useGrabCursor: View3DOptions["useGrabCursor"];

  private _skybox: View3DOptions["skybox"];
  private _envmap: View3DOptions["envmap"];
  private _background: View3DOptions["background"];
  private _exposure: View3DOptions["exposure"];
  private _shadow: View3DOptions["shadow"];
  private _skyboxBlur: View3DOptions["skyboxBlur"];
  private _toneMapping: View3DOptions["toneMapping"];

  private _webAR: View3DOptions["webAR"];
  private _sceneViewer: View3DOptions["sceneViewer"];
  private _quickLook: View3DOptions["quickLook"];
  private _arPriority: View3DOptions["arPriority"];

  private _poster: View3DOptions["poster"];
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
  /**
   * Root(Wrapper) element of View3D that given in the constructor
   * @type {HTMLElement}
   * @readonly
   */
  public get rootEl() { return this._rootEl; }
  /**
   * Whether the View3D is initialized. This is set to `true` just before triggering "ready" event.
   * @type {boolean}
   * @readonly
   */
  public get initialized() { return this._initialized; }
  /**
   * Active plugins of view3D
   * @type {View3DPlugin[]}
   * @readonly
   */
  public get plugins() { return this._plugins; }

  // Options Getter
  /**
   * Source URL to fetch 3D model. `glb` / `glTF` models are supported.
   * @type {string | null}
   * @default null
   */
  public get src() { return this._src; }
  /**
   * Source URL to fetch 3D model in iOS AR Quick Look. `usdz` models are supported.
   * @type {string | null}
   * @default null
   */
  public get iosSrc() { return this._iosSrc; }
  /**
   * URL to {@link https://github.com/google/draco Draco} decoder location.
   * @type {string}
   * @default https://www.gstatic.com/draco/versioned/decoders/1.4.1/
   */
  public get dracoPath() { return this._dracoPath; }
  /**
   * URL to {@link http://github.khronos.org/KTX-Specification/#basisu_gd KTX2 texture} transcoder location.
   * @type {string}
   * @default https://unpkg.com/three@0.134.0/examples/js/libs/basis/
   */
  public get ktxPath() { return this._ktxPath; }
  /**
   * URL to {@link https://github.com/zeux/meshoptimizer Meshoptimizer} decoder js path.
   * @type {string | null}
   * @default null
   */
  public get meshoptPath() { return this._meshoptPath; }
  /**
   * Sometimes, some rigged model has the wrong bounding box that when displaying on three.js (usually converted glTF model from Sketchfab)
   * Enabling this option can resolve that issue by recalculating bounding box size with the influence of the skeleton weight.
   * @type {boolean}
   * @default false
   */
  public get fixSkinnedBbox() { return this._fixSkinnedBbox; }
  /**
   * A vertical FOV(Field of View) value of the camera frustum, in degrees.
   * If `"auto"` is used, View3D will try to find the appropriate FOV value that model is not clipped at any angle.
   * @type {"auto" | number}
   * @default "auto"
   */
  public get fov() { return this._fov; }
  /**
   * Center of the camera rotation.
   * If `"auto"` is given, it will use the center of the model's bounding box as the pivot.
   * Else, you can use any world position as the pivot.
   * @type {"auto" | number[]}
   * @default "auto"
   */
  public get center() { return this._center; }
  /**
   * Initial Y-axis rotation of the camera, in degrees.
   * @type {number}
   * @default 0
   */
  public get yaw() { return this._yaw; }
  /**
   * Initial X-axis rotation of the camera, in degrees.
   * Should be a value from -90 to 90.
   * @type {number}
   * @default 0
   */
  public get pitch() { return this._pitch; }
  /**
   * Options for the {@link RotateControl}.
   * If `false` is given, it will disable the rotate control.
   * @type {boolean | RotateControlOptions}
   * @default true
   */
  public get rotate() { return this._rotate; }
  /**
   * Options for the {@link TranslateControl}.
   * If `false` is given, it will disable the translate control.
   * @type {boolean | TranslateControlOptions}
   * @default true
   */
  public get translate() { return this._translate; }
  /**
   * Options for the {@link ZoomControl}.
   * If `false` is given, it will disable the zoom control.
   * @type {boolean | ZoomControlOptions}
   * @default true
   */
  public get zoom() { return this._zoom; }
  /**
   * Enable Y-axis rotation autoplay.
   * If `true` is given, it will enable autoplay with default values.
   * @type {boolean | AutoplayOptions}
   * @default true
   */
  public get autoplay() { return this._autoplay; }
  /**
   * Enable browser scrolling with touch on the canvas area.
   * This will block the rotate(pitch) control if the user is currently scrolling.
   * @type {boolean}
   * @default true
   */
  public get scrollable() { return this._scrollable; }
  /**
   * Enable browser scrolling with mouse wheel on the canvas area.
   * This will block the zoom control with mouse wheel.
   * @type {boolean}
   * @default false
   */
  public get wheelScrollable() { return this._wheelScrollable; }
  /**
   * Enable CSS `cursor: grab` on the canvas element.
   * `cursor: grabbing` will be used on mouse click.
   * @type {boolean}
   * @default true
   */
  public get useGrabCursor() { return this._useGrabCursor; }
  /**
   * Source to the HDR texture image (RGBE), which will used as the scene environment map & background.
   * `envmap` will be ignored if this value is not `null`.
   * @type {string | null}
   * @default null
   */
  public get skybox() { return this._skybox; }
  /**
   * Source to the HDR texture image (RGBE), which will used as the scene environment map.
   * @type {string | null}
   * @default null
   */
  public get envmap() { return this._envmap; }
  /**
   * Color code / URL to a image to use as the background.
   * For transparent background, use `null`. (default value)
   * Can be enabled only when the `skybox` is `null`.
   * @type {number | string | null}
   * @default null
   */
  public get background() { return this._background; }
  /**
   * Exposure value of the HDR envmap/skybox image.
   * @type {number}
   * @default 1
   */
  public get exposure() { return this._exposure; }
  /**
   * Enable shadow below the model.
   * If `true` is given, it will enable shadow with the default options.
   * If `false` is given, it will disable the shadow.
   * @type {boolean | ShadowOptions}
   * @default true
   */
  public get shadow() { return this._shadow; }
  /**
   * Apply blur to the current skybox image.
   * @type {boolean}
   * @default false
   */
  public get skyboxBlur() { return this._skyboxBlur; }
  /**
   * This is used to approximate the appearance of high dynamic range (HDR) on the low dynamic range medium of a standard computer monitor or mobile device's screen.
   * @type {number}
   * @see TONE_MAPPING
   * @default THREE.LinearToneMapping
   */
  public get toneMapping() { return this._toneMapping; }
  /**
   * Options for the WebXR-based AR session.
   * If `false` is given, it will disable WebXR-based AR session.
   * @type {boolean | WebARSessionOptions}
   * @default true
   */
  public get webAR() { return this._webAR; }
  /**
   * Options for the {@link https://developers.google.com/ar/develop/java/scene-viewer Google SceneViewer} based AR session.
   * If `false` is given, it will disable SceneViewer based AR session.
   * See {@link https://developers.google.com/ar/develop/java/scene-viewer#supported_intent_parameters Official Page} for the parameter details.
   * @type {boolean | SceneViewerSessionOptions}
   * @default true
   */
  public get sceneViewer() { return this._sceneViewer; }
  /**
   * Options for the {@link https://developer.apple.com/augmented-reality/quick-look/ Apple AR Quick Look} based AR session.
   * If `false` is given, it will disable AR Quick Look based AR session.
   * @type {boolean | QuickLookSessionOptions}
   * @default true
   */
  public get quickLook() { return this._quickLook; }
  /**
   * Priority array for the AR sessions.
   * If the two sessions are available in one environment, the session listed earlier will be used first.
   * If the session name is not included in this priority array, that session will be ignored.
   * See {@link AR_SESSION_TYPE}
   * @type {string[]}
   * @default ["webAR", "sceneViewer", "quickLook"]
   */
  public get arPriority() { return this._arPriority; }
  /**
   * A URL to the image that will be displayed before the 3D model is loaded.
   * @type {string | null}
   * @default null
   */
  public get poster() { return this._poster; }
  /**
   * CSS Selector for the canvas element.
   * @type {string}
   * @default "canvas"
   */
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

  public set skybox(val: View3DOptions["skybox"]) {
    void this._scene.setSkybox(val);
    this._skybox = val;
  }

  public set envmap(val: View3DOptions["envmap"]) {
    void this._scene.setEnvMap(val);
    this._envmap = val;
  }

  public set exposure(val: View3DOptions["exposure"]) {
    this._renderer.threeRenderer.toneMappingExposure = val;
    this._exposure = val;
  }

  public set skyboxBlur(val: View3DOptions["skyboxBlur"]) {
    this._skyboxBlur = val;
    const scene = this._scene;
    const origEnvmapTexture = scene.root.environment;

    if (origEnvmapTexture && !!scene.skybox) {
      if (val) {
        scene.skybox.useBlurredHDR(origEnvmapTexture);
      } else {
        scene.skybox.useTexture(origEnvmapTexture);
      }
    }
  }

  public set toneMapping(val: View3DOptions["toneMapping"]) {
    this._toneMapping = val;
    this._renderer.threeRenderer.toneMapping = val as THREE.ToneMapping;
  }

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
    iosSrc = null,
    dracoPath = DEFAULT.DRACO_DECODER_URL,
    ktxPath = DEFAULT.KTX_TRANSCODER_URL,
    meshoptPath = null,
    fixSkinnedBbox = false,
    fov = AUTO,
    center = AUTO,
    yaw = 0,
    pitch = 0,
    rotate = true,
    translate = true,
    zoom = true,
    autoplay = false,
    scrollable = true,
    wheelScrollable = false,
    useGrabCursor = true,
    skybox = null,
    envmap = null,
    background = null,
    exposure = 1,
    shadow = true,
    skyboxBlur = false,
    toneMapping = TONE_MAPPING.LINEAR,
    webAR = true,
    sceneViewer = true,
    quickLook = true,
    arPriority = DEFAULT.AR_PRIORITY,
    poster = null,
    canvasSelector = "canvas",
    autoInit = true,
    autoResize = true,
    useResizeObserver = true,
    on = {},
    plugins = []
  }: Partial<View3DOptions> = {}) {
    super();

    this._rootEl = getElement(root);

    // Bind options
    this._src = src;
    this._iosSrc = iosSrc;
    this._dracoPath = dracoPath;
    this._ktxPath = ktxPath;
    this._meshoptPath = meshoptPath;
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
    this._wheelScrollable = wheelScrollable;
    this._useGrabCursor = useGrabCursor;

    this._skybox = skybox;
    this._envmap = envmap;
    this._background = background;
    this._exposure = exposure;
    this._shadow = shadow;
    this._skyboxBlur = skyboxBlur;
    this._toneMapping = toneMapping;

    this._webAR = webAR;
    this._sceneViewer = sceneViewer;
    this._quickLook = quickLook;
    this._arPriority = arPriority;

    this._poster = poster;
    this._canvasSelector = canvasSelector;
    this._autoInit = autoInit;
    this._autoResize = autoResize;
    this._useResizeObserver = useResizeObserver;

    this._model = null;
    this._initialized = false;
    this._plugins = plugins;

    // Create internal components
    this._renderer = new Renderer(this);
    this._camera = new Camera(this);
    this._control = new OrbitControl(this);
    this._scene = new Scene(this);
    this._animator = new ModelAnimator(this);
    this._autoPlayer = new AutoPlayer(this, getObjectOption(autoplay));
    this._autoResizer = new AutoResizer(this);
    this._arManager = new ARManager(this);

    this._addEventHandlers(on);
    this._addPosterImage();

    void this._initPlugins(plugins)
      .then(() => {
        if (src && autoInit) {
          void this.init();
        }
      });
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
    this._animator.reset();
    this._plugins.forEach(plugin => plugin.teardown(this));
    this._plugins = [];
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
    const renderer = this._renderer;
    const control = this._control;
    const skybox = this._skybox;
    const envmap = this._envmap;
    const background = this._background;
    const meshoptPath = this._meshoptPath;

    if (meshoptPath && !GLTFLoader.meshoptDecoder) {
      await GLTFLoader.setMeshoptDecoder(meshoptPath);
    }

    // Load & set skybox / envmap before displaying model
    const hasEnvmap = skybox || envmap;
    if (hasEnvmap) {
      const tempLight = new THREE.AmbientLight();
      scene.add(tempLight, false);

      const loadEnv = skybox
        ? scene.setSkybox(skybox)
        : scene.setEnvMap(envmap);

      void loadEnv.then(() => {
        scene.remove(tempLight);
      });
    }

    if (!skybox && background) {
      void scene.setBackground(background);
    }

    await this._loadModel(this._src);

    control.enable();
    if (this._autoplay) {
      this._autoPlayer.enable();
    }

    // Start rendering
    renderer.stopAnimationLoop();
    renderer.setAnimationLoop(renderer.defaultRenderLoop);

    this._initialized = true;
    this.trigger(EVENTS.READY, { type: EVENTS.READY, target: this });
  }

  /**
   * Resize View3D instance to fit current canvas size
   * @returns {void}
   */
  public resize() {
    const renderer = this._renderer;
    renderer.resize();

    const newSize = renderer.size;
    this._camera.resize(newSize);
    this._control.resize(newSize);

    if (!renderer.threeRenderer.xr.isPresenting) {
      // Prevent flickering on resize
      renderer.defaultRenderLoop(0);
    }

    this.trigger(EVENTS.RESIZE, { ...newSize, type: EVENTS.RESIZE, target: this });
  }

  /**
   * Load a new 3D model and replace it with the current one
   * @param {string | string[]} src Source URL to fetch 3D model from
   */
  public async load(src: string | string[]) {
    if (this._initialized) {
      await this._loadModel(src);

      // Change the src later as an error can occur while loading the model
      this._src = src;
    } else {
      this._src = src;

      await this.init();
    }
  }

  /**
   * Display the given model in the canvas
   * @param {Model} model A model to display
   * @param {object} options Options for displaying model
   * @param {boolean} [options.resetCamera=true] Reset camera to default pose
   */
  public display(model: Model, {
    resetCamera = true
  }: Partial<{
    resetCamera: boolean;
  }> = {}): void {
    const renderer = this._renderer;
    const scene = this._scene;
    const camera = this._camera;
    const animator = this._animator;
    const inXR = renderer.threeRenderer.xr.isPresenting;

    scene.reset();
    scene.add(model.scene);

    scene.shadowPlane.updateDimensions(model);

    if (resetCamera) {
      camera.fit(model, this._center);
      void camera.reset(0);
    }

    animator.reset();
    animator.setClips(model.animations);

    if (model.animations.length > 0) {
      animator.play(0);
    }

    this._model = model;

    if (inXR) {
      const activeSession = this._arManager.activeSession;

      if (activeSession) {
        activeSession.control.syncTargetModel(model);
      }
    }

    this.trigger(EVENTS.MODEL_CHANGE, {
      type: EVENTS.MODEL_CHANGE,
      target: this,
      model
    });
  }

  /**
   * Add new plugins to View3D
   * @param {View3DPlugin[]} plugins Plugins to add
   * @returns {Promise<void>} A promise that resolves when all plugins are initialized
   */
  public async loadPlugins(...plugins: View3DPlugin[]) {
    await this._initPlugins(plugins);
    this._plugins.push(...plugins);
  }

  /**
   * Remove plugins from View3D
   * @param {View3DPlugin[]} plugins Plugins to remove
   * @returns {Promise<void>} A promise that resolves when all plugins are removed
   */
  public async removePlugins(...plugins: View3DPlugin[]) {
    await Promise.all(plugins.map(plugin => plugin.teardown(this)));

    plugins.forEach(plugin => {
      const pluginIdx = this._plugins.indexOf(plugin);

      if (pluginIdx < 0) return;

      this._plugins.splice(pluginIdx, 1);
    });
  }

  /**
   * Take a screenshot of current rendered canvas image and download it
   */
  public screenshot(fileName = "screenshot") {
    const canvas = this._renderer.canvas;
    const imgURL = canvas.toDataURL("png");

    const anchorEl = document.createElement("a");
    anchorEl.href = imgURL;
    anchorEl.download = fileName;
    anchorEl.click();
  }

  private async _loadModel(src: string | string[]) {
    const loader = new GLTFLoader(this);

    if (Array.isArray(src)) {
      const loaded = src.map(() => false);
      const loadModels = src.map(async (srcLevel, level) => {
        this.trigger(EVENTS.LOAD_START, {
          type: EVENTS.LOAD_START,
          target: this,
          src: srcLevel,
          level
        });

        const model = await loader.load(srcLevel);
        const higherLevelLoaded = loaded.slice(level + 1).some(val => !!val);
        const modelLoadedBefore = loaded.some(val => !!val);

        this.trigger(EVENTS.LOAD, {
          type: EVENTS.LOAD,
          target: this,
          model,
          level
        });

        loaded[level] = true;

        if (higherLevelLoaded) return;

        this.display(model, {
          resetCamera: !modelLoadedBefore
        });
      });

      await Promise.race(loadModels);
    } else {
      this.trigger(EVENTS.LOAD_START, {
        type: EVENTS.LOAD_START,
        target: this,
        src,
        level: 0
      });

      const model = await loader.load(src);

      this.trigger(EVENTS.LOAD, {
        type: EVENTS.LOAD,
        target: this,
        model,
        level: 0
      });

      this.display(model);
    }
  }

  private _addEventHandlers(events: Partial<View3DEvents>) {
    Object.keys(events).forEach((evtName: keyof typeof EVENT_TYPES) => {
      this.on(evtName, events[evtName]);
    });
  }

  private _addPosterImage() {
    const poster = this._poster;
    const rootEl = this._rootEl;

    if (!poster) return;

    const imgEl = document.createElement("img");
    imgEl.className = DEFAULT_CLASS.POSTER;
    imgEl.src = poster;

    rootEl.appendChild(imgEl);

    this.once(EVENTS.READY, () => {
      if (imgEl.parentElement !== rootEl) return;
      rootEl.removeChild(imgEl);
    });
  }

  private async _initPlugins(plugins: View3DPlugin[]) {
    await Promise.all(plugins.map(plugin => plugin.init(this)));
  }
}

export default View3D;
