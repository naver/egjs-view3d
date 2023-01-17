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
import Skybox from "./core/Skybox";
import ARManager from "./core/ARManager";
import AnnotationManager from "./annotation/AnnotationManager";
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
import { EVENTS, AUTO, AR_SESSION_TYPE, DEFAULT_CLASS, TONE_MAPPING, ANIMATION_REPEAT_MODE } from "./const/external";
import ERROR from "./const/error";
import * as DEFAULT from "./const/default";
import * as EVENT_TYPES from "./type/event";
import { View3DPlugin } from "./plugin";
import { getElement, getObjectOption, isCSSSelector, isElement } from "./utils";
import { LiteralUnion, OptionGetters, ValueOf } from "./type/utils";
import { LoadingItem } from "./type/external";
import { GLTFLoader } from "./loader";

/**
 * @interface
 * @see [Events](/docs/events/ready) page for detailed information
 */
export interface View3DEvents {
  [EVENTS.READY]: EVENT_TYPES.ReadyEvent;
  [EVENTS.LOAD_START]: EVENT_TYPES.LoadStartEvent;
  [EVENTS.LOAD]: EVENT_TYPES.LoadEvent;
  [EVENTS.LOAD_ERROR]: EVENT_TYPES.LoadErrorEvent;
  [EVENTS.LOAD_FINISH]: EVENT_TYPES.LoadFinishEvent;
  [EVENTS.MODEL_CHANGE]: EVENT_TYPES.ModelChangeEvent;
  [EVENTS.RESIZE]: EVENT_TYPES.ResizeEvent;
  [EVENTS.BEFORE_RENDER]: EVENT_TYPES.BeforeRenderEvent;
  [EVENTS.RENDER]: EVENT_TYPES.RenderEvent;
  [EVENTS.PROGRESS]: EVENT_TYPES.LoadProgressEvent;
  [EVENTS.INPUT_START]: EVENT_TYPES.InputStartEvent;
  [EVENTS.INPUT_END]: EVENT_TYPES.InputEndEvent;
  [EVENTS.CAMERA_CHANGE]: EVENT_TYPES.CameraChangeEvent;
  [EVENTS.ANIMATION_START]: EVENT_TYPES.AnimationStartEvent;
  [EVENTS.ANIMATION_LOOP]: EVENT_TYPES.AnimationLoopEvent;
  [EVENTS.ANIMATION_FINISHED]: EVENT_TYPES.AnimationFinishedEvent;
  [EVENTS.ANNOTATION_FOCUS]: EVENT_TYPES.AnnotationFocusEvent;
  [EVENTS.ANNOTATION_UNFOCUS]: EVENT_TYPES.AnnotationUnfocusEvent;
  [EVENTS.AR_START]: EVENT_TYPES.ARStartEvent;
  [EVENTS.AR_END]: EVENT_TYPES.AREndEvent;
  [EVENTS.AR_MODEL_PLACED]: EVENT_TYPES.ARModelPlacedEvent;
  [EVENTS.QUICK_LOOK_TAP]: EVENT_TYPES.QuickLookTapEvent;
}

/**
 * @interface
 * @see [Options](/docs/options/model/src) page for detailed information
 */
export interface View3DOptions {
  // Model
  src: string | string[] | null;
  iosSrc: string | null;
  variant: number | string | null;
  dracoPath: string;
  ktxPath: string;
  meshoptPath: string | null;
  fixSkinnedBbox: boolean;

  // Control
  fov: typeof AUTO | number;
  center: typeof AUTO | Array<number | string>;
  yaw: number;
  pitch: number;
  pivot: typeof AUTO | Array<number | string>;
  initialZoom: number | {
    axis: "x" | "y" | "z";
    ratio: number;
  };
  rotate: boolean | Partial<RotateControlOptions>;
  translate: boolean | Partial<TranslateControlOptions>;
  zoom: boolean | Partial<ZoomControlOptions>;
  autoplay: boolean | Partial<AutoplayOptions>;
  scrollable: boolean;
  wheelScrollable: boolean;
  useGrabCursor: boolean;
  ignoreCenterOnFit: boolean;

