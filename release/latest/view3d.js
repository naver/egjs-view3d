/*
Copyright (c) 2020-present NAVER Corp.
name: @egjs/view3d
license: MIT
author: NAVER Corp.
repository: https://github.com/naver/egjs-view3d
version: 2.0.0
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@egjs/component'), require('three'), require('three/examples/jsm/loaders/RGBELoader'), require('three/examples/jsm/loaders/GLTFLoader'), require('three/examples/jsm/loaders/DRACOLoader'), require('three/examples/jsm/loaders/KTX2Loader')) :
    typeof define === 'function' && define.amd ? define(['@egjs/component', 'three', 'three/examples/jsm/loaders/RGBELoader', 'three/examples/jsm/loaders/GLTFLoader', 'three/examples/jsm/loaders/DRACOLoader', 'three/examples/jsm/loaders/KTX2Loader'], factory) :
    (global = global || self, global.View3D = factory(global.Component, global.THREE, global.RGBELoader, global.GLTFLoader, global.DRACOLoader, global.KTX2Loader));
}(this, (function (Component, THREE, RGBELoader, GLTFLoader$1, DRACOLoader, KTX2Loader) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    function __rest(s, e) {
      var t = {};

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
    }
    function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */

    /**
     * Error thrown by View3D
     */
    class View3DError extends Error {
      /**
       * Create new instance of View3DError
       */
      constructor(message, code) {
        super(message);
        Object.setPrototypeOf(this, View3DError.prototype);
        this.name = "View3DError";
        this.code = code;
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */

    /**
     * Error codes of {@link View3DError}
     * @type object
     * @property {number} WRONG_TYPE 0
     * @property {number} ELEMENT_NOT_FOUND 1
     * @property {number} CANVAS_NOT_FOUND 2
     * @property {number} WEBGL_NOT_SUPPORTED 3
     * @property {number} PROVIDE_SRC_FIRST 4
     * @property {number} PROVIDE_WIDTH_OR_HEIGHT 5
     * @property {number} FORMAT_NOT_SUPPORTED 6
     * @property {number} FILE_NOT_SUPPORTED 7
     * @property {number} NOT_INITIALIZED 8
     */
    const ERROR_CODES = {
      WRONG_TYPE: 0,
      ELEMENT_NOT_FOUND: 1,
      CANVAS_NOT_FOUND: 2,
      WEBGL_NOT_SUPPORTED: 3,
      PROVIDE_SRC_FIRST: 4,
      PROVIDE_WIDTH_OR_HEIGHT: 5,
      FORMAT_NOT_SUPPORTED: 6,
      FILE_NOT_SUPPORTED: 7,
      NOT_INITIALIZED: 8
    };
    const MESSAGES = {
      WRONG_TYPE: (val, types) => `${typeof val} is not a ${types.map(type => `"${type}"`).join(" or ")}.`,
      ELEMENT_NOT_FOUND: query => `Element with selector "${query}" not found.`,
      CANVAS_NOT_FOUND: "The canvas element was not found inside the given root element",
      WEBGL_NOT_SUPPORTED: "WebGL is not supported on this browser.",
      PROVIDE_SRC_FIRST: "\"src\" should be provided before initialization",
      PROVIDE_WIDTH_OR_HEIGHT: "Either width or height should be given.",
      FORMAT_NOT_SUPPORTED: format => `Given format "${format}" is not supported or invalid`,
      FILE_NOT_SUPPORTED: src => `Given file "${src}" is not supported.`,
      NOT_INITIALIZED: "View3D is not initialized yet"
    };
    var ERROR = {
      CODES: ERROR_CODES,
      MESSAGES
    };

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    const getNullableElement = (el, parent) => {
      let targetEl = null;

      if (typeof el === "string") {
        const parentEl = parent ? parent : document;
        const queryResult = parentEl.querySelector(el);

        if (!queryResult) {
          throw new View3DError(ERROR.MESSAGES.ELEMENT_NOT_FOUND(el), ERROR.CODES.ELEMENT_NOT_FOUND);
        }

        targetEl = queryResult;
      } else if (el && el.nodeType === Node.ELEMENT_NODE) {
        targetEl = el;
      }

      return targetEl;
    };
    const getElement = (el, parent) => {
      const targetEl = getNullableElement(el, parent);

      if (!targetEl) {
        throw new View3DError(ERROR.MESSAGES.WRONG_TYPE(el, ["HTMLElement", "string"]), ERROR.CODES.WRONG_TYPE);
      }

      return targetEl;
    };
    const findCanvas = (root, selector) => {
      const canvas = root.querySelector(selector);

      if (!canvas) {
        throw new View3DError(ERROR.MESSAGES.CANVAS_NOT_FOUND, ERROR.CODES.CANVAS_NOT_FOUND);
      }

      return canvas;
    };
    const toRadian = x => {
      return x * Math.PI / 180;
    };
    const toDegree = x => {
      return x * 180 / Math.PI;
    };
    const clamp = (x, min, max) => {
      return Math.max(Math.min(x, max), min);
    };

    const mix = (a, b, t) => {
      return a * (1 - t) + b * t;
    };
    const circulate = (val, min, max) => {
      const size = Math.abs(max - min);

      if (val < min) {
        const offset = (min - val) % size;
        val = max - offset;
      } else if (val > max) {
        const offset = (val - max) % size;
        val = min + offset;
      }

      return val;
    }; // eslint-disable-next-line @typescript-eslint/ban-types

    const merge = (target, ...srcs) => {
      srcs.forEach(source => {
        Object.keys(source).forEach(key => {
          const value = source[key];

          if (Array.isArray(target[key]) && Array.isArray(value)) {
            target[key] = [...target[key], ...value];
          } else {
            target[key] = value;
          }
        });
      });
      return target;
    };
    const toPowerOfTwo = val => {
      let result = 1;

      while (result < val) {
        result *= 2;
      }

      return result;
    };

    const getRotationAngle = (center, v1, v2) => {
      const centerToV1 = new THREE.Vector2().subVectors(v1, center).normalize();
      const centerToV2 = new THREE.Vector2().subVectors(v2, center).normalize(); // Get the rotation angle with the model's NDC coordinates as the center.

      const deg = centerToV2.angle() - centerToV1.angle();
      const compDeg = -Math.sign(deg) * (2 * Math.PI - Math.abs(deg)); // Take the smaller deg

      const rotationAngle = Math.abs(deg) < Math.abs(compDeg) ? deg : compDeg;
      return rotationAngle;
    };
    const getObjectOption = val => typeof val === "object" ? val : {};
    const toBooleanString = val => val ? "true" : "false";
    const getRotatedPosition = (distance, yawDeg, pitchDeg) => {
      const yaw = toRadian(yawDeg);
      const pitch = toRadian(pitchDeg);
      const newPos = new THREE.Vector3(0, 0, 0);
      newPos.y = distance * Math.sin(pitch);
      newPos.z = distance * Math.cos(pitch);
      newPos.x = newPos.z * Math.sin(-yaw);
      newPos.z = newPos.z * Math.cos(-yaw);
      return newPos;
    };

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    const AUTO = "auto";
    /**
     * Event type object with event name strings of {@link View3D}
     * @type {object}
     * @property {"ready"} READY {@link /docs/events/ready Ready event}
     * @property {"load"} LOAD {@link /docs/events/load Load event}
     * @property {"resize"} RESIZE {@link /docs/events/resize Resize event}
     * @property {"beforeRender"} BEFORE_RENDER {@link /docs/events/beforeRender Before render event}
     * @property {"render"} RENDER {@link /docs/events/render Render event}
     * @property {"progress"} PROGRESS {@link /docs/events/progress Progress event}
     * @property {"quickLookTap"} QUICK_LOOK_TAP {@link /docs/events/quickLookTap Quick Look Tap event}
     * @property {"arStart"} AR_START {@link /docs/events/arStart AR start evemt}
     * @property {"arEnd"} AR_END {@link /docs/events/arEnd AR end event}
     * @property {"arModelPlaced"} AR_MODEL_PLACED {@link /docs/events/arModelPlaced AR model placed event}
     * @example
     * ```ts
     * import { EVENTS } from "@egjs/view3d";
     * EVENTS.RESIZE; // "resize"
     * ```
     */

    const EVENTS = {
      READY: "ready",
      LOAD: "load",
      MODEL_CHANGE: "modelChange",
      RESIZE: "resize",
      BEFORE_RENDER: "beforeRender",
      RENDER: "render",
      PROGRESS: "progress",
      QUICK_LOOK_TAP: "quickLookTap",
      AR_START: "arStart",
      AR_END: "arEnd",
      AR_MODEL_PLACED: "arModelPlaced"
    };
    /**
     * Collection of predefined easing functions
     * @type {object}
     * @property {function} SINE_WAVE
     * @property {function} EASE_OUT_CUBIC
     * @property {function} EASE_OUT_BOUNCE
     * @example
     * ```ts
     * import View3D, { EASING } from "@egjs/view3d";
     *
     * new RotateControl({
     *  easing: EASING.EASE_OUT_CUBIC,
     * });
     * ```
     */

    const EASING = {
      SINE_WAVE: x => Math.sin(x * Math.PI * 2),
      EASE_OUT_CUBIC: x => 1 - Math.pow(1 - x, 3),
      EASE_OUT_BOUNCE: x => {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
          return n1 * x * x;
        } else if (x < 2 / d1) {
          return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
          return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
          return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
      }
    };
    /**
     * Available AR session types
     * @type {object}
     * @property {"WebXR"} WEBXR An AR session based on {@link https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API WebXR Device API}
     * @property {"SceneViewer"} SCENE_VIEWER An AR session based on {@link https://developers.google.com/ar/develop/java/scene-viewer Google SceneViewer}, which is only available in Android
     * @property {"QuickLook"} QUICK_LOOK An AR session based on Apple {@link https://developer.apple.com/augmented-reality/quick-look/ AR Quick Look}, which is only available in iOS
     */

    const AR_SESSION_TYPE = {
      WEBXR: "webAR",
      SCENE_VIEWER: "sceneViewer",
      QUICK_LOOK: "quickLook"
    };
    /**
     * @type {object}
     * @property {"ar_only"} ONLY_AR
     * @property {"3d_only"} ONLY_3D
     * @property {"ar_preferred"} PREFER_AR
     * @property {"3d_preferred"} PREFER_3D
     */

    const SCENE_VIEWER_MODE = {
      ONLY_AR: "ar_only",
      ONLY_3D: "3d_only",
      PREFER_AR: "ar_preferred",
      PREFER_3D: "3d_preferred"
    };
    /**
     * <img src="https://docs-assets.developer.apple.com/published/b122cc68df/10cb0534-e1f6-42ed-aadb-5390c55ad3ff.png" />
     * @see https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look
     * @property {"plain"} PLAIN
     * @property {"pay"} PAY
     * @property {"buy"} BUY
     * @property {"check-out"} CHECK_OUT
     * @property {"book"} BOOK
     * @property {"donate"} DONATE
     * @property {"subscribe"} SUBSCRIBE
     */

    const QUICK_LOOK_APPLE_PAY_BUTTON_TYPE = {
      PLAIN: "plain",
      PAY: "pay",
      BUY: "buy",
      CHECK_OUT: "check-out",
      BOOK: "book",
      DONATE: "donate",
      SUBSCRIBE: "subscribe"
    };
    /**
     * Available size of the custom banner
     * @type {object}
     * @property {"small"} SMALL 81pt
     * @property {"medium"} MEDIUM 121pt
     * @property {"large"} LARGE 161pt
     */

    const QUICK_LOOK_CUSTOM_BANNER_SIZE = {
      SMALL: "small",
      MEDIUM: "medium",
      LARGE: "large"
    };

    var Constants = {
        __proto__: null,
        AUTO: AUTO,
        EVENTS: EVENTS,
        EASING: EASING,
        AR_SESSION_TYPE: AR_SESSION_TYPE,
        SCENE_VIEWER_MODE: SCENE_VIEWER_MODE,
        QUICK_LOOK_APPLE_PAY_BUTTON_TYPE: QUICK_LOOK_APPLE_PAY_BUTTON_TYPE,
        QUICK_LOOK_CUSTOM_BANNER_SIZE: QUICK_LOOK_CUSTOM_BANNER_SIZE,
        ERROR_CODES: ERROR_CODES
    };

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Renderer that renders View3D's Scene
     */

    class Renderer {
      /**
       * Create new Renderer instance
       * @param canvas \<canvas\> element to render 3d model
       */
      constructor(view3D) {
        this._defaultRenderLoop = delta => {
          const view3D = this._view3D;
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

          this._renderer.render(scene.root, camera.threeCamera);

          view3D.trigger(EVENTS.RENDER, {
            type: EVENTS.RENDER,
            target: view3D,
            delta: deltaMiliSec
          });
        };

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
       * {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement HTMLCanvasElement} given when creating View3D instance
       * @type HTMLCanvasElement
       * @readonly
       */


      get canvas() {
        return this._canvas;
      }
      /**
       * Current {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext WebGLRenderingContext}
       * @type WebGLRenderingContext
       * @readonly
       */


      get context() {
        return this._renderer.context;
      }
      /**
       * Three.js {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer WebGLRenderer} instance
       * @type THREE.WebGLRenderer
       * @readonly
       */


      get threeRenderer() {
        return this._renderer;
      }
      /**
       * Default render loop of View3D
       * @type {function}
       * @readonly
       */


      get defaultRenderLoop() {
        return this._defaultRenderLoop;
      }
      /**
       * The width and height of the renderer's output canvas
       * @type {object}
       * @param {number} width Width of the canvas
       * @param {number} height Height of the canvas
       * @readonly
       */


      get size() {
        const canvasSize = this._renderer.getSize(new THREE.Vector2());

        return {
          width: canvasSize.width,
          height: canvasSize.y
        };
      }
      /**
       * Resize the renderer based on current canvas width / height
       * @returns {void}
       */


      resize() {
        const renderer = this._renderer;
        const canvas = this._canvas;
        if (renderer.xr.isPresenting) return;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);
      }

      setAnimationLoop(callback) {
        this._clock.start();

        this._renderer.setAnimationLoop((timestamp, frame) => {
          const delta = this._clock.getDelta();

          callback(delta, frame);
        });
      }

      stopAnimationLoop() {
        this._clock.stop(); // See https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setAnimationLoop


        this._renderer.setAnimationLoop(null);
      }
      /**
       * Enable shadow map
       */


      enableShadow() {
        const threeRenderer = this._renderer;
        threeRenderer.shadowMap.enabled = true;
        threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }
      /**
       * Disable shadow map
       */


      disableShadow() {
        const threeRenderer = this._renderer;
        threeRenderer.shadowMap.enabled = false;
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Texture loader
     */

    class TextureLoader {
      /**
       * Create new TextureLoader instance
       * @param renderer {@link Renderer} instance of View3D
       */
      constructor(renderer) {
        this._renderer = renderer;
      }
      /**
       * Create new {@link https://threejs.org/docs/index.html#api/en/textures/Texture Texture} with given url
       * Texture's {@link https://threejs.org/docs/index.html#api/en/textures/Texture.flipY flipY} property is `true` by Three.js's policy, so be careful when using it as a map texture.
       * @param url url to fetch image
       */


      load(url) {
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


      loadEquirectagularTexture(url) {
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


      loadCubeTexture(urls) {
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


      loadHDRTexture(url) {
        return new Promise((resolve, reject) => {
          const loader = new RGBELoader.RGBELoader();
          loader.setCrossOrigin("anonymous");
          loader.load(url, texture => {
            resolve(this._equirectToCubemap(texture));
          }, undefined, reject);
        });
      }

      _equirectToCubemap(texture) {
        const pmremGenerator = new THREE.PMREMGenerator(this._renderer.threeRenderer);
        const hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
        pmremGenerator.compileCubemapShader();
        return hdrCubeRenderTarget;
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    // Constants that used internally
    // Texture map names that used in THREE#MeshStandardMaterial
    const STANDARD_MAPS = ["alphaMap", "aoMap", "bumpMap", "displacementMap", "emissiveMap", "envMap", "lightMap", "map", "metalnessMap", "normalMap", "roughnessMap"];
    const CONTROL_EVENTS = {
      HOLD: "hold",
      RELEASE: "release",
      ENABLE: "enable",
      DISABLE: "disable"
    };
    var GESTURE;

    (function (GESTURE) {
      GESTURE[GESTURE["NONE"] = 0] = "NONE";
      GESTURE[GESTURE["ONE_FINGER_HORIZONTAL"] = 1] = "ONE_FINGER_HORIZONTAL";
      GESTURE[GESTURE["ONE_FINGER_VERTICAL"] = 2] = "ONE_FINGER_VERTICAL";
      GESTURE[GESTURE["ONE_FINGER"] = 3] = "ONE_FINGER";
      GESTURE[GESTURE["TWO_FINGER_HORIZONTAL"] = 4] = "TWO_FINGER_HORIZONTAL";
      GESTURE[GESTURE["TWO_FINGER_VERTICAL"] = 8] = "TWO_FINGER_VERTICAL";
      GESTURE[GESTURE["TWO_FINGER"] = 12] = "TWO_FINGER";
      GESTURE[GESTURE["PINCH"] = 16] = "PINCH";
    })(GESTURE || (GESTURE = {}));

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    // Browser related constants
    const IS_IOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    const IS_ANDROID = () => /android/i.test(navigator.userAgent);
    const EVENTS$1 = {
      MOUSE_DOWN: "mousedown",
      MOUSE_MOVE: "mousemove",
      MOUSE_UP: "mouseup",
      TOUCH_START: "touchstart",
      TOUCH_MOVE: "touchmove",
      TOUCH_END: "touchend",
      WHEEL: "wheel",
      RESIZE: "resize",
      CONTEXT_MENU: "contextmenu",
      MOUSE_ENTER: "mouseenter",
      MOUSE_LEAVE: "mouseleave",
      LOAD: "load",
      ERROR: "error"
    }; // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.button

    var MOUSE_BUTTON;

    (function (MOUSE_BUTTON) {
      MOUSE_BUTTON[MOUSE_BUTTON["LEFT"] = 0] = "LEFT";
      MOUSE_BUTTON[MOUSE_BUTTON["MIDDLE"] = 1] = "MIDDLE";
      MOUSE_BUTTON[MOUSE_BUTTON["RIGHT"] = 2] = "RIGHT";
    })(MOUSE_BUTTON || (MOUSE_BUTTON = {}));

    const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Helper class to easily add shadow plane under your 3D model
     */

    class ShadowPlane {
      /**
       * Create new shadow plane
       * @param {object} options Options
       * @param {number} [options.opacity=0.3] Opacity of the shadow.
       * @param {number} [options.hardness=6] Hardness of the shadow. Should be integer greater than 0, and lower the softer the shadow is.
       * @param {number} [options.yaw=0] Y-axis rotation of the light that casts shadow.
       * @param {number} [options.pitch=0] X-axis rotation of the light that casts shadow.
       */
      constructor(view3D, {
        opacity = 0.3,
        hardness = 6,
        yaw = 0,
        pitch = 0
      } = {}) {
        this._hardness = hardness;
        this._yaw = yaw;
        this._pitch = pitch;
        this._geometry = new THREE.PlaneBufferGeometry(2, 2);
        this._material = new THREE.ShadowMaterial({
          opacity,
          fog: false
        });
        this._mesh = new THREE.Mesh(this._geometry, this._material);
        this._light = new THREE.DirectionalLight();
        this._baseLightPos = new THREE.Vector3();
        this._modelRadius = 0;
        const mesh = this._mesh;
        mesh.rotateX(-Math.PI / 2);
        mesh.scale.setScalar(Math.pow(2, 32) - 1);
        mesh.receiveShadow = true;
        mesh.castShadow = false;
        mesh.name = "ShadowPlane-Mesh";
        const light = this._light;
        light.intensity = 0;
        light.target = mesh;
        light.castShadow = true;
        light.name = "ShadowPlane-Light";
        const maxTexSize = view3D.renderer.threeRenderer.capabilities.maxTextureSize;
        this._maxHardness = Math.round(Math.log(maxTexSize) / Math.log(2));

        this._updateSoftnessLevel();
      }
      /**
       * Shadow plane mesh
       * @type {THREE.Mesh}
       * @readonly
       */


      get mesh() {
        return this._mesh;
      }
      /**
       * Shadow light
       * @type {THREE.DirectionalLight}
       * @readonly
       */


      get light() {
        return this._light;
      }
      /**
       * Shadow opacity, value can be between 0(invisible) and 1(solid)
       * @type {number}
       * @default 0.3
       */


      get opacity() {
        return this._material.opacity;
      }
      /**
       * Hardness of the shadow. Should be integer greater than 0, and lower the softer the shadow is.
       * @type {number}
       * @default 6
       */


      get hardness() {
        return this._hardness;
      }
      /**
       * Y-axis rotation of the shadow.
       * @type {number}
       * @default 0
       */


      get yaw() {
        return this._yaw;
      }
      /**
       * X-axis rotation of the shadow.
       * @type {number}
       * @default 0
       */


      get pitch() {
        return this._pitch;
      }

      set opacity(val) {
        this._material.opacity = val;
      }

      update(model) {
        this._updatePlane(model);

        this._updateLightPosition(model);

        this.updateShadow();
      }

      updateShadow(worldScale = 1) {
        const light = this._light;
        const scale = 1.5;
        const shadowCam = light.shadow.camera;
        const radius = this._modelRadius;
        light.position.copy(this._baseLightPos.clone().multiplyScalar(worldScale));
        const camSize = scale * worldScale * radius;
        shadowCam.near = 0;
        shadowCam.far = MAX_SAFE_INTEGER;
        shadowCam.left = -camSize;
        shadowCam.right = camSize;
        shadowCam.top = camSize;
        shadowCam.bottom = -camSize;
        shadowCam.updateProjectionMatrix();
      }

      _updateSoftnessLevel() {
        const light = this._light;
        const hardness = clamp(Math.floor(this._hardness), 1, this._maxHardness);
        const shadowSize = Math.pow(2, hardness);
        light.shadow.mapSize.set(shadowSize, shadowSize);
      }

      _updatePlane(model) {
        const mesh = this._mesh;
        const modelBbox = model.bbox;
        const boxPoints = [modelBbox.min.x, modelBbox.min.z, modelBbox.max.x, modelBbox.max.z].map(val => Math.abs(val));
        const maxXZ = Math.max(...boxPoints);
        mesh.scale.setScalar(100 * maxXZ);
      }

      _updateLightPosition(model) {
        const yaw = this._yaw;
        const pitch = this._pitch;
        const boundingSphere = model.bbox.getBoundingSphere(new THREE.Sphere());
        const radius = boundingSphere.radius; // Added AR hover height(0.1) as offset

        const newPosition = getRotatedPosition(2 * radius + 0.1, yaw, 90 - pitch);

        this._baseLightPos.copy(newPosition);

        this._modelRadius = radius;
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Scene that View3D will render.
     * All model datas including Mesh, Lights, etc. will be included on this
     */

    class Scene {
      /**
       * Create new Scene instance
       */
      constructor(view3D) {
        this._view3D = view3D;
        this._root = new THREE.Scene();
        this._userObjects = new THREE.Group();
        this._envObjects = new THREE.Group();
        this._fixedObjects = new THREE.Group();
        this._shadowPlane = new ShadowPlane(view3D, getObjectOption(view3D.shadow));
        const root = this._root;
        const userObjects = this._userObjects;
        const envObjects = this._envObjects;
        const fixedObjects = this._fixedObjects;
        const shadowPlane = this._shadowPlane;
        userObjects.name = "userObjects";
        envObjects.name = "envObjects";
        fixedObjects.name = "fixedObjects";
        root.add(userObjects, envObjects, fixedObjects);

        if (view3D.shadow) {
          fixedObjects.add(shadowPlane.mesh, shadowPlane.light);
        }
      }
      /**
       * Root {@link https://threejs.org/docs/#api/en/scenes/Scene THREE.Scene} object
       */


      get root() {
        return this._root;
      }
      /**
       * Shadow plane & light
       * @type {ShadowPlane}
       */


      get shadowPlane() {
        return this._shadowPlane;
      }
      /**
       * Group that contains volatile user objects
       */


      get userObjects() {
        return this._userObjects;
      }
      /**
       * Group that contains non-volatile user objects
       */


      get envObjects() {
        return this._envObjects;
      }
      /**
       * Group that contains objects that View3D manages
       */


      get fixedObjects() {
        return this._fixedObjects;
      }
      /**
       * Reset scene to initial state
       * @param {object} options Options
       * @param {boolean} [options.volatileOnly=true] Remove only volatile objects
       * @returns {void}
       */


      reset({
        volatileOnly = true
      } = {}) {
        this._removeChildsOf(this._userObjects);

        if (!volatileOnly) {
          this._removeChildsOf(this._envObjects);
        }
      }
      /**
       * Add new Three.js {@link https://threejs.org/docs/#api/en/core/Object3D Object3D} into the scene
       * @param object {@link https://threejs.org/docs/#api/en/core/Object3D THREE.Object3D}s to add
       * @param volatile If set to true, objects will be removed after displaying another 3D model
       * @returns {void}
       */


      add(object, volatile = true) {
        const objRoot = volatile ? this._userObjects : this._envObjects;
        const objects = Array.isArray(object) ? object : [object];
        objRoot.add(...objects);
      }
      /**
       * Remove Three.js {@link https://threejs.org/docs/#api/en/core/Object3D Object3D} into the scene
       * @param object {@link https://threejs.org/docs/#api/en/core/Object3D THREE.Object3D}s to add
       * @returns {void}
       */


      remove(object) {
        const objects = Array.isArray(object) ? object : [object];

        this._root.remove(...objects);
      }
      /**
       * Set background of the scene.
       * @param background A color / image url to set as background
       * @returns {Promise<void>}
       */


      setBackground(background) {
        return __awaiter(this, void 0, void 0, function* () {
          const root = this._root;

          if (typeof background === "number" || background.charAt(0) === "#") {
            root.background = new THREE.Color(background);
          } else {
            const textureLoader = new TextureLoader(this._view3D.renderer);
            const texture = yield textureLoader.load(background);
            texture.encoding = THREE.sRGBEncoding;
            root.background = texture;
          }
        });
      }
      /**
       * Set scene's skybox, which both affects background & envmap
       * @param url An URL to equirectangular image
       * @returns {Promise<void>}
       */


      setSkybox(url) {
        return __awaiter(this, void 0, void 0, function* () {
          const root = this._root;

          if (url) {
            const textureLoader = new TextureLoader(this._view3D.renderer);
            const renderTarget = yield textureLoader.loadHDRTexture(url);
            root.background = renderTarget.texture;
            root.environment = renderTarget.texture;
          } else {
            root.background = null;
            root.environment = null;
          }
        });
      }
      /**
       * Set scene's environment map that affects all physical materials in the scene
       * @param url An URL to equirectangular image
       * @returns {void}
       */


      setEnvMap(url) {
        return __awaiter(this, void 0, void 0, function* () {
          if (url) {
            const textureLoader = new TextureLoader(this._view3D.renderer);
            const renderTarget = yield textureLoader.loadHDRTexture(url);
            this._root.environment = renderTarget.texture;
          } else {
            this._root.environment = null;
          }
        });
      }

      _removeChildsOf(obj) {
        obj.traverse(child => {
          if (child.isMesh) {
            const mesh = child; // Release geometry & material memory

            mesh.geometry.dispose();
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach(mat => {
              STANDARD_MAPS.forEach(map => {
                if (mat[map]) {
                  mat[map].dispose();
                }
              });
            });
          }
        });

        while (obj.children.length > 0) {
          obj.remove(obj.children[0]);
        }
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Data class of camera's pose
     */

    class Pose {
      /**
       * Create new instance of pose
       * @param {number} yaw yaw
       * @param {number} pitch pitch
       * @param {number} zoom zoom
       * @param {number[]} pivot pivot
       * @example
       * ```ts
       * import { THREE, Pose } from "@egjs/view3d";
       *
       * const pose = new Pose(180, 45, 150, [5, -1, 3]);
       * ```
       */
      constructor(yaw, pitch, zoom, pivot = [0, 0, 0]) {
        this.yaw = yaw;
        this.pitch = pitch;
        this.zoom = zoom;
        this.pivot = new THREE.Vector3().fromArray(pivot);
      }
      /**
       * Clone this pose
       * @returns Cloned pose
       */


      clone() {
        return new Pose(this.yaw, this.pitch, this.zoom, this.pivot.toArray());
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */

    const EASING$1 = EASING.EASE_OUT_CUBIC;
    const ANIMATION_DURATION = 300;
    const ANIMATION_LOOP = false;
    const ANIMATION_RANGE = {
      min: 0,
      max: 1
    }; // Camera

    const FOV = 45;
    const CAMERA_POSE = new Pose(0, 15, 0, [0, 0, 0]);
    const INFINITE_RANGE = {
      min: -Infinity,
      max: Infinity
    };
    const PITCH_RANGE = {
      min: -89.9,
      max: 89.9
    };
    const AR_OVERLAY_CLASS = "view3d-ar-overlay";
    const DRACO_DECODER_URL = "https://www.gstatic.com/draco/versioned/decoders/1.4.1/";
    const KTX_TRANSCODER_URL = "https://unpkg.com/three@0.134.0/examples/js/libs/basis/";
    const AR_PRIORITY = [AR_SESSION_TYPE.WEBXR, AR_SESSION_TYPE.SCENE_VIEWER, AR_SESSION_TYPE.QUICK_LOOK];

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */

    class Motion {
      constructor({
        duration = ANIMATION_DURATION,
        loop = ANIMATION_LOOP,
        range = ANIMATION_RANGE,
        easing = EASING$1
      } = {}) {
        this._duration = duration;
        this._loop = loop;
        this._range = range;
        this._easing = easing;
        this._activated = false;
        this.reset(0);
      }

      get val() {
        return this._val;
      }

      get start() {
        return this._start;
      }

      get end() {
        return this._end;
      }

      get progress() {
        return this._progress;
      }

      get duration() {
        return this._duration;
      }

      get loop() {
        return this._loop;
      }

      get range() {
        return this._range;
      }

      get easing() {
        return this._easing;
      }

      set duration(val) {
        this._duration = val;
      }

      set loop(val) {
        this._loop = val;
      }

      set range(val) {
        this._range = val;
      }

      set easing(val) {
        this._easing = val;
      }
      /**
       * Update motion and progress it by given deltaTime
       * @param deltaTime number of milisec to update motion
       * @returns Difference(delta) of the value from the last update.
       */


      update(deltaTime) {
        if (!this._activated) return 0;
        const start = this._start;
        const end = this._end;
        const duration = this._duration;
        const prev = this._val;
        const loop = this._loop;
        const nextProgress = this._progress + deltaTime / duration;
        this._progress = loop ? circulate(nextProgress, 0, 1) : clamp(nextProgress, 0, 1);

        const easedProgress = this._easing(this._progress);

        this._val = mix(start, end, easedProgress);

        if (!loop && this._progress >= 1) {
          this._activated = false;
        }

        return this._val - prev;
      }

      reset(defaultVal) {
        const range = this._range;
        const val = clamp(defaultVal, range.min, range.max);
        this._start = val;
        this._end = val;
        this._val = val;
        this._progress = 0;
        this._activated = false;
      }

      setEndDelta(delta) {
        const range = this._range;
        this._start = this._val;
        this._end = clamp(this._end + delta, range.min, range.max);
        this._progress = 0;
        this._activated = true;
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Control that animates model without user input
     */

    class AnimationControl {
      /**
       * Create new instance of AnimationControl
       * @param from Start pose
       * @param to End pose
       * @param {object} options Options
       * @param {number} [options.duration=500] Animation duration
       * @param {function} [options.easing=(x: number) => 1 - Math.pow(1 - x, 3)] Animation easing function
       */
      constructor(view3D, from, to, {
        duration = ANIMATION_DURATION,
        easing = EASING$1
      } = {}) {
        this._enabled = false;
        this._finishCallbacks = [];
        this._view3D = view3D;
        from = from.clone();
        to = to.clone();
        from.yaw = circulate(from.yaw, 0, 360);
        to.yaw = circulate(to.yaw, 0, 360); // Take the smaller degree

        if (Math.abs(to.yaw - from.yaw) > 180) {
          to.yaw = to.yaw < from.yaw ? to.yaw + 360 : to.yaw - 360;
        }

        this._motion = new Motion({
          duration,
          range: ANIMATION_RANGE,
          easing
        });
        this._from = from;
        this._to = to;
      }

      get element() {
        return null;
      }
      /**
       * Whether this control is enabled or not
       * @readonly
       */


      get enabled() {
        return this._enabled;
      }
      /**
       * Duration of the animation
       */


      get duration() {
        return this._motion.duration;
      }
      /**
       * Easing function of the animation
       */


      get easing() {
        return this._motion.easing;
      }

      set duration(val) {
        this._motion.duration = val;
      }

      set easing(val) {
        this._motion.easing = val;
      }
      /**
       * Destroy the instance and remove all event listeners attached
       * This also will reset CSS cursor to intial
       * @returns {void}
       */


      destroy() {
        this.disable();
      }
      /**
       * Update control by given deltaTime
       * @param deltaTime Number of milisec to update
       * @returns {void}
       */


      update(deltaTime) {
        if (!this._enabled) return;
        const camera = this._view3D.camera;
        const from = this._from;
        const to = this._to;
        const motion = this._motion;
        motion.update(deltaTime); // Progress that easing is applied

        const progress = motion.val;
        camera.yaw = mix(from.yaw, to.yaw, progress);
        camera.pitch = mix(from.pitch, to.pitch, progress);
        camera.zoom = mix(from.zoom, to.zoom, progress);
        camera.pivot = from.pivot.clone().lerp(to.pivot, progress);

        if (progress >= 1) {
          this.disable();

          this._finishCallbacks.forEach(callback => callback());
        }
      }
      /**
       * Enable this input and add event listeners
       * @returns {void}
       */


      enable() {
        if (this._enabled) return;
        this._enabled = true;

        this._motion.reset(0);

        this._motion.setEndDelta(1);
      }
      /**
       * Disable this input and remove all event handlers
       * @returns {void}
       */


      disable() {
        if (!this._enabled) return;
        this._enabled = false;
      }
      /**
       * Add callback which is called when animation is finished
       * @param callback Callback that will be called when animation finishes
       * @returns {void}
       */


      onFinished(callback) {
        this._finishCallbacks.push(callback);
      }
      /**
       * Remove all onFinished callbacks
       * @returns {void}
       */


      clearFinished() {
        this._finishCallbacks = [];
      }
      /* eslint-disable @typescript-eslint/no-unused-vars */


      resize(size) {// DO NOTHING
      }

      sync() {// Do nothing
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Camera that renders the scene of View3D
     */

    class Camera {
      /**
       * Create new Camera instance
       * @param canvas \<canvas\> element to render 3d model
       */
      constructor(view3D) {
        this._distance = 0;
        this._baseFov = 45;
        this._defaultPose = CAMERA_POSE;
        this._currentPose = this._defaultPose.clone();
        this._view3D = view3D;
        this._threeCamera = new THREE.PerspectiveCamera();
        this._maxTanHalfHFov = 0;
        this._defaultPose = new Pose(view3D.yaw, view3D.pitch, 0);
        this._currentPose = this._defaultPose.clone();
      }
      /**
       * Three.js {@link https://threejs.org/docs/#api/en/cameras/PerspectiveCamera PerspectiveCamera} instance
       * @readonly
       * @type THREE.PerspectiveCamera
       */


      get threeCamera() {
        return this._threeCamera;
      }
      /**
       * Camera's default pose(yaw, pitch, zoom, pivot)
       * This will be new currentPose when {@link Camera#reset reset()} is called
       * @readonly
       * @type {Pose}
       */


      get defaultPose() {
        return this._defaultPose;
      }
      /**
       * Camera's current pose value
       * @readonly
       * @type {Pose}
       */


      get currentPose() {
        return this._currentPose.clone();
      }
      /**
       * Camera's current yaw
       * {@link Camera#updatePosition} should be called after changing this value, and normally it is called every frame.
       * @type {number}
       */


      get yaw() {
        return this._currentPose.yaw;
      }
      /**
       * Camera's current pitch
       * {@link Camera#updatePosition} should be called after changing this value, and normally it is called every frame.
       * @type {number}
       */


      get pitch() {
        return this._currentPose.pitch;
      }
      /**
       * Camera's current zoom value
       * {@link Camera#updatePosition} should be called after changing this value, and normally it is called every frame.
       * @type {number}
       */


      get zoom() {
        return this._currentPose.zoom;
      }
      /**
       * Camera's default fov value.
       * This will be automatically chosen when `view3D.fov` is "auto", otherwise it is equal to `view3D.fov`
       * @type {number}
       */


      get baseFov() {
        return this._baseFov;
      }
      /**
       * Current pivot point of camera rotation
       * @readonly
       * @type THREE.Vector3
       * @see {@link https://threejs.org/docs/#api/en/math/Vector3 THREE#Vector3}
       */


      get pivot() {
        return this._currentPose.pivot;
      }
      /**
       * Camera's focus of view value (vertical)
       * @type number
       * @see {@link https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.fov THREE#PerspectiveCamera}
       */


      get fov() {
        return this._threeCamera.fov;
      }

      get pose() {
        return this._currentPose;
      }
      /**
       * Camera's frustum width
       * @type number
       */


      get renderWidth() {
        return this.renderHeight * this._threeCamera.aspect;
      }
      /**
       * Camera's frustum height
       * @type number
       */


      get renderHeight() {
        return 2 * this._distance * Math.tan(toRadian(this._threeCamera.getEffectiveFOV() / 2));
      }

      set yaw(val) {
        this._currentPose.yaw = val;
      }

      set pitch(val) {
        this._currentPose.pitch = val;
      }

      set zoom(val) {
        this._currentPose.zoom = val;
      }

      set pivot(val) {
        this._currentPose.pivot = val;
      }
      /**
       * Reset camera to default pose
       * @param duration Duration of the reset animation
       * @param easing Easing function for the reset animation
       * @returns Promise that resolves when the animation finishes
       */


      reset(duration = 0, easing = EASING$1) {
        return __awaiter(this, void 0, void 0, function* () {
          const view3D = this._view3D;
          const control = view3D.control;
          const currentPose = this._currentPose;
          const defaultPose = this._defaultPose;

          if (duration <= 0) {
            // Reset camera immediately
            this._currentPose = defaultPose.clone();
            control.sync();
            return Promise.resolve();
          } else {
            // Play the animation
            const resetControl = new AnimationControl(view3D, currentPose, defaultPose);
            resetControl.duration = duration;
            resetControl.easing = easing;
            resetControl.enable();
            control.disable();

            const updateResetControl = evt => {
              resetControl.update(evt.delta);
            };

            view3D.on(EVENTS.BEFORE_RENDER, updateResetControl);
            return new Promise(resolve => {
              resetControl.onFinished(() => {
                control.sync();
                control.enable();
                view3D.off(EVENTS.BEFORE_RENDER, updateResetControl);
                resolve();
              });
            });
          }
        });
      }
      /**
       * Update camera's aspect to given size
       * @param {object} size New size to apply
       * @param {number} [size.width] New width
       * @param {number} [size.height] New height
       * @returns {void}
       */


      resize({
        width,
        height
      }) {
        const cam = this._threeCamera;
        const aspect = width / height;
        const fov = this._view3D.fov;
        cam.aspect = aspect;

        if (fov === AUTO) {
          this._applyEffectiveFov(FOV);
        } else {
          this._baseFov = fov;
        }
      }
      /**
       * Fit camera frame to the given model
       */


      fit(model, center) {
        const view3D = this._view3D;
        const camera = this._threeCamera;
        const control = view3D.control;
        const defaultPose = this._defaultPose;
        const bbox = model.bbox;
        const fov = view3D.fov;
        const hfov = fov === AUTO ? FOV : fov;
        const modelCenter = Array.isArray(center) ? new THREE.Vector3().fromArray(center) : bbox.getCenter(new THREE.Vector3());
        const maxDistToCenterSquared = model.reduceVertices((dist, vertice) => {
          return Math.max(dist, vertice.distanceToSquared(modelCenter));
        }, 0);
        const maxDistToCenter = Math.sqrt(maxDistToCenterSquared);
        const effectiveCamDist = maxDistToCenter / Math.sin(toRadian(hfov / 2));
        const maxTanHalfHFov = model.reduceVertices((res, vertex) => {
          const distToCenter = new THREE.Vector3().subVectors(vertex, modelCenter);
          const radiusXZ = Math.sqrt(distToCenter.x * distToCenter.x + distToCenter.z * distToCenter.z);
          return Math.max(res, radiusXZ / (effectiveCamDist - Math.abs(distToCenter.y)));
        }, 0);

        if (fov === AUTO) {
          // Cache for later use in resize
          this._maxTanHalfHFov = maxTanHalfHFov;

          this._applyEffectiveFov(hfov);
        } else {
          this._maxTanHalfHFov = fov;
        }

        defaultPose.pivot = modelCenter.clone();
        this._distance = effectiveCamDist;
        camera.near = (effectiveCamDist - maxDistToCenter) * 0.1;
        camera.far = (effectiveCamDist + maxDistToCenter) * 10;
        control.zoom.updateRange();
      }
      /**
       * Update camera position base on the {@link Camera#currentPose currentPose} value
       * @returns {void}
       */


      updatePosition() {
        const {
          control
        } = this._view3D;
        const threeCamera = this._threeCamera;
        const currentPose = this._currentPose;
        const distance = this._distance;
        const baseFov = this._baseFov;
        const zoomRange = control.zoom.range; // Clamp current pose

        currentPose.yaw = circulate(currentPose.yaw, 0, 360);
        currentPose.pitch = clamp(currentPose.pitch, PITCH_RANGE.min, PITCH_RANGE.max);
        currentPose.zoom = clamp(baseFov + currentPose.zoom, zoomRange.min, zoomRange.max) - baseFov;
        const newCamPos = getRotatedPosition(distance, currentPose.yaw, currentPose.pitch);
        const fov = currentPose.zoom + baseFov;
        newCamPos.add(currentPose.pivot);
        threeCamera.fov = fov;
        threeCamera.position.copy(newCamPos);
        threeCamera.lookAt(currentPose.pivot);
        threeCamera.updateProjectionMatrix();
      }

      _applyEffectiveFov(fov) {
        const camera = this._threeCamera;
        const tanHalfHFov = Math.tan(toRadian(fov / 2));
        const tanHalfVFov = tanHalfHFov * Math.max(1, this._maxTanHalfHFov / tanHalfHFov / camera.aspect);
        this._baseFov = toDegree(2 * Math.atan(tanHalfVFov));
        camera.updateProjectionMatrix();
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */

    class AutoResizer {
      constructor(view3d) {
        this._onResize = () => {
          this._view3d.resize();
        };

        this._view3d = view3d;
        this._enabled = false;
        this._resizeObserver = null;
      }

      get enabled() {
        return this._enabled;
      }

      enable() {
        const view3d = this._view3d;

        if (this._enabled) {
          this.disable();
        }

        if (view3d.useResizeObserver && !!window.ResizeObserver) {
          const resizeObserver = new ResizeObserver(this._onResize); // This will automatically call `resize` for the first time

          resizeObserver.observe(view3d.renderer.canvas);
          this._resizeObserver = resizeObserver;
        } else {
          view3d.resize();
          window.addEventListener(EVENTS$1.RESIZE, this._onResize);
        }

        this._enabled = true;
        return this;
      }

      disable() {
        if (!this._enabled) return this;
        const resizeObserver = this._resizeObserver;

        if (resizeObserver) {
          resizeObserver.disconnect();
          this._resizeObserver = null;
        } else {
          window.removeEventListener(EVENTS$1.RESIZE, this._onResize);
        }

        this._enabled = false;
        return this;
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Component that manages animations of the 3D Model
     */

    class ModelAnimator {
      /**
       * Create new ModelAnimator instance
       */
      constructor(root) {
        this._mixer = new THREE.AnimationMixer(root);
        this._clips = [];
        this._actions = [];
      }
      /**
       * Three.js {@link https://threejs.org/docs/#api/en/animation/AnimationClip AnimationClip}s that stored
       * @type THREE.AnimationClip
       * @readonly
       */


      get clips() {
        return this._clips;
      }
      /**
       * {@link https://threejs.org/docs/index.html#api/en/animation/AnimationMixer THREE.AnimationMixer} instance
       * @type THREE.AnimationMixer
       * @readonly
       */


      get mixer() {
        return this._mixer;
      }
      /**
       * Store the given clips
       * @param clips Three.js {@link https://threejs.org/docs/#api/en/animation/AnimationClip AnimationClip}s of the model
       * @returns {void}
       * @example
       * ```ts
       * // After loading model
       * view3d.animator.setClips(model.animations);
       * ```
       */


      setClips(clips) {
        const mixer = this._mixer;
        this._clips = clips;
        this._actions = clips.map(clip => mixer.clipAction(clip));
      }
      /**
       * Play one of the model's animation
       * @param index Index of the animation to play
       * @returns {void}
       */


      play(index) {
        const action = this._actions[index];

        if (action) {
          action.play();
        }
      }
      /**
       * Pause one of the model's animation
       * If you want to stop animation completely, you should call {@link ModelAnimator#stop stop} instead
       * You should call {@link ModelAnimator#resume resume} to resume animation
       * @param index Index of the animation to pause
       * @returns {void}
       */


      pause(index) {
        const action = this._actions[index];

        if (action) {
          action.timeScale = 0;
        }
      }
      /**
       * Resume one of the model's animation
       * This will play animation from the point when the animation is paused
       * @param index Index of the animation to resume
       * @returns {void}
       */


      resume(index) {
        const action = this._actions[index];

        if (action) {
          action.timeScale = 1;
        }
      }
      /**
       * Fully stops one of the model's animation
       * @param index Index of the animation to stop
       * @returns {void}
       */


      stop(index) {
        const action = this._actions[index];

        if (action) {
          action.stop();
        }
      }
      /**
       * Update animations
       * @param delta number of seconds to play animations attached
       * @returns {void}
       */


      update(delta) {
        this._mixer.update(delta);
      }
      /**
       * Reset the instance and remove all cached animation clips attached to it
       * @returns {void}
       */


      reset() {
        const mixer = this._mixer;
        mixer.uncacheRoot(mixer.getRoot());
        this._clips = [];
        this._actions = [];
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Fires for every animation frame when animation is active.
     * @type object
     * @property {object} event Event object.
     * @property {number} [event.progress] Current animation progress value.
     * Value is ranged from 0(start) to 1(end).
     * @property {number} [event.easedProgress] Eased progress value.
     * @event Animation#progress
     */

    /**
     * Fires for every animation loop except for the last loop
     * This will be triggered only when repeat > 0
     * @type object
     * @property {object} event Event object.
     * @property {number} [event.progress] Current animation progress value.
     * Value is ranged from 0(start) to 1(end).
     * @property {number} [event.easedProgress] Eased progress value.
     * @property {number} [event.loopIndex] Index of the current loop.
     * @event Animation#loop
     */

    /**
     * Fires when animation ends.
     * @type void
     * @event Animation#finish
     */

    /**
     * Self-running animation
     */

    class Animation extends Component {
      /**
       * Create new instance of the Animation
       * @param {object} [options={}] Options
       */
      constructor({
        context = window,
        repeat = 0,
        duration = ANIMATION_DURATION,
        easing = EASING.EASE_OUT_CUBIC
      } = {}) {
        super();

        this._loop = () => {
          const delta = this._getDeltaTime();

          const duration = this._duration;
          this._time += delta;
          const loopIncrease = Math.floor(this._time / duration);
          this._time = circulate(this._time, 0, duration);
          const progress = this._time / duration;
          const progressEvent = {
            progress,
            easedProgress: this._easing(progress)
          };
          this.trigger("progress", progressEvent);

          for (let loopIdx = 0; loopIdx < loopIncrease; loopIdx++) {
            this._loopCount++;

            if (this._loopCount > this._repeat) {
              this.trigger("finish");
              this.stop();
              return;
            } else {
              this.trigger("loop", Object.assign(Object.assign({}, progressEvent), {
                loopIndex: this._loopCount
              }));
            }
          }

          this._rafId = this._ctx.requestAnimationFrame(this._loop);
        }; // Options


        this._repeat = repeat;
        this._duration = duration;
        this._easing = easing; // Internal States

        this._ctx = context;
        this._rafId = -1;
        this._time = 0;
        this._clock = 0;
        this._loopCount = 0;
      }

      start() {
        if (this._rafId >= 0) return; // This guarantees "progress" event with progress = 0 on first start

        this._updateClock();

        this._loop();
      }

      stop() {
        if (this._rafId < 0) return;
        this._time = 0;
        this._loopCount = 0;

        this._stopLoop();
      }

      pause() {
        if (this._rafId < 0) return;

        this._stopLoop();
      }

      _stopLoop() {
        this._ctx.cancelAnimationFrame(this._rafId);

        this._rafId = -1;
      }

      _getDeltaTime() {
        const lastTime = this._clock;

        this._updateClock();

        return this._clock - lastTime;
      }

      _updateClock() {
        this._clock = Date.now();
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */

    /* eslint-enable */
    const QUICK_LOOK_SUPPORTED = () => {
      const anchorEl = document.createElement("a");
      return anchorEl.relList && anchorEl.relList.supports && anchorEl.relList.supports("ar");
    };
    const WEBXR_SUPPORTED = () => navigator.xr && !!navigator.xr.isSessionSupported;
    const HIT_TEST_SUPPORTED = () => window.XRSession && window.XRSession.prototype.requestHitTestSource;
    const DOM_OVERLAY_SUPPORTED = () => window.XRDOMOverlayState != null;
    const SESSION = {
      AR: "immersive-ar",
      VR: "immersive-vr"
    };
    const REFERENCE_SPACE = {
      LOCAL: "local",
      LOCAL_FLOOR: "local-floor",
      VIEWER: "viewer"
    };
    const EVENTS$2 = {
      SELECT_START: "selectstart",
      SELECT: "select",
      SELECT_END: "selectend"
    };
    const INPUT_PROFILE = {
      TOUCH: "generic-touchscreen"
    };
    const FEATURES = {
      HIT_TEST: {
        requiredFeatures: ["hit-test"]
      },
      DOM_OVERLAY: root => root ? {
        requiredFeatures: ["dom-overlay"],
        domOverlay: {
          root
        }
      } : {}
    }; // For type definition

    const EMPTY_FEATURES = {};
    const SCENE_VIEWER = {
      INTENT_AR_CORE: (params, fallback) => `intent://arvr.google.com/scene-viewer/1.2?${params}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;${fallback ? `S.browser_fallback_url=${fallback};` : ""}end;`,
      INTENT_SEARCHBOX: (params, fallback) => `intent://arvr.google.com/scene-viewer/1.2?${params}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;${fallback ? `S.browser_fallback_url=${fallback};` : ""}end;`,
      FALLBACK_DEFAULT: params => `https://arvr.google.com/scene-viewer?${params}`
    };

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * One finger swirl control on single axis
     */

    class ARSwirlControl {
      /**
       * Create new ARSwirlControl
       * @param {ARSwirlControlOptions} [options={}] Options
       * @param {number} [options.scale=1] Scale(speed) factor of the rotation
       * @param {boolean} [options.showIndicator=true] Whether to show rotation indicator or not.
       */
      constructor({
        scale = 1
      } = {}) {
        /**
         * Current rotation value
         */
        this.rotation = new THREE.Quaternion(); // Internal States

        this._axis = new THREE.Vector3(0, 1, 0);
        this._enabled = false;
        this._active = false;
        this._prevPos = new THREE.Vector2();
        this._fromQuat = new THREE.Quaternion();
        this._toQuat = new THREE.Quaternion();
        this._motion = new Motion({
          range: INFINITE_RANGE
        });
        this._userScale = scale;
      }
      /**
       * Whether this control is enabled or not.
       * @readonly
       */


      get enabled() {
        return this._enabled;
      }
      /**
       * Scale(speed) factor of this control.
       */


      get scale() {
        return this._userScale;
      }

      set scale(val) {
        this._userScale = val;
      }

      updateRotation(rotation) {
        this.rotation.copy(rotation);

        this._fromQuat.copy(rotation);

        this._toQuat.copy(rotation);
      }
      /**
       * Enable this control
       */


      enable() {
        this._enabled = true;
      }
      /**
       * Disable this control
       */


      disable() {
        this._enabled = false;
      }

      activate() {
        if (!this._enabled) return;
        this._active = true;
      }

      deactivate() {
        this._active = false;
      }

      updateAxis(axis) {
        this._axis.copy(axis);
      }

      setInitialPos(coords) {
        this._prevPos.copy(coords[0]);
      }

      process({
        scene,
        xrCam
      }, {
        coords
      }) {
        if (!this._active || coords.length !== 1) return;
        const prevPos = this._prevPos;
        const motion = this._motion;
        const coord = coords[0];
        const modelPos = scene.modelMovable.getWorldPosition(new THREE.Vector3());
        const ndcModelPos = new THREE.Vector2().fromArray(modelPos.project(xrCam).toArray()); // Get the rotation angle with the model's NDC coordinates as the center.

        const rotationAngle = getRotationAngle(ndcModelPos, prevPos, coord) * this._userScale;

        const rotation = new THREE.Quaternion().setFromAxisAngle(this._axis, rotationAngle);

        const interpolated = this._getInterpolatedQuaternion();

        this._fromQuat.copy(interpolated);

        this._toQuat.premultiply(rotation);

        motion.reset(0);
        motion.setEndDelta(1);
        prevPos.copy(coord);
      }

      update({
        scene
      }, deltaTime) {
        if (!this._active) return;
        const motion = this._motion;
        motion.update(deltaTime);

        const interpolated = this._getInterpolatedQuaternion();

        this.rotation.copy(interpolated);
        scene.setModelRotation(interpolated);
      }

      _getInterpolatedQuaternion() {
        const motion = this._motion;
        const toEuler = this._toQuat;
        const fromEuler = this._fromQuat;
        const progress = motion.val;
        return new THREE.Quaternion().copy(fromEuler).slerp(toEuler, progress);
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    var STATE;

    (function (STATE) {
      STATE[STATE["WAITING"] = 0] = "WAITING";
      STATE[STATE["TRANSLATING"] = 1] = "TRANSLATING";
      STATE[STATE["BOUNCING"] = 2] = "BOUNCING";
    })(STATE || (STATE = {}));
    /**
     * Model's translation(position) control for {@link WebARControl}
     */


    class ARTranslateControl {
      /**
       * Create new instance of ARTranslateControl
       * @param {ARTranslateControlOption} [options={}] Options
       */
      constructor({
        hoverHeight = 0.1,
        bounceDuration = 1000,
        bounceEasing = EASING.EASE_OUT_BOUNCE
      } = {}) {
        // Internal states
        this._hoverPosition = new THREE.Vector3();
        this._floorPosition = new THREE.Vector3();
        this._wallRotation = new THREE.Quaternion();
        this._dragPlane = new THREE.Plane();
        this._enabled = false;
        this._vertical = false;
        this._state = STATE.WAITING;
        this._initialPos = new THREE.Vector2();
        this._hoverHeight = hoverHeight;
        this._bounceMotion = new Motion({
          duration: bounceDuration,
          easing: bounceEasing,
          range: INFINITE_RANGE
        });
      }
      /**
       * Whether this control is enabled or not
       * @readonly
       */


      get enabled() {
        return this._enabled;
      }
      /**
       * Last detected floor position
       * @readonly
       */


      get floorPosition() {
        return this._floorPosition.clone();
      }
      /**
       * How much model will float from the floor, in meter.
       */


      get hoverHeight() {
        return this._hoverHeight;
      }

      set hoverHeight(val) {
        this._hoverHeight = val;
      }
      /**
       * Enable this control
       */


      enable() {
        this._enabled = true;
      }
      /**
       * Disable this control
       */


      disable() {
        this.deactivate();
        this._enabled = false;
      }

      activate() {
        if (!this._enabled) return;
        const dragPlane = this._dragPlane;
        dragPlane.constant = this._calcDragPlaneConstant(this._floorPosition);
        this._state = STATE.TRANSLATING;
      }

      deactivate() {
        if (!this._enabled || this._vertical || this._state === STATE.WAITING) {
          this._state = STATE.WAITING;
          return;
        }

        this._state = STATE.BOUNCING;
        const floorPosition = this._floorPosition;
        const hoverPosition = this._hoverPosition;
        const bounceMotion = this._bounceMotion;
        const hoveringAmount = hoverPosition.y - floorPosition.y;
        bounceMotion.reset(hoveringAmount);
        bounceMotion.setEndDelta(-hoveringAmount);
      }

      init(position, rotation, vertical) {
        this._floorPosition.copy(position);

        this._hoverPosition.copy(position);

        const planeNormal = vertical ? new THREE.Vector3(0, 1, 0).applyQuaternion(rotation) : new THREE.Vector3(0, 1, 0);

        this._dragPlane.normal.copy(planeNormal);

        this._wallRotation.copy(rotation);

        this._vertical = vertical;
      }

      setInitialPos(coords) {
        this._initialPos.copy(coords[0]);
      }

      process({
        frame,
        referenceSpace,
        xrCam
      }, {
        hitResults
      }) {
        const state = this._state;
        const notActive = state === STATE.WAITING || state === STATE.BOUNCING;
        if (!hitResults || hitResults.length !== 1 || notActive) return;
        const hitResult = hitResults[0];

        const prevFloorPosition = this._floorPosition.clone();

        const floorPosition = this._floorPosition;
        const hoverPosition = this._hoverPosition;
        const hoverHeight = this._hoverHeight;
        const dragPlane = this._dragPlane;
        const vertical = this._vertical;
        const hitPose = hitResult.results[0] && hitResult.results[0].getPose(referenceSpace);
        const hitMatrix = hitPose && new THREE.Matrix4().fromArray(hitPose.transform.matrix);
        const isFloorHit = hitPose && hitMatrix.elements[5] > 0.75;
        const isWallHit = hitPose && hitMatrix.elements[5] < 0.25;
        const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);
        const hitPosition = hitPose && new THREE.Vector3().setFromMatrixPosition(hitMatrix);

        if (!vertical) {
          if (frame && (!hitPose || !isFloorHit)) {
            // Use previous drag plane if no hit plane is found
            const targetRayPose = frame.getPose(hitResult.inputSource.targetRaySpace, referenceSpace);
            if (!targetRayPose) return;
            const rayPos = targetRayPose.transform.position;
            const fingerPos = new THREE.Vector3(rayPos.x, rayPos.y, rayPos.z);
            const fingerDir = fingerPos.sub(camPos).normalize();
            const fingerRay = new THREE.Ray(camPos, fingerDir);
            const intersection = fingerRay.intersectPlane(dragPlane, new THREE.Vector3());

            if (intersection) {
              floorPosition.copy(intersection);
              floorPosition.setY(prevFloorPosition.y);
              hoverPosition.copy(intersection);
            }

            return;
          } // Set new floor level when it's increased at least 10cm


          const currentDragPlaneHeight = -dragPlane.constant;
          const hitDragPlaneHeight = hitPosition.y + hoverHeight;

          if (hitDragPlaneHeight - currentDragPlaneHeight > 0.1) {
            dragPlane.constant = -hitDragPlaneHeight;
          }

          const camToHitDir = new THREE.Vector3().subVectors(hitPosition, camPos).normalize();
          const camToHitRay = new THREE.Ray(camPos, camToHitDir);
          const hitOnDragPlane = camToHitRay.intersectPlane(dragPlane, new THREE.Vector3());
          if (!hitOnDragPlane) return;
          floorPosition.copy(hitOnDragPlane);
          floorPosition.setY(hitPosition.y);
          hoverPosition.copy(hitOnDragPlane);
        } else {
          if (frame && (!hitPose || !isWallHit)) {
            // Use previous drag plane if no hit plane is found
            const targetRayPose = frame.getPose(hitResult.inputSource.targetRaySpace, referenceSpace);
            if (!targetRayPose) return;
            const rayPos = targetRayPose.transform.position;
            const fingerPos = new THREE.Vector3(rayPos.x, rayPos.y, rayPos.z);
            const fingerDir = fingerPos.sub(camPos).normalize();
            const fingerRay = new THREE.Ray(camPos, fingerDir);
            const intersection = fingerRay.intersectPlane(dragPlane, new THREE.Vector3());

            if (intersection) {
              floorPosition.copy(intersection);
            }

            return;
          }

          const globalUp = new THREE.Vector3(0, 1, 0);
          const hitOrientation = hitPose.transform.orientation;
          const wallNormal = globalUp.clone().applyQuaternion(new THREE.Quaternion(hitOrientation.x, hitOrientation.y, hitOrientation.z, hitOrientation.w)).normalize();
          const wallX = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), wallNormal); // Update rotation if it differs more than 10deg

          const prevWallNormal = new THREE.Vector3(0, 1, 0).applyQuaternion(this._wallRotation).normalize();

          if (Math.acos(Math.abs(prevWallNormal.dot(wallNormal))) >= Math.PI / 18) {
            const wallMatrix = new THREE.Matrix4().makeBasis(wallX, globalUp, wallNormal);
            const wallEuler = new THREE.Euler(0, 0, 0, "YXZ").setFromRotationMatrix(wallMatrix);
            wallEuler.z = 0;
            wallEuler.x = Math.PI / 2;

            this._wallRotation.setFromEuler(wallEuler);

            dragPlane.normal.copy(new THREE.Vector3(0, 1, 0).applyQuaternion(this._wallRotation));
            dragPlane.constant = this._calcDragPlaneConstant(hitPosition);
          }

          const camToHitDir = new THREE.Vector3().subVectors(hitPosition, camPos).normalize();
          const camToHitRay = new THREE.Ray(camPos, camToHitDir);
          const hitOnDragPlane = camToHitRay.intersectPlane(dragPlane, new THREE.Vector3());
          if (!hitOnDragPlane) return;
          floorPosition.copy(hitOnDragPlane);
        }
      }

      update({
        scene
      }, delta) {
        const state = this._state;
        const floorPosition = this._floorPosition;
        const hoverPosition = this._hoverPosition;
        const bounceMotion = this._bounceMotion;
        const vertical = this._vertical;

        if (state === STATE.BOUNCING) {
          bounceMotion.update(delta);
          hoverPosition.setY(floorPosition.y + bounceMotion.val);

          if (bounceMotion.progress >= 1) {
            this._state = STATE.WAITING;
          }
        }

        scene.setRootPosition(floorPosition);

        if (!vertical) {
          scene.setModelHovering(hoverPosition.y - floorPosition.y);
        } else {
          scene.setWallRotation(this._wallRotation);
        }
      }

      _calcDragPlaneConstant(floor) {
        const vertical = this._vertical;

        const dragPlaneNormal = this._dragPlane.normal.clone();

        const dragPlaneAtZero = new THREE.Plane(dragPlaneNormal, 0);
        const hoverHeight = vertical ? 0 : this._hoverHeight;
        const dragPlaneConstant = -(dragPlaneAtZero.distanceToPoint(floor) + hoverHeight);
        return dragPlaneConstant;
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * UI element displaying model's scale percentage info when user chaning model's scale.
     */

    class ScaleUI {
      /**
       * Create new instance of ScaleUI
       * @param {ScaleUIOptions} [options={}] Options
       */
      constructor({
        width = 0.1,
        padding = 20,
        offset = 0.05,
        font = "64px sans-serif",
        color = "white"
      } = {}) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.font = font; // Maximum canvas width should be equal to this

        const maxText = ctx.measureText("100%"); // Following APIs won't work on IE, but it's WebXR so I think it's okay

        const maxWidth = maxText.actualBoundingBoxLeft + maxText.actualBoundingBoxRight;
        const maxHeight = maxText.actualBoundingBoxAscent + maxText.actualBoundingBoxDescent;
        const widthPowerOfTwo = toPowerOfTwo(maxWidth);
        canvas.width = widthPowerOfTwo;
        canvas.height = widthPowerOfTwo; // This considers increased amount by making width to power of two

        const planeWidth = width * (widthPowerOfTwo / maxWidth);
        this._ctx = ctx;
        this._canvas = canvas;
        this._height = planeWidth * maxHeight / maxWidth; // Text height inside plane

        this._texture = new THREE.CanvasTexture(canvas); // Plane is square

        const uiGeometry = new THREE.PlaneGeometry(planeWidth, planeWidth);
        const mesh = new THREE.Mesh(uiGeometry, new THREE.MeshBasicMaterial({
          map: this._texture,
          transparent: true,
          depthTest: false
        }));
        this._mesh = mesh;
        this._font = font;
        this._color = color;
        this._padding = padding;
        this._offset = offset;
        this.hide();
      }
      /**
       * Scale UI's plane mesh
       * @readonly
       */


      get mesh() {
        return this._mesh;
      }
      /**
       * Scale UI's height value
       * @readonly
       */


      get height() {
        return this._height;
      }
      /**
       * Whether UI is visible or not.
       * @readonly
       */


      get visible() {
        return this._mesh.visible;
      }

      updatePosition(worldRotation, focus, modelHeight) {
        const mesh = this._mesh;
        const offset = this._height / 2 + this._offset + modelHeight;
        const offsetVec = new THREE.Vector3(0, offset, 0).applyQuaternion(worldRotation.clone().invert()); // Update mesh

        mesh.position.copy(offsetVec);
        mesh.lookAt(focus);
      }

      updateScale(scale) {
        const ctx = this._ctx;
        const canvas = this._canvas;
        const padding = this._padding;
        const scalePercentage = (scale * 100).toFixed(0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2; // Draw round rect

        const textSize = ctx.measureText(`${scalePercentage}%`);
        const halfWidth = (textSize.actualBoundingBoxLeft + textSize.actualBoundingBoxRight) / 2;
        const halfHeight = (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) / 2;
        ctx.beginPath();
        ctx.moveTo(centerX - halfWidth, centerY - halfHeight - padding);
        ctx.lineTo(centerX + halfWidth, centerY - halfHeight - padding);
        ctx.quadraticCurveTo(centerX + halfWidth + padding, centerY - halfHeight - padding, centerX + halfWidth + padding, centerY - halfHeight);
        ctx.lineTo(centerX + halfWidth + padding, centerY + halfHeight);
        ctx.quadraticCurveTo(centerX + halfWidth + padding, centerY + halfHeight + padding, centerX + halfWidth, centerY + halfHeight + padding);
        ctx.lineTo(centerX - halfWidth, centerY + halfHeight + padding);
        ctx.quadraticCurveTo(centerX - halfWidth - padding, centerY + halfHeight + padding, centerX - halfWidth - padding, centerY + halfHeight);
        ctx.lineTo(centerX - halfWidth - padding, centerY - halfHeight);
        ctx.quadraticCurveTo(centerX - halfWidth - padding, centerY - halfHeight - padding, centerX - halfWidth, centerY - halfHeight - padding);
        ctx.closePath();
        ctx.lineWidth = 5;
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fill();
        ctx.stroke(); // Draw text

        ctx.font = this._font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = this._color;
        ctx.fillStyle = this._color;
        ctx.fillText(`${scalePercentage}%`, centerX, centerY);
        this._texture.needsUpdate = true;

        this._mesh.scale.setScalar(1 / scale);
      }
      /**
       * Show UI
       */


      show() {
        this._mesh.visible = true;
      }
      /**
       * Hide UI
       */


      hide() {
        this._mesh.visible = false;
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Model's scale controller which works on AR(WebXR) mode.
     */

    class ARScaleControl {
      /**
       * Create new instance of ARScaleControl
       * @param {ARScaleControlOptions} [options={}] Options
       * @param {number} [options.min=0.05] Minimum scale, default is 0.05(5%)
       * @param {number} [options.max=5] Maximum scale, default is 5(500%)
       */
      constructor({
        min = 0.05,
        max = 5
      } = {}) {
        this._enabled = false;
        this._active = false;
        this._prevCoordDistance = -1;
        this._scaleMultiplier = 1;
        this._ui = new ScaleUI();
        this._motion = new Motion({
          duration: 0,
          range: {
            min,
            max
          }
        });

        this._motion.reset(1); // default scale is 1(100%)


        this._ui = new ScaleUI();
      }
      /**
       * Whether this control is enabled or not
       * @readonly
       */


      get enabled() {
        return this._enabled;
      }

      get scale() {
        return this._scaleMultiplier;
      }

      get ui() {
        return this._ui;
      }
      /**
       * Range of the scale
       * @readonly
       */


      get range() {
        return this._motion.range;
      }

      setInitialScale({
        scene,
        model,
        floorPosition,
        xrCam,
        initialScale
      }) {
        const motion = this._motion;
        const scaleRange = motion.range;

        if (initialScale === AUTO) {
          const camFov = 2 * Math.atan(1 / xrCam.projectionMatrix.elements[5]); // in radians

          const aspectInv = xrCam.projectionMatrix.elements[0] / xrCam.projectionMatrix.elements[5]; // x/y

          const camPos = xrCam.position;
          const modelHeight = model.bbox.max.y - model.bbox.min.y;
          const camToFloorDist = camPos.distanceTo(new THREE.Vector3().addVectors(floorPosition, new THREE.Vector3(0, modelHeight / 2, 0)));
          const viewY = camToFloorDist * Math.tan(camFov / 2);
          const viewX = viewY * aspectInv;
          const modelBoundingSphere = model.bbox.getBoundingSphere(new THREE.Sphere());
          const scaleY = viewY / modelBoundingSphere.radius;
          const scaleX = viewX / modelBoundingSphere.radius;
          const scale = clamp(Math.min(scaleX, scaleY), scaleRange.min, 1);
          motion.reset(scale);
        } else {
          motion.reset(clamp(initialScale, scaleRange.min, scaleRange.max));
        }

        const scale = this._motion.val;
        this._scaleMultiplier = scale;
        scene.setModelScale(scale);
      }

      setInitialPos(coords) {
        this._prevCoordDistance = new THREE.Vector2().subVectors(coords[0], coords[1]).length();
      }
      /**
       * Enable this control
       */


      enable() {
        this._enabled = true;
      }
      /**
       * Disable this control
       */


      disable() {
        this._enabled = false;
        this.deactivate();
      }

      activate(ctx) {
        this._active = true;

        this._ui.show();

        this._updateUIPosition(ctx);
      }

      deactivate() {
        this._active = false;

        this._ui.hide();

        this._prevCoordDistance = -1;
      }

      process(ctx, {
        coords
      }) {
        if (coords.length !== 2 || !this._enabled || !this._active) return;
        const motion = this._motion;
        const distance = new THREE.Vector2().subVectors(coords[0], coords[1]).length();
        const delta = distance - this._prevCoordDistance;
        motion.setEndDelta(delta);
        this._prevCoordDistance = distance;

        this._updateUIPosition(ctx);
      }

      update({
        view3D,
        scene
      }, deltaTime) {
        if (!this._enabled || !this._active) return;
        const motion = this._motion;
        motion.update(deltaTime);
        this._scaleMultiplier = motion.val;

        this._ui.updateScale(this._scaleMultiplier);

        scene.setModelScale(this._scaleMultiplier);
        view3D.scene.shadowPlane.updateShadow(this._scaleMultiplier);
      }

      _updateUIPosition({
        view3D,
        scene,
        xrCam,
        vertical
      }) {
        // Update UI
        const model = view3D.model;
        const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);
        const modelHeight = vertical ? model.bbox.getBoundingSphere(new THREE.Sphere()).radius : model.bbox.max.y - model.bbox.min.y;

        this._ui.updatePosition(scene.root.quaternion, camPos, modelHeight);
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Ring type indicator for showing where the model's at.
     */

    class FloorIndicator {
      /**
       * Create new instance of FloorIndicator
       * @param {FloorIndicatorOptions} [options={}] Options
       */
      constructor({
        ringOpacity = 0.3,
        dirIndicatorOpacity = 1,
        fadeoutDuration = 1000
      } = {}) {
        const deg10 = Math.PI / 18;
        const ringGeomtry = new THREE.RingGeometry(0.975, 1, 150, 1, -6 * deg10, 30 * deg10);
        const reticleGeometry = new THREE.CircleGeometry(0.1, 30, 0, Math.PI * 2);
        ringGeomtry.rotateX(-Math.PI / 2);
        reticleGeometry.rotateX(-Math.PI / 2);
        const arrowGeometry = new THREE.RingGeometry(0.96, 1.015, 30, 1, 25 * deg10, 4 * deg10); // Create little triangle in ring

        const {
          position: arrowGeometryPosition
        } = arrowGeometry.attributes;
        const triangleStartIdx = Math.floor(11 * arrowGeometryPosition.count / 16);
        const triangleEndIdx = Math.floor(13 * arrowGeometryPosition.count / 16);
        const midIndex = Math.floor((triangleEndIdx - triangleStartIdx + 1) / 2);
        const firstY = new THREE.Vector3().fromBufferAttribute(arrowGeometryPosition, triangleStartIdx).y;

        for (let idx = triangleStartIdx; idx < triangleEndIdx; idx++) {
          const vecIndex = idx - triangleStartIdx;
          const offsetAmount = 0.025 * (midIndex - Math.abs(vecIndex - midIndex));
          arrowGeometryPosition.setY(idx, firstY - offsetAmount);
        }

        arrowGeometry.rotateX(-Math.PI / 2);
        const dimmedMaterial = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: ringOpacity,
          color: 0xffffff
        });
        const highlightMaterial = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: dirIndicatorOpacity,
          color: 0xffffff
        });
        const ring = new THREE.Mesh(ringGeomtry, dimmedMaterial);
        const reticle = new THREE.Mesh(reticleGeometry, dimmedMaterial);
        const arrow = new THREE.Mesh(arrowGeometry, highlightMaterial);
        const merged = new THREE.Group();
        merged.add(ring, reticle, arrow);
        merged.position.setY(0.0001); // Set Y higher than shadow plane

        this._mesh = merged;
        this._ring = ring;
        this._reticle = reticle;
        this._arrow = arrow;
        this._animator = new Motion({
          duration: fadeoutDuration
        });
        this._opacityRange = {
          min: ringOpacity,
          max: dirIndicatorOpacity
        };
        this.hide();
      }
      /**
       * Ring mesh
       */


      get mesh() {
        return this._mesh;
      }

      updateSize(model) {
        this._mesh.scale.setScalar(model.bbox.getBoundingSphere(new THREE.Sphere()).radius);
      }

      update({
        delta,
        rotation
      }) {
        const mesh = this._mesh;
        const animator = this._animator;
        if (!mesh.visible) return;
        animator.update(delta);
        const minOpacityMat = this._ring.material;
        const maxOpacityMat = this._arrow.material;
        const opacityRange = this._opacityRange;
        minOpacityMat.opacity = animator.val * opacityRange.min;
        maxOpacityMat.opacity = animator.val * opacityRange.max;

        if (animator.val <= 0) {
          mesh.visible = false;
        } // Update mesh


        mesh.quaternion.copy(rotation);
        mesh.updateMatrix();
      }

      show() {
        this._mesh.visible = true;

        this._animator.reset(1);
      }

      hide() {
        this._mesh.visible = false;
      }

      fadeout() {
        this._animator.setEndDelta(-1);
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    var STATE$1;

    (function (STATE) {
      STATE[STATE["WAITING"] = 0] = "WAITING";
      STATE[STATE["IN_DEADZONE"] = 1] = "IN_DEADZONE";
      STATE[STATE["OUT_OF_DEADZONE"] = 2] = "OUT_OF_DEADZONE";
    })(STATE$1 || (STATE$1 = {}));
    /**
     * Deadzone checker for deadzone-based controls
     */


    class DeadzoneChecker {
      /**
       * Create new DeadzoneChecker
       * @param {DeadzoneCheckerOptions} [options={}] Options
       * @param {number} [options.size=0.1] Size of the deadzone circle.
       */
      constructor({
        size = 0.1
      } = {}) {
        // Internal States
        this._state = STATE$1.WAITING;
        this._detectedGesture = GESTURE.NONE;
        this._testingGestures = GESTURE.NONE;
        this._lastFingerCount = 0;
        this._aspect = 1; // Store two prev positions, as it should be maintained separately

        this._prevOneFingerPos = new THREE.Vector2();
        this._prevTwoFingerPos = new THREE.Vector2();
        this._initialTwoFingerDistance = 0;
        this._prevOneFingerPosInitialized = false;
        this._prevTwoFingerPosInitialized = false;
        this._size = size;
      }
      /**
       * Size of the deadzone.
       * @type {number}
       */


      get size() {
        return this._size;
      }
      /**
       * Whether the input is in the deadzone
       * @type {boolean}
       */


      get inDeadzone() {
        return this._state === STATE$1.IN_DEADZONE;
      }

      set size(val) {
        this._size = val;
      }
      /**
       * Set screen aspect(height / width)
       * @param aspect Screen aspect value
       */


      setAspect(aspect) {
        this._aspect = aspect;
      }

      setFirstInput(inputs) {
        const fingerCount = inputs.length;

        if (fingerCount === 1 && !this._prevOneFingerPosInitialized) {
          this._prevOneFingerPos.copy(inputs[0]);

          this._prevOneFingerPosInitialized = true;
        } else if (fingerCount === 2 && !this._prevTwoFingerPosInitialized) {
          this._prevTwoFingerPos.copy(new THREE.Vector2().addVectors(inputs[0], inputs[1]).multiplyScalar(0.5));

          this._initialTwoFingerDistance = new THREE.Vector2().subVectors(inputs[0], inputs[1]).length();
          this._prevTwoFingerPosInitialized = true;
        }

        this._lastFingerCount = fingerCount;
        this._state = STATE$1.IN_DEADZONE;
      }

      addTestingGestures(...gestures) {
        this._testingGestures = this._testingGestures | gestures.reduce((gesture, accumulated) => gesture | accumulated, GESTURE.NONE);
      }

      cleanup() {
        this._testingGestures = GESTURE.NONE;
        this._lastFingerCount = 0;
        this._prevOneFingerPosInitialized = false;
        this._prevTwoFingerPosInitialized = false;
        this._initialTwoFingerDistance = 0;
        this._detectedGesture = GESTURE.NONE;
        this._state = STATE$1.WAITING;
      }

      applyScreenAspect(inputs) {
        const aspect = this._aspect;
        inputs.forEach(input => {
          if (aspect > 1) {
            input.setY(input.y * aspect);
          } else {
            input.setX(input.x / aspect);
          }
        });
      }

      check(inputs) {
        const state = this._state;
        const deadzone = this._size;
        const testingGestures = this._testingGestures;
        const lastFingerCount = this._lastFingerCount;
        const fingerCount = inputs.length;

        if (state === STATE$1.OUT_OF_DEADZONE) {
          return this._detectedGesture;
        }

        this._lastFingerCount = fingerCount;
        this.applyScreenAspect(inputs);

        if (fingerCount !== lastFingerCount) {
          this.setFirstInput(inputs);
          return GESTURE.NONE;
        }

        if (fingerCount === 1) {
          const input = inputs[0];

          const prevPos = this._prevOneFingerPos.clone();

          const diff = new THREE.Vector2().subVectors(input, prevPos);

          if (diff.length() > deadzone) {
            if (Math.abs(diff.x) > Math.abs(diff.y)) {
              if (GESTURE.ONE_FINGER_HORIZONTAL & testingGestures) {
                this._detectedGesture = GESTURE.ONE_FINGER_HORIZONTAL;
              }
            } else {
              if (GESTURE.ONE_FINGER_VERTICAL & testingGestures) {
                this._detectedGesture = GESTURE.ONE_FINGER_VERTICAL;
              }
            }
          }
        } else if (fingerCount === 2) {
          const middle = new THREE.Vector2().addVectors(inputs[1], inputs[0]).multiplyScalar(0.5);

          const prevPos = this._prevTwoFingerPos.clone();

          const diff = new THREE.Vector2().subVectors(middle, prevPos);

          if (diff.length() > deadzone) {
            if (Math.abs(diff.x) > Math.abs(diff.y)) {
              if (GESTURE.TWO_FINGER_HORIZONTAL & testingGestures) {
                this._detectedGesture = GESTURE.TWO_FINGER_HORIZONTAL;
              }
            } else {
              if (GESTURE.TWO_FINGER_VERTICAL & testingGestures) {
                this._detectedGesture = GESTURE.TWO_FINGER_VERTICAL;
              }
            }
          }

          const distance = new THREE.Vector2().subVectors(inputs[1], inputs[0]).length();

          if (Math.abs(distance - this._initialTwoFingerDistance) > deadzone) {
            if (GESTURE.PINCH & testingGestures) {
              this._detectedGesture = GESTURE.PINCH;
            }
          }
        }

        if (this._detectedGesture !== GESTURE.NONE) {
          this._state = STATE$1.OUT_OF_DEADZONE;
        }

        return this._detectedGesture;
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * AR control for {@link WebARSession}
     */

    class WebARControl {
      /**
       * Create new instance of ARControl
       * @param {WebARControlOptions} options Options
       */
      constructor(view3D, arScene, {
        rotate,
        translate,
        scale,
        ring,
        deadzone,
        initialScale
      }) {
        this._onSelectStart = evt => {
          const frame = evt.frame;
          const view3D = this._view3D;
          const arScene = this._arScene;
          const hitTestSource = this._hitTestSource;
          const deadzoneChecker = this._deadzoneChecker;
          const rotateControl = this._rotateControl;
          const translateControl = this._translateControl;
          const scaleControl = this._scaleControl;
          const threeRenderer = view3D.renderer.threeRenderer;
          const xrCamArray = threeRenderer.xr.getCamera(new THREE.PerspectiveCamera());
          const referenceSpace = threeRenderer.xr.getReferenceSpace();
          if (!hitTestSource || xrCamArray.cameras.length <= 0) return;
          const xrCam = xrCamArray.cameras[0];
          const model = view3D.model; // Update deadzone testing gestures

          if (rotateControl.enabled) {
            deadzoneChecker.addTestingGestures(GESTURE.ONE_FINGER);
          }

          if (translateControl.enabled) {
            deadzoneChecker.addTestingGestures(GESTURE.ONE_FINGER);
          }

          if (scaleControl.enabled) {
            deadzoneChecker.addTestingGestures(GESTURE.PINCH);
          }

          const hitResults = frame.getHitTestResultsForTransientInput(hitTestSource);

          const coords = this._hitResultToVector(hitResults);

          deadzoneChecker.applyScreenAspect(coords);
          deadzoneChecker.setFirstInput(coords);

          if (coords.length === 1) {
            // Check finger is on the model
            const targetRayPose = frame.getPose(hitResults[0].inputSource.targetRaySpace, referenceSpace);

            if (targetRayPose) {
              const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);
              const rayPose = targetRayPose.transform.position;
              const fingerDir = new THREE.Vector3(rayPose.x, rayPose.y, rayPose.z).sub(camPos).normalize();
              const fingerRay = new THREE.Ray(camPos, fingerDir);
              const modelBoundingSphere = model.bbox.getBoundingSphere(new THREE.Sphere());
              modelBoundingSphere.applyMatrix4(arScene.modelMovable.matrixWorld);
              const intersection = fingerRay.intersectSphere(modelBoundingSphere, new THREE.Vector3());

              if (intersection) {
                // Touch point intersected with model
                this._modelHit = true;
              }
            }
          }

          if (!this._vertical || this._modelHit) {
            this._floorIndicator.show();
          }
        };

        this._onSelectEnd = () => {
          this._deactivate();

          this._floorIndicator.fadeout();
        };

        this._view3D = view3D;
        this._arScene = arScene;
        this._vertical = false;
        this._initialized = false;
        this._modelHit = false;
        this._hitTestSource = null;
        this._rotate = rotate;
        this._translate = translate;
        this._scale = scale;
        this._initialScale = initialScale;
        this._rotateControl = new ARSwirlControl(getObjectOption(rotate));
        this._translateControl = new ARTranslateControl(getObjectOption(translate));
        this._scaleControl = new ARScaleControl(getObjectOption(scale));
        this._floorIndicator = new FloorIndicator(ring);
        this._deadzoneChecker = new DeadzoneChecker(deadzone);
      }
      /**
       * {@link ARSwirlControl} in this control
       */


      get rotate() {
        return this._rotateControl;
      }
      /**
       * {@link ARTranslateControl} in this control
       */


      get translate() {
        return this._translateControl;
      }
      /**
       * {@link ARScaleControl} in this control
       */


      get scale() {
        return this._scaleControl;
      }

      init({
        model,
        session,
        size,
        vertical,
        hitPosition,
        hitRotation
      }) {
        return __awaiter(this, void 0, void 0, function* () {
          const arScene = this._arScene;
          const translateControl = this._translateControl;
          const scaleControl = this._scaleControl;
          const floorIndicator = this._floorIndicator;
          const deadzoneChecker = this._deadzoneChecker;
          this._vertical = vertical;
          translateControl.init(hitPosition, hitRotation, vertical);
          deadzoneChecker.setAspect(size.height / size.width);
          arScene.add(floorIndicator.mesh, scaleControl.ui.mesh);
          this.syncTargetModel(model);
          const transientHitTestSource = yield session.requestHitTestSourceForTransientInput({
            profile: INPUT_PROFILE.TOUCH
          });
          this._hitTestSource = transientHitTestSource;
          this._initialized = true;
        });
      }
      /**
       * Destroy this control and deactivate it
       */


      destroy(session) {
        if (!this._initialized) return;

        if (this._hitTestSource) {
          this._hitTestSource.cancel();

          this._hitTestSource = null;
        }

        this.disable(session);

        this._floorIndicator.hide();

        this._scaleControl.ui.hide();

        session.removeEventListener(EVENTS$2.SELECT_START, this._onSelectStart);
        session.removeEventListener(EVENTS$2.SELECT_END, this._onSelectEnd);
        this._initialized = false;
      }

      enable(session) {
        const rotate = this._rotate;
        const translate = this._translate;
        const scale = this._scale;
        const rotateControl = this._rotateControl;
        const translateControl = this._translateControl;
        const scaleControl = this._scaleControl;
        const vertical = this._vertical;
        session.addEventListener(EVENTS$2.SELECT_START, this._onSelectStart);
        session.addEventListener(EVENTS$2.SELECT_END, this._onSelectEnd);

        if (rotate && !vertical) {
          rotateControl.enable();
        }

        if (translate) {
          translateControl.enable();
        }

        if (scale) {
          scaleControl.enable();
        }
      }

      disable(session) {
        const rotateControl = this._rotateControl;
        const translateControl = this._translateControl;
        const scaleControl = this._scaleControl;
        session.removeEventListener(EVENTS$2.SELECT_START, this._onSelectStart);
        session.removeEventListener(EVENTS$2.SELECT_END, this._onSelectEnd);

        this._deactivate();

        rotateControl.disable();
        translateControl.disable();
        scaleControl.disable();
      }

      update(ctx) {
        var _a;

        const {
          view3D,
          session,
          frame
        } = ctx;
        const hitTestSource = this._hitTestSource;
        if (!hitTestSource || !view3D.model) return;
        const deadzoneChecker = this._deadzoneChecker;
        const inputSources = session.inputSources;
        const hitResults = (_a = frame === null || frame === void 0 ? void 0 : frame.getHitTestResultsForTransientInput(hitTestSource)) !== null && _a !== void 0 ? _a : [];

        const coords = this._hitResultToVector(hitResults);

        const xrInputs = {
          coords,
          inputSources,
          hitResults
        };

        if (deadzoneChecker.inDeadzone) {
          this._checkDeadzone(ctx, xrInputs);
        } else {
          this._processInput(ctx, xrInputs);
        }

        this._updateControls(ctx);
      }

      syncTargetModel(model) {
        const initialScale = this._initialScale;
        const floorPosition = this._translateControl.floorPosition;

        const xrCam = this._view3D.renderer.threeRenderer.xr.getCamera(new THREE.PerspectiveCamera()).cameras[0];

        this._floorIndicator.updateSize(model);

        this._scaleControl.setInitialScale({
          scene: this._arScene,
          model,
          floorPosition,
          xrCam,
          initialScale
        });
      }

      _deactivate() {
        this._modelHit = false;

        this._deadzoneChecker.cleanup();

        this._rotateControl.deactivate();

        this._translateControl.deactivate();

        this._scaleControl.deactivate();
      }

      _checkDeadzone(ctx, {
        coords
      }) {
        const arScene = this._arScene;
        const rotateControl = this._rotateControl;
        const translateControl = this._translateControl;
        const scaleControl = this._scaleControl;

        const gesture = this._deadzoneChecker.check(coords.map(coord => coord.clone()));

        if (gesture === GESTURE.NONE) return;

        switch (gesture) {
          case GESTURE.ONE_FINGER_HORIZONTAL:
          case GESTURE.ONE_FINGER_VERTICAL:
            if (this._modelHit) {
              translateControl.activate();
              translateControl.setInitialPos(coords);
            } else {
              rotateControl.activate();
              rotateControl.updateRotation(arScene.modelMovable.quaternion);
              rotateControl.setInitialPos(coords);
            }

            break;

          case GESTURE.PINCH:
            scaleControl.activate(ctx);
            scaleControl.setInitialPos(coords);
            break;
        }
      }

      _processInput(ctx, inputs) {
        this._rotateControl.process(ctx, inputs);

        this._translateControl.process(ctx, inputs);

        this._scaleControl.process(ctx, inputs);
      }

      _updateControls(ctx) {
        const {
          delta
        } = ctx;
        const arScene = this._arScene;
        const rotateControl = this._rotateControl;
        const translateControl = this._translateControl;
        const scaleControl = this._scaleControl;
        const floorIndicator = this._floorIndicator;
        const deltaMilisec = delta * 1000;
        rotateControl.update(ctx, deltaMilisec);
        translateControl.update(ctx, deltaMilisec);
        scaleControl.update(ctx, deltaMilisec);
        const modelRotation = rotateControl.rotation;
        const floorPosition = translateControl.floorPosition;
        arScene.setRootPosition(floorPosition);
        floorIndicator.update({
          delta: deltaMilisec,
          rotation: modelRotation
        });
      }

      _hitResultToVector(hitResults) {
        return hitResults.map(input => {
          return new THREE.Vector2().set(input.inputSource.gamepad.axes[0], -input.inputSource.gamepad.axes[1]);
        });
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */

    class ARScene {
      constructor() {
        this._root = new THREE.Scene();
        this._modelRoot = new THREE.Group();
        this._modelMovable = new THREE.Group();
        this._modelFixed = new THREE.Group();
        this._arRoot = new THREE.Group();
        const root = this._root;
        const modelRoot = this._modelRoot;
        const modelMovable = this._modelMovable;
        const modelFixed = this._modelFixed;
        const arRoot = this._arRoot;
        modelRoot.add(modelMovable);
        root.add(modelRoot, modelFixed, arRoot);
      }

      get root() {
        return this._root;
      }

      get modelRoot() {
        return this._modelRoot;
      }

      get modelMovable() {
        return this._modelMovable;
      }

      get arRoot() {
        return this._arRoot;
      }

      init(view3D) {
        const root = this._root;
        const modelMovable = this._modelMovable;
        const modelFixed = this._modelFixed; // Copy all scene objects into model objects

        const originalScene = view3D.scene;
        modelMovable.add(originalScene.userObjects, originalScene.envObjects);
        modelFixed.add(originalScene.fixedObjects); // Copy environment

        root.environment = originalScene.root.environment; // Start with root hidden, as floor should be detected first

        this.hideModel();
      }

      destroy(view3D) {
        const modelMovable = this._modelMovable;
        const modelFixed = this._modelFixed;
        const originalScene = view3D.scene;
        [...modelMovable.children, ...modelFixed.children].forEach(child => {
          originalScene.root.add(child);
        });
      }
      /**
       * Make this scene visible
       * @returns {void}
       */


      showModel() {
        this._modelRoot.visible = true;
      }
      /**
       * Make this scene invisible
       * @returns {void}
       */


      hideModel() {
        this._modelRoot.visible = false;
      }
      /**
       * Add AR-exclusive object
       */


      add(...objects) {
        this._arRoot.add(...objects);
      }

      setRootPosition(pos) {
        const root = this._root;
        root.position.copy(pos);
      }

      setWallRotation(quat) {
        const root = this._root;
        root.quaternion.copy(quat);
      }

      updateModelRootPosition(model, vertical) {
        const modelRoot = this._modelRoot;
        if (!vertical) return;
        const modelHeight = model.bbox.max.y - model.bbox.min.y;
        modelRoot.position.setZ(modelHeight / 2);
        modelRoot.position.setY(-model.bbox.min.z);
        modelRoot.rotateX(-Math.PI / 2);
        modelRoot.updateMatrix();
      }

      setModelHovering(hoverAmount) {
        const modelMovable = this._modelMovable;
        modelMovable.position.setY(hoverAmount);
      }

      setModelRotation(quat) {
        const modelMovable = this._modelMovable;
        modelMovable.quaternion.copy(quat);
      }

      setModelScale(scalar) {
        const root = this._root;
        root.scale.setScalar(scalar);
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Manager for WebXR dom-overlay feature
     */

    class DOMOverlay {
      constructor() {
        this._root = null;
      }
      /**
       * Return whether dom-overlay feature is available
       */


      static isAvailable() {
        return DOM_OVERLAY_SUPPORTED();
      }

      get root() {
        return this._root;
      }

      destroy() {
        this._root = null;
      }

      getFeatures(root) {
        this._root = root;
        return FEATURES.DOM_OVERLAY(root);
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Manager for WebXR hit-test feature
     */

    class HitTest {
      constructor() {
        this._source = null;
      }
      /**
       * Return whether hit-test feature is available
       */


      static isAvailable() {
        return HIT_TEST_SUPPORTED();
      }
      /**
       * Return whether hit-test is ready
       */


      get ready() {
        return this._source != null;
      }
      /**
       * Destroy instance
       */


      destroy() {
        if (this._source) {
          this._source.cancel();

          this._source = null;
        }
      }
      /**
       * Initialize hit-test feature
       * @param {XRSession} session XRSession instance
       */


      init(session) {
        session.requestReferenceSpace(REFERENCE_SPACE.VIEWER).then(referenceSpace => {
          session.requestHitTestSource({
            space: referenceSpace
          }).then(source => {
            this._source = source;
          });
        });
      }
      /**
       * {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit XRSessionInit} object for hit-test feature
       */


      getFeatures() {
        return FEATURES.HIT_TEST;
      }
      /**
       * Get hit-test results
       * @param {XRFrame} frame XRFrame instance
       */


      getResults(frame) {
        var _a;

        return (_a = frame === null || frame === void 0 ? void 0 : frame.getHitTestResults(this._source)) !== null && _a !== void 0 ? _a : [];
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * WebXR based abstract AR session class
     */

    class WebARSession {
      /**
       * Create new instance of WebARSession
       * @param {View3D} view3D Instance of the View3D
       * @param {object} [options={}] Options
       * @param {object} [options.features={}] Additional features(see {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit XRSessionInit}) of the WebXR session.
       * @param {HTMLElement|string|null} [options.overlayRoot=null] `dom-overlay`'s root element. You can set either HTMLElement or query selector for that element.
       * @param {boolean|ARSwirlControlOptions} [options.rotate=true] Options for the rotate control inside the AR session. You can disable rotate control by giving `false`.
       * @param {boolean|ARTranslateControlOptions} [options.translate=true] Options for the translate control inside the AR session. You can disable translate control by giving `false`.
       * @param {boolean|ARScaleControlOptions} [options.scale=true] Options for the scale control inside the AR session. You can disable scale control by giving `false`.
       * @param {FloorIndicatorOptions} [options.ring={}] Options for the floor ring.
       * @param {DeadzoneCheckerOptions} [options.deadzone={}] Control's deadzone options.
       * @param {"auto"|number} [options.initialScale="auto"] Initial scale of the model. If set to "auto", it will modify big overflowing 3D model's scale to fit the screen when it's initially displayed. This won't increase the 3D model's scale more than 1.
       */
      constructor(view3D, {
        features = EMPTY_FEATURES,
        vertical = false,
        overlayRoot = null,
        rotate = true,
        translate = true,
        scale = true,
        ring = {},
        deadzone = {},
        initialScale = AUTO
      } = {}) {
        this._view3D = view3D; // Init internal states

        this._modelPlaced = false; // Bind options

        this.features = features;
        this.vertical = vertical;
        this.overlayRoot = overlayRoot; // Create internal components

        this._arScene = new ARScene();
        this._control = new WebARControl(view3D, this._arScene, {
          rotate,
          translate,
          scale,
          ring,
          deadzone,
          initialScale
        });
        this._hitTest = new HitTest();
        this._domOverlay = new DOMOverlay();
      }
      /**
       * Return availability of this session
       * @returns {Promise<boolean>} A Promise that resolves availability of this session(boolean).
       */


      static isAvailable() {
        if (!WEBXR_SUPPORTED() || !HitTest.isAvailable() || !DOMOverlay.isAvailable()) return Promise.resolve(false);
        return navigator.xr.isSessionSupported(SESSION.AR);
      }
      /**
       * {@link ARControl} instance of this session
       * @type ARFloorControl
       */


      get control() {
        return this._control;
      }

      get arScene() {
        return this._arScene;
      }

      get hitTest() {
        return this._hitTest;
      }

      get domOverlay() {
        return this._domOverlay;
      }
      /**
       * Enter session
       * @param view3D Instance of the View3D
       * @returns {Promise}
       */


      enter() {
        return __awaiter(this, void 0, void 0, function* () {
          const view3D = this._view3D;
          const arScene = this._arScene;
          const renderer = view3D.renderer;
          const threeRenderer = renderer.threeRenderer;
          const control = this._control;
          const hitTest = this._hitTest;
          const domOverlay = this._domOverlay;
          const vertical = this.vertical;

          const features = this._getAllXRFeatures(); // Enable xr


          threeRenderer.xr.enabled = true;
          const session = yield navigator.xr.requestSession(SESSION.AR, features); // Cache original values

          const originalPixelRatio = threeRenderer.getPixelRatio();
          threeRenderer.setPixelRatio(1);
          threeRenderer.xr.setReferenceSpaceType(REFERENCE_SPACE.LOCAL);
          yield threeRenderer.xr.setSession(session);
          arScene.init(view3D);
          hitTest.init(session);

          const onSessionEnd = () => __awaiter(this, void 0, void 0, function* () {
            const overlayEl = domOverlay.root;
            control.destroy(session);
            arScene.destroy(view3D);

            if (!this.overlayRoot && overlayEl) {
              view3D.rootEl.removeChild(overlayEl);
            }

            domOverlay.destroy();
            view3D.scene.shadowPlane.updateShadow(); // Restore original values

            threeRenderer.setPixelRatio(originalPixelRatio); // Restore render loop

            renderer.stopAnimationLoop();
            renderer.setAnimationLoop(renderer.defaultRenderLoop);
            view3D.trigger(EVENTS.AR_END, {
              target: view3D,
              type: EVENTS.AR_END,
              session: this
            });
          });

          session.addEventListener("end", onSessionEnd, {
            once: true
          }); // Set XR session render loop

          const arClock = new THREE.Clock();
          arClock.start();
          renderer.stopAnimationLoop();
          threeRenderer.xr.setAnimationLoop((_, frame) => {
            var _a, _b;

            const xrCamArray = threeRenderer.xr.getCamera(new THREE.PerspectiveCamera());
            const delta = arClock.getDelta();
            if (xrCamArray.cameras.length <= 0) return;
            const xrCam = xrCamArray.cameras[0];
            const referenceSpace = threeRenderer.xr.getReferenceSpace();
            const glLayer = session.renderState.baseLayer;
            const size = {
              width: (_a = glLayer === null || glLayer === void 0 ? void 0 : glLayer.framebufferWidth) !== null && _a !== void 0 ? _a : 1,
              height: (_b = glLayer === null || glLayer === void 0 ? void 0 : glLayer.framebufferHeight) !== null && _b !== void 0 ? _b : 1
            };
            const ctx = {
              view3D,
              scene: arScene,
              session,
              delta,
              frame,
              vertical,
              referenceSpace,
              xrCam,
              size
            };
            const deltaMiliSec = delta * 1000;
            view3D.trigger(EVENTS.BEFORE_RENDER, {
              type: EVENTS.BEFORE_RENDER,
              target: view3D,
              delta: deltaMiliSec
            });

            if (!this._modelPlaced) {
              this._initModelPosition(ctx);
            } else {
              control.update(ctx);
              view3D.animator.update(delta);
              threeRenderer.render(arScene.root, xrCam);
            }

            view3D.trigger(EVENTS.RENDER, {
              type: EVENTS.RENDER,
              target: view3D,
              delta: deltaMiliSec
            });
          });
          view3D.trigger(EVENTS.AR_START, {
            type: EVENTS.AR_START,
            target: view3D,
            session: this
          });
        });
      }
      /**
       * Exit this session
       */


      exit() {
        return __awaiter(this, void 0, void 0, function* () {
          const session = this._view3D.renderer.threeRenderer.xr.getSession();

          return session === null || session === void 0 ? void 0 : session.end();
        });
      }

      _getAllXRFeatures() {
        var _a;

        const userFeatures = this.features;
        const overlayRoot = (_a = getNullableElement(this.overlayRoot)) !== null && _a !== void 0 ? _a : this._createARRootElement();
        return merge({}, this._domOverlay.getFeatures(overlayRoot), this._hitTest.getFeatures(), userFeatures);
      }

      _initModelPosition(ctx) {
        const {
          frame,
          session,
          size,
          vertical,
          referenceSpace
        } = ctx;
        const view3D = this._view3D;
        const model = view3D.model;
        const arScene = this._arScene;
        const hitTest = this._hitTest; // Make sure the model is loaded

        if (!hitTest.ready || !model) return;
        const control = this._control;
        const hitTestResults = hitTest.getResults(frame);
        if (hitTestResults.length <= 0) return;
        const hit = hitTestResults[0];
        const hitPose = hit.getPose(referenceSpace);
        if (!hitPose) return;
        const hitMatrix = new THREE.Matrix4().fromArray(hitPose.transform.matrix); // If transformed coords space's y axis is not facing the correct direction, don't use it.

        if (!vertical && hitMatrix.elements[5] < 0.75 || vertical && (hitMatrix.elements[5] >= 0.25 || hitMatrix.elements[5] <= -0.25)) return;
        const hitPosition = new THREE.Vector3().setFromMatrixPosition(hitMatrix);
        const hitRotation = new THREE.Quaternion();

        if (vertical) {
          const globalUp = new THREE.Vector3(0, 1, 0);
          const hitOrientation = hitPose.transform.orientation;
          const wallNormal = globalUp.clone().applyQuaternion(new THREE.Quaternion(hitOrientation.x, hitOrientation.y, hitOrientation.z, hitOrientation.w)).normalize();
          const wallX = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), wallNormal);
          const wallMatrix = new THREE.Matrix4().makeBasis(wallX, globalUp, wallNormal);
          const wallEuler = new THREE.Euler(0, 0, 0, "YXZ").setFromRotationMatrix(wallMatrix);
          wallEuler.z = 0;
          wallEuler.x = Math.PI / 2;
          hitRotation.setFromEuler(wallEuler);
          arScene.setWallRotation(hitRotation);
        } // Reset rotation & update position


        arScene.updateModelRootPosition(model, vertical);
        arScene.setRootPosition(hitPosition);
        arScene.showModel(); // Don't need hit-test anymore, as we're having new one in WebARControl

        hitTest.destroy();
        this._modelPlaced = true;
        view3D.trigger(EVENTS.AR_MODEL_PLACED, {
          type: EVENTS.AR_MODEL_PLACED,
          target: view3D,
          session: this,
          model
        });
        void control.init({
          model,
          vertical,
          session,
          size,
          hitPosition,
          hitRotation
        });
        const initialScale = control.scale.scale; // Show scale up animation

        const scaleUpAnimation = new Animation({
          context: session,
          duration: 1000
        });
        scaleUpAnimation.on("progress", evt => {
          arScene.setModelScale(evt.easedProgress * initialScale);
        });
        scaleUpAnimation.on("finish", () => {
          arScene.setModelScale(initialScale);
          control.enable(session);
        });
        scaleUpAnimation.start();
      }

      _createARRootElement() {
        const view3D = this._view3D;
        const root = document.createElement("div");
        root.classList.add(AR_OVERLAY_CLASS);
        view3D.rootEl.appendChild(root);
        view3D.once(EVENTS.AR_END, () => {
          view3D.rootEl.removeChild(root);
        });
        return root;
      }

    }

    WebARSession.type = AR_SESSION_TYPE.WEBXR;

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * AR session using Google's scene-viewer
     * @see https://developers.google.com/ar/develop/java/scene-viewer
     */

    class SceneViewerSession {
      /**
       * Create new instance of SceneViewerSession
       * @see https://developers.google.com/ar/develop/java/scene-viewer
       * @param {View3D} view3D Instance of the View3D
       * @param {object} [params={}] Session params
       * @param {string} [params.file=null] This URL specifies the glTF or glb file that should be loaded into Scene Viewer. This should be URL-escaped. If `null` is given, it will try to use current model shown on the canvas. This behavior only works when the format of the model shown is either "glTF" or "glb".
       * @param {string} [params.mode="ar_only"] See [SCENE_VIEWER_MODE](/docs/api/SCENE_VIEWER_MODE) for available modes (also check their [official page](https://developers.google.com/ar/develop/java/scene-viewer) for details).
       * @param {string} [params.fallbackURL=null] This is a Google Chrome feature supported only for web-based implementations. When the Google app com.google.android.googlequicksearchbox is not present on the device, this is the URL that Google Chrome navigates to.
       * @param {string} [params.title=null] A name for the model. If present, it will be displayed in the UI. The name will be truncated with ellipses after 60 characters.
       * @param {string} [params.link=null] A URL for an external webpage. If present, a button will be surfaced in the UI that intents to this URL when clicked.
       * @param {string} [params.sound=null] A URL to a looping audio track that is synchronized with the first animation embedded in a glTF file. It should be provided alongside a glTF with an animation of matching length. If present, the sound is looped after the model is loaded. This should be URL-escaped.
       * @param {boolean} [params.resizable=true] When set to false, users will not be able to scale the model in the AR experience. Scaling works normally in the 3D experience.
       * @param {boolean} [params.vertical=false] When set to true, users will be able to place the model on a vertical surface.
       * @param {boolean} [params.disableOcclusion=false] When set to true, SceneViewer will disable {@link https://developers.google.com/ar/develop/java/depth/introduction object blending}
       * @param {string} [params.initialScale="auto"] Initial scale of the 3D model. If set to `null`, 3D model will shown as its original size and will disable the "View actual size" button. Default value is "auto", and "1" will show model size in 100%, "2" in 200%, "0.5" in 50% and so on.
       * @param {string} [params.shareText=null] A text that will be displayed when user clicked the share button.
       */
      constructor(view3D, _a = {}) {
        var {
          file = null,
          mode = SCENE_VIEWER_MODE.ONLY_AR,
          fallbackURL = null,
          title = null,
          link = null,
          sound = null,
          resizable = true,
          vertical = false,
          disableOcclusion = false,
          initialScale = AUTO,
          shareText = null
        } = _a,
            otherParams = __rest(_a, ["file", "mode", "fallbackURL", "title", "link", "sound", "resizable", "vertical", "disableOcclusion", "initialScale", "shareText"]);

        this._view3D = view3D;
        this.file = file;
        this.fallbackURL = fallbackURL;
        this.mode = mode;
        this.title = title;
        this.link = link;
        this.sound = sound;
        this.resizable = resizable;
        this.vertical = vertical;
        this.disableOcclusion = disableOcclusion;
        this.initialScale = initialScale;
        this.shareText = shareText;
        this.otherParams = otherParams;
      }
      /**
       * Return the availability of SceneViewerSession.
       * Scene-viewer is available on all android devices with google ARCore installed.
       * @returns {Promise} A Promise that resolves availability of this session(boolean).
       */


      static isAvailable() {
        return Promise.resolve(IS_ANDROID());
      }
      /**
       * Enter Scene-viewer AR session
       */


      enter() {
        var _a, _b;

        return __awaiter(this, void 0, void 0, function* () {
          const model = this._view3D.model;
          const params = Object.assign({
            title: this.title,
            link: this.link,
            sound: this.sound,
            mode: this.mode,
            initial_scale: this.initialScale
          }, this.otherParams);
          params.resizable = toBooleanString(this.resizable);
          params.enable_vertical_placement = toBooleanString(this.vertical);
          params.disable_occlusion = toBooleanString(this.disableOcclusion);
          params.share_text = this.shareText ? encodeURIComponent(this.shareText) : null;
          const file = (_a = this.file) !== null && _a !== void 0 ? _a : model.src;

          if (!file) {
            return Promise.reject(new View3DError(ERROR.MESSAGES.FILE_NOT_SUPPORTED((_b = this.file) !== null && _b !== void 0 ? _b : model.src), ERROR.CODES.FILE_NOT_SUPPORTED));
          }

          params.file = new URL(file, window.location.href).href;
          const fallbackURL = this.fallbackURL;
          const queryString = Object.keys(params).filter(key => params[key] != null).map(key => `${key}=${params[key]}`).join("&");
          const intentURL = params.mode === SCENE_VIEWER_MODE.ONLY_AR ? SCENE_VIEWER.INTENT_AR_CORE(queryString, fallbackURL) : SCENE_VIEWER.INTENT_SEARCHBOX(queryString, fallbackURL || SCENE_VIEWER.FALLBACK_DEFAULT(queryString));
          const anchor = document.createElement("a");
          anchor.href = intentURL;
          anchor.click();
        });
      }

      exit() {
        return Promise.resolve();
      }

    }

    SceneViewerSession.type = AR_SESSION_TYPE.SCENE_VIEWER;

    /**
     * AR Session using Apple AR Quick Look Viewer
     * @see https://developer.apple.com/augmented-reality/quick-look/
     */

    class QuickLookSession {
      /**
       * Create new instance of QuickLookSession
       * @param {View3D} view3D Instance of the View3D
       * @param {object} [options={}] Quick Look options
       * @param {boolean} [options.allowsContentScaling=true] Whether to allow content scaling.
       * @param {string | null} [options.canonicalWebPageURL=null] The web URL to share when the user invokes the share sheet. If `null` is given, the USDZ file will be shared.
       * @param {string | null} [options.applePayButtonType=null] Type of the apple pay button in the banner. See {@link QUICK_LOOK_APPLE_PAY_BUTTON_TYPE}
       * @param {string | null} [options.callToAction=null] A text that will be displayed instead of Apple Pay Button. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3405143 Official Guide Page}
       * @param {string | null} [options.checkoutTitle=null] Title of the previewed item. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3405142 Official Guide Page}
       * @param {string | null} [options.checkoutSubtitle=null] Subtitle of the previewed item. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3405142 Official Guide Page}
       * @param {string | null} [options.price=null] Price of the previewed item. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3405142 Official Guide Page}
       * @param {string | null} [options.custom=null] Custom URL to the banner HTML. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3402837 Official Guide Page}
       * @param {string | null} [options.customHeight=null] Height of the custom banner. See {@link QUICK_LOOK_CUSTOM_BANNER_SIZE}
       */
      constructor(view3D, {
        allowsContentScaling = true,
        canonicalWebPageURL = null,
        applePayButtonType = null,
        callToAction = null,
        checkoutTitle = null,
        checkoutSubtitle = null,
        price = null,
        custom = null,
        customHeight = null
      } = {}) {
        this._view3D = view3D;
        this.allowsContentScaling = allowsContentScaling;
        this.canonicalWebPageURL = canonicalWebPageURL;
        this.applePayButtonType = applePayButtonType;
        this.callToAction = callToAction;
        this.checkoutTitle = checkoutTitle;
        this.checkoutSubtitle = checkoutSubtitle;
        this.price = price;
        this.custom = custom;
        this.customHeight = customHeight;
      }
      /**
       * Return the availability of QuickLookSession.
       * QuickLook AR is available on iOS12+
       * @returns {Promise} A Promise that resolves availability of this session(boolean).
       */


      static isAvailable() {
        return Promise.resolve(QUICK_LOOK_SUPPORTED() && IS_IOS());
      }
      /**
       * Enter QuickLook AR Session
       */


      enter() {
        const view3D = this._view3D;
        const file = view3D.iosSrc;

        if (!file) {
          return Promise.reject(new View3DError(ERROR.MESSAGES.FILE_NOT_SUPPORTED(`${file}`), ERROR.CODES.FILE_NOT_SUPPORTED));
        }

        const canonicalWebPageURL = this.canonicalWebPageURL;
        const custom = this.custom;
        const currentHref = window.location.href;
        const anchor = document.createElement("a");
        anchor.setAttribute("rel", "ar");
        anchor.appendChild(document.createElement("img"));
        const hashObj = Object.entries({
          applePayButtonType: this.applePayButtonType,
          callToAction: this.callToAction,
          checkoutTitle: this.checkoutTitle,
          checkoutSubtitle: this.checkoutSubtitle,
          price: this.price,
          customHeight: this.customHeight
        }).reduce((obj, [key, value]) => {
          if (value) {
            obj[key] = value;
          }

          return obj;
        }, {});
        const usdzURL = new URL(file, currentHref);

        if (!this.allowsContentScaling) {
          hashObj.allowsContentScaling = "0";
        }

        if (canonicalWebPageURL) {
          hashObj.canonicalWebPageURL = new URL(canonicalWebPageURL, currentHref).href;
        }

        if (custom) {
          hashObj.custom = new URL(custom, currentHref).href;
        }

        usdzURL.hash = new URLSearchParams(hashObj).toString();
        anchor.setAttribute("href", usdzURL.href);
        anchor.addEventListener("message", evt => {
          if (evt.data === "_apple_ar_quicklook_button_tapped") {
            // User tapped either Apple pay button / Custom action button
            view3D.trigger(EVENTS.QUICK_LOOK_TAP, Object.assign(Object.assign({}, evt), {
              type: EVENTS.QUICK_LOOK_TAP,
              target: view3D
            }));
          }
        }, false);
        anchor.click();
        return Promise.resolve();
      }

      exit() {
        return Promise.resolve();
      }

    }

    QuickLookSession.type = AR_SESSION_TYPE.QUICK_LOOK;

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    const sessionCtors = {
      [AR_SESSION_TYPE.WEBXR]: WebARSession,
      [AR_SESSION_TYPE.SCENE_VIEWER]: SceneViewerSession,
      [AR_SESSION_TYPE.QUICK_LOOK]: QuickLookSession
    };
    /**
     * ARManager that manages AR sessions
     */

    class ARManager {
      /**
       * Create a new instance of the ARManager
       * @param {View3D} view3D An instance of the View3D
       */
      constructor(view3D) {
        this._view3D = view3D;
        this._activeSession = null;
        view3D.on(EVENTS.AR_START, ({
          session
        }) => {
          this._activeSession = session;
        });
        view3D.on(EVENTS.AR_END, () => {
          this._activeSession = null;
        });
      }

      get activeSession() {
        return this._activeSession;
      }
      /**
       * Return a Promise containing whether any of the added session is available
       * If any of the AR session in current environment, this will return `true`
       * @returns {Promise<boolean>} Availability of the AR session
       */


      isAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
          const sessions = this._getSesssionClasses();

          const results = yield Promise.all(sessions.map(session => session.isAvailable()));
          return results.some(result => result === true);
        });
      }
      /**
       * Enter XR Session.
       * This should be called from a user interaction.
       */


      enter() {
        return __awaiter(this, void 0, void 0, function* () {
          const view3D = this._view3D;

          if (!view3D.model || !view3D.initialized) {
            throw new View3DError(ERROR.MESSAGES.NOT_INITIALIZED, ERROR.CODES.NOT_INITIALIZED);
          }

          const sessions = this._getSesssionClasses();

          for (const session of sessions) {
            try {
              if (yield session.isAvailable()) {
                const sessionInstance = new session(view3D, getObjectOption(view3D[session.type]));
                yield sessionInstance.enter();
                return Promise.resolve();
              }
            } catch (err) {} // eslint-disable-line no-empty

          } // No sessions were available


          return Promise.reject();
        });
      }
      /**
       * Exit current XR Session.
       */


      exit() {
        return __awaiter(this, void 0, void 0, function* () {
          const activeSession = this._activeSession;
          activeSession === null || activeSession === void 0 ? void 0 : activeSession.exit();
        });
      }

      _getSesssionClasses() {
        return this._getUsingSessionTypes().map(sessionType => sessionCtors[sessionType]);
      }

      _getUsingSessionTypes() {
        const view3D = this._view3D;
        const priority = view3D.arPriority;
        return priority.filter(sessionType => !!view3D[sessionType]);
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    const CURSOR = {
      GRAB: "grab",
      GRABBING: "grabbing",
      NONE: ""
    };

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Model's rotation control that supports both mouse & touch
     */

    class RotateControl extends Component {
      /**
       * Create new RotateControl instance
       * @param {View3D} view3D An instance of View3D
       * @param {RotateControlOptions} options Options
       */
      constructor(view3D, {
        duration = ANIMATION_DURATION,
        easing = EASING$1,
        scale = 1
      } = {}) {
        super();
        this._screenScale = new THREE.Vector2(0, 0);
        this._prevPos = new THREE.Vector2(0, 0);
        this._enabled = false;

        this._onMouseDown = evt => {
          if (evt.button !== MOUSE_BUTTON.LEFT) return;
          const targetEl = this._view3D.renderer.canvas;
          evt.preventDefault();

          if (!!targetEl.focus) {
            targetEl.focus();
          } else {
            window.focus();
          }

          this._prevPos.set(evt.clientX, evt.clientY);

          window.addEventListener(EVENTS$1.MOUSE_MOVE, this._onMouseMove, false);
          window.addEventListener(EVENTS$1.MOUSE_UP, this._onMouseUp, false);
          this.trigger(CONTROL_EVENTS.HOLD);
        };

        this._onMouseMove = evt => {
          evt.preventDefault();
          const prevPos = this._prevPos;
          const rotateDelta = new THREE.Vector2(evt.clientX, evt.clientY).sub(prevPos).multiplyScalar(this._scale);
          rotateDelta.multiply(this._screenScale);

          this._xMotion.setEndDelta(rotateDelta.x);

          this._yMotion.setEndDelta(rotateDelta.y);

          prevPos.set(evt.clientX, evt.clientY);
        };

        this._onMouseUp = () => {
          this._prevPos.set(0, 0);

          window.removeEventListener(EVENTS$1.MOUSE_MOVE, this._onMouseMove, false);
          window.removeEventListener(EVENTS$1.MOUSE_UP, this._onMouseUp, false);
          this.trigger(CONTROL_EVENTS.RELEASE);
        };

        this._onTouchStart = evt => {
          const touch = evt.touches[0];
          this._isFirstTouch = true;

          this._prevPos.set(touch.clientX, touch.clientY);
        };

        this._onTouchMove = evt => {
          // Only the one finger motion should be considered
          if (evt.touches.length > 1 || this._isScrolling) return;
          const touch = evt.touches[0];
          const scrollable = this._view3D.scrollable;

          if (scrollable && !evt.cancelable) {
            return;
          }

          if (this._isFirstTouch) {
            if (scrollable) {
              const delta = new THREE.Vector2(touch.clientX, touch.clientY).sub(this._prevPos);

              if (Math.abs(delta.y) > Math.abs(delta.x)) {
                // Assume Scrolling
                this._isScrolling = true;
                return;
              }
            }

            this._isFirstTouch = false;
          }

          if (!scrollable && evt.cancelable) {
            evt.preventDefault();
          }

          evt.stopPropagation();
          const prevPos = this._prevPos;
          const rotateDelta = new THREE.Vector2(touch.clientX, touch.clientY).sub(prevPos).multiplyScalar(this._scale);
          rotateDelta.multiply(this._screenScale);

          this._xMotion.setEndDelta(rotateDelta.x);

          this._yMotion.setEndDelta(rotateDelta.y);

          prevPos.set(touch.clientX, touch.clientY);
        };

        this._onTouchEnd = evt => {
          const touch = evt.touches[0];

          if (touch) {
            this._prevPos.set(touch.clientX, touch.clientY);
          } else {
            this._prevPos.set(0, 0);
          }

          this._isScrolling = false;
        };

        this._view3D = view3D;
        this._scale = scale;
        this._duration = duration;
        this._easing = easing;
        this._isFirstTouch = false;
        this._isScrolling = false;
        this._xMotion = new Motion({
          duration,
          range: INFINITE_RANGE,
          easing
        });
        this._yMotion = new Motion({
          duration,
          range: PITCH_RANGE,
          easing
        });
      }
      /**
       * Whether this control is enabled or not
       * @readonly
       * @type {boolean}
       */


      get enabled() {
        return this._enabled;
      }
      /**
       * Scale factor for rotation
       * @type {number}
       * @default 1
       */


      get scale() {
        return this._scale;
      }
      /**
       * Duration of the input animation (ms)
       * @type {number}
       * @default 300
       */


      get duration() {
        return this._duration;
      }
      /**
       * Easing function of the animation
       * @type {function}
       * @default EASING.EASE_OUT_CUBIC
       * @see EASING
       */


      get easing() {
        return this._easing;
      }

      set scale(val) {
        this._scale = val;
      }

      set duration(val) {
        this._duration = val;
        this._xMotion.duration = val;
        this._yMotion.duration = val;
      }

      set easing(val) {
        this._easing = val;
        this._xMotion.easing = val;
        this._yMotion.easing = val;
      }
      /**
       * Destroy the instance and remove all event listeners attached
       * @returns {void}
       */


      destroy() {
        this.disable();
      }
      /**
       * Update control by given deltaTime
       * @param deltaTime Number of milisec to update
       * @returns {void}
       */


      update(deltaTime) {
        const camera = this._view3D.camera;
        const xMotion = this._xMotion;
        const yMotion = this._yMotion;
        const delta = new THREE.Vector2(xMotion.update(deltaTime), yMotion.update(deltaTime));
        camera.yaw += delta.x;
        camera.pitch += delta.y;
      }
      /**
       * Resize control to match target size
       * @param {object} size New size to apply
       * @param {number} [size.width] New width
       * @param {number} [size.height] New height
       */


      resize(size) {
        this._screenScale.set(360 / size.width, 180 / size.height);
      }
      /**
       * Enable this input and add event listeners
       * @returns {void}
       */


      enable() {
        if (this._enabled) return;
        const targetEl = this._view3D.renderer.canvas;
        targetEl.addEventListener(EVENTS$1.MOUSE_DOWN, this._onMouseDown);
        targetEl.addEventListener(EVENTS$1.TOUCH_START, this._onTouchStart, {
          passive: true
        });
        targetEl.addEventListener(EVENTS$1.TOUCH_MOVE, this._onTouchMove, {
          passive: this._view3D.scrollable
        });
        targetEl.addEventListener(EVENTS$1.TOUCH_END, this._onTouchEnd);
        this._enabled = true;
        this.sync();
        this.trigger(CONTROL_EVENTS.ENABLE);
      }
      /**
       * Disable this input and remove all event handlers
       * @returns {void}
       */


      disable() {
        if (!this._enabled) return;
        const targetEl = this._view3D.renderer.canvas;
        targetEl.removeEventListener(EVENTS$1.MOUSE_DOWN, this._onMouseDown);
        window.removeEventListener(EVENTS$1.MOUSE_MOVE, this._onMouseMove);
        window.removeEventListener(EVENTS$1.MOUSE_UP, this._onMouseUp);
        targetEl.removeEventListener(EVENTS$1.TOUCH_START, this._onTouchStart);
        targetEl.removeEventListener(EVENTS$1.TOUCH_MOVE, this._onTouchMove);
        targetEl.removeEventListener(EVENTS$1.TOUCH_END, this._onTouchEnd);
        this._enabled = false;
        this.trigger(CONTROL_EVENTS.DISABLE);
      }
      /**
       * Synchronize this control's state to given camera position
       * @returns {void}
       */


      sync() {
        const camera = this._view3D.camera;

        this._xMotion.reset(camera.yaw);

        this._yMotion.reset(camera.pitch);
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Model's translation control that supports both mouse & touch
     */

    class TranslateControl extends Component {
      /**
       * Create new TranslateControl instance
       * @param {View3D} view3D An instance of View3D
       * @param {TranslateControlOptions} options Options
       */
      constructor(view3D, {
        easing = EASING$1,
        duration = 0,
        scale = 1
      } = {}) {
        super();
        this._enabled = false; // Sometimes, touchstart for second finger doesn't triggered.
        // This flag checks whether that happened

        this._touchInitialized = false;
        this._prevPos = new THREE.Vector2(0, 0);
        this._screenSize = new THREE.Vector2(0, 0);

        this._onMouseDown = evt => {
          if (evt.button !== MOUSE_BUTTON.RIGHT) return;
          const targetEl = this._view3D.renderer.canvas;
          evt.preventDefault();

          if (!!targetEl.focus) {
            targetEl.focus();
          } else {
            window.focus();
          }

          this._prevPos.set(evt.clientX, evt.clientY);

          window.addEventListener(EVENTS$1.MOUSE_MOVE, this._onMouseMove, false);
          window.addEventListener(EVENTS$1.MOUSE_UP, this._onMouseUp, false);
          window.addEventListener(EVENTS$1.CONTEXT_MENU, this._onContextMenu, false);
          this.trigger(CONTROL_EVENTS.HOLD);
        };

        this._onMouseMove = evt => {
          evt.preventDefault();
          const prevPos = this._prevPos;
          const delta = new THREE.Vector2(evt.clientX, evt.clientY).sub(prevPos).multiplyScalar(this._scale); // X value is negated to match cursor direction

          this._xMotion.setEndDelta(-delta.x);

          this._yMotion.setEndDelta(delta.y);

          prevPos.set(evt.clientX, evt.clientY);
        };

        this._onMouseUp = () => {
          this._prevPos.set(0, 0);

          window.removeEventListener(EVENTS$1.MOUSE_MOVE, this._onMouseMove, false);
          window.removeEventListener(EVENTS$1.MOUSE_UP, this._onMouseUp, false);
          this.trigger(CONTROL_EVENTS.RELEASE);
        };

        this._onTouchStart = evt => {
          // Only the two finger motion should be considered
          if (evt.touches.length !== 2) return;

          if (evt.cancelable !== false) {
            evt.preventDefault();
          }

          this._prevPos.copy(this._getTouchesMiddle(evt.touches));

          this._touchInitialized = true;
        };

        this._onTouchMove = evt => {
          // Only the two finger motion should be considered
          if (evt.touches.length !== 2) return;

          if (evt.cancelable !== false) {
            evt.preventDefault();
          }

          evt.stopPropagation();
          const prevPos = this._prevPos;

          const middlePoint = this._getTouchesMiddle(evt.touches);

          if (!this._touchInitialized) {
            prevPos.copy(middlePoint);
            this._touchInitialized = true;
            return;
          }

          const delta = new THREE.Vector2().subVectors(middlePoint, prevPos).multiplyScalar(this._scale); // X value is negated to match cursor direction

          this._xMotion.setEndDelta(-delta.x);

          this._yMotion.setEndDelta(delta.y);

          prevPos.copy(middlePoint);
        };

        this._onTouchEnd = evt => {
          // Only the two finger motion should be considered
          if (evt.touches.length !== 2) {
            this._touchInitialized = false;
            return;
          } // Three fingers to two fingers


          this._prevPos.copy(this._getTouchesMiddle(evt.touches));

          this._touchInitialized = true;
        };

        this._onContextMenu = evt => {
          evt.preventDefault();
          window.removeEventListener(EVENTS$1.CONTEXT_MENU, this._onContextMenu, false);
        };

        this._view3D = view3D;
        this._xMotion = new Motion({
          duration,
          range: INFINITE_RANGE,
          easing
        });
        this._yMotion = new Motion({
          duration,
          range: INFINITE_RANGE,
          easing
        });
        this._scale = scale;
      }
      /**
       * Whether this control is enabled or not
       * @readonly
       * @type {boolean}
       */


      get enabled() {
        return this._enabled;
      }
      /**
       * Scale factor for translation
       * @type number
       * @default 1
       * @see https://threejs.org/docs/#api/en/math/Vector2
       */


      get scale() {
        return this._scale;
      }
      /**
       * Duration of the input animation (ms)
       * @type {number}
       * @default 300
       */


      get duration() {
        return this._duration;
      }
      /**
       * Easing function of the animation
       * @type {function}
       * @default EASING.EASE_OUT_CUBIC
       * @see EASING
       */


      get easing() {
        return this._easing;
      }

      set scale(val) {
        this._scale = val;
      }

      set duration(val) {
        this._duration = val;
        this._xMotion.duration = val;
        this._yMotion.duration = val;
      }

      set easing(val) {
        this._easing = val;
        this._xMotion.easing = val;
        this._yMotion.easing = val;
      }
      /**
       * Destroy the instance and remove all event listeners attached
       * @returns {void}
       */


      destroy() {
        this.disable();
      }
      /**
       * Update control by given deltaTime
       * @param deltaTime Number of milisec to update
       * @returns {void}
       */


      update(deltaTime) {
        const camera = this._view3D.camera;
        const screenSize = this._screenSize;
        const delta = new THREE.Vector2(this._xMotion.update(deltaTime), this._yMotion.update(deltaTime));
        const viewXDir = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.threeCamera.quaternion);
        const viewYDir = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.threeCamera.quaternion);
        const screenScale = new THREE.Vector2(camera.renderWidth, camera.renderHeight).divide(screenSize);
        delta.multiply(screenScale);
        camera.pivot.add(viewXDir.multiplyScalar(delta.x));
        camera.pivot.add(viewYDir.multiplyScalar(delta.y));
      }
      /**
       * Resize control to match target size
       * @param {object} size New size to apply
       * @param {number} [size.width] New width
       * @param {number} [size.height] New height
       */


      resize(size) {
        const screenSize = this._screenSize;
        screenSize.copy(new THREE.Vector2(size.width, size.height));
      }
      /**
       * Enable this input and add event listeners
       * @returns {void}
       */


      enable() {
        if (this._enabled) return;
        const targetEl = this._view3D.renderer.canvas;
        targetEl.addEventListener(EVENTS$1.MOUSE_DOWN, this._onMouseDown, false);
        targetEl.addEventListener(EVENTS$1.TOUCH_START, this._onTouchStart, {
          passive: false,
          capture: false
        });
        targetEl.addEventListener(EVENTS$1.TOUCH_MOVE, this._onTouchMove, {
          passive: false,
          capture: false
        });
        targetEl.addEventListener(EVENTS$1.TOUCH_END, this._onTouchEnd, {
          passive: false,
          capture: false
        });
        this._enabled = true;
        this.sync();
        this.trigger(CONTROL_EVENTS.ENABLE);
      }
      /**
       * Disable this input and remove all event handlers
       * @returns {void}
       */


      disable() {
        if (!this._enabled) return;
        const targetEl = this._view3D.renderer.canvas;
        targetEl.removeEventListener(EVENTS$1.MOUSE_DOWN, this._onMouseDown, false);
        window.removeEventListener(EVENTS$1.MOUSE_MOVE, this._onMouseMove, false);
        window.removeEventListener(EVENTS$1.MOUSE_UP, this._onMouseUp, false);
        targetEl.removeEventListener(EVENTS$1.TOUCH_START, this._onTouchStart, false);
        targetEl.removeEventListener(EVENTS$1.TOUCH_MOVE, this._onTouchMove, false);
        targetEl.removeEventListener(EVENTS$1.TOUCH_END, this._onTouchEnd, false);
        window.removeEventListener(EVENTS$1.CONTEXT_MENU, this._onContextMenu, false);
        this._enabled = false;
        this.trigger(CONTROL_EVENTS.DISABLE);
      }
      /**
       * Synchronize this control's state to the camera position
       * @returns {void}
       */


      sync() {
        this._xMotion.reset(0);

        this._yMotion.reset(0);
      }

      _getTouchesMiddle(touches) {
        return new THREE.Vector2(touches[0].clientX + touches[1].clientX, touches[0].clientY + touches[1].clientY).multiplyScalar(0.5);
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Distance controller handling both mouse wheel and pinch zoom(fov)
     */

    class ZoomControl {
      /**
       * Create new ZoomControl instance
       * @param {View3D} view3D An instance of View3D
       * @param {ZoomControlOptions} options Options
       */
      constructor(view3D, {
        scale = 1,
        duration = ANIMATION_DURATION,
        minFov = 1,
        maxFov = AUTO,
        easing = EASING$1
      } = {}) {
        this._wheelModifier = 0.02;
        this._touchModifier = 0.05;
        this._prevTouchDistance = -1;
        this._enabled = false;

        this._onWheel = evt => {
          const wheelScrollable = this._view3D.wheelScrollable;
          if (evt.deltaY === 0 || wheelScrollable) return;
          evt.preventDefault();
          evt.stopPropagation();
          const animation = this._motion;
          const delta = -this._scale * this._wheelModifier * evt.deltaY;
          animation.setEndDelta(delta);
        };

        this._onTouchMove = evt => {
          const touches = evt.touches;
          if (touches.length !== 2) return;

          if (evt.cancelable !== false) {
            evt.preventDefault();
          }

          evt.stopPropagation();
          const animation = this._motion;
          const prevTouchDistance = this._prevTouchDistance;
          const touchPoint1 = new THREE.Vector2(touches[0].pageX, touches[0].pageY);
          const touchPoint2 = new THREE.Vector2(touches[1].pageX, touches[1].pageY);
          const touchDiff = touchPoint1.sub(touchPoint2);

          const touchDistance = touchDiff.length() * this._scale * this._touchModifier;

          const delta = touchDistance - prevTouchDistance;
          this._prevTouchDistance = touchDistance;
          if (prevTouchDistance < 0) return;
          animation.setEndDelta(delta);
        };

        this._onTouchEnd = () => {
          this._prevTouchDistance = -1;
        };

        this._view3D = view3D;
        this._scale = scale;
        this._duration = duration;
        this._minFov = minFov;
        this._maxFov = maxFov;
        this._easing = easing;
        this._range = {
          min: minFov,
          max: maxFov === AUTO ? 180 : maxFov
        };
        this._motion = new Motion({
          duration,
          easing
        });
      }
      /**
       * Whether this control is enabled or not
       * @readonly
       */


      get enabled() {
        return this._enabled;
      }
      /**
       * Actual fov range
       * @readonly
       */


      get range() {
        return this._range;
      }
      /**
       * Scale factor of the zoom
       * @type number
       * @default 1
       */


      get scale() {
        return this._scale;
      }
      /**
       * Duration of the input animation (ms)
       * @type {number}
       * @default 300
       */


      get duration() {
        return this._duration;
      }
      /**
       * Minimum vertical fov(field of view).
       * You can get a bigger image with the smaller value of this.
       * @type {number}
       * @default 1
       */


      get minFov() {
        return this._minFov;
      }
      /**
       * Maximum vertical fov(field of view).
       * You can get a smaller image with the bigger value of this.
       * If `"auto"` is given, it will use Math.min(default fov + 45, 175).
       * @type {"auto" | number}
       * @default "auto"
       */


      get maxFov() {
        return this._maxFov;
      }
      /**
       * Easing function of the animation
       * @type {function}
       * @default EASING.EASE_OUT_CUBIC
       * @see EASING
       */


      get easing() {
        return this._easing;
      }

      set scale(val) {
        this._scale = val;
      }
      /**
       * Destroy the instance and remove all event listeners attached
       * @returns {void}
       */


      destroy() {
        this.disable();
      }
      /**
       * Update control by given deltaTime
       * @param camera Camera to update position
       * @param deltaTime Number of milisec to update
       * @returns {void}
       */


      update(deltaTime) {
        const camera = this._view3D.camera;
        const motion = this._motion;
        camera.zoom -= motion.update(deltaTime);
      } // eslint-disable-next-line @typescript-eslint/no-unused-vars


      resize(size) {// DO NOTHING
      }
      /**
       * Enable this input and add event listeners
       * @returns {void}
       */


      enable() {
        if (this._enabled) return;
        const targetEl = this._view3D.renderer.canvas;
        targetEl.addEventListener(EVENTS$1.WHEEL, this._onWheel, {
          passive: false,
          capture: false
        });
        targetEl.addEventListener(EVENTS$1.TOUCH_MOVE, this._onTouchMove, {
          passive: false,
          capture: false
        });
        targetEl.addEventListener(EVENTS$1.TOUCH_END, this._onTouchEnd, {
          passive: false,
          capture: false
        });
        this._enabled = true;
        this.sync();
      }
      /**
       * Disable this input and remove all event handlers
       * @returns {void}
       */


      disable() {
        if (!this._enabled) return;
        const targetEl = this._view3D.renderer.canvas;
        targetEl.removeEventListener(EVENTS$1.WHEEL, this._onWheel, false);
        targetEl.removeEventListener(EVENTS$1.TOUCH_MOVE, this._onTouchMove, false);
        targetEl.removeEventListener(EVENTS$1.TOUCH_END, this._onTouchEnd, false);
        this._enabled = false;
      }
      /**
       * Synchronize this control's state to given camera position
       * @param camera Camera to match state
       * @returns {void}
       */


      sync() {
        const camera = this._view3D.camera;

        this._motion.reset(camera.zoom);
      }
      /**
       * Update fov range by the camera's current fov value
       * @returns {void}
       */


      updateRange() {
        const max = this._maxFov;
        const range = this._range;
        const motion = this._motion;
        const {
          camera
        } = this._view3D;
        const baseFov = camera.baseFov;

        if (max === AUTO) {
          range.max = Math.min(baseFov + 45, 175);
        }

        motion.range.min = range.min - baseFov;
        motion.range.max = range.max - baseFov;
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Aggregation of {@link RotateControl}, {@link TranslateControl}, and {@link ZoomControl}.
     */

    class OrbitControl {
      /**
       * Create new OrbitControl instance
       * @param {View3D} view3D An instance of View3D
       */
      constructor(view3D) {
        this._onEnable = () => {
          const view3D = this._view3D;
          const canvas = view3D.renderer.canvas;
          const shouldSetGrabCursor = view3D.useGrabCursor && (this._rotateControl.enabled || this._translateControl.enabled) && canvas.style.cursor === CURSOR.NONE;

          if (shouldSetGrabCursor) {
            this._setCursor(CURSOR.GRAB);
          }
        };

        this._onDisable = () => {
          const canvas = this._view3D.renderer.canvas;
          const shouldRemoveGrabCursor = canvas.style.cursor !== CURSOR.NONE && !this._rotateControl.enabled && !this._translateControl.enabled;

          if (shouldRemoveGrabCursor) {
            this._setCursor(CURSOR.NONE);
          }
        };

        this._onHold = () => {
          const grabCursorEnabled = this._view3D.useGrabCursor && (this._rotateControl.enabled || this._translateControl.enabled);

          if (grabCursorEnabled) {
            this._setCursor(CURSOR.GRABBING);
          }
        };

        this._onRelease = () => {
          const grabCursorEnabled = this._view3D.useGrabCursor && (this._rotateControl.enabled || this._translateControl.enabled);

          if (grabCursorEnabled) {
            this._setCursor(CURSOR.GRAB);
          }
        };

        this._view3D = view3D;
        this._rotateControl = new RotateControl(view3D, getObjectOption(view3D.rotate));
        this._translateControl = new TranslateControl(view3D, getObjectOption(view3D.translate));
        this._zoomControl = new ZoomControl(view3D, getObjectOption(view3D.zoom));
        [this._rotateControl, this._translateControl].forEach(control => {
          control.on({
            [CONTROL_EVENTS.HOLD]: this._onHold,
            [CONTROL_EVENTS.RELEASE]: this._onRelease,
            [CONTROL_EVENTS.ENABLE]: this._onEnable,
            [CONTROL_EVENTS.DISABLE]: this._onDisable
          });
        });
      } // Internal Values Getter

      /**
       * {@link RotateControl} of this control
       */


      get rotate() {
        return this._rotateControl;
      }
      /**
       * {@link TranslateControl} of this control
       */


      get translate() {
        return this._translateControl;
      }
      /**
       * {@link ZoomControl} of this control
       */


      get zoom() {
        return this._zoomControl;
      }
      /**
       * Destroy the instance and remove all event listeners attached
       * This also will reset CSS cursor to intial
       * @returns {void}
       */


      destroy() {
        this._rotateControl.destroy();

        this._translateControl.destroy();

        this._zoomControl.destroy();
      }
      /**
       * Update control by given deltaTime
       * @param deltaTime Number of milisec to update
       * @returns {void}
       */


      update(delta) {
        this._rotateControl.update(delta);

        this._translateControl.update(delta);

        this._zoomControl.update(delta);
      }
      /**
       * Resize control to match target size
       * @param {object} size New size to apply
       * @param {number} [size.width] New width
       * @param {number} [size.height] New height
       * @returns {void}
       */


      resize(size) {
        this._rotateControl.resize(size);

        this._translateControl.resize(size);

        this._zoomControl.resize(size);
      }
      /**
       * Enable this control and add event listeners
       * @returns {void}
       */


      enable() {
        const view3D = this._view3D;

        if (view3D.rotate) {
          this._rotateControl.enable();
        }

        if (view3D.translate) {
          this._translateControl.enable();
        }

        if (view3D.zoom) {
          this._zoomControl.enable();
        }
      }
      /**
       * Disable this control and remove all event handlers
       * @returns {void}
       */


      disable() {
        this._rotateControl.disable();

        this._translateControl.disable();

        this._zoomControl.disable();
      }
      /**
       * Synchronize this control's state to current camera position
       * @returns {void}
       */


      sync() {
        this._rotateControl.sync();

        this._translateControl.sync();

        this._zoomControl.sync();
      }
      /**
       * Update cursor to current option
       * @returns {void}
       */


      updateCursor() {
        const cursor = this._view3D.useGrabCursor ? CURSOR.GRAB : CURSOR.NONE;

        this._setCursor(cursor);
      }

      _setCursor(newCursor) {
        const view3D = this._view3D;
        if (!view3D.useGrabCursor && newCursor !== CURSOR.NONE) return;
        const targetEl = view3D.renderer.canvas;
        targetEl.style.cursor = newCursor;
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Autoplayer that animates model without user input
     */

    class AutoPlayer {
      /**
       * Create new AutoPlayer instance
       * @param {View3D} view3D An instance of View3D
       * @param {object} options Options
       * @param {number} [options.delay=2000] Reactivation delay after mouse input in milisecond
       * @param {number} [options.delayOnMouseLeave=0] Reactivation delay after mouse leave
       * @param {number} [options.speed=1] Y-axis(yaw) rotation speed
       * @param {boolean} [options.pauseOnHover=false] Whether to pause rotation on mouse hover
       * @param {boolean} [options.canInterrupt=true] Whether user can interrupt the rotation with click/wheel input
       * @param {boolean} [options.disableOnInterrupt=false] Whether to disable autoplay on user interrupt
       */
      constructor(view3D, {
        delay = 2000,
        delayOnMouseLeave = 0,
        speed = 1,
        pauseOnHover = false,
        canInterrupt = true,
        disableOnInterrupt = false
      } = {}) {
        this._enabled = false;
        this._interrupted = false;
        this._interruptionTimer = -1;
        this._hovering = false;

        this._onMouseDown = evt => {
          if (!this._canInterrupt) return;
          if (evt.button !== MOUSE_BUTTON.LEFT && evt.button !== MOUSE_BUTTON.RIGHT) return;
          this._interrupted = true;

          this._clearTimeout();

          window.addEventListener(EVENTS$1.MOUSE_UP, this._onMouseUp, false);
        };

        this._onMouseUp = () => {
          window.removeEventListener(EVENTS$1.MOUSE_UP, this._onMouseUp, false);

          this._setUninterruptedAfterDelay(this._delay);
        };

        this._onTouchStart = () => {
          if (!this._canInterrupt) return;
          this._interrupted = true;

          this._clearTimeout();
        };

        this._onTouchEnd = () => {
          this._setUninterruptedAfterDelay(this._delay);
        };

        this._onMouseEnter = () => {
          if (!this._pauseOnHover) return;
          this._interrupted = true;
          this._hovering = true;
        };

        this._onMouseLeave = () => {
          if (!this._pauseOnHover) return;
          this._hovering = false;

          this._setUninterruptedAfterDelay(this._delayOnMouseLeave);
        };

        this._onWheel = () => {
          if (!this._canInterrupt) return;
          this._interrupted = true;

          this._setUninterruptedAfterDelay(this._delay);
        };

        this._view3D = view3D;
        this._delay = delay;
        this._delayOnMouseLeave = delayOnMouseLeave;
        this._speed = speed;
        this._pauseOnHover = pauseOnHover;
        this._canInterrupt = canInterrupt;
        this._disableOnInterrupt = disableOnInterrupt;
      }
      /**
       * Whether autoplay is enabled or not
       * @readonly
       */


      get enabled() {
        return this._enabled;
      }
      /**
       * Reactivation delay after mouse input in milisecond
       */


      get delay() {
        return this._delay;
      }
      /**
       * Reactivation delay after mouse leave
       * This option only works when {@link AutoPlayer#pauseOnHover pauseOnHover} is activated
       */


      get delayOnMouseLeave() {
        return this._delayOnMouseLeave;
      }
      /**
       * Y-axis(yaw) rotation speed
       * @default 1
       */


      get speed() {
        return this._speed;
      }
      /**
       * Whether to pause rotation on mouse hover
       * @default false
       */


      get pauseOnHover() {
        return this._pauseOnHover;
      }
      /**
       * Whether user can interrupt the rotation with click/wheel input
       * @default true
       */


      get canInterrupt() {
        return this._canInterrupt;
      }
      /**
       * Whether to disable autoplay on user interrupt
       * @default false
       */


      get disableOnInterrupt() {
        return this._disableOnInterrupt;
      }

      set delay(val) {
        this._delay = val;
      }

      set delayOnMouseLeave(val) {
        this._delayOnMouseLeave = val;
      }

      set speed(val) {
        this._speed = val;
      }

      set pauseOnHover(val) {
        this._pauseOnHover = val;
      }

      set canInterrupt(val) {
        this._canInterrupt = val;
      }

      set disableOnInterrupt(val) {
        this._disableOnInterrupt = val;
      }
      /**
       * Destroy the instance and remove all event listeners attached
       * This also will reset CSS cursor to intial
       * @returns {void}
       */


      destroy() {
        this.disable();
      }
      /**
       * Update camera by given deltaTime
       * @param camera Camera to update position
       * @param deltaTime Number of milisec to update
       * @returns {void}
       */


      update(deltaTime) {
        if (!this._enabled) return;

        if (this._interrupted) {
          if (this._disableOnInterrupt) {
            this.disable();
          }

          return;
        }

        const camera = this._view3D.camera;
        camera.yaw += this._speed * deltaTime / 100;
      }
      /**
       * Enable this input and add event listeners
       * @returns {void}
       */


      enable() {
        if (this._enabled) return;
        const targetEl = this._view3D.renderer.canvas;
        targetEl.addEventListener(EVENTS$1.MOUSE_DOWN, this._onMouseDown, false);
        targetEl.addEventListener(EVENTS$1.TOUCH_START, this._onTouchStart, {
          passive: false,
          capture: false
        });
        targetEl.addEventListener(EVENTS$1.TOUCH_END, this._onTouchEnd, {
          passive: false,
          capture: false
        });
        targetEl.addEventListener(EVENTS$1.MOUSE_ENTER, this._onMouseEnter, false);
        targetEl.addEventListener(EVENTS$1.MOUSE_LEAVE, this._onMouseLeave, false);
        targetEl.addEventListener(EVENTS$1.WHEEL, this._onWheel, {
          passive: false,
          capture: false
        });
        this._enabled = true;
      }
      /**
       * Disable this input and remove all event handlers
       * @returns {void}
       */


      disable() {
        if (!this._enabled) return;
        const targetEl = this._view3D.renderer.canvas;
        targetEl.removeEventListener(EVENTS$1.MOUSE_DOWN, this._onMouseDown, false);
        window.removeEventListener(EVENTS$1.MOUSE_UP, this._onMouseUp, false);
        targetEl.removeEventListener(EVENTS$1.TOUCH_START, this._onTouchStart, false);
        targetEl.removeEventListener(EVENTS$1.TOUCH_END, this._onTouchEnd, false);
        targetEl.removeEventListener(EVENTS$1.MOUSE_ENTER, this._onMouseEnter, false);
        targetEl.removeEventListener(EVENTS$1.MOUSE_LEAVE, this._onMouseLeave, false);
        targetEl.removeEventListener(EVENTS$1.WHEEL, this._onWheel, false);
        this._enabled = false;
        this._interrupted = false;
        this._hovering = false;

        this._clearTimeout();
      }

      _setUninterruptedAfterDelay(delay) {
        if (this._hovering) return;

        this._clearTimeout();

        if (delay > 0) {
          this._interruptionTimer = window.setTimeout(() => {
            this._interrupted = false;
            this._interruptionTimer = -1;
          }, delay);
        } else {
          this._interrupted = false;
          this._interruptionTimer = -1;
        }
      }

      _clearTimeout() {
        if (this._interruptionTimer >= 0) {
          window.clearTimeout(this._interruptionTimer);
          this._interruptionTimer = -1;
        }
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    /**
     * Data class for loaded 3d model
     */

    class Model {
      /**
       * Create new Model instance
       */
      constructor({
        src,
        scenes,
        animations = [],
        fixSkinnedBbox = false,
        castShadow = true,
        receiveShadow = false
      }) {
        this._src = src; // This guarantees model's root has identity matrix at creation

        this._scene = new THREE.Group();

        this._scene.add(...scenes);

        this._animations = animations;
        this._bbox = this._getInitialBbox(fixSkinnedBbox); // Move to position where bbox.min.y = 0

        const offset = this._bbox.min.y;

        this._scene.translateY(-offset);

        this._bbox.translate(new THREE.Vector3(0, -offset, 0));

        this.castShadow = castShadow;
        this.receiveShadow = receiveShadow;
      }
      /**
       * Source URL of this model
       * @type {string}
       * @readonly
       */


      get src() {
        return this._src;
      }
      /**
       * Scene of the model, see {@link https://threejs.org/docs/#api/en/objects/Group THREE.Group}
       * @readonly
       */


      get scene() {
        return this._scene;
      }
      /**
       * {@link https://threejs.org/docs/#api/en/animation/AnimationClip THREE.AnimationClip}s inside model
       * @readonly
       */


      get animations() {
        return this._animations;
      }
      /**
       * {@link https://threejs.org/docs/#api/en/objects/Mesh THREE.Mesh}es inside model if there's any.
       * @readonly
       */


      get meshes() {
        return this._getAllMeshes();
      }
      /**
       * Get a copy of model's current bounding box
       * @type THREE#Box3
       * @readonly
       * @see https://threejs.org/docs/#api/en/math/Box3
       */


      get bbox() {
        return this._bbox;
      }
      /**
       * Whether the model's meshes gets rendered into shadow map
       * @type boolean
       * @example
       * ```ts
       * model.castShadow = true;
       * ```
       */


      set castShadow(val) {
        const meshes = this.meshes;
        meshes.forEach(mesh => mesh.castShadow = val);
      }
      /**
       * Whether the model's mesh materials receive shadows
       * @type boolean
       * @example
       * ```ts
       * model.receiveShadow = true;
       * ```
       */


      set receiveShadow(val) {
        const meshes = this.meshes;
        meshes.forEach(mesh => mesh.receiveShadow = val);
      }

      reduceVertices(callbackfn, initialVal) {
        const meshes = this.meshes;
        let result = initialVal;
        meshes.forEach(mesh => {
          const {
            position
          } = mesh.geometry.attributes;
          if (!position) return;
          mesh.updateMatrixWorld();

          for (let idx = 0; idx < position.count; idx++) {
            const vertex = new THREE.Vector3().fromBufferAttribute(position, idx);
            vertex.applyMatrix4(mesh.matrixWorld);
            result = callbackfn(result, vertex);
          }
        });
        return result;
      }

      _getInitialBbox(fixSkinnedBbox) {
        this._scene.updateMatrixWorld();

        if (fixSkinnedBbox && this._hasSkinnedMesh()) {
          return this._getSkeletonBbox();
        } else {
          return new THREE.Box3().setFromObject(this._scene);
        }
      }

      _getSkeletonBbox() {
        const bbox = new THREE.Box3();
        this.meshes.forEach(mesh => {
          if (!mesh.isSkinnedMesh) {
            bbox.expandByObject(mesh);
            return;
          }

          const geometry = mesh.geometry;
          const positions = geometry.attributes.position;
          const skinIndicies = geometry.attributes.skinIndex;
          const skinWeights = geometry.attributes.skinWeight;
          const skeleton = mesh.skeleton;
          skeleton.update();
          const boneMatricies = skeleton.boneMatrices;
          const finalMatrix = new THREE.Matrix4();

          for (let posIdx = 0; posIdx < positions.count; posIdx++) {
            finalMatrix.identity();
            const skinned = new THREE.Vector4();
            skinned.set(0, 0, 0, 0);
            const skinVertex = new THREE.Vector4();
            skinVertex.set(positions.getX(posIdx), positions.getY(posIdx), positions.getZ(posIdx), 1).applyMatrix4(mesh.bindMatrix);
            const weights = [skinWeights.getX(posIdx), skinWeights.getY(posIdx), skinWeights.getZ(posIdx), skinWeights.getW(posIdx)];
            const indicies = [skinIndicies.getX(posIdx), skinIndicies.getY(posIdx), skinIndicies.getZ(posIdx), skinIndicies.getW(posIdx)];
            weights.forEach((weight, index) => {
              const boneMatrix = new THREE.Matrix4().fromArray(boneMatricies, indicies[index] * 16);
              skinned.add(skinVertex.clone().applyMatrix4(boneMatrix).multiplyScalar(weight));
            });
            const transformed = new THREE.Vector3().fromArray(skinned.applyMatrix4(mesh.bindMatrixInverse).toArray());
            transformed.applyMatrix4(mesh.matrixWorld); // if (Math.abs(transformed.x) > 10000) {
            //   console.log(transformed, mesh.bindMatrixInverse, skinned);
            // }

            bbox.expandByPoint(transformed);
          }
        });
        return bbox;
      }
      /**
       * Get all {@link https://threejs.org/docs/#api/en/objects/Mesh THREE.Mesh}es inside model if there's any.
       * @private
       * @returns Meshes found at model's scene
       */


      _getAllMeshes() {
        const meshes = [];

        this._scene.traverse(obj => {
          if (obj.isMesh) {
            meshes.push(obj);
          }
        });

        return meshes;
      }

      _hasSkinnedMesh() {
        return this._getAllMeshes().some(mesh => mesh.isSkinnedMesh);
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    const dracoLoader = new DRACOLoader.DRACOLoader();
    const ktx2Loader = new KTX2Loader.KTX2Loader();
    /**
     * GLTFLoader
     */

    class GLTFLoader {
      /**
       * Create a new instance of GLTFLoader
       */
      constructor(view3D) {
        this._view3D = view3D;
        this._loader = new GLTFLoader$1.GLTFLoader();
        const loader = this._loader;
        loader.setCrossOrigin("anonymous");
        loader.setDRACOLoader(dracoLoader);
        loader.setKTX2Loader(ktx2Loader.detectSupport(view3D.renderer.threeRenderer));
      }

      static setMeshoptDecoder(meshoptPath) {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            const scriptTag = document.createElement("script");
            scriptTag.addEventListener("load", () => __awaiter(this, void 0, void 0, function* () {
              yield window.MeshoptDecoder.ready;
              GLTFLoader.meshoptDecoder = window.MeshoptDecoder;
              document.body.removeChild(scriptTag);
              resolve();
            }));
            scriptTag.addEventListener("error", () => {
              document.body.removeChild(scriptTag);
              reject();
            });
            scriptTag.src = new URL(meshoptPath, location.href).href;
            document.body.appendChild(scriptTag);
          });
        });
      }
      /**
       * Load new GLTF model from the given url
       * @param {string} url URL to fetch glTF/glb file
       * @returns Promise that resolves {@link Model}
       */


      load(url) {
        const view3D = this._view3D;
        const loader = this._loader;
        dracoLoader.setDecoderPath(view3D.dracoPath);
        ktx2Loader.setTranscoderPath(view3D.ktxPath);

        if (GLTFLoader.meshoptDecoder) {
          loader.setMeshoptDecoder(GLTFLoader.meshoptDecoder);
        }

        return new Promise((resolve, reject) => {
          try {
            loader.load(url, gltf => {
              const model = this._parseToModel(gltf, url);

              resolve(model);
            }, evt => {
              view3D.trigger(EVENTS.PROGRESS, Object.assign(Object.assign({}, evt), {
                target: view3D,
                type: EVENTS.PROGRESS
              }));
            }, err => {
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


      loadFromFiles(files) {
        const view3D = this._view3D;
        const loader = this._loader;
        const objectURLs = [];

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

          const filesMap = new Map();
          files.forEach(file => {
            filesMap.set(file.name, file);
          });
          const gltfURL = URL.createObjectURL(gltfFile);
          objectURLs.push(gltfURL);
          const manager = new THREE.LoadingManager();
          manager.setURLModifier(fileURL => {
            const fileNameResult = /[^\/|\\]+$/.exec(fileURL);
            const fileName = fileNameResult && fileNameResult[0] || "";

            if (filesMap.has(fileName)) {
              const blob = filesMap.get(fileName);
              const blobURL = URL.createObjectURL(blob);
              objectURLs.push(blobURL);
              return blobURL;
            }

            return fileURL;
          });
          loader.manager = manager;
          loader.load(gltfURL, gltf => {
            const model = this._parseToModel(gltf, gltfFile.name);

            resolve(model);
            revokeURLs();
          }, undefined, err => {
            reject(err);
            revokeURLs();
          });
        });
      }

      _parseToModel(gltf, src) {
        const fixSkinnedBbox = this._view3D.fixSkinnedBbox;
        const model = new Model({
          src,
          scenes: gltf.scenes,
          animations: gltf.animations,
          fixSkinnedBbox
        });
        return model;
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */

    var Loaders = {
        __proto__: null,
        GLTFLoader: GLTFLoader,
        TextureLoader: TextureLoader
    };

    /**
     * @extends Component
     * @see https://naver.github.io/egjs-component/
     */

    class View3D extends Component {
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
      constructor(root, {
        src = null,
        iosSrc = null,
        dracoPath = DRACO_DECODER_URL,
        ktxPath = KTX_TRANSCODER_URL,
        meshoptPath = null,
        fixSkinnedBbox = false,
        skybox = null,
        envmap = null,
        background = null,
        fov = AUTO,
        center = AUTO,
        yaw = 0,
        pitch = 0,
        rotate = true,
        translate = true,
        zoom = true,
        exposure = 1,
        shadow = true,
        autoplay = false,
        scrollable = true,
        wheelScrollable = false,
        useGrabCursor = true,
        webAR = true,
        sceneViewer = true,
        quickLook = true,
        arPriority = AR_PRIORITY,
        canvasSelector = "canvas",
        autoInit = true,
        autoResize = true,
        useResizeObserver = true
      } = {}) {
        super();
        this._rootEl = getElement(root); // Bind options

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
        this._webAR = webAR;
        this._sceneViewer = sceneViewer;
        this._quickLook = quickLook;
        this._arPriority = arPriority;
        this._canvasSelector = canvasSelector;
        this._autoInit = autoInit;
        this._autoResize = autoResize;
        this._useResizeObserver = useResizeObserver; // Create internal components

        this._renderer = new Renderer(this);
        this._camera = new Camera(this);
        this._control = new OrbitControl(this);
        this._scene = new Scene(this);
        this._animator = new ModelAnimator(this._scene.userObjects);
        this._autoPlayer = new AutoPlayer(this, getObjectOption(autoplay));
        this._autoResizer = new AutoResizer(this);
        this._arManager = new ARManager(this);
        this._model = null;
        this._initialized = false;

        if (src && autoInit) {
          void this.init();
        }
      } // Internal Components Getter

      /**
       * {@link Renderer} instance of the View3D
       * @type {Renderer}
       * @readonly
       */


      get renderer() {
        return this._renderer;
      }
      /**
       * {@link Scene} instance of the View3D
       * @type {Scene}
       * @readonly
       */


      get scene() {
        return this._scene;
      }
      /**
       * {@link Camera} instance of the View3D
       * @type {Camera}
       * @readonly
       */


      get camera() {
        return this._camera;
      }
      /**
       * {@link OrbitControl} instance of the View3D
       * @type {OrbitControl}
       * @readonly
       */


      get control() {
        return this._control;
      }
      /**
       * {@link AutoPlayer} instance of the View3D
       * @type {AutoPlayer}
       * @readonly
       */


      get autoPlayer() {
        return this._autoPlayer;
      }
      /**
       * Current {@link Model} displaying. `null` if nothing is displayed on the canvas.
       * @type {Model | null}
       * @readonly
       */


      get model() {
        return this._model;
      }
      /**
       * {@link ModelAnimator} instance of the View3D
       * @type {ModelAnimator}
       * @readonly
       */


      get animator() {
        return this._animator;
      }
      /**
       * {@link ARManager} instance of the View3D
       * @type {ARManager}
       * @readonly
       */


      get ar() {
        return this._arManager;
      } // Internal State Getter

      /**
       * Root(Wrapper) element of View3D that given in the constructor
       * @type {HTMLElement}
       * @readonly
       */


      get rootEl() {
        return this._rootEl;
      }
      /**
       * Whether the View3D is initialized. This is set to `true` just before triggering "ready" event.
       * @type {boolean}
       * @readonly
       */


      get initialized() {
        return this._initialized;
      } // Options Getter

      /**
       * Source URL to fetch 3D model. `glb` / `glTF` models are supported.
       * @type {string | null}
       * @default null
       */


      get src() {
        return this._src;
      }
      /**
       * Source URL to fetch 3D model in iOS AR Quick Look. `usdz` models are supported.
       * @type {string | null}
       * @default null
       */


      get iosSrc() {
        return this._iosSrc;
      }
      /**
       * URL to {@link https://github.com/google/draco Draco} decoder location.
       * @type {string}
       * @default https://www.gstatic.com/draco/versioned/decoders/1.4.1/
       */


      get dracoPath() {
        return this._dracoPath;
      }
      /**
       * URL to {@link http://github.khronos.org/KTX-Specification/#basisu_gd KTX2 texture} transcoder location.
       * @type {string}
       * @default https://unpkg.com/three@0.134.0/examples/js/libs/basis/
       */


      get ktxPath() {
        return this._ktxPath;
      }
      /**
       * URL to {@link https://github.com/zeux/meshoptimizer Meshoptimizer} decoder js path.
       * @type {string | null}
       * @default null
       */


      get meshoptPath() {
        return this._meshoptPath;
      }
      /**
       * Sometimes, some rigged model has the wrong bounding box that when displaying on three.js (usually converted glTF model from Sketchfab)
       * Enabling this option can resolve that issue by recalculating bounding box size with the influence of the skeleton weight.
       * @type {boolean}
       * @default false
       */


      get fixSkinnedBbox() {
        return this._fixSkinnedBbox;
      }
      /**
       * A vertical FOV(Field of View) value of the camera frustum, in degrees.
       * If `"auto"` is used, View3D will try to find the appropriate FOV value that model is not clipped at any angle.
       * @type {"auto" | number}
       * @default "auto"
       */


      get fov() {
        return this._fov;
      }
      /**
       * Center of the camera rotation.
       * If `"auto"` is given, it will use the center of the model's bounding box as the pivot.
       * Else, you can use any world position as the pivot.
       * @type {"auto" | number[]}
       * @default "auto"
       */


      get center() {
        return this._center;
      }
      /**
       * Initial Y-axis rotation of the camera, in degrees.
       * @type {number}
       * @default 0
       */


      get yaw() {
        return this._yaw;
      }
      /**
       * Initial X-axis rotation of the camera, in degrees.
       * Should be a value from -90 to 90.
       * @type {number}
       * @default 0
       */


      get pitch() {
        return this._pitch;
      }
      /**
       * Options for the {@link RotateControl}.
       * If `false` is given, it will disable the rotate control.
       * @type {boolean | RotateControlOptions}
       * @default true
       */


      get rotate() {
        return this._rotate;
      }
      /**
       * Options for the {@link TranslateControl}.
       * If `false` is given, it will disable the translate control.
       * @type {boolean | TranslateControlOptions}
       * @default true
       */


      get translate() {
        return this._translate;
      }
      /**
       * Options for the {@link ZoomControl}.
       * If `false` is given, it will disable the zoom control.
       * @type {boolean | ZoomControlOptions}
       * @default true
       */


      get zoom() {
        return this._zoom;
      }
      /**
       * Enable Y-axis rotation autoplay.
       * If `true` is given, it will enable autoplay with default values.
       * @type {boolean | AutoplayOptions}
       * @default true
       */


      get autoplay() {
        return this._autoplay;
      }
      /**
       * Enable browser scrolling with touch on the canvas area.
       * This will block the rotate(pitch) control if the user is currently scrolling.
       * @type {boolean}
       * @default true
       */


      get scrollable() {
        return this._scrollable;
      }
      /**
       * Enable browser scrolling with mouse wheel on the canvas area.
       * This will block the zoom control with mouse wheel.
       * @type {boolean}
       * @default false
       */


      get wheelScrollable() {
        return this._wheelScrollable;
      }
      /**
       * Enable CSS `cursor: grab` on the canvas element.
       * `cursor: grabbing` will be used on mouse click.
       * @type {boolean}
       * @default true
       */


      get useGrabCursor() {
        return this._useGrabCursor;
      }
      /**
       * Source to the HDR texture image (RGBE), which will used as the scene environment map & background.
       * `envmap` will be ignored if this value is not `null`.
       * @type {string | null}
       * @default null
       */


      get skybox() {
        return this._skybox;
      }
      /**
       * Source to the HDR texture image (RGBE), which will used as the scene environment map.
       * @type {string | null}
       * @default null
       */


      get envmap() {
        return this._envmap;
      }
      /**
       * Color code / URL to a image to use as the background.
       * For transparent background, use `null`. (default value)
       * Can be enabled only when the `skybox` is `null`.
       * @type {number | string | null}
       * @default null
       */


      get background() {
        return this._background;
      }
      /**
       * Exposure value of the HDR envmap/skybox image.
       * @type {number}
       * @default 1
       */


      get exposure() {
        return this._exposure;
      }
      /**
       * Enable shadow below the model.
       * If `true` is given, it will enable shadow with the default options.
       * If `false` is given, it will disable the shadow.
       * @type {boolean | ShadowOptions}
       * @default true
       */


      get shadow() {
        return this._shadow;
      }
      /**
       * Options for the WebXR-based AR session.
       * If `false` is given, it will disable WebXR-based AR session.
       * @type {boolean | WebARSessionOptions}
       * @default true
       */


      get webAR() {
        return this._webAR;
      }
      /**
       * Options for the {@link https://developers.google.com/ar/develop/java/scene-viewer Google SceneViewer} based AR session.
       * If `false` is given, it will disable SceneViewer based AR session.
       * See {@link https://developers.google.com/ar/develop/java/scene-viewer#supported_intent_parameters Official Page} for the parameter details.
       * @type {boolean | SceneViewerSessionOptions}
       * @default true
       */


      get sceneViewer() {
        return this._sceneViewer;
      }
      /**
       * Options for the {@link https://developer.apple.com/augmented-reality/quick-look/ Apple AR Quick Look} based AR session.
       * If `false` is given, it will disable AR Quick Look based AR session.
       * @type {boolean | QuickLookSessionOptions}
       * @default true
       */


      get quickLook() {
        return this._quickLook;
      }
      /**
       * Priority array for the AR sessions.
       * If the two sessions are available in one environment, the session listed earlier will be used first.
       * If the session name is not included in this priority array, that session will be ignored.
       * See {@link AR_SESSION_TYPE}
       * @type {string[]}
       * @default ["webAR", "sceneViewer", "quickLook"]
       */


      get arPriority() {
        return this._arPriority;
      }
      /**
       * CSS Selector for the canvas element.
       * @type {string}
       * @default "canvas"
       */


      get canvasSelector() {
        return this._canvasSelector;
      }
      /**
       * Call {@link View3D#init init()} automatically when creating View3D's instance
       * This option won't work if `src` is not given
       * @type {boolean}
       * @default true
       * @readonly
       */


      get autoInit() {
        return this._autoInit;
      }
      /**
       * Whether to automatically call {@link View3D#resize resize()} when the canvas element's size is changed
       * @type {boolean}
       * @default true
       */


      get autoResize() {
        return this._autoResize;
      }
      /**
       * Whether to listen {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver ResizeObserver}'s event instead of Window's {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event resize} event when using the `autoResize` option
       * @type {boolean}
       * @default true
       */


      get useResizeObserver() {
        return this._useResizeObserver;
      }

      set skybox(val) {
        void this._scene.setSkybox(val);
        this._skybox = val;
      }

      set envmap(val) {
        void this._scene.setEnvMap(val);
        this._envmap = val;
      }

      set exposure(val) {
        this._renderer.threeRenderer.toneMappingExposure = val;
        this._exposure = val;
      }

      set useGrabCursor(val) {
        this._useGrabCursor = val;

        this._control.updateCursor();
      }
      /**
       * Destroy View3D instance and remove all events attached to it
       * @returns {void}
       */


      destroy() {
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


      init() {
        return __awaiter(this, void 0, void 0, function* () {
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
          const meshoptPath = this._meshoptPath;

          if (meshoptPath && !GLTFLoader.meshoptDecoder) {
            yield GLTFLoader.setMeshoptDecoder(meshoptPath);
          }

          const tasks = [this._loadModel(this._src)]; // Load & set skybox / envmap before displaying model

          if (skybox) {
            tasks.push(scene.setSkybox(skybox));
          } else if (envmap) {
            tasks.push(scene.setEnvMap(envmap));
          }

          if (!skybox && background) {
            tasks.push(scene.setBackground(background));
          }

          const [model] = yield Promise.all(tasks);

          this._display(model);

          this._control.enable();

          if (this._autoplay) {
            this._autoPlayer.enable();
          }

          this._initialized = true;
          this.trigger(EVENTS.READY, {
            type: EVENTS.READY,
            target: this
          });
        });
      }
      /**
       * Resize View3D instance to fit current canvas size
       * @returns {void}
       */


      resize() {
        this._renderer.resize();

        const newSize = this._renderer.size;

        this._camera.resize(newSize);

        this._control.resize(newSize);

        this.trigger(EVENTS.RESIZE, Object.assign(Object.assign({}, newSize), {
          type: EVENTS.RESIZE,
          target: this
        }));
      }
      /**
       * Load a new 3D model and replace it with the current one
       * @param {string} src Source URL to fetch 3D model from
       */


      load(src) {
        return __awaiter(this, void 0, void 0, function* () {
          if (this._initialized) {
            const model = yield this._loadModel(src);
            this._src = src;

            this._display(model);
          } else {
            this._src = src;
            yield this.init();
          }
        });
      }

      loadPlugins(...plugins) {
        return __awaiter(this, void 0, void 0, function* () {
          return Promise.all(plugins.map(plugin => plugin.init(this)));
        });
      }

      _loadModel(src) {
        return __awaiter(this, void 0, void 0, function* () {
          const loader = new GLTFLoader(this);
          const model = yield loader.load(src);
          this.trigger(EVENTS.LOAD, {
            type: EVENTS.LOAD,
            target: this,
            model
          });
          return model;
        });
      }

      _display(model) {
        const renderer = this._renderer;
        const scene = this._scene;
        const camera = this._camera;
        const animator = this._animator;
        const inXR = renderer.threeRenderer.xr.isPresenting;
        scene.reset();
        scene.add(model.scene);
        scene.shadowPlane.update(model);
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
          type: EVENTS.MODEL_CHANGE,
          target: this,
          model
        });
      }

    }
    /**
     * Current version of the View3D
     * @type {string}
     * @readonly
     */


    View3D.VERSION = "2.0.0";

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */

    var Core = {
        __proto__: null,
        Animation: Animation,
        ARManager: ARManager,
        AutoPlayer: AutoPlayer,
        AutoResizer: AutoResizer,
        Camera: Camera,
        Model: Model,
        ModelAnimator: ModelAnimator,
        Motion: Motion,
        Pose: Pose,
        Renderer: Renderer,
        Scene: Scene,
        ShadowPlane: ShadowPlane,
        View3DError: View3DError
    };

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */

    var Controls = {
        __proto__: null,
        AnimationControl: AnimationControl,
        OrbitControl: OrbitControl,
        RotateControl: RotateControl,
        TranslateControl: TranslateControl,
        ZoomControl: ZoomControl
    };

    /* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */

    /**
     * Plugin for View3D
     * @abstract
     */

    class View3DPlugin {
      init(view3D) {
        return __awaiter(this, void 0, void 0, function* () {});
      }

      teardown(view3D) {
        return __awaiter(this, void 0, void 0, function* () {});
      }

    }

    /*
     * "View In Ar" Icon from [Google Material Design Icons](https://github.com/google/material-design-icons)
     * Licensed under [Apache Lincese Version 2.0](https://github.com/google/material-design-icons/blob/master/LICENSE)
     */
    // eslint-disable-next-line quotes
    var ARIcon = '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" width="32px" height="32px"><g><rect fill="none" height="24" width="24" x="0" y="0"/></g><g><g><path d="M3,4c0-0.55,0.45-1,1-1h2V1H4C2.34,1,1,2.34,1,4v2h2V4z"/><path d="M3,20v-2H1v2c0,1.66,1.34,3,3,3h2v-2H4C3.45,21,3,20.55,3,20z"/><path d="M20,1h-2v2h2c0.55,0,1,0.45,1,1v2h2V4C23,2.34,21.66,1,20,1z"/><path d="M21,20c0,0.55-0.45,1-1,1h-2v2h2c1.66,0,3-1.34,3-3v-2h-2V20z"/><path d="M19,14.87V9.13c0-0.72-0.38-1.38-1-1.73l-5-2.88c-0.31-0.18-0.65-0.27-1-0.27s-0.69,0.09-1,0.27L6,7.39 C5.38,7.75,5,8.41,5,9.13v5.74c0,0.72,0.38,1.38,1,1.73l5,2.88c0.31,0.18,0.65,0.27,1,0.27s0.69-0.09,1-0.27l5-2.88 C18.62,16.25,19,15.59,19,14.87z M11,17.17l-4-2.3v-4.63l4,2.33V17.17z M12,10.84L8.04,8.53L12,6.25l3.96,2.28L12,10.84z M17,14.87l-4,2.3v-4.6l4-2.33V14.87z"/></g></g></svg>';

    /**
     * A button that will be shown on the right-bottom side with the AR icon.
     * It will be disabled automatically when it's not available to enter AR sessions.
     * User can enter AR sessions by clicking this.
     */

    class ARButton extends View3DPlugin {
      /**
       * Create new instance of ARButton
       * @param {object} [options={}] Options for the ARButton
       * @param {string} [options.availableText="View in AR"] A text that will be shown on mouse hover when it's available to enter the AR session.
       * @param {string} [options.unavailableText="AR is not available in this browser"] A text that will be shown on mouse hover when it's not available to enter the AR session.
       */
      constructor(options = {}) {
        super();
        this._options = options;
      }

      init(view3D) {
        return __awaiter(this, void 0, void 0, function* () {
          yield this._addButton(view3D);
        });
      }

      _addButton(view3D) {
        return __awaiter(this, void 0, void 0, function* () {
          const {
            availableText = "View in AR",
            unavailableText = "AR is not available in this browser"
          } = this._options;
          const arAvailable = yield view3D.ar.isAvailable();
          const button = document.createElement("button");
          const tooltip = document.createElement("div");
          const tooltipText = document.createTextNode(arAvailable ? availableText : unavailableText);
          button.classList.add("view3d-ar-button");
          tooltip.classList.add("view3d-tooltip");
          button.disabled = true;
          button.innerHTML = ARIcon;
          button.appendChild(tooltip);
          tooltip.appendChild(tooltipText);
          view3D.rootEl.appendChild(button);

          if (view3D.initialized) {
            yield this._setAvailable(view3D, button, arAvailable);
          } else {
            view3D.once(EVENTS.MODEL_CHANGE, () => {
              void this._setAvailable(view3D, button, arAvailable);
            });
          }
        });
      }

      _setAvailable(view3D, button, arAvailable) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!arAvailable) {
            button.disabled = true;
          } else {
            button.disabled = false;
            button.addEventListener("click", () => {
              void view3D.ar.enter();
            });
          }
        });
      }

    }

    /*
     * "Close" Icon from [Google Material Design Icons](https://github.com/google/material-design-icons)
     * Licensed under [Apache Lincese Version 2.0](https://github.com/google/material-design-icons/blob/master/LICENSE)
     */
    // eslint-disable-next-line quotes
    var CloseIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48px" height="48px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>';

    /**
     * An UI that will be displayed on top of {@link WebARSession}.
     * This will be automatically added on the overlayRoot of the {@link WebARSession}.
     */

    class AROverlay extends View3DPlugin {
      /**
       * Create new instance of AROverlay
       * @param {object} [options={}] Options for the AROverlay
       */
      constructor(options = {}) {
        super();
        this._options = options;
      }

      init(view3D) {
        return __awaiter(this, void 0, void 0, function* () {
          view3D.on(EVENTS.AR_START, ({
            session
          }) => {
            const overlayRoot = session.domOverlay.root;
            if (!overlayRoot) return;

            if (this._cachedElements) {
              Object.values(this._cachedElements).map(el => {
                if (!overlayRoot.contains(el)) {
                  overlayRoot.appendChild(el);
                }
              });
            } else {
              const closeButton = document.createElement("div");
              closeButton.innerHTML = CloseIcon;
              closeButton.classList.add("view3d-ar-close");
              overlayRoot.appendChild(closeButton);
              this._cachedElements = {
                closeButton
              };
            }

            const {
              closeButton
            } = this._cachedElements;

            const closeButtonHandler = () => {
              void session.exit();
            };

            closeButton.addEventListener("click", closeButtonHandler);
            view3D.once(EVENTS.AR_END, () => {
              if (closeButton.parentElement) {
                closeButton.parentElement.removeChild(closeButton);
              }

              closeButton.removeEventListener("click", closeButtonHandler);
            });
          });
        });
      }

    }

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */

    var Plugins = {
        __proto__: null,
        ARButton: ARButton,
        AROverlay: AROverlay
    };

    /*
     * Copyright (c) 2020 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    merge(View3D, Core);
    merge(View3D, Controls);
    merge(View3D, Loaders);
    merge(View3D, Plugins);
    merge(View3D, Constants);
    View3D.View3DError = View3DError;

    return View3D;

})));