  // Environment
  skybox: string | null;
  envmap: string | null;
  background: number | string | null;
  exposure: number;
  shadow: boolean | Partial<ShadowOptions>;
  skyboxBlur: boolean;
  toneMapping: LiteralUnion<ValueOf<typeof TONE_MAPPING>, THREE.ToneMapping>;
  useDefaultEnv: boolean;

  // Animation
  defaultAnimationIndex: number;
  animationRepeatMode: ValueOf<typeof ANIMATION_REPEAT_MODE>;

  // Annotation
  annotationURL: string | null;
  annotationWrapper: HTMLElement | string;
  annotationSelector: string;
  annotationBreakpoints: Record<number, number>;
  annotationAutoUnfocus: boolean;

  // AR
  webAR: boolean | Partial<WebARSessionOptions>;
  sceneViewer: boolean | Partial<SceneViewerSessionOptions>;
  quickLook: boolean | Partial<QuickLookSessionOptions>;
  arPriority: Array<ValueOf<typeof AR_SESSION_TYPE>>;

  // Others
  poster: string | HTMLElement | null;
  canvasSelector: string;
  autoInit: boolean;
  autoResize: boolean;
  useResizeObserver: boolean;
  maintainSize: boolean;
  on: Partial<View3DEvents>;
  plugins: View3DPlugin[];
  maxDeltaTime: number;
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
  private _annotationManager: AnnotationManager;

  // Internal States
  private _rootEl: HTMLElement;
  private _plugins: View3DPlugin[];
  private _initialized: boolean;
  private _loadingContext: LoadingItem[];

  // Options
  private _src: View3DOptions["src"];
  private _iosSrc: View3DOptions["iosSrc"];
  private _variant: View3DOptions["variant"];
  private _dracoPath: View3DOptions["dracoPath"];
  private _ktxPath: View3DOptions["ktxPath"];
  private _meshoptPath: View3DOptions["meshoptPath"];
  private _fixSkinnedBbox: View3DOptions["fixSkinnedBbox"];

  private _fov: View3DOptions["fov"];
  private _center: View3DOptions["center"];
  private _yaw: View3DOptions["yaw"];
  private _pitch: View3DOptions["pitch"];
  private _pivot: View3DOptions["pivot"];
  private _initialZoom: View3DOptions["initialZoom"];
  private _rotate: View3DOptions["rotate"];
  private _translate: View3DOptions["translate"];
  private _zoom: View3DOptions["zoom"];
  private _autoplay: View3DOptions["autoplay"];
  private _scrollable: View3DOptions["scrollable"];
  private _wheelScrollable: View3DOptions["scrollable"];
  private _useGrabCursor: View3DOptions["useGrabCursor"];
  private _ignoreCenterOnFit: View3DOptions["ignoreCenterOnFit"];

  private _skybox: View3DOptions["skybox"];
  private _envmap: View3DOptions["envmap"];
  private _background: View3DOptions["background"];
  private _exposure: View3DOptions["exposure"];
  private _shadow: View3DOptions["shadow"];
  private _skyboxBlur: View3DOptions["skyboxBlur"];
  private _toneMapping: View3DOptions["toneMapping"];
  private _useDefaultEnv: View3DOptions["useDefaultEnv"];

  private _defaultAnimationIndex: View3DOptions["defaultAnimationIndex"];
  private _animationRepeatMode: View3DOptions["animationRepeatMode"];

  private _annotationURL: View3DOptions["annotationURL"];
  private _annotationWrapper: View3DOptions["annotationWrapper"];
  private _annotationSelector: View3DOptions["annotationSelector"];
  private _annotationBreakpoints: View3DOptions["annotationBreakpoints"];
  private _annotationAutoUnfocus: View3DOptions["annotationAutoUnfocus"];

  private _webAR: View3DOptions["webAR"];
  private _sceneViewer: View3DOptions["sceneViewer"];
  private _quickLook: View3DOptions["quickLook"];
  private _arPriority: View3DOptions["arPriority"];

  private _poster: View3DOptions["poster"];
  private _canvasSelector: View3DOptions["canvasSelector"];
  private _autoInit: View3DOptions["autoInit"];
  private _autoResize: View3DOptions["autoResize"];
  private _useResizeObserver: View3DOptions["useResizeObserver"];
  private _maintainSize: View3DOptions["maintainSize"];
  private _maxDeltaTime: View3DOptions["maxDeltaTime"];

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
  /**
   * {@link AnnotationManager} instance of the View3D
   * @type {AnnotationManager}
   */
  public get annotation() { return this._annotationManager; }

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
   * An array of loading status of assets.
   * @type {LoadingItem[]}
   * @readonly
   * @internal
   */
  public get loadingContext() { return this._loadingContext; }
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
   * Active material variant of the model.
   * Either can be index of the variant(number), or the name of the variant(string)
   * Changing this value will change the material of the model
   * @default null
   * @see https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_variants/README.md
   */
  public get variant() { return this._variant; }
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
   * Specifies the center of the model.
   * If `"auto"` is given, it will use the center of the model's bounding box.
   * Else, you can use a number array as any world position.
   * Or, you can use a string array as a relative position to bounding box min/max. ex) ["0%", "100%", "50%"]
   * The difference to {@link View3D#pivot pivot} is model's bounding box and center position will be shown on screen at every rotation angle.
   * @type {"auto" | Array<number | string>}
   * @default "auto"
   */
  public get center() { return this._center; }
  /**
   * Initial Y-axis rotation of the camera, in degrees.
   * Use {@link Camera#yaw view3D.camera.yaw} instead if you want current yaw value.
   * @type {number}
   * @default 0
   */
  public get yaw() { return this._yaw; }
  /**
   * Initial X-axis rotation of the camera, in degrees.
   * Should be a value from -90 to 90.
   * Use {@link Camera#pitch view3D.camera.pitch} instead if you want current pitch value.
   * @type {number}
   * @default 0
   */
  public get pitch() { return this._pitch; }
  /**
   * Initial origin point of rotation of the camera.
   * If `"auto"` is given, it will use {@link View3D#center model's center} as pivot.
   * Else, you can use a number array as any world position.
   * Or, you can use a string array as a relative position to bounding box min/max. ex) ["0%", "100%", "50%"]
   * Use {@link Camera#pivot view3D.camera.pivot} instead if you want current pivot value.
   * @type {"auto" | Array<number | string>}
   * @default "auto"
   */
  public get pivot() { return this._pivot; }
  /**
   * Initial zoom value.
   * If `number` is given, positive value will make camera zoomed in and negative value will make camera zoomed out.
   * If `object` is given, it will fit model's bounding box's front / side face to the given ratio of the canvas height / width.
   * For example, `{ axis: "y", ratio: 0.5 }` will set the zoom of the camera so that the height of the model to 50% of the height of the canvas.
   * @type {number}
   * @default 0
   */
  public get initialZoom() { return this._initialZoom; }
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
   * When {@link Camera#pivot camera.fit} is called, View3D will adjust camera with the model so that the model is not clipped from any camera rotation by assuming {@link View3D#center center} as origin of the rotation by default.
   * This will ignore that behavior by forcing model's bbox center as center of the rotation while fitting the camera to the model.
   * @type {boolean}
   * @default false
   */
  public get ignoreCenterOnFit() { return this._ignoreCenterOnFit; }
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
   * Whether to use generated default environment map.
   * @type {boolean}
   * @default true
   */
  public get useDefaultEnv() { return this._useDefaultEnv; }
  /**
   * Index of the animation to play after the model is loaded
   * @type {number}
   * @default 0
   */
  public get defaultAnimationIndex() { return this._defaultAnimationIndex; }
  /**
   * Repeat mode of the animator.
   * "one" will repeat single animation, and "all" will repeat all animations.
   * "none" will make animation to automatically paused on its last frame.
   * @see ANIMATION_REPEAT_MODE
   * @type {string}
   * @default "one"
   */
  public get animationRepeatMode() { return this._animationRepeatMode; }
  /**
   * An URL to the JSON file that has annotation informations.
   * @type {string | null}
   * @default null
   */
  public get annotationURL() { return this._annotationURL; }
  /**
   * An element or CSS selector of the annotation wrapper element.
   * @type {HTMLElement | string}
   * @default ".view3d-annotation-wrapper"
   */
  public get annotationWrapper() { return this._annotationWrapper; }
  /**
   * CSS selector of the annotation elements inside the root element
   * @type {string}
   * @default ".view3d-annotation"
   */
  public get annotationSelector() { return this._annotationSelector; }
  /**
   * Breakpoints for the annotation opacity, mapped by degree between (camera-model center-annotation) as key.
   * @type {Record<number, number>}
   * @default { 165: 0, 135: 0.4, 0: 1 }
   */
  public get annotationBreakpoints() { return this._annotationBreakpoints; }
  /**
   * Whether to automatically unfocus annotation on user input
   * @type {boolean}
   * @default true
   */
  public get annotationAutoUnfocus() { return this._annotationAutoUnfocus; }
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
   * Poster image that will be displayed before the 3D model is loaded.
   * If `string` URL is given, View3D will temporarily show poster image element with that url as src before the first model is loaded
   * If `string` CSS selector of DOM element inside view3d-wrapper or `HTMLElement` is given, View3D will remove that element after the first model is loaded
   * @type {string | HTMLElement | null}
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
  /**
   * Whether to retain 3D model's visual size on canvas resize
   * @type {boolean}
   * @default false
   */
  public get maintainSize() { return this._maintainSize; }
  /**
   * Maximum delta time in any given frame
   * This can prevent a long frame hitch / lag
   * The default value is 1/30(30 fps). Set this value to `Infinity` to disable
   * @type {number}
   * @default 1/30
   */
  public get maxDeltaTime() { return this._maxDeltaTime; }

  public set iosSrc(val: View3DOptions["iosSrc"]) { this._iosSrc = val; }
  public set variant(val: View3DOptions["variant"]) {
    if (this._model) {
      this._model.selectVariant(val)
        .then(() => {
          this.renderer.renderSingleFrame();
        });
    }
    this._variant = val;
  }
  public set defaultAnimationIndex(val: View3DOptions["defaultAnimationIndex"]) { this._defaultAnimationIndex = val; }
  public set initialZoom(val: View3DOptions["initialZoom"]) { this._initialZoom = val; }

  public set skybox(val: View3DOptions["skybox"]) {
    void this._scene.setSkybox(val);
    this._skybox = val;

    if (!val && this._useDefaultEnv) {
      this._scene.setDefaultEnv();
    }
  }

  public set envmap(val: View3DOptions["envmap"]) {
    void this._scene.setEnvMap(val);
    this._envmap = val;

    if (!val && this._useDefaultEnv) {
      this._scene.setDefaultEnv();
    }
  }

  public set exposure(val: View3DOptions["exposure"]) {
    this._exposure = val;
    this._renderer.threeRenderer.toneMappingExposure = val;
    this._renderer.renderSingleFrame();
  }

  public set skyboxBlur(val: View3DOptions["skyboxBlur"]) {
    this._skyboxBlur = val;
    const scene = this._scene;
    const root = scene.root;
    const origEnvmapTexture = scene.root.environment;

    if (origEnvmapTexture && root.background !== null) {
      if (val) {
        root.background = Skybox.createBlurredHDR(this, origEnvmapTexture);
      } else {
        root.background = origEnvmapTexture;
      }
    }
  }

  public set toneMapping(val: View3DOptions["toneMapping"]) {
    this._toneMapping = val;
    this._renderer.threeRenderer.toneMapping = val as THREE.ToneMapping;
    this._renderer.renderSingleFrame();
  }

  public set useGrabCursor(val: View3DOptions["useGrabCursor"]) {
    this._useGrabCursor = val;
    this._control.updateCursor();
  }

  public set animationRepeatMode(val: View3DOptions["animationRepeatMode"]) {
    this._animationRepeatMode = val;
    this._animator.updateRepeatMode();
  }

  public set autoResize(val: View3DOptions["autoResize"]) {
    this._autoResize = val;

    if (val) {
      this._autoResizer.enable();
    } else {
      this._autoResizer.disable();
    }
  }

  public set maintainSize(val: View3DOptions["maintainSize"]) { this._maintainSize = val; }
  public set maxDeltaTime(val: View3DOptions["maxDeltaTime"]) { this._maxDeltaTime = val; }

  /**
   * Creates new View3D instance.
   * @param root A root element or selector of it to initialize View3D
   * @param {View3DOptions} [options={}] An options object for View3D
   * @throws {View3DError}
   */
  public constructor(root: string | HTMLElement, {
    src = null,
    iosSrc = null,
    variant = null,
    dracoPath = DEFAULT.DRACO_DECODER_URL,
    ktxPath = DEFAULT.KTX_TRANSCODER_URL,
    meshoptPath = null,
    fixSkinnedBbox = false,
    fov = AUTO,
    center = AUTO,
    yaw = 0,
    pitch = 0,
    pivot = AUTO,
    initialZoom = 0,
    rotate = true,
    translate = true,
    zoom = true,
    autoplay = false,
    scrollable = true,
    wheelScrollable = false,
    useGrabCursor = true,
    ignoreCenterOnFit = false,
    skybox = null,
    envmap = null,
    background = null,
    exposure = 1,
    shadow = true,
    skyboxBlur = false,
    toneMapping = TONE_MAPPING.LINEAR,
    useDefaultEnv = true,
    defaultAnimationIndex = 0,
    animationRepeatMode = ANIMATION_REPEAT_MODE.ONE,
    annotationURL = null,
    annotationWrapper = `.${DEFAULT_CLASS.ANNOTATION_WRAPPER}`,
    annotationSelector = `.${DEFAULT_CLASS.ANNOTATION}`,
    annotationBreakpoints = DEFAULT.ANNOTATION_BREAKPOINT,
    annotationAutoUnfocus = true,
    webAR = true,
    sceneViewer = true,
    quickLook = true,
    arPriority = DEFAULT.AR_PRIORITY,
    poster = null,
    canvasSelector = "canvas",
    autoInit = true,
    autoResize = true,
    useResizeObserver = true,
    maintainSize = false,
    on = {},
    plugins = [],
    maxDeltaTime = 1 / 30
  }: Partial<View3DOptions> = {}) {
    super();

    this._rootEl = getElement(root);

    // Bind options
    this._src = src;
    this._iosSrc = iosSrc;
    this._variant = variant;
    this._dracoPath = dracoPath;
    this._ktxPath = ktxPath;
    this._meshoptPath = meshoptPath;
    this._fixSkinnedBbox = fixSkinnedBbox;

    this._fov = fov;
    this._center = center;
    this._yaw = yaw;
    this._pitch = pitch;
    this._pivot = pivot;
    this._initialZoom = initialZoom;
    this._rotate = rotate;
    this._translate = translate;
    this._zoom = zoom;
    this._autoplay = autoplay;
    this._scrollable = scrollable;
    this._wheelScrollable = wheelScrollable;
    this._useGrabCursor = useGrabCursor;
    this._ignoreCenterOnFit = ignoreCenterOnFit;

    this._skybox = skybox;
    this._envmap = envmap;
    this._background = background;
    this._exposure = exposure;
    this._shadow = shadow;
    this._skyboxBlur = skyboxBlur;
    this._toneMapping = toneMapping;
    this._useDefaultEnv = useDefaultEnv;

    this._defaultAnimationIndex = defaultAnimationIndex;
    this._animationRepeatMode = animationRepeatMode;

    this._annotationURL = annotationURL;
    this._annotationWrapper = annotationWrapper;
    this._annotationSelector = annotationSelector;
    this._annotationBreakpoints = annotationBreakpoints;
    this._annotationAutoUnfocus = annotationAutoUnfocus;

    this._webAR = webAR;
    this._sceneViewer = sceneViewer;
    this._quickLook = quickLook;
    this._arPriority = arPriority;

    this._poster = poster;
    this._canvasSelector = canvasSelector;
    this._autoInit = autoInit;
    this._autoResize = autoResize;
    this._useResizeObserver = useResizeObserver;
    this._maintainSize = maintainSize;

    this._model = null;
    this._initialized = false;
    this._loadingContext = [];
    this._plugins = plugins;
    this._maxDeltaTime = maxDeltaTime;

    // Create internal components
    this._renderer = new Renderer(this);
    this._camera = new Camera(this);
    this._control = new OrbitControl(this);
    this._scene = new Scene(this);
    this._animator = new ModelAnimator(this);
    this._autoPlayer = new AutoPlayer(this, getObjectOption(autoplay));
    this._autoResizer = new AutoResizer(this);
    this._arManager = new ARManager(this);
    this._annotationManager = new AnnotationManager(this);

    this._addEventHandlers(on);
    this._addPosterImage();

    void (async () => {
      await this._initPlugins(plugins);

      if (src && autoInit) {
        await this.init();
      }
    })();
  }

  /**
   * Destroy View3D instance and remove all events attached to it
   * @returns {void}
   */
  public destroy(): void {
    this._scene.reset();
    this._renderer.destroy();
    this._control.destroy();
    this._autoResizer.disable();
    this._animator.destroy();
    this._annotationManager.destroy();
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

    const scene = this._scene;
    const renderer = this._renderer;
    const control = this._control;
    const animator = this._animator;
    const annotationManager = this._annotationManager;
    const meshoptPath = this._meshoptPath;
    const tasks: Array<Promise<any>> = [];

    this.resize();
    animator.init();
    annotationManager.init();

    if (this._autoResize) {
      this._autoResizer.enable();
    }

    if (meshoptPath && !GLTFLoader.meshoptDecoder) {
      await GLTFLoader.setMeshoptDecoder(meshoptPath);
    }

    // Load & set skybox / envmap before displaying model
    tasks.push(...scene.initTextures());

    const loadModel = this._loadModel(this._src);
    tasks.push(...loadModel);

    void this._resetLoadingContextOnFinish(tasks);

    await Promise.race(loadModel);

    if (this._annotationURL) {
      await this._annotationManager.load(this._annotationURL);
    }

    control.enable();
    if (this._autoplay) {
      this._autoPlayer.enable();
    }

    // Start rendering
    renderer.stopAnimationLoop();
    renderer.setAnimationLoop(renderer.defaultRenderLoop);
    renderer.renderSingleFrame();

    this._initialized = true;
    this.trigger(EVENTS.READY, { type: EVENTS.READY, target: this });
  }

  /**
   * Resize View3D instance to fit current canvas size
   * @returns {void}
   */
  public resize() {
    const renderer = this._renderer;
    const prevSize = this._initialized ? renderer.size : null;
    renderer.resize();

    const newSize = renderer.size;
    this._camera.resize(newSize, prevSize);
    this._control.resize(newSize);
    this._annotationManager.resize();

    // Prevent flickering on resize
    if (this._initialized) {
      renderer.renderSingleFrame(true);
    }

    this.trigger(EVENTS.RESIZE, { ...newSize, type: EVENTS.RESIZE, target: this });
  }

  /**
   * Load a new 3D model and replace it with the current one
   * @param {string | string[]} src Source URL to fetch 3D model from
   * @param {object} [options={}] Options
   * @param {string | null} [options.iosSrc] Source URL to fetch 3D model in iOS AR Quick Look. `usdz` models are supported.
   */
  public async load(src: string | string[], {
    iosSrc = null
  }: Partial<{
    iosSrc: string | null;
  }> = {}) {
    if (this._initialized) {
      const loadModel = this._loadModel(src);
      void this._resetLoadingContextOnFinish(loadModel);

      await Promise.race(loadModel);

      // Change the src later as an error can occur while loading the model
      this._src = src;
      this._iosSrc = iosSrc;
    } else {
      this._src = src;
      this._iosSrc = iosSrc;

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
    const annotationManager = this._annotationManager;
    const inXR = renderer.threeRenderer.xr.isPresenting;

    scene.reset();
    scene.add(model.scene);

    scene.shadowPlane.updateDimensions(model);

    if (resetCamera) {
      camera.fit(model);
      void camera.reset(0);
    }

    animator.reset();
    animator.setClips(model.animations);

    if (model.animations.length > 0) {
      animator.play(this._defaultAnimationIndex);
    }

    annotationManager.reset();
    annotationManager.collect();
    annotationManager.add(...model.annotations);

    this._model = model;

    if (inXR) {
      const activeSession = this._arManager.activeSession;

      if (activeSession) {
        activeSession.control.syncTargetModel(model);
      }
    }

    if (this._initialized) {
      renderer.renderSingleFrame();
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

  private _loadModel(src: string | string[]): Array<Promise<void>> {
    const loader = new GLTFLoader(this);

    if (Array.isArray(src)) {
      const loaded = src.map(() => false);
      const loadModels = src.map((srcLevel, level) => this._loadSingleModel(loader, srcLevel, level, loaded));

      return loadModels;
    } else {
      return [this._loadSingleModel(loader, src, 0, [false])];
    }
  }

  private async _loadSingleModel(loader: GLTFLoader, src: string, level: number, loaded: boolean[]) {
    const maxLevel = loaded.length - 1;

    this.trigger(EVENTS.LOAD_START, {
      type: EVENTS.LOAD_START,
      target: this,
      src,
      level,
      maxLevel
    });

    try {
      const model = await loader.load(src);
      const higherLevelLoaded = loaded.slice(level + 1).some(val => !!val);
      const modelLoadedBefore = loaded.some(val => !!val);

      this.trigger(EVENTS.LOAD, {
        type: EVENTS.LOAD,
        target: this,
        model,
        level,
        maxLevel
      });

      loaded[level] = true;

      if (higherLevelLoaded) return;

      this.display(model, {
        resetCamera: !modelLoadedBefore
      });
    } catch (error) {
      this.trigger(EVENTS.LOAD_ERROR, {
        type: EVENTS.LOAD_ERROR,
        target: this,
        level,
        maxLevel,
        error
      });

      throw new View3DError(ERROR.MESSAGES.MODEL_FAIL_TO_LOAD(src), ERROR.CODES.MODEL_FAIL_TO_LOAD);
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

    const isPosterEl = isElement(poster);
    let posterEl: HTMLElement;

    if (isPosterEl || isCSSSelector(poster)) {
      const elCandidate = isPosterEl ? poster : rootEl.querySelector(poster as any);

      if (!elCandidate) {
        throw new View3DError(ERROR.MESSAGES.ELEMENT_NOT_FOUND(poster as string), ERROR.CODES.ELEMENT_NOT_FOUND);
      }

      posterEl = elCandidate as HTMLElement;
    } else {
      const imgEl = document.createElement("img");
      imgEl.className = DEFAULT_CLASS.POSTER;
      imgEl.src = poster as string;

      rootEl.appendChild(imgEl);

      posterEl = imgEl;

      this.once(EVENTS.READY, () => {
        if (imgEl.parentElement !== rootEl) return;
        rootEl.removeChild(imgEl);
      });
    }

    this.once(EVENTS.READY, () => {
      if (!posterEl.parentElement) return;

      // Remove that element from the parent element
      posterEl.parentElement.removeChild(posterEl);
    });
  }

  private async _initPlugins(plugins: View3DPlugin[]) {
    await Promise.all(plugins.map(plugin => plugin.init(this)));
  }

  private async _resetLoadingContextOnFinish(tasks: Array<Promise<any>>) {
    void Promise.all(tasks).then(() => {
      this.trigger(EVENTS.LOAD_FINISH, {
        type: EVENTS.LOAD_FINISH,
        target: this
      });
      this._loadingContext = [];
    });
  }
}

export default View3D;
