/*
Copyright (c) 2020-present NAVER Corp.
name: @egjs/view3d
license: MIT
author: NAVER Corp.
repository: https://github.com/naver/egjs-view3d
version: 2.4.2
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('three'), require('@egjs/component'), require('three/examples/jsm/loaders/RGBELoader'), require('three/examples/jsm/shaders/HorizontalBlurShader'), require('three/examples/jsm/shaders/VerticalBlurShader'), require('three/examples/jsm/lights/LightProbeGenerator'), require('three/examples/jsm/loaders/GLTFLoader'), require('three/examples/jsm/loaders/DRACOLoader'), require('three/examples/jsm/loaders/KTX2Loader')) :
  typeof define === 'function' && define.amd ? define(['three', '@egjs/component', 'three/examples/jsm/loaders/RGBELoader', 'three/examples/jsm/shaders/HorizontalBlurShader', 'three/examples/jsm/shaders/VerticalBlurShader', 'three/examples/jsm/lights/LightProbeGenerator', 'three/examples/jsm/loaders/GLTFLoader', 'three/examples/jsm/loaders/DRACOLoader', 'three/examples/jsm/loaders/KTX2Loader'], factory) :
  (global = global || self, global.View3D = factory(global.THREE, global.Component, global.RGBELoader, global.HorizontalBlurShader, global.VerticalBlurShader, global.LightProbeGenerator, global.GLTFLoader, global.DRACOLoader, global.KTX2Loader));
}(this, (function (THREE, Component, RGBELoader, HorizontalBlurShader, VerticalBlurShader, LightProbeGenerator, GLTFLoader$1, DRACOLoader, KTX2Loader) { 'use strict';

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
    NOT_INITIALIZED: 8,
    MODEL_FAIL_TO_LOAD: 9
  };
  const MESSAGES = {
    WRONG_TYPE: (val, types) => `${typeof val} is not a ${types.map(type => `"${type}"`).join(" or ")}.`,
    ELEMENT_NOT_FOUND: query => `Element with selector "${query}" not found.`,
    CANVAS_NOT_FOUND: "The canvas element was not found inside the given root element.",
    WEBGL_NOT_SUPPORTED: "WebGL is not supported on this browser.",
    PROVIDE_SRC_FIRST: "\"src\" should be provided before initialization.",
    PROVIDE_WIDTH_OR_HEIGHT: "Either width or height should be given.",
    FORMAT_NOT_SUPPORTED: format => `Given format "${format}" is not supported or invalid.`,
    FILE_NOT_SUPPORTED: src => `Given file "${src}" is not supported.`,
    NOT_INITIALIZED: "View3D is not initialized yet.",
    MODEL_FAIL_TO_LOAD: url => `Failed to load/parse the 3D model with the given url: "${url}". Check "loadError" event for actual error instance.`
  };
  var ERROR = {
    CODES: ERROR_CODES,
    MESSAGES
  };

  /*
   * Copyright (c) 2020 NAVER Corp.
   * egjs projects are licensed under the MIT license
   */
  const isNumber = val => typeof val === "number";
  const isString = val => typeof val === "string";
  const isElement = val => !!val && val.nodeType === Node.ELEMENT_NODE;
  const getNullableElement = (el, parent) => {
    let targetEl = null;

    if (isString(el)) {
      const parentEl = parent ? parent : document;
      const queryResult = parentEl.querySelector(el);

      if (!queryResult) {
        return null;
      }

      targetEl = queryResult;
    } else if (isElement(el)) {
      targetEl = el;
    }

    return targetEl;
  };
  const getElement = (el, parent) => {
    const targetEl = getNullableElement(el, parent);

    if (!targetEl) {
      if (isString(el)) {
        throw new View3DError(ERROR.MESSAGES.ELEMENT_NOT_FOUND(el), ERROR.CODES.ELEMENT_NOT_FOUND);
      } else {
        throw new View3DError(ERROR.MESSAGES.WRONG_TYPE(el, ["HTMLElement", "string"]), ERROR.CODES.WRONG_TYPE);
      }
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
  const isCSSSelector = val => {
    if (!isString(val)) return false;
    const dummyEl = document.createDocumentFragment();

    try {
      dummyEl.querySelector(val);
    } catch (_a) {
      return false;
    }

    return true;
  };
  const range = end => {
    if (!end || end <= 0) {
      return [];
    }

    return Array.apply(0, Array(end)).map((undef, idx) => idx);
  };
  const toRadian = x => x * Math.PI / 180;
  const toDegree = x => x * 180 / Math.PI;
  const clamp = (x, min, max) => Math.max(Math.min(x, max), min); // Linear interpolation between a and b

  const lerp = (a, b, t) => {
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
  }; // In Radians

  const directionToYawPitch = direction => {
    const xz = new THREE.Vector2(direction.x, direction.z);
    const origin = new THREE.Vector2();
    const yaw = Math.abs(direction.y) <= 0.99 ? getRotationAngle(origin, new THREE.Vector2(0, 1), xz) : 0;
    const pitch = Math.atan2(direction.y, xz.distanceTo(origin));
    return {
      yaw,
      pitch
    };
  };
  const createLoadingContext = (view3D, src) => {
    const context = {
      src,
      loaded: 0,
      total: 0,
      lengthComputable: false,
      initialized: false
    };
    view3D.loadingContext.push(context);
    return context;
  };
  const getAttributeScale = attrib => {
    if (attrib.normalized && ArrayBuffer.isView(attrib.array)) {
      const buffer = attrib.array;
      const isSigned = isSignedArrayBuffer(buffer);
      const scale = 1 / (Math.pow(2, 8 * buffer.BYTES_PER_ELEMENT) - 1);
      return isSigned ? scale * 2 : scale;
    } else {
      return 1;
    }
  };
  const getSkinnedVertex = (posIdx, mesh, positionScale, skinWeightScale) => {
    const geometry = mesh.geometry;
    const positions = geometry.attributes.position;
    const skinIndicies = geometry.attributes.skinIndex;
    const skinWeights = geometry.attributes.skinWeight;
    const skeleton = mesh.skeleton;
    const boneMatricies = skeleton.boneMatrices;
    const pos = new THREE.Vector3().fromBufferAttribute(positions, posIdx).multiplyScalar(positionScale);
    const skinned = new THREE.Vector4(0, 0, 0, 0);
    const skinVertex = new THREE.Vector4(pos.x, pos.y, pos.z).applyMatrix4(mesh.bindMatrix);
    const weights = [skinWeights.getX(posIdx), skinWeights.getY(posIdx), skinWeights.getZ(posIdx), skinWeights.getW(posIdx)].map(weight => weight * skinWeightScale);
    const indicies = [skinIndicies.getX(posIdx), skinIndicies.getY(posIdx), skinIndicies.getZ(posIdx), skinIndicies.getW(posIdx)];
    weights.forEach((weight, index) => {
      const boneMatrix = new THREE.Matrix4().fromArray(boneMatricies, indicies[index] * 16);
      skinned.add(skinVertex.clone().applyMatrix4(boneMatrix).multiplyScalar(weight));
    });
    const transformed = new THREE.Vector3().fromArray(skinned.applyMatrix4(mesh.bindMatrixInverse).toArray());
    transformed.applyMatrix4(mesh.matrixWorld);
    return transformed;
  };
  const isSignedArrayBuffer = buffer => {
    const testBuffer = new buffer.constructor(1);
    testBuffer[0] = -1;
    return testBuffer[0] < 0;
  };
  const checkHalfFloatAvailable = renderer => {
    if (renderer.capabilities.isWebGL2) {
      return true;
    } else {
      const gl = renderer.getContext();
      const texture = gl.createTexture();
      let available = true;

      try {
        const data = new Uint16Array(4);
        const ext = gl.getExtension("OES_texture_half_float");

        if (!ext) {
          available = false;
        } else {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, ext.HALF_FLOAT_OES, data);
          const err = gl.getError();
          available = err === gl.NO_ERROR;
        }
      } catch (err) {
        available = false;
      }

      gl.deleteTexture(texture);
      return available;
    }
  };
  const getFaceVertices = (model, meshIndex, faceIndex) => {
    var _a;

    if (!model || meshIndex < 0 || faceIndex < 0) return null;
    const mesh = model.meshes[meshIndex];
    const indexes = (_a = mesh === null || mesh === void 0 ? void 0 : mesh.geometry.index) === null || _a === void 0 ? void 0 : _a.array;
    const face = indexes ? range(3).map(idx => indexes[3 * faceIndex + idx]) : null;
    if (!mesh || !indexes || !face || face.some(val => val == null)) return null;
    const position = mesh.geometry.getAttribute("position");
    const vertices = face.map(index => {
      return new THREE.Vector3().fromBufferAttribute(position, index);
    });
    return vertices;
  };
  const getAnimatedFace = (model, meshIndex, faceIndex) => {
    const vertices = getFaceVertices(model, meshIndex, faceIndex);
    if (!vertices) return null;
    const mesh = model.meshes[meshIndex];
    const indexes = mesh.geometry.getIndex();
    const face = indexes.array.slice(3 * faceIndex, 3 * faceIndex + 3);

    if (mesh.isSkinnedMesh) {
      const geometry = mesh.geometry;
      const positions = geometry.attributes.position;
      const skinWeights = geometry.attributes.skinWeight;
      const positionScale = getAttributeScale(positions);
      const skinWeightScale = getAttributeScale(skinWeights);
      vertices.forEach((vertex, idx) => {
        const posIdx = face[idx];
        const transformed = getSkinnedVertex(posIdx, mesh, positionScale, skinWeightScale);
        vertex.copy(transformed);
      });
    } else {
      vertices.forEach(vertex => {
        vertex.applyMatrix4(mesh.matrixWorld);
      });
    }

    return vertices;
  };

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
  // Browser related constants
  const IS_IOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const IS_ANDROID = () => /android/i.test(navigator.userAgent);
  const EVENTS = {
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
    ERROR: "error",
    CLICK: "click",
    CONTEXT_LOST: "webglcontextlost",
    CONTEXT_RESTORE: "webglcontextrestored"
  };
  const CURSOR = {
    GRAB: "grab",
    GRABBING: "grabbing",
    NONE: ""
  }; // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.button

  var MOUSE_BUTTON;

  (function (MOUSE_BUTTON) {
    MOUSE_BUTTON[MOUSE_BUTTON["LEFT"] = 0] = "LEFT";
    MOUSE_BUTTON[MOUSE_BUTTON["MIDDLE"] = 1] = "MIDDLE";
    MOUSE_BUTTON[MOUSE_BUTTON["RIGHT"] = 2] = "RIGHT";
  })(MOUSE_BUTTON || (MOUSE_BUTTON = {}));
  const ANONYMOUS = "anonymous";

  /*
   * Copyright (c) 2020 NAVER Corp.
   * egjs projects are licensed under the MIT license
   */
  /**
   * "auto"
   * @type {"auto"}
   */

  const AUTO = "auto";
  /**
   * Event type object with event name strings of {@link View3D}
   * @type {object}
   * @property {"ready"} READY {@link /docs/events/ready Ready event}
   * @property {"loadStart"} LOAD_START {@link /docs/events/loadStart Load start event}
   * @property {"load"} LOAD {@link /docs/events/load Load event}
   * @property {"loadError"} LOAD_ERROR {@link /docs/events/loadError Load error event}
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

  const EVENTS$1 = {
    READY: "ready",
    LOAD_START: "loadStart",
    LOAD: "load",
    LOAD_ERROR: "loadError",
    LOAD_FINISH: "loadFinish",
    MODEL_CHANGE: "modelChange",
    RESIZE: "resize",
    BEFORE_RENDER: "beforeRender",
    RENDER: "render",
    PROGRESS: "progress",
    INPUT_START: "inputStart",
    INPUT_END: "inputEnd",
    CAMERA_CHANGE: "cameraChange",
    AR_START: "arStart",
    AR_END: "arEnd",
    AR_MODEL_PLACED: "arModelPlaced",
    QUICK_LOOK_TAP: "quickLookTap"
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
   * Default class names that View3D uses
   * @type {object}
   * @property {"view3d-poster"} POSTER A class name for poster element
   * @property {"view3d-ar-overlay"} AR_OVERLAY A class name for AR overlay element
   * @property {"view3d-annotation-wrapper"} ANNOTATION_WRAPPER A class name for annotation wrapper element
   * @property {"view3d-annotation"} ANNOTATION A class name for annotation element
   * @property {"default"} ANNOTATION_DEFAULT A class name for default style annotation element
   * @property {"selected"} ANNOTATION_SELECTED A class name for selected annotation element
   * @property {"flip-x"} ANNOTATION_FLIP_X A class name for annotation element which has tooltip on the left side
   * @property {"flip-y"} ANNOTATION_FLIP_Y A class name for annotation element which has tooltip on the bottom side
   * @property {"ctx-lost"} CTX_LOST A class name for canvas element which will be added on context lost
   */

  const DEFAULT_CLASS = {
    POSTER: "view3d-poster",
    AR_OVERLAY: "view3d-ar-overlay",
    ANNOTATION_WRAPPER: "view3d-annotation-wrapper",
    ANNOTATION: "view3d-annotation",
    ANNOTATION_TOOLTIP: "view3d-annotation-tooltip",
    ANNOTATION_DEFAULT: "default",
    ANNOTATION_SELECTED: "selected",
    ANNOTATION_FLIP_X: "flip-x",
    ANNOTATION_FLIP_Y: "flip-y",
    CTX_LOST: "ctx-lost"
  };
  /**
   * Possible values for the toneMapping option.
   * This is used to approximate the appearance of high dynamic range (HDR) on the low dynamic range medium of a standard computer monitor or mobile device's screen.
   * @type {object}
   * @property {THREE.LinearToneMapping} LINEAR
   * @property {THREE.ReinhardToneMapping} REINHARD
   * @property {THREE.CineonToneMapping} CINEON
   * @property {THREE.ACESFilmicToneMapping} ACES_FILMIC
   */

  const TONE_MAPPING = {
    LINEAR: THREE.LinearToneMapping,
    REINHARD: THREE.ReinhardToneMapping,
    CINEON: THREE.CineonToneMapping,
    ACES_FILMIC: THREE.ACESFilmicToneMapping
  };
  /**
   * Types of zoom control
   * @type {object}
   * @property {"fov"} FOV Zoom by chaning fov(field-of-view). This will prevent camera from going inside the model.
   * @property {"distance"} DISTANCE Zoom by changing camera distance from the model.
   */

  const ZOOM_TYPE = {
    FOV: "fov",
    DISTANCE: "distance"
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
  /**
   * Input types
   * @type {object}
   * @property {0} ROTATE Rotate input
   * @property {1} TRANSLATE Translate input
   * @property {2} ZOOM Zoom input
   */

  const INPUT_TYPE = {
    ROTATE: 0,
    TRANSLATE: 1,
    ZOOM: 2
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
     * @param {View3D} view3D An instance of View3D
     */
    constructor(view3D) {
      this._defaultRenderLoop = delta => {
        const view3D = this._view3D;
        const {
          control,
          autoPlayer,
          animator
        } = view3D;
        if (!animator.animating && !control.animating && !autoPlayer.animating) return;

        this._renderFrame(delta);
      };

      this._onContextLost = () => {
        const canvas = this._canvas;
        canvas.classList.add(DEFAULT_CLASS.CTX_LOST);
      };

      this._onContextRestore = () => {
        const canvas = this._canvas;
        const scene = this._view3D.scene;
        canvas.classList.remove(DEFAULT_CLASS.CTX_LOST);
        scene.initTextures();
        this.renderSingleFrame();
      };

      const canvas = findCanvas(view3D.rootEl, view3D.canvasSelector);
      this._canvas = canvas;
      this._view3D = view3D;
      this._renderQueued = false;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true
      });
      renderer.toneMapping = view3D.toneMapping;
      renderer.toneMappingExposure = view3D.exposure;
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.setClearColor(0x000000, 0);
      this._halfFloatAvailable = checkHalfFloatAvailable(renderer);
      this._renderer = renderer;
      this._clock = new THREE.Clock(false);
      this._canvasSize = new THREE.Vector2();
      canvas.addEventListener(EVENTS.CONTEXT_LOST, this._onContextLost);
      canvas.addEventListener(EVENTS.CONTEXT_RESTORE, this._onContextRestore);
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
      return this._renderer.getContext();
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
     * The rendering width and height of the canvas
     * @type {object}
     * @param {number} width Width of the canvas
     * @param {number} height Height of the canvas
     * @readonly
     */


    get size() {
      const renderingSize = this._renderer.getSize(new THREE.Vector2());

      return {
        width: renderingSize.width,
        height: renderingSize.y
      };
    }
    /**
     * Canvas element's actual size
     * @type THREE.Vector2
     * @readonly
     */


    get canvasSize() {
      return this._canvasSize;
    }
    /**
     * An object containing details about the capabilities of the current RenderingContext.
     * Merged with three.js WebGLRenderer's capabilities.
     */


    get capabilities() {
      const renderer = this._renderer;
      return Object.assign(Object.assign({}, renderer.capabilities), {
        halfFloat: this._halfFloatAvailable
      });
    }
    /**
     * Destroy the renderer and stop active animation loop
     */


    destroy() {
      const canvas = this._canvas;
      this.stopAnimationLoop();

      this._renderer.dispose();

      canvas.removeEventListener(EVENTS.CONTEXT_LOST, this._onContextLost);
      canvas.removeEventListener(EVENTS.CONTEXT_RESTORE, this._onContextRestore);
    }
    /**
     * Resize the renderer based on current canvas width / height
     * @returns {void}
     */


    resize() {
      const renderer = this._renderer;
      const canvas = this._canvas;
      if (renderer.xr.isPresenting) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height, false);

      this._canvasSize.set(width, height);
    }

    setAnimationLoop(callback) {
      const view3D = this._view3D;
      const clock = this._clock;
      clock.start();

      this._renderer.setAnimationLoop((timestamp, frame) => {
        const delta = Math.min(clock.getDelta(), view3D.maxDeltaTime);
        callback(delta, frame);
      });
    }

    stopAnimationLoop() {
      this._clock.stop(); // See https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setAnimationLoop


      this._renderer.setAnimationLoop(null);
    }

    renderSingleFrame(immediate = false) {
      const renderer = this._renderer;

      if (!renderer.xr.isPresenting) {
        if (immediate) {
          this._renderFrame(0);
        } else if (!this._renderQueued) {
          requestAnimationFrame(() => {
            this._renderFrame(0);
          });
          this._renderQueued = true;
        }
      }
    }

    _renderFrame(delta) {
      const view3D = this._view3D;
      const threeRenderer = this._renderer;
      const {
        scene,
        camera,
        control,
        autoPlayer,
        animator,
        annotation
      } = view3D;
      if (threeRenderer.getContext().isContextLost()) return;
      const deltaMiliSec = delta * 1000;
      this._renderQueued = false;
      animator.update(delta);
      control.update(deltaMiliSec);
      autoPlayer.update(deltaMiliSec);
      view3D.trigger(EVENTS$1.BEFORE_RENDER, {
        type: EVENTS$1.BEFORE_RENDER,
        target: view3D,
        delta: deltaMiliSec
      });
      camera.updatePosition();
      scene.shadowPlane.render();
      threeRenderer.render(scene.root, camera.threeCamera); // Render annotations

      annotation.render();
      view3D.trigger(EVENTS$1.RENDER, {
        type: EVENTS$1.RENDER,
        target: view3D,
        delta: deltaMiliSec
      });
    }

  }

  /**
   * Base class for all loaders that View3D uses
   */

  class Loader {
    constructor(view3D) {
      this._onLoadingProgress = (evt, src, context) => {
        const view3D = this._view3D;
        context.initialized = true;
        context.lengthComputable = evt.lengthComputable;
        context.loaded = evt.loaded;
        context.total = evt.total;
        view3D.trigger(EVENTS$1.PROGRESS, {
          type: EVENTS$1.PROGRESS,
          target: view3D,
          src,
          lengthComputable: evt.lengthComputable,
          loaded: evt.loaded,
          total: evt.total
        });
      };

      this._view3D = view3D;
    }

  }

  /*
   * Copyright (c) 2020 NAVER Corp.
   * egjs projects are licensed under the MIT license
   */
  /**
   * Texture loader
   */

  class TextureLoader extends Loader {
    /**
     * Create new TextureLoader instance
     * @param {View3D} view3D An instance of View3D
     */
    constructor(view3D) {
      super(view3D);
    }
    /**
     * Create new {@link https://threejs.org/docs/index.html#api/en/textures/Texture Texture} with given url
     * Texture's {@link https://threejs.org/docs/index.html#api/en/textures/Texture.flipY flipY} property is `true` by Three.js's policy, so be careful when using it as a map texture.
     * @param url url to fetch image
     */


    load(url) {
      const view3D = this._view3D;
      return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        const loadingContext = createLoadingContext(view3D, url);
        loader.setCrossOrigin(ANONYMOUS);
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


    loadHDRTexture(url) {
      const view3D = this._view3D;
      return new Promise((resolve, reject) => {
        const loader = new RGBELoader.RGBELoader();

        if (!view3D.renderer.capabilities.halfFloat) {
          loader.type = THREE.FloatType;
        }

        const loadingContext = createLoadingContext(view3D, url);
        loader.setCrossOrigin(ANONYMOUS);
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

  /*
   * Copyright (c) 2020 NAVER Corp.
   * egjs projects are licensed under the MIT license
   */
  // Constants that used internally
  // Texture map names that used in THREE#MeshStandardMaterial
  const STANDARD_MAPS = ["alphaMap", "aoMap", "bumpMap", "displacementMap", "emissiveMap", "envMap", "lightMap", "map", "metalnessMap", "normalMap", "roughnessMap", "sheenColorMap", "sheenRoughnessMap", "specularColorMap", "specularIntensityMap", "transmissionMap", "clearcoatMap", "clearcoatNormalMap"];
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

  const CUSTOM_TEXTURE_LOD_EXTENSION = "EXT_View3D_texture_LOD";
  const TEXTURE_LOD_EXTRA = "view3d-lod";
  const ANNOTATION_EXTRA = "view3d-annotation";

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
     * @param {number} [options.darkness=0.5] Darkness of the shadow.
     * @param {number} [options.mapSize=9] Size of the shadow map. Texture of size (n * n) where n = 2 ^ (mapSize) will be used as shadow map. Should be an integer value.
     * @param {number} [options.blur=3.5] Blurriness of the shadow.
     * @param {number} [options.shadowScale=1] Scale of the shadow range. This usually means which height of the 3D model shadow will be affected by.
     * @param {number} [options.planeScale=2] Scale of the shadow plane. Use higher value if the shadow is clipped.
     */
    constructor(view3D, {
      darkness = 0.5,
      mapSize = 9,
      blur = 3.5,
      shadowScale = 1,
      planeScale = 2
    } = {}) {
      this._view3D = view3D;
      this._darkness = darkness;
      this._mapSize = mapSize;
      this._blur = blur;
      this._shadowScale = shadowScale;
      this._planeScale = planeScale;
      const threeRenderer = view3D.renderer.threeRenderer;
      const maxTextureSize = Math.min(Math.pow(2, Math.floor(mapSize)), threeRenderer.capabilities.maxTextureSize);
      this._root = new THREE.Group();
      this._renderTarget = new THREE.WebGLRenderTarget(maxTextureSize, maxTextureSize, {
        format: THREE.RGBAFormat
      });
      this._blurTarget = new THREE.WebGLRenderTarget(maxTextureSize, maxTextureSize, {
        format: THREE.RGBAFormat
      });
      this._renderTarget.texture.generateMipmaps = false;
      this._blurTarget.texture.generateMipmaps = false;
      const shadowCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0);
      shadowCamera.rotation.x = Math.PI / 2;
      this._shadowCamera = shadowCamera;

      this._root.add(shadowCamera);

      const blurCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0);
      this._blurCamera = blurCamera;

      this._setupPlanes();
    }
    /**
     * Root of the object
     * @readonly
     */


    get root() {
      return this._root;
    }
    /**
     * Darkness of the shadow.
     * @type {number}
     * @default 0.5
     */


    get darkness() {
      return this._darkness;
    }
    /**
     * Size of the shadow map. Texture of size (n * n) where n = 2 ^ (mapSize) will be used as shadow map. Should be an integer value.
     * @type {number}
     * @default 9
     */


    get mapSize() {
      return this._mapSize;
    }
    /**
     * Blurriness of the shadow.
     * @type {number}
     * @default 3.5
     */


    get blur() {
      return this._blur;
    }
    /**
     * Scale of the shadow range. Using higher values will make shadow more even-textured.
     * @type {number}
     * @default 1
     */


    get shadowScale() {
      return this._shadowScale;
    }
    /**
     * Scale of the shadow plane. Use higher value if the shadow is clipped.
     * @type {number}
     * @default 2
     */


    get planeScale() {
      return this._planeScale;
    }

    set darkness(val) {
      this._plane.material.opacity = val;
      this._darkness = val;
    }

    set blur(val) {
      this._blur = val;
    }

    set shadowScale(val) {
      this._shadowScale = val;
      const model = this._view3D.model;

      if (model) {
        this.updateDimensions(model);
      }
    }

    updateDimensions(model) {
      const root = this._root;
      const shadowCam = this._shadowCamera;
      const baseScale = this._planeScale;
      const boundingSphere = model.bbox.getBoundingSphere(new THREE.Sphere());
      const radius = boundingSphere.radius;
      const camSize = baseScale * 2 * radius;
      const shadowScale = this._shadowScale;
      shadowCam.far = shadowScale * (model.bbox.max.y - model.bbox.min.y) / camSize;
      shadowCam.rotation.set(Math.PI / 2, Math.PI, 0, "YXZ");
      root.position.copy(boundingSphere.center).setY(model.bbox.min.y);
      root.scale.setScalar(camSize);
      shadowCam.updateProjectionMatrix();
    }

    render() {
      this._plane.visible = false;
      const view3D = this._view3D;
      const {
        renderer,
        ar
      } = view3D;
      const shadowCamera = this._shadowCamera;
      const threeRenderer = renderer.threeRenderer;
      const scene = ar.activeSession ? ar.activeSession.arScene : view3D.scene; // disable XR for offscreen rendering

      const xrEnabled = threeRenderer.xr.enabled;
      threeRenderer.xr.enabled = false;
      const sceneRoot = scene.root;
      const initialBackground = sceneRoot.background;
      sceneRoot.background = null; // force the depthMaterial to everything

      sceneRoot.overrideMaterial = this._depthMaterial; // set renderer clear alpha

      const initialClearAlpha = threeRenderer.getClearAlpha();
      threeRenderer.setClearAlpha(0); // render to the render target to get the depths

      const prevRenderTarget = threeRenderer.getRenderTarget();
      threeRenderer.setRenderTarget(this._renderTarget);
      threeRenderer.clear();
      threeRenderer.render(sceneRoot, shadowCamera); // and reset the override material

      sceneRoot.overrideMaterial = null;

      this._blurShadow(this._blur); // a second pass to reduce the artifacts
      // (0.4 is the minimum blur amout so that the artifacts are gone)


      this._blurShadow(this._blur * 0.4); // reset and render the normal scene


      threeRenderer.xr.enabled = xrEnabled;
      threeRenderer.setRenderTarget(prevRenderTarget);
      threeRenderer.setClearAlpha(initialClearAlpha);
      sceneRoot.background = initialBackground;
      this._plane.visible = true;
    }

    _blurShadow(amount) {
      const {
        renderer
      } = this._view3D;
      const blurCamera = this._blurCamera;
      const threeRenderer = renderer.threeRenderer;
      const blurPlane = this._blurPlane;
      const renderTarget = this._renderTarget;
      const blurTarget = this._blurTarget;
      const horizontalBlurMaterial = this._horizontalBlurMaterial;
      const verticalBlurMaterial = this._verticalBlurMaterial;
      blurPlane.visible = true; // blur horizontally and draw in the renderTargetBlur

      horizontalBlurMaterial.uniforms.tDiffuse.value = renderTarget.texture;
      horizontalBlurMaterial.uniforms.h.value = amount * 1 / 256;
      horizontalBlurMaterial.needsUpdate = true;
      blurPlane.material = horizontalBlurMaterial;
      threeRenderer.setRenderTarget(blurTarget);
      threeRenderer.render(blurPlane, blurCamera); // blur vertically and draw in the main renderTarget

      verticalBlurMaterial.uniforms.tDiffuse.value = blurTarget.texture;
      verticalBlurMaterial.uniforms.v.value = amount * 1 / 256;
      verticalBlurMaterial.needsUpdate = true;
      blurPlane.material = verticalBlurMaterial;
      threeRenderer.setRenderTarget(renderTarget);
      threeRenderer.render(blurPlane, blurCamera);
      blurPlane.visible = false;
    }

    _setupPlanes() {
      const root = this._root;
      const planeGeometry = new THREE.PlaneBufferGeometry();
      const planeMat = new THREE.MeshBasicMaterial({
        opacity: this._darkness,
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        map: this._renderTarget.texture
      });
      const plane = new THREE.Mesh(planeGeometry, planeMat);
      plane.renderOrder = 1;
      plane.scale.set(-1, -1, 1);
      plane.rotation.order = "YXZ";
      plane.rotation.x = Math.PI / 2;
      this._plane = plane;
      root.add(plane);
      const blurPlane = new THREE.Mesh(planeGeometry);
      this._blurPlane = blurPlane;
      const depthMaterial = new THREE.MeshDepthMaterial();

      depthMaterial.onBeforeCompile = shader => {
        shader.fragmentShader = `
        ${shader.fragmentShader.replace("gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );", "gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * opacity );")}`;
      };

      this._depthMaterial = depthMaterial;
      const horizontalBlurMaterial = new THREE.ShaderMaterial(HorizontalBlurShader.HorizontalBlurShader);
      horizontalBlurMaterial.depthTest = false;
      this._horizontalBlurMaterial = horizontalBlurMaterial;
      const verticalBlurMaterial = new THREE.ShaderMaterial(VerticalBlurShader.VerticalBlurShader);
      verticalBlurMaterial.depthTest = false;
      this._verticalBlurMaterial = verticalBlurMaterial;
    }

  }

  /**
   * Skybox texture generator
   */

  class Skybox {
    static createDefaultEnv(renderer) {
      const envScene = new THREE.Scene();
      const point = new THREE.PointLight(0xffffff, 0.8, 20);
      point.decay = 2;
      point.position.set(0, 7, 0);
      envScene.add(point);
      const boxGeo = new THREE.BoxBufferGeometry(1, 1, 1);
      const boxMat = new THREE.MeshStandardMaterial({
        side: THREE.BackSide
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.castShadow = false;
      box.scale.set(15, 45, 15);
      box.position.set(0, 20, 0);
      envScene.add(box);

      const topLight = Skybox._createRectAreaLightSource({
        intensity: 4.5,
        width: 4,
        height: 4
      });

      topLight.position.set(0, 2.5, 0);
      topLight.rotateX(Math.PI / 2);
      const frontLightIntensity = 3;

      const frontLight0 = Skybox._createRectAreaLightSource({
        intensity: frontLightIntensity,
        width: 2,
        height: 2
      });

      frontLight0.position.set(0, 1, 4);
      frontLight0.lookAt(0, 0, 0);

      const frontLight1 = Skybox._createRectAreaLightSource({
        intensity: frontLightIntensity,
        width: 2,
        height: 2
      });

      frontLight1.position.set(-4, 1, 1);
      frontLight1.lookAt(0, 0, 0);

      const frontLight2 = Skybox._createRectAreaLightSource({
        intensity: frontLightIntensity,
        width: 2,
        height: 2
      });

      frontLight2.position.set(4, 1, 1);
      frontLight2.lookAt(0, 0, 0);

      const backLight1 = Skybox._createRectAreaLightSource({
        intensity: 2.5,
        width: 2,
        height: 2
      });

      backLight1.position.set(1.5, 1, -4);
      backLight1.lookAt(0, 0, 0);

      const backLight2 = Skybox._createRectAreaLightSource({
        intensity: 2.5,
        width: 2,
        height: 2
      });

      backLight2.position.set(-1.5, 1, -4);
      backLight2.lookAt(0, 0, 0);
      envScene.add(topLight, frontLight0, frontLight1, frontLight2, backLight1, backLight2);
      const outputEncoding = renderer.outputEncoding;
      const toneMapping = renderer.toneMapping;
      renderer.outputEncoding = THREE.LinearEncoding;
      renderer.toneMapping = THREE.NoToneMapping;
      const renderTarget = new THREE.PMREMGenerator(renderer).fromScene(envScene, 0.035);
      renderer.outputEncoding = outputEncoding;
      renderer.toneMapping = toneMapping;
      return renderTarget.texture;
    }
    /**
     * Create blurred cubemap texture of the given texture and use that as the skybox
     * @param {THREE.Texture} texture Equirect texture
     * @returns {this}
     */


    static createBlurredHDR(view3D, texture) {
      const threeRenderer = view3D.renderer.threeRenderer;
      const bgScene = new THREE.Scene();
      bgScene.background = texture; // To prevent exposure applied twice

      const origExposure = threeRenderer.toneMappingExposure;
      threeRenderer.toneMappingExposure = 1;
      const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
        encoding: THREE.sRGBEncoding,
        format: THREE.RGBAFormat
      });
      const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
      cubeCamera.update(threeRenderer, bgScene);
      const lightProbe = LightProbeGenerator.LightProbeGenerator.fromCubeRenderTarget(threeRenderer, cubeRenderTarget);
      const skyboxMat = new THREE.MeshStandardMaterial({
        side: THREE.BackSide
      });
      const geometry = new THREE.IcosahedronBufferGeometry(1, 4);
      const skyboxScene = new THREE.Scene();
      const skyboxMesh = new THREE.Mesh(geometry, skyboxMat);
      const normals = geometry.getAttribute("normal");

      for (let i = 0; i < normals.count; i++) {
        normals.setXYZ(i, -normals.getX(i), -normals.getY(i), -normals.getZ(i));
      }

      skyboxScene.add(skyboxMesh);
      skyboxScene.add(lightProbe);
      cubeCamera.update(threeRenderer, skyboxScene);
      threeRenderer.toneMappingExposure = origExposure;
      return cubeRenderTarget.texture;
    }

    static _createRectAreaLightSource({
      intensity,
      width,
      height
    }) {
      const planeBufferGeo = new THREE.PlaneBufferGeometry(width, height);
      const mat = new THREE.MeshBasicMaterial();
      mat.color.setScalar(intensity);
      return new THREE.Mesh(planeBufferGeo, mat);
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
     * @param {View3D} view3D An instance of View3D
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
        fixedObjects.add(shadowPlane.root);
      }
    }
    /**
     * Root {@link https://threejs.org/docs/#api/en/scenes/Scene THREE.Scene} object
     * @readonly
     */


    get root() {
      return this._root;
    }
    /**
     * Shadow plane & light
     * @type {ShadowPlane}
     * @readonly
     */


    get shadowPlane() {
      return this._shadowPlane;
    }
    /**
     * Group that contains volatile user objects
     * @readonly
     */


    get userObjects() {
      return this._userObjects;
    }
    /**
     * Group that contains non-volatile user objects
     * @readonly
     */


    get envObjects() {
      return this._envObjects;
    }
    /**
     * Group that contains objects that View3D manages
     * @readonly
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

      this._userObjects.remove(...objects);

      this._envObjects.remove(...objects);
    }
    /**
     * Set background of the scene.
     * @param background A color / image url to set as background
     * @returns {Promise<void>}
     */


    setBackground(background) {
      return __awaiter(this, void 0, void 0, function* () {
        const view3D = this._view3D;
        const root = this._root;

        if (typeof background === "number" || background.charAt(0) === "#") {
          root.background = new THREE.Color(background);
        } else {
          const textureLoader = new TextureLoader(view3D);
          const texture = yield textureLoader.load(background);
          texture.encoding = THREE.sRGBEncoding;
          root.background = texture;
        }

        view3D.renderer.renderSingleFrame();
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
        const view3D = this._view3D; // Destroy previous skybox

        if (root.background && root.background.isTexture) {
          root.background.dispose();
        }

        if (url) {
          const textureLoader = new TextureLoader(view3D);
          const texture = yield textureLoader.loadHDRTexture(url);

          if (view3D.skyboxBlur) {
            root.background = Skybox.createBlurredHDR(view3D, texture);
          } else {
            root.background = texture;
          }

          root.environment = texture;
        } else {
          root.background = null;
          root.environment = null;
        }

        view3D.renderer.renderSingleFrame();
      });
    }
    /**
     * Set scene's environment map that affects all physical materials in the scene
     * @param url An URL to equirectangular image
     * @returns {void}
     */


    setEnvMap(url) {
      return __awaiter(this, void 0, void 0, function* () {
        const view3D = this._view3D;
        const root = this._root;

        if (url) {
          const textureLoader = new TextureLoader(view3D);
          const texture = yield textureLoader.loadHDRTexture(url);
          root.environment = texture;
        } else {
          root.environment = null;
        }

        view3D.renderer.renderSingleFrame();
      });
    }
    /**
     * @internal
     */


    initTextures() {
      const {
        skybox,
        envmap,
        background,
        useDefaultEnv
      } = this._view3D;
      const tasks = [];

      if (useDefaultEnv) {
        this.setDefaultEnv();
      }

      const hasEnvmap = skybox || envmap;

      if (hasEnvmap) {
        const loadEnv = skybox ? this.setSkybox(skybox) : this.setEnvMap(envmap);
        tasks.push(loadEnv);
      }

      if (!skybox && background) {
        tasks.push(this.setBackground(background));
      }

      return tasks;
    }
    /**
     * @internal
     */


    setDefaultEnv() {
      const renderer = this._view3D.renderer;
      const defaultEnv = Skybox.createDefaultEnv(renderer.threeRenderer);
      this._root.environment = defaultEnv;
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

  const EASING$1 = EASING.EASE_OUT_CUBIC;
  const ANIMATION_DURATION = 300;
  const ANIMATION_LOOP = false;
  const ANIMATION_RANGE = {
    min: 0,
    max: 1
  }; // Camera

  const FOV = 45;
  const INFINITE_RANGE = {
    min: -Infinity,
    max: Infinity
  };
  const PITCH_RANGE = {
    min: -89.9,
    max: 89.9
  };
  const ANNOTATION_BREAKPOINT = {
    165: 0,
    135: 0.4,
    0: 1
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

    get activated() {
      return this._activated;
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

      this._val = lerp(start, end, easedProgress);

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
      easing = EASING$1,
      disableOnFinish = true
    } = {}) {
      this._enabled = false;
      this._finishCallbacks = [];
      this._view3D = view3D;
      this._motion = new Motion({
        duration,
        range: ANIMATION_RANGE,
        easing
      });
      this._disableOnFinish = disableOnFinish;
      this.changeStartEnd(from, to);
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
    /**
     * Whether this control is animating the camera
     * @readonly
     * @type {boolean}
     */


    get animating() {
      return this._motion.activated;
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

    changeStartEnd(from, to) {
      from = from.clone();
      to = to.clone();
      from.yaw = circulate(from.yaw, 0, 360);
      to.yaw = circulate(to.yaw, 0, 360); // Take the smaller degree

      if (Math.abs(to.yaw - from.yaw) > 180) {
        to.yaw = to.yaw < from.yaw ? to.yaw + 360 : to.yaw - 360;
      }

      this._from = from;
      this._to = to;
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
      camera.yaw = lerp(from.yaw, to.yaw, progress);
      camera.pitch = lerp(from.pitch, to.pitch, progress);
      camera.zoom = lerp(from.zoom, to.zoom, progress);
      camera.pivot = from.pivot.clone().lerp(to.pivot, progress);

      if (progress >= 1) {
        if (this._disableOnFinish) {
          this.disable();
        }

        this._finishCallbacks.forEach(callback => callback());

        this.clearFinished();
      }
    }
    /**
     * Enable this input and add event listeners
     * @returns {void}
     */


    enable() {
      if (this._enabled) return;
      this._enabled = true;
      this.reset();
    }
    /**
     * Disable this input and remove all event handlers
     * @returns {void}
     */


    disable() {
      if (!this._enabled) return;
      this._enabled = false;
    }

    reset() {
      this._motion.reset(0);

      this._motion.setEndDelta(1);
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
    /**
     * Copy values from the other pose
     * @param {Pose} pose pose to copy
     */


    copy(pose) {
      this.yaw = pose.yaw;
      this.pitch = pose.pitch;
      this.zoom = pose.zoom;
      this.pivot.copy(pose.pivot);
    }
    /**
     * Return whether values of this pose is equal to other pose
     * @param {Pose} pose pose to check
     */


    equals(pose) {
      const {
        yaw,
        pitch,
        zoom,
        pivot
      } = this;
      return circulate(yaw, 0, 360) === circulate(pose.yaw, 0, 360) && pitch === pose.pitch && zoom === pose.zoom && pivot.equals(pose.pivot);
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
     * @param {View3D} view3D An instance of View3D
     */
    constructor(view3D) {
      this._view3D = view3D;
      this._threeCamera = new THREE.PerspectiveCamera();
      this._maxTanHalfHFov = 0;
      this._baseFov = 45;
      this._baseDistance = 0;
      const initialZoom = isNumber(view3D.initialZoom) ? view3D.initialZoom : 0;
      this._defaultPose = new Pose(view3D.yaw, view3D.pitch, initialZoom);
      this._currentPose = this._defaultPose.clone();
      this._newPose = this._currentPose.clone();
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
     * Camera's new pose that will be applied on the next frame
     * {@link Camera#updatePosition} should be called after changing this value.
     * @type {Pose}
     */


    get newPose() {
      return this._newPose;
    }
    /**
     * Camera's current yaw
     * {@link Camera#updatePosition} should be called after changing this value.
     * @type {number}
     */


    get yaw() {
      return this._currentPose.yaw;
    }
    /**
     * Camera's current pitch
     * {@link Camera#updatePosition} should be called after changing this value.
     * @type {number}
     */


    get pitch() {
      return this._currentPose.pitch;
    }
    /**
     * Camera's current zoom value
     * {@link Camera#updatePosition} should be called after changing this value.
     * @type {number}
     */


    get zoom() {
      return this._currentPose.zoom;
    }
    /**
     * Camera's disatance from current camera pivot(target)
     * @type {number}
     * @readonly
     */


    get distance() {
      return this._view3D.control.zoom.type === ZOOM_TYPE.FOV ? this._baseDistance : this._baseDistance - this._currentPose.zoom;
    }
    /**
     * Camera's default distance from the model center.
     * This will be automatically calculated based on the model size.
     * @type {number}
     * @readonly
     */


    get baseDistance() {
      return this._baseDistance;
    }
    /**
     * Camera's default fov value.
     * This will be automatically chosen when `view3D.fov` is "auto", otherwise it is equal to `view3D.fov`
     * @type {number}
     * @readonly
     */


    get baseFov() {
      return this._baseFov;
    }
    /**
     * Current pivot point of camera rotation
     * @type THREE.Vector3
     * @readonly
     * @see {@link https://threejs.org/docs/#api/en/math/Vector3 THREE#Vector3}
     */


    get pivot() {
      return this._currentPose.pivot;
    }
    /**
     * Camera's focus of view value (vertical)
     * @type number
     * @readonly
     * @see {@link https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.fov THREE#PerspectiveCamera}
     */


    get fov() {
      return this._threeCamera.fov;
    }
    /**
     * Camera's frustum width
     * @type number
     * @readonly
     */


    get renderWidth() {
      return this.renderHeight * this._threeCamera.aspect;
    }
    /**
     * Camera's frustum height
     * @type number
     * @readonly
     */


    get renderHeight() {
      return 2 * this.distance * Math.tan(toRadian(this._threeCamera.getEffectiveFOV() / 2));
    }

    set yaw(val) {
      this._newPose.yaw = val;
    }

    set pitch(val) {
      this._newPose.pitch = val;
    }

    set zoom(val) {
      this._newPose.zoom = val;
    }

    set pivot(val) {
      this._newPose.pivot.copy(val);
    }

    set baseFov(val) {
      this._baseFov = val;
    }
    /**
     * Reset camera to default pose
     * @param {number} [duration=0] Duration of the reset animation
     * @param {function} [easing] Easing function for the reset animation
     * @param {Pose} [pose] Pose to reset, camera will reset to `defaultPose` if pose is not given.
     * @returns Promise that resolves when the animation finishes
     */


    reset(duration = 0, easing = EASING$1, pose) {
      const view3D = this._view3D;
      const control = view3D.control;
      const autoPlayer = view3D.autoPlayer;
      const newPose = this._newPose;
      const currentPose = this._currentPose;
      const targetPose = pose !== null && pose !== void 0 ? pose : this._defaultPose;

      if (duration <= 0) {
        // Reset camera immediately
        newPose.copy(targetPose);
        currentPose.copy(targetPose);
        view3D.renderer.renderSingleFrame();
        control.sync();
        return Promise.resolve();
      } else {
        // Play the animation
        const autoplayEnabled = autoPlayer.enabled;
        const resetControl = new AnimationControl(view3D, currentPose, targetPose);
        resetControl.duration = duration;
        resetControl.easing = easing;
        resetControl.enable();

        if (autoplayEnabled) {
          autoPlayer.disable();
        }

        control.add(resetControl);
        return new Promise(resolve => {
          resetControl.onFinished(() => {
            newPose.copy(targetPose);
            currentPose.copy(targetPose);
            control.remove(resetControl);
            control.sync();

            if (autoplayEnabled) {
              autoPlayer.enableAfterDelay();
            }

            resolve();
          });
        });
      }
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
    }, prevSize = null) {
      const {
        control,
        fov,
        maintainSize
      } = this._view3D;
      const threeCamera = this._threeCamera;
      const aspect = width / height;
      threeCamera.aspect = aspect;

      if (fov === AUTO) {
        if (!maintainSize || prevSize == null) {
          this._applyEffectiveFov(FOV);
        } else {
          const heightRatio = height / prevSize.height;
          const currentZoom = this._currentPose.zoom;
          const tanHalfFov = Math.tan(toRadian((this._baseFov - currentZoom) / 2));
          this._baseFov = toDegree(2 * Math.atan(heightRatio * tanHalfFov)) + currentZoom;
        }
      } else {
        this._baseFov = fov;
      }

      control.zoom.updateRange();
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
      const maxDistToCenterSquared = center === AUTO ? new THREE.Vector3().subVectors(bbox.max, bbox.min).lengthSq() / 4 : model.reduceVertices((dist, vertice) => {
        return Math.max(dist, vertice.distanceToSquared(modelCenter));
      }, 0);
      const maxDistToCenter = Math.sqrt(maxDistToCenterSquared);
      const effectiveCamDist = maxDistToCenter / Math.sin(toRadian(hfov / 2));
      const maxTanHalfHFov = model.reduceVertices((res, vertex) => {
        const distToCenter = new THREE.Vector3().subVectors(vertex, modelCenter);
        const radiusXZ = Math.hypot(distToCenter.x, distToCenter.z);
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
      this._baseDistance = effectiveCamDist;
      camera.near = (effectiveCamDist - maxDistToCenter) * 0.1;
      camera.far = (effectiveCamDist + maxDistToCenter) * 10;
      control.zoom.updateRange();

      if (!isNumber(view3D.initialZoom)) {
        const baseFov = this._baseFov;
        const modelBbox = model.bbox;
        const alignAxis = view3D.initialZoom.axis;
        const targetRatio = view3D.initialZoom.ratio;
        const bboxDiff = new THREE.Vector3().subVectors(modelBbox.max, modelBbox.min);
        const axisDiff = bboxDiff[alignAxis];
        const newViewHeight = alignAxis === "y" ? axisDiff / targetRatio : axisDiff / (targetRatio * camera.aspect);
        const camDist = alignAxis !== "z" ? effectiveCamDist - bboxDiff.z / 2 : effectiveCamDist - bboxDiff.x / 2;
        const newFov = toDegree(2 * Math.atan(newViewHeight / (2 * camDist)));
        defaultPose.zoom = baseFov - newFov;
      } else {
        defaultPose.zoom = view3D.initialZoom;
      }
    }
    /**
     * Update camera position
     * @returns {void}
     */


    updatePosition() {
      const view3D = this._view3D;
      const control = view3D.control;
      const threeCamera = this._threeCamera;
      const currentPose = this._currentPose;
      const newPose = this._newPose;
      const baseFov = this._baseFov;
      const baseDistance = this._baseDistance;
      const isFovZoom = control.zoom.type === ZOOM_TYPE.FOV;
      const prevPose = currentPose.clone(); // Clamp current pose

      currentPose.yaw = circulate(newPose.yaw, 0, 360);
      currentPose.pitch = clamp(newPose.pitch, PITCH_RANGE.min, PITCH_RANGE.max);
      currentPose.zoom = newPose.zoom;
      currentPose.pivot.copy(newPose.pivot);
      const fov = isFovZoom ? baseFov - currentPose.zoom : baseFov;
      const distance = isFovZoom ? baseDistance : baseDistance - currentPose.zoom;
      const newCamPos = getRotatedPosition(distance, currentPose.yaw, currentPose.pitch);
      newCamPos.add(currentPose.pivot);
      threeCamera.fov = fov;
      threeCamera.position.copy(newCamPos);
      threeCamera.lookAt(currentPose.pivot);
      threeCamera.updateProjectionMatrix();
      newPose.copy(currentPose);
      view3D.trigger(EVENTS$1.CAMERA_CHANGE, {
        type: EVENTS$1.CAMERA_CHANGE,
        target: view3D,
        pose: currentPose.clone(),
        prevPose
      });
    }

    _applyEffectiveFov(fov) {
      const camera = this._threeCamera;
      const tanHalfHFov = Math.tan(toRadian(fov / 2));
      const tanHalfVFov = tanHalfHFov * Math.max(1, this._maxTanHalfHFov / tanHalfHFov / camera.aspect);
      this._baseFov = toDegree(2 * Math.atan(tanHalfVFov));
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
      }; // eslint-disable-next-line @typescript-eslint/member-ordering


      this._skipFirstResize = (() => {
        let isFirstResize = true;
        return () => {
          if (isFirstResize) {
            isFirstResize = false;
            return;
          }

          this._onResize();
        };
      })();

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
        const canvasEl = view3d.renderer.canvas;
        const canvasBbox = canvasEl.getBoundingClientRect();
        const resizeImmediate = canvasBbox.width !== 0 || canvasBbox.height !== 0;
        const resizeObserver = new ResizeObserver(resizeImmediate ? this._skipFirstResize : this._onResize); // This will automatically call `resize` for the first time

        resizeObserver.observe(canvasEl);
        this._resizeObserver = resizeObserver;
      } else {
        view3d.resize();
        window.addEventListener(EVENTS.RESIZE, this._onResize);
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
        window.removeEventListener(EVENTS.RESIZE, this._onResize);
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
    constructor(view3D) {
      this._view3D = view3D;
      this._mixer = new THREE.AnimationMixer(view3D.scene.userObjects);
      this._clips = [];
      this._actions = [];
      this._activeAnimationIdx = -1;
      this._fadePromises = [];
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
     * {@link https://threejs.org/docs/#api/en/animation/AnimationMixer THREE.AnimationMixer} instance
     * @type THREE.AnimationMixer
     * @readonly
     */


    get mixer() {
      return this._mixer;
    }
    /**
     * An array of active {@link https://threejs.org/docs/#api/en/animation/AnimationAction AnimationAction}s
     * @type THREE.AnimationAction
     * @readonly
     */


    get actions() {
      return this._actions;
    }
    /**
     * Current length of animations
     * @type {number}
     * @readonly
     */


    get animationCount() {
      return this._clips.length;
    }
    /**
     * Infomation of the animation currently playing, `null` if there're no animation or stopped.
     * @see {@link https://threejs.org/docs/#api/en/animation/AnimationClip AnimationClip}
     * @type {THREE.AnimationClip | null}
     */


    get activeAnimation() {
      var _a;

      return (_a = this._clips[this._activeAnimationIdx]) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * An index of the animation currently playing.
     * @type {number}
     * @readonly
     */


    get activeAnimationIndex() {
      return this._activeAnimationIdx;
    }
    /**
     * An boolean value indicating whether the animations are paused
     * @type {boolean}
     * @readonly
     */


    get paused() {
      return this._mixer.timeScale === 0;
    }
    /**
     * An boolean value indicating whether at least one of the animation is playing
     * @type {boolean}
     * @readonly
     */


    get animating() {
      return this.activeAnimation && !this.paused;
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
      this._actions = clips.map(clip => {
        const action = mixer.clipAction(clip);
        action.setEffectiveWeight(0);
        return action;
      });
    }
    /**
     * Play one of the model's animation
     * @param {number} index Index of the animation to play
     * @returns {void}
     */


    play(index) {
      const action = this._actions[index];
      if (!action) return;
      this.stop(); // Stop all previous actions

      this._restoreTimeScale();

      action.setEffectiveTimeScale(1);
      action.setEffectiveWeight(1);
      action.play();
      this._activeAnimationIdx = index;

      this._flushFadePromises();
    }
    /**
     * Crossfade animation from one to another
     * @param {number} index Index of the animation to crossfade to
     * @param {number} duration Duration of the crossfade animation, in milisec
     * @returns {Promise<boolean>} A promise that resolves boolean value that indicates whether the crossfade is fullfilled without any inference
     */


    crossFade(index, duration, {
      synchronize = false
    } = {}) {
      var _a;

      return __awaiter(this, void 0, void 0, function* () {
        const view3D = this._view3D;
        const mixer = this._mixer;
        const actions = this._actions;
        const activeAnimationIdx = this._activeAnimationIdx;
        const endAction = actions[index];
        const startAction = (_a = actions[activeAnimationIdx]) !== null && _a !== void 0 ? _a : endAction; // eslint-disable-next-line @typescript-eslint/naming-convention

        const EVT_LOOP = "loop";

        this._restoreTimeScale();

        const doCrossfade = () => {
          endAction.enabled = true;
          endAction.setEffectiveTimeScale(1);
          endAction.setEffectiveWeight(1);
          endAction.time = 0;
          endAction.play();
          startAction.crossFadeTo(endAction, duration / 1000, true);
          this._activeAnimationIdx = index;
        };

        if (synchronize) {
          const onLoop = evt => {
            if (evt.action === startAction) {
              mixer.removeEventListener(EVT_LOOP, onLoop);
              doCrossfade();
            }
          };

          mixer.addEventListener(EVT_LOOP, onLoop);
        } else {
          doCrossfade();
        }

        this._flushFadePromises();

        const fadePromise = new Promise(resolve => {
          const onFrame = () => {
            if (endAction.getEffectiveWeight() < 1) return;
            view3D.off(EVENTS$1.BEFORE_RENDER, onFrame);
            resolve(true);
          };

          view3D.on(EVENTS$1.BEFORE_RENDER, onFrame);

          this._fadePromises.push({
            listener: onFrame,
            resolve
          });
        });
        return fadePromise;
      });
    }
    /**
     * Fadeout active animation, and restore to the default pose
     * @param {number} duration Duration of the crossfade animation, in milisec
     * @returns {Promise<boolean>} A promise that resolves boolean value that indicates whether the fadeout is fullfilled without any inference
     */


    fadeOut(duration) {
      return __awaiter(this, void 0, void 0, function* () {
        const view3D = this._view3D;
        const actions = this._actions;
        const activeAction = actions[this._activeAnimationIdx];
        if (!activeAction) return false;

        this._flushFadePromises();

        this._restoreTimeScale();

        activeAction.fadeOut(duration / 1000);
        const fadePromise = new Promise(resolve => {
          const onFrame = () => {
            if (activeAction.getEffectiveWeight() > 0) return;
            view3D.off(EVENTS$1.BEFORE_RENDER, onFrame);
            this._activeAnimationIdx = -1;
            resolve(true);
          };

          view3D.on(EVENTS$1.BEFORE_RENDER, onFrame);

          this._fadePromises.push({
            listener: onFrame,
            resolve
          });
        });
        return fadePromise;
      });
    }
    /**
     * Pause all animations
     * If you want to stop animation completely, you should call {@link ModelAnimator#stop stop} instead
     * You should call {@link ModelAnimator#resume resume} to resume animation
     * @returns {void}
     */


    pause() {
      this._mixer.timeScale = 0;
    }
    /**
     * Resume all animations
     * This will play animation from the point when the animation is paused
     * @returns {void}
     */


    resume() {
      this._restoreTimeScale();
    }
    /**
     * Fully stops one of the model's animation
     * @returns {void}
     */


    stop() {
      this._actions.forEach(action => {
        action.stop();
        action.setEffectiveWeight(0);
      }); // Render single frame to show deactivated state


      this._view3D.renderer.renderSingleFrame();

      this._activeAnimationIdx = -1;

      this._flushFadePromises();
    }
    /**
     * Update animations
     * @param {number} delta number of seconds to play animations attached
     * @internal
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
      this.stop();
      mixer.uncacheRoot(mixer.getRoot());
      this._clips = [];
      this._actions = [];
    }

    _restoreTimeScale() {
      this._mixer.timeScale = 1;
    }

    _flushFadePromises() {
      const view3D = this._view3D;
      const fadePromises = this._fadePromises;
      fadePromises.forEach(({
        resolve,
        listener
      }) => {
        resolve(false);
        view3D.off(EVENTS$1.BEFORE_RENDER, listener);
      });
      this._fadePromises = [];
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
      easing = EASING$1
    } = {}) {
      super();

      this._loop = () => {
        const delta = this._getDeltaTime();

        const duration = this._duration;
        const repeat = this._repeat;
        const prevTime = this._time;
        const time = prevTime + delta;
        const loopIncrease = Math.floor(time / duration);
        this._time = this._loopCount >= repeat ? clamp(time, 0, duration) : circulate(time, 0, duration);
        const progress = this._time / duration;
        const progressEvent = {
          progress,
          easedProgress: this._easing(progress)
        };
        this.trigger("progress", progressEvent);

        for (let loopIdx = 0; loopIdx < loopIncrease; loopIdx++) {
          this._loopCount++;

          if (this._loopCount > repeat) {
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
      scene
    }, deltaTime) {
      if (!this._enabled || !this._active) return;
      const motion = this._motion;
      motion.update(deltaTime);
      this._scaleMultiplier = motion.val;

      this._ui.updateScale(this._scaleMultiplier);

      scene.setModelScale(this._scaleMultiplier);
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
      ringGeomtry.rotateX(-Math.PI / 2);
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
      const arrow = new THREE.Mesh(arrowGeometry, highlightMaterial);
      const merged = new THREE.Group();
      merged.add(ring, arrow);
      merged.position.setY(0.0001); // Set Y higher than shadow plane

      this._mesh = merged;
      this._ring = ring;
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
        const scene = view3D.scene;
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
          control.destroy(session);
          arScene.destroy(view3D);
          domOverlay.destroy(); // Restore original values

          threeRenderer.setPixelRatio(originalPixelRatio); // Restore render loop

          renderer.stopAnimationLoop();
          renderer.setAnimationLoop(renderer.defaultRenderLoop);
          view3D.trigger(EVENTS$1.AR_END, {
            target: view3D,
            type: EVENTS$1.AR_END,
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
          view3D.trigger(EVENTS$1.BEFORE_RENDER, {
            type: EVENTS$1.BEFORE_RENDER,
            target: view3D,
            delta: deltaMiliSec
          });

          if (!this._modelPlaced) {
            this._initModelPosition(ctx);
          } else {
            control.update(ctx);
            view3D.animator.update(delta);
            scene.shadowPlane.render();
            threeRenderer.render(arScene.root, xrCam);
          }

          view3D.trigger(EVENTS$1.RENDER, {
            type: EVENTS$1.RENDER,
            target: view3D,
            delta: deltaMiliSec
          });
        });
        view3D.trigger(EVENTS$1.AR_START, {
          type: EVENTS$1.AR_START,
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
      view3D.trigger(EVENTS$1.AR_MODEL_PLACED, {
        type: EVENTS$1.AR_MODEL_PLACED,
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
      view3D.once(EVENTS$1.AR_END, () => {
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
          view3D.trigger(EVENTS$1.QUICK_LOOK_TAP, Object.assign(Object.assign({}, evt), {
            type: EVENTS$1.QUICK_LOOK_TAP,
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
      view3D.on(EVENTS$1.AR_START, ({
        session
      }) => {
        this._activeSession = session;
      });
      view3D.on(EVENTS$1.AR_END, () => {
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
  /**
   * Annotation(Hotspot) base class
   */

  class Annotation {
    /**
     * @param {View3D} view3D Instance of the view3D
     * @param {AnnotationOptions} [options={}] Options
     */
    constructor(view3D, {
      element = null,
      focus = [],
      focusDuration = 1000,
      baseFov = 45,
      baseDistance = null,
      aspect = 1
    } = {}) {
      this._onClick = () => {
        void this.focus();
      };

      this._onWheel = evt => {
        evt.preventDefault();
        evt.stopPropagation();
      };

      this._view3D = view3D;
      this._element = element;
      this._focus = focus;
      this._focusDuration = focusDuration;
      this._baseFov = baseFov;
      this._baseDistance = baseDistance;
      this._aspect = aspect;
      this._enabled = false;
      this._tooltipSize = new THREE.Vector2();

      if (element) {
        element.draggable = false;
        this.resize();
      }
    }
    /**
     * Element of the annotation
     * @type {HTMLElement}
     * @readonly
     */


    get element() {
      return this._element;
    }
    /**
     * Whether this annotation is renderable in the screen
     * @type {boolean}
     * @readonly
     */


    get renderable() {
      return !!this._element;
    }
    /**
     * An array of values in order of [yaw, pitch, zoom]
     * @type {number[]}
     * @readonly
     */


    get focusPose() {
      return this._focus;
    }
    /**
     * Duration of the focus animation
     * @type {number}
     */


    get focusDuration() {
      return this._focusDuration;
    }
    /**
     * Base fov value that annotation is referencing
     * @type {number}
     */


    get baseFov() {
      return this._baseFov;
    }
    /**
     * Base dsitance value that annotation is referencing
     * @type {number | null}
     */


    get baseDistance() {
      return this._baseDistance;
    }
    /**
     * Base aspect value that annotation is referencing
     * @type {number}
     */


    get aspect() {
      return this._aspect;
    }

    set focusDuration(val) {
      this._focusDuration = val;
    }

    set baseFov(val) {
      this._baseFov = val;
    }

    set baseDistance(val) {
      this._baseDistance = val;
    }

    set aspect(val) {
      this._aspect = val;
    }
    /**
     * Destroy annotation and release all resources.
     */


    destroy() {
      const wrapper = this._view3D.annotation.wrapper;
      const element = this._element;
      this.disableEvents();

      if (element && element.parentElement === wrapper) {
        wrapper.removeChild(element);
      }
    }
    /**
     * Resize annotation to the current size
     */


    resize() {
      const el = this._element;
      if (!el) return;
      const tooltip = el.querySelector(`.${DEFAULT_CLASS.ANNOTATION_TOOLTIP}`);

      if (tooltip) {
        this._tooltipSize.set(tooltip.offsetWidth, tooltip.offsetHeight);
      }
    }
    /**
     * Render annotation element
     * @param {object} params
     * @internal
     */


    render({
      screenPos,
      screenSize,
      renderOrder
    }) {
      const el = this._element;
      const tooltipSize = this._tooltipSize;
      if (!el) return;
      el.style.zIndex = `${renderOrder + 1}`;
      el.style.transform = `translate(-50%, -50%) translate(${screenPos.x}px, ${screenPos.y}px)`;

      if (screenPos.y + tooltipSize.y > screenSize.y) {
        el.classList.add(DEFAULT_CLASS.ANNOTATION_FLIP_Y);
      } else {
        el.classList.remove(DEFAULT_CLASS.ANNOTATION_FLIP_Y);
      }

      if (screenPos.x + tooltipSize.x > screenSize.x) {
        el.classList.add(DEFAULT_CLASS.ANNOTATION_FLIP_X);
      } else {
        el.classList.remove(DEFAULT_CLASS.ANNOTATION_FLIP_X);
      }
    }
    /**
     * Set opacity of the annotation
     * Opacity is automatically controlled with [annotationBreakpoints](/docs/options/annotation/annotationBreakpoints)
     * @param {number} opacity Opacity to apply, number between 0 and 1
     */


    setOpacity(opacity) {
      const el = this._element;
      if (!el) return;
      el.style.opacity = `${opacity}`;
    }
    /**
     * Add browser event handlers
     * @internal
     */


    enableEvents() {
      const el = this._element;
      if (!el || this._enabled) return;
      el.addEventListener(EVENTS.CLICK, this._onClick);
      el.addEventListener(EVENTS.WHEEL, this._onWheel);
      this._enabled = true;
    }
    /**
     * Remove browser event handlers
     * @internal
     */


    disableEvents() {
      const el = this._element;
      if (!el || !this._enabled) return;
      el.removeEventListener(EVENTS.CLICK, this._onClick);
      el.removeEventListener(EVENTS.WHEEL, this._onWheel);
      this._enabled = false;
    }

    _getFocus() {
      var _a;

      const view3D = this._view3D;
      const focusVector = new THREE.Vector3().fromArray(this._focus);
      const currentDistance = view3D.camera.baseDistance;
      const currentSize = view3D.renderer.size;
      const currentAspect = Math.max(currentSize.height / currentSize.width, 1);
      const aspect = this._aspect;
      const baseFov = this._baseFov;
      const baseDistance = (_a = this._baseDistance) !== null && _a !== void 0 ? _a : currentDistance;
      const aspectRatio = currentAspect / aspect;
      const targetRenderHeight = aspectRatio * baseDistance * Math.tan(toRadian((baseFov - focusVector.z) / 2));
      const targetFov = 2 * toDegree(Math.atan(targetRenderHeight / currentDistance)); // zoom value

      focusVector.z = view3D.camera.baseFov - targetFov;
      return focusVector;
    }

  }

  /**
   * {@link Annotation} that stays at one point
   */

  class PointAnnotation extends Annotation {
    /** */
    constructor(view3D, _a = {}) {
      var {
        position = []
      } = _a,
          commonOptions = __rest(_a, ["position"]);

      super(view3D, commonOptions);
      this._position = new THREE.Vector3().fromArray(position);
    }

    get position() {
      return this._position;
    }

    focus() {
      return __awaiter(this, void 0, void 0, function* () {
        const {
          camera
        } = this._view3D;
        const el = this._element;
        const focus = this._focus;
        let targetPose;

        if (focus.length > 0) {
          const focusVector = this._getFocus();

          const position = this._position;
          targetPose = new Pose(focusVector.x, focusVector.y, focusVector.z, position.toArray());
        } else {
          const modelToPos = this._calculateNormalFromModelCenter();

          const {
            yaw,
            pitch
          } = directionToYawPitch(modelToPos);
          targetPose = new Pose(toDegree(yaw), toDegree(pitch), 0, this._position.toArray());
        }

        if (el) {
          el.classList.add(DEFAULT_CLASS.ANNOTATION_SELECTED);
          window.addEventListener("click", () => {
            this.unfocus();
          }, {
            once: true,
            capture: true
          });
        }

        if (!targetPose.equals(camera.currentPose)) {
          return camera.reset(this._focusDuration, EASING$1, targetPose);
        } else {
          return Promise.resolve();
        }
      });
    }

    unfocus() {
      const el = this._element;
      if (!el) return;
      el.classList.remove(DEFAULT_CLASS.ANNOTATION_SELECTED);
    }

    toJSON() {
      return {
        position: this._position.toArray(),
        focus: this._focus,
        duration: this._focusDuration
      };
    }

    _calculateNormalFromModelCenter() {
      const view3D = this._view3D;
      const model = view3D.model;
      const center = model ? model.bbox.getCenter(new THREE.Vector3()) : new THREE.Vector3();
      return new THREE.Vector3().subVectors(this._position, center).normalize();
    }

  }

  /**
   *
   */

  class FaceAnnotation extends Annotation {
    /** */
    constructor(view3D, _a = {}) {
      var {
        meshIndex = -1,
        faceIndex = -1,
        weights = [...new Array(3)].map(() => 1 / 3)
      } = _a,
          commonOptions = __rest(_a, ["meshIndex", "faceIndex", "weights"]);

      super(view3D, commonOptions);
      this._meshIndex = meshIndex;
      this._faceIndex = faceIndex;
      this._weights = weights;
      this._trackingControl = null;
    }

    get position() {
      return this._getPosition();
    }

    get renderable() {
      return !!this._element && this._meshIndex >= 0 && this._faceIndex >= 0;
    }

    get meshIndex() {
      return this._meshIndex;
    }

    get faceIndex() {
      return this._faceIndex;
    }

    get weights() {
      return this._weights;
    }

    focus() {
      return __awaiter(this, void 0, void 0, function* () {
        const el = this._element;

        if (el) {
          el.classList.add(DEFAULT_CLASS.ANNOTATION_SELECTED);
        }

        const view3D = this._view3D;
        const {
          camera,
          control
        } = view3D;

        const focus = this._getFocus();

        const position = this._getPosition();

        const targetPose = new Pose(focus.x, focus.y, focus.z, position.toArray());
        const trackingControl = new AnimationControl(view3D, camera.currentPose, targetPose, {
          duration: this._focusDuration,
          disableOnFinish: false
        });
        this._trackingControl = trackingControl;
        trackingControl.enable();
        control.add(trackingControl);
        window.addEventListener("click", () => {
          this.unfocus();
        }, {
          once: true,
          capture: true
        });
      });
    }

    unfocus() {
      const el = this._element;
      const {
        control
      } = this._view3D;
      const trackingControl = this._trackingControl;

      if (el) {
        el.classList.remove(DEFAULT_CLASS.ANNOTATION_SELECTED);
      }

      if (trackingControl) {
        control.sync();
        control.remove(trackingControl);
        trackingControl.destroy();
        this._trackingControl = null;
      }
    }

    render(params) {
      super.render(params);
      const trackingControl = this._trackingControl;
      if (!trackingControl) return;
      const {
        camera
      } = this._view3D;

      const focus = this._getFocus();

      const position = this._getPosition();

      const targetPose = new Pose(focus.x, focus.y, focus.z, position.toArray());
      trackingControl.changeStartEnd(camera.currentPose, targetPose);
      trackingControl.reset();
    }

    toJSON() {
      return {
        meshIndex: this._meshIndex,
        faceIndex: this._faceIndex,
        focus: this._focus,
        duration: this._focusDuration
      };
    }

    _getPosition() {
      const model = this._view3D.model;
      const meshIndex = this._meshIndex;
      const faceIndex = this._faceIndex;
      const weights = this._weights;
      const animatedVertices = getAnimatedFace(model, meshIndex, faceIndex);
      if (!animatedVertices) return new THREE.Vector3(); // barycentric

      return new THREE.Vector3().addScaledVector(animatedVertices[0], weights[0]).addScaledVector(animatedVertices[1], weights[1]).addScaledVector(animatedVertices[2], weights[2]);
    }

  }

  /**
   * Manager class for {@link Annotation}
   */

  class AnnotationManager {
    /** */
    constructor(view3D) {
      this._onInput = () => {
        const annotations = this._list;
        annotations.forEach(annotation => {
          const el = annotation.element;
          if (!el) return;
          annotation.unfocus();
        });
      };

      this._view3D = view3D;
      this._list = [];
      this._wrapper = getNullableElement(view3D.annotationWrapper, view3D.rootEl) || this._createWrapper();
    }
    /**
     * List of annotations
     * @type {Annotation[]}
     * @readonly
     */


    get list() {
      return this._list;
    }
    /**
     * Wrapper element for annotations
     * @type {HTMLElement}
     * @readonly
     */


    get wrapper() {
      return this._wrapper;
    }
    /**
     * Initialize and collect annotations from the wrapper
     */


    init() {
      const view3D = this._view3D;
      view3D.control.controls.forEach(control => {
        control.on({
          [CONTROL_EVENTS.HOLD]: this._onInput
        });
      });
    }
    /**
     * Destroy all annotations & event handlers
     */


    destroy() {
      this._view3D.control.controls.forEach(control => {
        control.off({
          [CONTROL_EVENTS.HOLD]: this._onInput
        });
      });

      this.reset();
    }
    /**
     * Resize annotations
     */


    resize() {
      this._list.forEach(annotation => {
        annotation.resize();
      });
    }
    /**
     * Collect annotations inside the wrapper element
     */


    collect() {
      const view3D = this._view3D;
      const wrapper = this._wrapper;
      const annotationEls = [].slice.apply(wrapper.querySelectorAll(view3D.annotationSelector));
      const annotations = annotationEls.map(element => {
        const focusStr = element.dataset.focus;
        const focus = focusStr ? focusStr.split(" ").map(val => parseFloat(val)) : [];
        const focusDuration = element.dataset.duration ? parseFloat(element.dataset.duration) : void 0;
        const commonOptions = {
          element,
          focus,
          focusDuration
        };

        if (element.dataset.meshIndex) {
          const meshIndex = parseFloat(element.dataset.meshIndex);
          const faceIndex = element.dataset.faceIndex ? parseFloat(element.dataset.faceIndex) : void 0;
          return new FaceAnnotation(view3D, Object.assign(Object.assign({}, commonOptions), {
            meshIndex,
            faceIndex
          }));
        } else {
          const positionStr = element.dataset.position;
          const position = positionStr ? positionStr.split(" ").map(val => parseFloat(val)) : [];
          return new PointAnnotation(view3D, Object.assign(Object.assign({}, commonOptions), {
            position
          }));
        }
      });
      this.add(...annotations);
    }
    /**
     * Load annotation JSON from URL
     * @param {string} url URL to annotations json
     */


    load(url) {
      const fileLoader = new THREE.FileLoader();
      return new Promise((resolve, reject) => {
        fileLoader.load(url, json => {
          const data = JSON.parse(json);
          const parsed = this.parse(data);
          this.add(...parsed);
          resolve(parsed);
        }, undefined, error => {
          reject(error);
        });
      });
    }
    /**
     * Parse an array of annotation data
     * @param {object[]} data An array of annotation data
     */


    parse(data) {
      const view3D = this._view3D;
      const {
        baseFov,
        baseDistance,
        aspect,
        items
      } = data;
      const annotations = items.map(annotationData => {
        const {
          meshIndex,
          faceIndex,
          position
        } = annotationData,
              commonData = __rest(annotationData, ["meshIndex", "faceIndex", "position"]);

        const element = this._createDefaultAnnotationElement(annotationData.label);

        if (meshIndex != null && faceIndex != null) {
          return new FaceAnnotation(view3D, Object.assign(Object.assign({
            meshIndex,
            faceIndex
          }, commonData), {
            baseFov,
            baseDistance,
            aspect,
            element
          }));
        } else {
          return new PointAnnotation(view3D, Object.assign(Object.assign({
            position: position
          }, commonData), {
            baseFov,
            baseDistance,
            aspect,
            element
          }));
        }
      });
      return annotations;
    }
    /**
     * Render annotations
     */


    render() {
      const view3D = this._view3D;
      const model = view3D.model;
      if (!model) return;
      const camera = view3D.camera;
      const screenSize = view3D.renderer.canvasSize;
      const halfScreenSize = screenSize.clone().multiplyScalar(0.5);
      const threeCamera = camera.threeCamera;
      const camPos = threeCamera.position;
      const modelCenter = model.bbox.getCenter(new THREE.Vector3());
      const breakpoints = view3D.annotationBreakpoints; // Sort by distance most far to camera (descending)

      const annotationsDesc = [...this._list].filter(annotation => annotation.renderable).map(annotation => {
        const position = annotation.position;
        return {
          annotation,
          position,
          distToCameraSquared: camPos.distanceToSquared(position)
        };
      }).sort((a, b) => b.distToCameraSquared - a.distToCameraSquared);
      const centerToCamDir = new THREE.Vector3().subVectors(camPos, modelCenter).normalize();
      const breakpointKeysDesc = Object.keys(breakpoints).map(val => parseFloat(val)).sort((a, b) => b - a);
      annotationsDesc.forEach(({
        annotation,
        position
      }, idx) => {
        if (!annotation.element) return;
        const screenRelPos = position.clone().project(threeCamera);
        const screenPos = new THREE.Vector2(screenRelPos.x, -screenRelPos.y);
        const centerToAnnotationDir = new THREE.Vector3().subVectors(position, modelCenter).normalize();
        const camToAnnotationDegree = toDegree(Math.abs(Math.acos(centerToAnnotationDir.dot(centerToCamDir))));
        screenPos.multiply(halfScreenSize);
        screenPos.add(halfScreenSize);

        for (const breakpoint of breakpointKeysDesc) {
          if (camToAnnotationDegree >= breakpoint) {
            annotation.setOpacity(breakpoints[breakpoint]);
            break;
          }
        }

        annotation.render({
          position,
          renderOrder: idx,
          screenPos,
          screenSize
        });
      });
    }
    /**
     * Add new annotation to the scene
     * @param {Annotation} annotations Annotations to add
     */


    add(...annotations) {
      const wrapper = this._wrapper;
      annotations.forEach(annotation => {
        annotation.enableEvents();

        if (annotation.element && annotation.element.parentElement !== wrapper) {
          wrapper.appendChild(annotation.element);
        }
      });

      this._list.push(...annotations);
    }
    /**
     * Remove annotation at the given index
     * @param {number} index Index of the annotation to remove
     */


    remove(index) {
      const removed = this._list.splice(index, 1)[0];

      if (!removed) return null;
      removed.destroy();
      return removed;
    }
    /**
     * Remove all annotations
     */


    reset() {
      const annotations = this._list;
      const removed = annotations.splice(0, annotations.length);
      removed.forEach(annotation => {
        annotation.destroy();
      });
    }
    /**
     * Save annotations as JSON
     */


    toJSON() {
      const view3D = this._view3D;
      const annotations = this._list;
      const items = annotations.map(annotation => {
        var _a, _b;

        return Object.assign(Object.assign({}, annotation.toJSON()), {
          label: ((_b = (_a = annotation.element) === null || _a === void 0 ? void 0 : _a.querySelector(`.${DEFAULT_CLASS.ANNOTATION_TOOLTIP}`)) === null || _b === void 0 ? void 0 : _b.innerHTML) || null
        });
      });
      const size = view3D.renderer.size;
      const aspect = Math.max(size.height / size.width, 1);
      return {
        baseFov: view3D.camera.baseFov,
        baseDistance: view3D.camera.baseDistance,
        aspect,
        items
      };
    }

    _createWrapper() {
      const view3D = this._view3D;
      const wrapper = document.createElement("div");
      wrapper.classList.add(DEFAULT_CLASS.ANNOTATION_WRAPPER);
      view3D.rootEl.appendChild(wrapper);
      return wrapper;
    }

    _createDefaultAnnotationElement(label) {
      const annotation = document.createElement("div");
      annotation.classList.add(DEFAULT_CLASS.ANNOTATION);
      annotation.classList.add(DEFAULT_CLASS.ANNOTATION_DEFAULT);

      if (label) {
        const tooltip = document.createElement("div");
        tooltip.classList.add(DEFAULT_CLASS.ANNOTATION_TOOLTIP);
        tooltip.classList.add(DEFAULT_CLASS.ANNOTATION_DEFAULT);
        tooltip.innerHTML = label;
        annotation.appendChild(tooltip);
      }

      return annotation;
    }

  }

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
      scale = 1,
      disablePitch = false,
      disableYaw = false
    } = {}) {
      super();
      this._screenScale = new THREE.Vector2(0, 0);
      this._prevPos = new THREE.Vector2(0, 0);
      this._isFirstTouch = false;
      this._isScrolling = false;
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

        window.addEventListener(EVENTS.MOUSE_MOVE, this._onMouseMove, false);
        window.addEventListener(EVENTS.MOUSE_UP, this._onMouseUp, false);
        this.trigger(CONTROL_EVENTS.HOLD, {
          inputType: INPUT_TYPE.ROTATE,
          isTouch: false
        });
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

        window.removeEventListener(EVENTS.MOUSE_MOVE, this._onMouseMove, false);
        window.removeEventListener(EVENTS.MOUSE_UP, this._onMouseUp, false);
        this.trigger(CONTROL_EVENTS.RELEASE, {
          inputType: INPUT_TYPE.ROTATE,
          isTouch: false
        });
      };

      this._onTouchStart = evt => {
        const touch = evt.touches[0];
        this._isFirstTouch = true;

        this._prevPos.set(touch.clientX, touch.clientY);

        this.trigger(CONTROL_EVENTS.HOLD, {
          inputType: INPUT_TYPE.ROTATE,
          isTouch: true
        });
      };

      this._onTouchMove = evt => {
        // Only the one finger motion should be considered
        if (evt.touches.length > 1 || this._isScrolling) return;
        const touch = evt.touches[0];
        const scrollable = this._view3D.scrollable;

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

          this.trigger(CONTROL_EVENTS.RELEASE, {
            inputType: INPUT_TYPE.ROTATE,
            isTouch: true
          });
        }

        this._isScrolling = false;
      };

      this._view3D = view3D;
      this._scale = scale;
      this._duration = duration;
      this._easing = easing;
      this._disablePitch = disablePitch;
      this._disableYaw = disableYaw;
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
     * Whether this control is animating the camera
     * @readonly
     * @type {boolean}
     */


    get animating() {
      return this._xMotion.activated || this._yMotion.activated;
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
    /**
     * Disable X-axis(pitch) rotation
     * @type {boolean}
     * @default false
     */


    get disablePitch() {
      return this._disablePitch;
    }
    /**
     * Disable Y-axis(yaw) rotation
     * @type {boolean}
     * @default false
     */


    get disableYaw() {
      return this._disableYaw;
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
      this.reset();
      this.off();
    }
    /**
     * Reset internal values
     * @returns {void}
     */


    reset() {
      this._isFirstTouch = false;
      this._isScrolling = false;
    }
    /**
     * Update control by given deltaTime
     * @param {number} deltaTime Number of milisec to update
     * @returns {void}
     */


    update(deltaTime) {
      const camera = this._view3D.camera;
      const xMotion = this._xMotion;
      const yMotion = this._yMotion;
      const newPose = camera.newPose;
      const yawEnabled = !this._disableYaw;
      const pitchEnabled = !this._disablePitch;
      const delta = new THREE.Vector2(xMotion.update(deltaTime), yMotion.update(deltaTime));

      if (yawEnabled) {
        newPose.yaw += delta.x;
      }

      if (pitchEnabled) {
        newPose.pitch += delta.y;
      }
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
      targetEl.addEventListener(EVENTS.MOUSE_DOWN, this._onMouseDown);
      targetEl.addEventListener(EVENTS.TOUCH_START, this._onTouchStart, {
        passive: true
      });
      targetEl.addEventListener(EVENTS.TOUCH_MOVE, this._onTouchMove, {
        passive: this._view3D.scrollable
      });
      targetEl.addEventListener(EVENTS.TOUCH_END, this._onTouchEnd);
      this._enabled = true;
      this.sync();
      this.trigger(CONTROL_EVENTS.ENABLE, {
        inputType: INPUT_TYPE.ROTATE
      });
    }
    /**
     * Disable this input and remove all event handlers
     * @returns {void}
     */


    disable() {
      if (!this._enabled) return;
      const targetEl = this._view3D.renderer.canvas;
      targetEl.removeEventListener(EVENTS.MOUSE_DOWN, this._onMouseDown);
      window.removeEventListener(EVENTS.MOUSE_MOVE, this._onMouseMove);
      window.removeEventListener(EVENTS.MOUSE_UP, this._onMouseUp);
      targetEl.removeEventListener(EVENTS.TOUCH_START, this._onTouchStart);
      targetEl.removeEventListener(EVENTS.TOUCH_MOVE, this._onTouchMove);
      targetEl.removeEventListener(EVENTS.TOUCH_END, this._onTouchEnd);
      this._enabled = false;
      this.trigger(CONTROL_EVENTS.DISABLE, {
        inputType: INPUT_TYPE.ROTATE
      });
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

        window.addEventListener(EVENTS.MOUSE_MOVE, this._onMouseMove, false);
        window.addEventListener(EVENTS.MOUSE_UP, this._onMouseUp, false);
        window.addEventListener(EVENTS.CONTEXT_MENU, this._onContextMenu, false);
        this.trigger(CONTROL_EVENTS.HOLD, {
          inputType: INPUT_TYPE.TRANSLATE,
          isTouch: false
        });
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

        window.removeEventListener(EVENTS.MOUSE_MOVE, this._onMouseMove, false);
        window.removeEventListener(EVENTS.MOUSE_UP, this._onMouseUp, false);
        this.trigger(CONTROL_EVENTS.RELEASE, {
          inputType: INPUT_TYPE.TRANSLATE,
          isTouch: false
        });
      };

      this._onTouchStart = evt => {
        // Only the two finger motion should be considered
        if (evt.touches.length !== 2) return;

        if (evt.cancelable !== false) {
          evt.preventDefault();
        }

        this._prevPos.copy(this._getTouchesMiddle(evt.touches));

        this._touchInitialized = true;
        this.trigger(CONTROL_EVENTS.HOLD, {
          inputType: INPUT_TYPE.TRANSLATE,
          isTouch: true
        });
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
          if (this._touchInitialized) {
            this._touchInitialized = false;
            this.trigger(CONTROL_EVENTS.RELEASE, {
              inputType: INPUT_TYPE.TRANSLATE,
              isTouch: true
            });
          }

          return;
        } // Three fingers to two fingers


        this._prevPos.copy(this._getTouchesMiddle(evt.touches));

        this._touchInitialized = true;
      };

      this._onContextMenu = evt => {
        evt.preventDefault();
        window.removeEventListener(EVENTS.CONTEXT_MENU, this._onContextMenu, false);
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
     * Whether this control is animating the camera
     * @readonly
     * @type {boolean}
     */


    get animating() {
      return this._xMotion.activated || this._yMotion.activated;
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
      this.reset();
      this.off();
    }
    /**
     * Reset internal values
     * @returns {void}
     */


    reset() {
      this._touchInitialized = false;
    }
    /**
     * Update control by given deltaTime
     * @param {number} deltaTime Number of milisec to update
     * @returns {void}
     */


    update(deltaTime) {
      const camera = this._view3D.camera;
      const newPose = camera.newPose;
      const screenSize = this._screenSize;
      const delta = new THREE.Vector2(this._xMotion.update(deltaTime), this._yMotion.update(deltaTime));
      const viewXDir = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.threeCamera.quaternion);
      const viewYDir = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.threeCamera.quaternion);
      const screenScale = new THREE.Vector2(camera.renderWidth, camera.renderHeight).divide(screenSize);
      delta.multiply(screenScale);
      const newPivot = newPose.pivot.clone();
      newPose.pivot = newPivot.add(viewXDir.multiplyScalar(delta.x)).add(viewYDir.multiplyScalar(delta.y));
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
      targetEl.addEventListener(EVENTS.MOUSE_DOWN, this._onMouseDown, false);
      targetEl.addEventListener(EVENTS.TOUCH_START, this._onTouchStart, {
        passive: false,
        capture: false
      });
      targetEl.addEventListener(EVENTS.TOUCH_MOVE, this._onTouchMove, {
        passive: false,
        capture: false
      });
      targetEl.addEventListener(EVENTS.TOUCH_END, this._onTouchEnd, {
        passive: false,
        capture: false
      });
      this._enabled = true;
      this.sync();
      this.trigger(CONTROL_EVENTS.ENABLE, {
        inputType: INPUT_TYPE.TRANSLATE
      });
    }
    /**
     * Disable this input and remove all event handlers
     * @returns {void}
     */


    disable() {
      if (!this._enabled) return;
      const targetEl = this._view3D.renderer.canvas;
      targetEl.removeEventListener(EVENTS.MOUSE_DOWN, this._onMouseDown, false);
      window.removeEventListener(EVENTS.MOUSE_MOVE, this._onMouseMove, false);
      window.removeEventListener(EVENTS.MOUSE_UP, this._onMouseUp, false);
      targetEl.removeEventListener(EVENTS.TOUCH_START, this._onTouchStart, false);
      targetEl.removeEventListener(EVENTS.TOUCH_MOVE, this._onTouchMove, false);
      targetEl.removeEventListener(EVENTS.TOUCH_END, this._onTouchEnd, false);
      window.removeEventListener(EVENTS.CONTEXT_MENU, this._onContextMenu, false);
      this._enabled = false;
      this.trigger(CONTROL_EVENTS.DISABLE, {
        inputType: INPUT_TYPE.TRANSLATE
      });
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

  class ZoomControl extends Component {
    /**
     * Create new ZoomControl instance
     * @param {View3D} view3D An instance of View3D
     * @param {ZoomControlOptions} [options={}] Options
     */
    constructor(view3D, {
      type = ZOOM_TYPE.FOV,
      scale = 1,
      duration = ANIMATION_DURATION,
      minFov = 1,
      maxFov = AUTO,
      minDistance = 0.1,
      maxDistance = 2,
      easing = EASING$1
    } = {}) {
      super();
      this._scaleModifier = 1;
      this._wheelModifier = 0.02;
      this._touchModifier = 0.05;
      this._prevTouchDistance = -1;
      this._enabled = false;
      this._isFirstTouch = true;
      this._isWheelScrolling = false;

      this._onWheel = evt => {
        const wheelScrollable = this._view3D.wheelScrollable;
        if (evt.deltaY === 0 || wheelScrollable) return;
        evt.preventDefault();
        evt.stopPropagation();
        const motion = this._motion;
        const delta = -this._scale * this._scaleModifier * this._wheelModifier * evt.deltaY;

        if (!this._isWheelScrolling) {
          this.trigger(CONTROL_EVENTS.HOLD, {
            inputType: INPUT_TYPE.ZOOM,
            isTouch: false
          });
        }

        this._isWheelScrolling = true;
        motion.setEndDelta(delta);
      };

      this._onTouchMove = evt => {
        const touches = evt.touches;
        if (touches.length !== 2) return;

        if (evt.cancelable !== false) {
          evt.preventDefault();
        }

        evt.stopPropagation();
        const motion = this._motion;
        const prevTouchDistance = this._prevTouchDistance;
        const touchPoint1 = new THREE.Vector2(touches[0].pageX, touches[0].pageY);
        const touchPoint2 = new THREE.Vector2(touches[1].pageX, touches[1].pageY);
        const touchDiff = touchPoint1.sub(touchPoint2);

        const touchDistance = touchDiff.length() * this._scale * this._scaleModifier * this._touchModifier;

        const delta = this._isFirstTouch ? 0 : touchDistance - prevTouchDistance;
        this._prevTouchDistance = touchDistance;

        if (this._isFirstTouch) {
          this.trigger(CONTROL_EVENTS.HOLD, {
            inputType: INPUT_TYPE.ZOOM,
            isTouch: true
          });
        }

        this._isFirstTouch = false;
        motion.setEndDelta(delta);
      };

      this._onTouchEnd = evt => {
        if (evt.touches.length !== 0) return;
        this.trigger(CONTROL_EVENTS.RELEASE, {
          inputType: INPUT_TYPE.ZOOM,
          isTouch: true
        });
        this._prevTouchDistance = -1;
        this._isFirstTouch = true;
      };

      this._view3D = view3D;
      this._type = type;
      this._scale = scale;
      this._duration = duration;
      this._minFov = minFov;
      this._maxFov = maxFov;
      this._minDistance = minDistance;
      this._maxDistance = maxDistance;
      this._easing = easing;
      this._motion = new Motion({
        duration,
        easing,
        range: {
          min: -Infinity,
          max: Infinity
        }
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
     * Whether this control is animating the camera
     * @readonly
     * @type {boolean}
     */


    get animating() {
      return this._motion.activated;
    }
    /**
     * Currenet fov/distance range
     * @readonly
     * @type {Range}
     */


    get range() {
      return this._motion.range;
    }
    /**
     * Current control type
     * @readonly
     * @see {ZOOM_TYPE}
     * @default "fov"
     */


    get type() {
      return this._type;
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
     * Only available when type is "fov".
     * You can get a bigger image with the smaller value of this.
     * @type {number}
     * @default 1
     */


    get minFov() {
      return this._minFov;
    }
    /**
     * Maximum vertical fov(field of view).
     * Only available when type is "fov".
     * You can get a smaller image with the bigger value of this.
     * If `"auto"` is given, it will use Math.min(default fov + 45, 175).
     * @type {"auto" | number}
     * @default "auto"
     */


    get maxFov() {
      return this._maxFov;
    }
    /**
     * Minimum camera distance. This will be scaled to camera's default distance({@link camera.baseDistance Camera#baseDistance})
     * Only available when type is "distance".
     * @type {number}
     * @default 0.1
     */


    get minDistance() {
      return this._minDistance;
    }
    /**
     * Maximum camera distance. This will be scaled to camera's default distance({@link camera.baseDistance Camera#baseDistance})
     * Only available when type is "distance".
     * @type {number}
     * @default 2
     */


    get maxDistance() {
      return this._maxDistance;
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

    set type(val) {
      this._type = val;
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
      this.reset();
      this.off();
    }
    /**
     * Reset internal values
     * @returns {void}
     */


    reset() {
      this._prevTouchDistance = -1;
      this._isFirstTouch = true;
      this._isWheelScrolling = false;
    }
    /**
     * Update control by given deltaTime
     * @param deltaTime Number of milisec to update
     * @returns {void}
     */


    update(deltaTime) {
      const camera = this._view3D.camera;
      const newPose = camera.newPose;
      const motion = this._motion;
      const prevProgress = motion.progress;
      const delta = motion.update(deltaTime);
      const newProgress = motion.progress;
      newPose.zoom -= delta;

      if (this._isWheelScrolling && prevProgress < 1 && newProgress >= 1) {
        this.trigger(CONTROL_EVENTS.RELEASE, {
          inputType: INPUT_TYPE.ZOOM,
          isTouch: false
        });
        this._isWheelScrolling = false;
      }
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
      targetEl.addEventListener(EVENTS.WHEEL, this._onWheel, {
        passive: false,
        capture: false
      });
      targetEl.addEventListener(EVENTS.TOUCH_MOVE, this._onTouchMove, {
        passive: false,
        capture: false
      });
      targetEl.addEventListener(EVENTS.TOUCH_END, this._onTouchEnd, {
        passive: false,
        capture: false
      });
      this._enabled = true;
      this.sync();
      this.trigger(CONTROL_EVENTS.ENABLE, {
        inputType: INPUT_TYPE.ZOOM
      });
    }
    /**
     * Disable this input and remove all event handlers
     * @returns {void}
     */


    disable() {
      if (!this._enabled) return;
      const targetEl = this._view3D.renderer.canvas;
      targetEl.removeEventListener(EVENTS.WHEEL, this._onWheel, false);
      targetEl.removeEventListener(EVENTS.TOUCH_MOVE, this._onTouchMove, false);
      targetEl.removeEventListener(EVENTS.TOUCH_END, this._onTouchEnd, false);
      this._enabled = false;
      this.trigger(CONTROL_EVENTS.DISABLE, {
        inputType: INPUT_TYPE.ZOOM
      });
    }
    /**
     * Synchronize this control's state to given camera position
     * @returns {void}
     */


    sync() {
      const camera = this._view3D.camera;
      const motion = this._motion;
      motion.reset(-camera.zoom);

      if (this._type === ZOOM_TYPE.FOV) {
        this._scaleModifier = -1;
      } else {
        this._scaleModifier = -camera.baseDistance / 44;
      }
    }
    /**
     * Update fov range by the camera's current fov value
     * @returns {void}
     */


    updateRange() {
      const range = this._motion.range;
      const {
        camera
      } = this._view3D;

      if (this._type === ZOOM_TYPE.FOV) {
        const baseFov = camera.baseFov;
        const maxFov = this._maxFov;
        range.max = maxFov === AUTO ? Math.min(baseFov + 45, 175) - baseFov : maxFov - baseFov;
        range.min = this._minFov - baseFov;
      } else {
        range.max = camera.baseDistance * this._maxDistance - camera.baseDistance;
        range.min = camera.baseDistance * this._minDistance - camera.baseDistance;
      }
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
      this._onEnable = ({
        inputType
      }) => {
        if (inputType === INPUT_TYPE.ZOOM) return;
        const view3D = this._view3D;
        const canvas = view3D.renderer.canvas;
        const shouldSetGrabCursor = view3D.useGrabCursor && (this._rotateControl.enabled || this._translateControl.enabled) && canvas.style.cursor === CURSOR.NONE;

        if (shouldSetGrabCursor) {
          this._setCursor(CURSOR.GRAB);
        }
      };

      this._onDisable = ({
        inputType
      }) => {
        if (inputType === INPUT_TYPE.ZOOM) return;
        const canvas = this._view3D.renderer.canvas;
        const shouldRemoveGrabCursor = canvas.style.cursor !== CURSOR.NONE && !this._rotateControl.enabled && !this._translateControl.enabled;

        if (shouldRemoveGrabCursor) {
          this._setCursor(CURSOR.NONE);
        }
      };

      this._onHold = ({
        inputType,
        isTouch
      }) => {
        const view3D = this._view3D;

        if (inputType !== INPUT_TYPE.ZOOM && !isTouch) {
          const grabCursorEnabled = view3D.useGrabCursor && (this._rotateControl.enabled || this._translateControl.enabled);

          if (grabCursorEnabled) {
            this._setCursor(CURSOR.GRABBING);
          }
        }

        view3D.trigger(EVENTS$1.INPUT_START, {
          type: EVENTS$1.INPUT_START,
          target: view3D,
          inputType
        });
      };

      this._onRelease = ({
        inputType,
        isTouch
      }) => {
        const view3D = this._view3D;

        if (inputType !== INPUT_TYPE.ZOOM && !isTouch) {
          const grabCursorEnabled = view3D.useGrabCursor && (this._rotateControl.enabled || this._translateControl.enabled);

          if (grabCursorEnabled) {
            this._setCursor(CURSOR.GRAB);
          }
        }

        view3D.trigger(EVENTS$1.INPUT_END, {
          type: EVENTS$1.INPUT_END,
          target: view3D,
          inputType
        });
      };

      this._view3D = view3D;
      this._rotateControl = new RotateControl(view3D, getObjectOption(view3D.rotate));
      this._translateControl = new TranslateControl(view3D, getObjectOption(view3D.translate));
      this._zoomControl = new ZoomControl(view3D, getObjectOption(view3D.zoom));
      this._extraControls = [];
      [this._rotateControl, this._translateControl, this._zoomControl].forEach(control => {
        control.on({
          [CONTROL_EVENTS.HOLD]: this._onHold,
          [CONTROL_EVENTS.RELEASE]: this._onRelease,
          [CONTROL_EVENTS.ENABLE]: this._onEnable,
          [CONTROL_EVENTS.DISABLE]: this._onDisable
        });
      });
    } // Internal Values Getter

    /**
     * Rotate(left-click) part of this control
     * @type {RotateControl}
     * @readonly
     */


    get rotate() {
      return this._rotateControl;
    }
    /**
     * Translation(right-click) part of this control
     * @type {TranslateControl}
     * @readonly
     */


    get translate() {
      return this._translateControl;
    }
    /**
     * Zoom(mouse wheel) part of this control
     * @type {ZoomControl}
     * @readonly
     */


    get zoom() {
      return this._zoomControl;
    }
    /**
     * Base controls
     * @type {CameraControl[]}
     * @readonly
     */


    get controls() {
      return [this._rotateControl, this._translateControl, this._zoomControl];
    }
    /**
     * Extra camera controls added, like {@link AnimationControl}
     * @type {CameraControl[]}
     * @readonly
     */


    get extraControls() {
      return this._extraControls;
    }
    /**
     * Whether one of the controls is animating at the moment
     * @type {boolean}
     * @readonly
     */


    get animating() {
      return this._rotateControl.animating || this._translateControl.animating || this._zoomControl.animating || this._extraControls.some(control => control.animating);
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

      this._extraControls.forEach(control => control.destroy());

      this._extraControls = [];
    }
    /**
     * Update control by given deltaTime
     * @param {number} deltaTime Number of milisec to update
     * @returns {void}
     */


    update(deltaTime) {
      this._rotateControl.update(deltaTime);

      this._translateControl.update(deltaTime);

      this._zoomControl.update(deltaTime);

      this._extraControls.forEach(control => control.update(deltaTime));
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

      this._extraControls.forEach(control => control.resize(size));
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

      this._extraControls.forEach(control => control.enable());
    }
    /**
     * Disable this control and remove all event handlers
     * @returns {void}
     */


    disable() {
      this._rotateControl.disable();

      this._translateControl.disable();

      this._zoomControl.disable();

      this._extraControls.forEach(control => control.disable());
    }
    /**
     * Synchronize this control's state to current camera position
     * @returns {void}
     */


    sync() {
      this._rotateControl.sync();

      this._translateControl.sync();

      this._zoomControl.sync();

      this._extraControls.forEach(control => control.sync());
    }
    /**
     * Add extra control
     * @param {CameraControl} control Control to add
     * @returns {void}
     */


    add(control) {
      this._extraControls.push(control);
    }
    /**
     * Remove extra control
     * @param {CameraControl} control Control to add
     * @returns {void}
     */


    remove(control) {
      const extraControls = this._extraControls;
      const controlIdx = extraControls.findIndex(ctrl => ctrl === control);

      if (controlIdx >= 0) {
        extraControls.splice(controlIdx, 1);
      }
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

        window.addEventListener(EVENTS.MOUSE_UP, this._onMouseUp, false);
      };

      this._onMouseUp = () => {
        window.removeEventListener(EVENTS.MOUSE_UP, this._onMouseUp, false);

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
     * Whether autoplay is updating the camera at the moment
     * @readonly
     */


    get animating() {
      return this._enabled && !this._interrupted;
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

      const newPose = this._view3D.camera.newPose;
      newPose.yaw += this._speed * deltaTime / 100;
    }
    /**
     * Enable autoplay and add event listeners
     * @returns {void}
     */


    enable() {
      if (this._enabled) return;
      const targetEl = this._view3D.renderer.canvas;
      targetEl.addEventListener(EVENTS.MOUSE_DOWN, this._onMouseDown, false);
      targetEl.addEventListener(EVENTS.TOUCH_START, this._onTouchStart, {
        passive: false,
        capture: false
      });
      targetEl.addEventListener(EVENTS.TOUCH_END, this._onTouchEnd, {
        passive: false,
        capture: false
      });
      targetEl.addEventListener(EVENTS.MOUSE_ENTER, this._onMouseEnter, false);
      targetEl.addEventListener(EVENTS.MOUSE_LEAVE, this._onMouseLeave, false);
      targetEl.addEventListener(EVENTS.WHEEL, this._onWheel, {
        passive: false,
        capture: false
      });
      this._enabled = true;
    }
    /**
     * Enable autoplay after current delay value
     * @returns {void}
     */


    enableAfterDelay() {
      this.enable();
      this._interrupted = true;

      this._setUninterruptedAfterDelay(this._delay);
    }
    /**
     * Disable this input and remove all event handlers
     * @returns {void}
     */


    disable() {
      if (!this._enabled) return;
      const targetEl = this._view3D.renderer.canvas;
      targetEl.removeEventListener(EVENTS.MOUSE_DOWN, this._onMouseDown, false);
      window.removeEventListener(EVENTS.MOUSE_UP, this._onMouseUp, false);
      targetEl.removeEventListener(EVENTS.TOUCH_START, this._onTouchStart, false);
      targetEl.removeEventListener(EVENTS.TOUCH_END, this._onTouchEnd, false);
      targetEl.removeEventListener(EVENTS.MOUSE_ENTER, this._onMouseEnter, false);
      targetEl.removeEventListener(EVENTS.MOUSE_LEAVE, this._onMouseLeave, false);
      targetEl.removeEventListener(EVENTS.WHEEL, this._onWheel, false);
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
      annotations = [],
      fixSkinnedBbox = false,
      castShadow = true,
      receiveShadow = false
    }) {
      this._src = src;
      const scene = new THREE.Group();
      scene.add(...scenes);
      this._animations = animations;
      this._annotations = annotations;
      this._scene = scene;

      const bbox = this._getInitialBbox(fixSkinnedBbox); // Move to position where bbox.min.y = 0


      const offset = bbox.min.y;
      scene.translateY(-offset);
      scene.updateMatrixWorld();
      bbox.translate(new THREE.Vector3(0, -offset, 0));
      this._fixSkinnedBbox = fixSkinnedBbox;
      this._bbox = bbox;
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
     * {@link Annotation}s included inside the model
     * @readonly
     */


    get annotations() {
      return this._annotations;
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
    /**
     * Executes a user-supplied "reducer" callback function on each vertex of the model, in order, passing in the return value from the calculation on the preceding element.
     */


    reduceVertices(callbackfn, initialVal) {
      const meshes = this.meshes;
      let result = initialVal;
      meshes.forEach(mesh => {
        const {
          position
        } = mesh.geometry.attributes;
        if (!position) return;
        mesh.updateMatrixWorld();

        if (this._fixSkinnedBbox && mesh.isSkinnedMesh) {
          this._forEachSkinnedVertices(mesh, vertex => {
            result = callbackfn(result, vertex);
          });
        } else {
          const posScale = getAttributeScale(position);

          for (let idx = 0; idx < position.count; idx++) {
            const vertex = new THREE.Vector3().fromBufferAttribute(position, idx);

            if (position.normalized) {
              vertex.multiplyScalar(posScale);
            }

            vertex.applyMatrix4(mesh.matrixWorld);
            result = callbackfn(result, vertex);
          }
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

        this._forEachSkinnedVertices(mesh, vertex => bbox.expandByPoint(vertex));
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

      return meshes.sort((a, b) => a.name.localeCompare(b.name));
    }

    _hasSkinnedMesh() {
      return this._getAllMeshes().some(mesh => mesh.isSkinnedMesh);
    }

    _forEachSkinnedVertices(mesh, callback) {
      const geometry = mesh.geometry;
      const positions = geometry.attributes.position;
      const skinWeights = geometry.attributes.skinWeight;
      const skeleton = mesh.skeleton;
      skeleton.update();
      const positionScale = getAttributeScale(positions);
      const skinWeightScale = getAttributeScale(skinWeights);

      for (let posIdx = 0; posIdx < positions.count; posIdx++) {
        const transformed = getSkinnedVertex(posIdx, mesh, positionScale, skinWeightScale);
        callback(transformed);
      }
    }

  }

  /*
   * Copyright (c) 2020 NAVER Corp.
   * egjs projects are licensed under the MIT license
   */
  const dracoLoader = new DRACOLoader.DRACOLoader();
  const ktx2Loader = new KTX2Loader.KTX2Loader();
  /**
   * glTF/glb 3D model loader
   */

  class GLTFLoader extends Loader {
    /**
     * Create a new instance of GLTFLoader
     */
    constructor(view3D) {
      super(view3D);
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
      const loadingContext = createLoadingContext(view3D, url);
      dracoLoader.setDecoderPath(view3D.dracoPath);
      ktx2Loader.setTranscoderPath(view3D.ktxPath);

      if (GLTFLoader.meshoptDecoder) {
        loader.setMeshoptDecoder(GLTFLoader.meshoptDecoder);
      }

      loader.manager = THREE.DefaultLoadingManager;
      return new Promise((resolve, reject) => {
        try {
          loader.load(url, gltf => {
            const model = this._parseToModel(gltf, url);

            resolve(model);
          }, evt => this._onLoadingProgress(evt, url, loadingContext), err => {
            loadingContext.initialized = true;
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
          if (/^data:.*,.*$/i.test(fileURL)) return fileURL;
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
        const loadingContext = createLoadingContext(view3D, gltfURL);
        loader.manager = manager;
        loader.load(gltfURL, gltf => {
          const model = this._parseToModel(gltf, gltfFile.name);

          revokeURLs();
          resolve(model);
        }, evt => this._onLoadingProgress(evt, gltfURL, loadingContext), err => {
          loadingContext.initialized = true;
          revokeURLs();
          reject(err);
        });
      });
    }

    _parseToModel(gltf, src) {
      const view3D = this._view3D;
      const fixSkinnedBbox = view3D.fixSkinnedBbox;
      gltf.scenes.forEach(scene => {
        scene.traverse(obj => {
          obj.frustumCulled = false;
        });
      });
      const maxTextureSize = view3D.renderer.threeRenderer.capabilities.maxTextureSize;
      const meshes = [];
      gltf.scenes.forEach(scene => {
        scene.traverse(obj => {
          if (obj.isMesh) {
            meshes.push(obj);
          }
        });
      });
      const materials = meshes.reduce((allMaterials, mesh) => {
        return [...allMaterials, ...(Array.isArray(mesh.material) ? mesh.material : [mesh.material])];
      }, []);
      const textures = materials.reduce((allTextures, material) => {
        return [...allTextures, ...STANDARD_MAPS.filter(map => material[map]).map(mapName => material[mapName])];
      }, []);
      const associations = gltf.parser.associations;
      const gltfJSON = gltf.parser.json;
      const gltfTextures = textures.filter(texture => associations.has(texture)).map(texture => {
        return gltfJSON.textures[associations.get(texture).textures];
      });
      const texturesByLevel = [...new Set(gltfTextures).values()].reduce((levels, texture, texIdx) => {
        const hasExtension = texture.extensions && texture.extensions[CUSTOM_TEXTURE_LOD_EXTENSION];
        const hasExtra = texture.extras && texture.extras[TEXTURE_LOD_EXTRA];
        if (!hasExtension && !hasExtra) return levels;
        const currentTexture = textures[texIdx];
        const lodLevels = hasExtension ? texture.extensions[CUSTOM_TEXTURE_LOD_EXTENSION].levels : texture.extras[TEXTURE_LOD_EXTRA].levels;
        lodLevels.forEach(({
          index,
          size
        }, level) => {
          if (size > maxTextureSize) return;

          if (!levels[level]) {
            levels[level] = [];
          }

          levels[level].push({
            index,
            texture: currentTexture
          });
        });
        return levels;
      }, []);
      const loaded = texturesByLevel.map(() => false);
      texturesByLevel.forEach((levelTextures, level) => __awaiter(this, void 0, void 0, function* () {
        // Change textures when all texture of the level loaded
        const texturesLoaded = yield Promise.all(levelTextures.map(({
          index
        }) => gltf.parser.getDependency("texture", index)));
        const higherLevelLoaded = loaded.slice(level + 1).some(val => !!val);
        loaded[level] = true;
        if (higherLevelLoaded) return;
        texturesLoaded.forEach((texture, index) => {
          const origTexture = levelTextures[index].texture;
          origTexture.image = texture.image;
          origTexture.needsUpdate = true;
          view3D.renderer.renderSingleFrame();
        });
      }));
      const annotations = [];

      if (gltf.parser.json.extras && gltf.parser.json.extras[ANNOTATION_EXTRA]) {
        const data = gltf.parser.json.extras[ANNOTATION_EXTRA];
        annotations.push(...view3D.annotation.parse(data));
      }

      const model = new Model({
        src,
        scenes: gltf.scenes,
        annotations,
        animations: gltf.animations,
        fixSkinnedBbox
      });
      return model;
    }

  }

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
     * |{@link ERROR_CODES WRONG_TYPE}|When the root is not either string or HTMLElement|
     * |{@link ERROR_CODES ELEMENT_NOT_FOUND}|When the element with given CSS selector does not exist|
     * |{@link ERROR_CODES ELEMENT_NOT_CANVAS}|When the element given is not a \<canvas\> element|
     * |{@link ERROR_CODES WEBGL_NOT_SUPPORTED}|When the browser does not support WebGL|
     */
    constructor(root, {
      src = null,
      iosSrc = null,
      dracoPath = DRACO_DECODER_URL,
      ktxPath = KTX_TRANSCODER_URL,
      meshoptPath = null,
      fixSkinnedBbox = false,
      fov = AUTO,
      center = AUTO,
      yaw = 0,
      pitch = 0,
      initialZoom = 0,
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
      useDefaultEnv = true,
      annotationURL = null,
      annotationWrapper = `.${DEFAULT_CLASS.ANNOTATION_WRAPPER}`,
      annotationSelector = `.${DEFAULT_CLASS.ANNOTATION}`,
      annotationBreakpoints = ANNOTATION_BREAKPOINT,
      webAR = true,
      sceneViewer = true,
      quickLook = true,
      arPriority = AR_PRIORITY,
      poster = null,
      canvasSelector = "canvas",
      autoInit = true,
      autoResize = true,
      useResizeObserver = true,
      maintainSize = false,
      on = {},
      plugins = [],
      maxDeltaTime = 1 / 30
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
      this._initialZoom = initialZoom;
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
      this._useDefaultEnv = useDefaultEnv;
      this._annotationURL = annotationURL;
      this._annotationWrapper = annotationWrapper;
      this._annotationSelector = annotationSelector;
      this._annotationBreakpoints = annotationBreakpoints;
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
      this._maxDeltaTime = maxDeltaTime; // Create internal components

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

      void (() => __awaiter(this, void 0, void 0, function* () {
        yield this._initPlugins(plugins);

        if (src && autoInit) {
          yield this.init();
        }
      }))();
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
    }
    /**
     * {@link AnnotationManager} instance of the View3D
     * @type {AnnotationManager}
     */


    get annotation() {
      return this._annotationManager;
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
    }
    /**
     * An array of loading status of assets.
     * @type {LoadingItem[]}
     * @readonly
     * @internal
     */


    get loadingContext() {
      return this._loadingContext;
    }
    /**
     * Active plugins of view3D
     * @type {View3DPlugin[]}
     * @readonly
     */


    get plugins() {
      return this._plugins;
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
     * Initial zoom value.
     * If `number` is given, positive value will make camera zoomed in and negative value will make camera zoomed out.
     * If `object` is given, it will fit model's bounding box's front / side face to the given ratio of the canvas height / width.
     * For example, `{ axis: "y", ratio: 0.5 }` will set the zoom of the camera so that the height of the model to 50% of the height of the canvas.
     * @type {number}
     * @default 0
     */


    get initialZoom() {
      return this._initialZoom;
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
     * Apply blur to the current skybox image.
     * @type {boolean}
     * @default false
     */


    get skyboxBlur() {
      return this._skyboxBlur;
    }
    /**
     * This is used to approximate the appearance of high dynamic range (HDR) on the low dynamic range medium of a standard computer monitor or mobile device's screen.
     * @type {number}
     * @see TONE_MAPPING
     * @default THREE.LinearToneMapping
     */


    get toneMapping() {
      return this._toneMapping;
    }
    /**
     *
     * @type {boolean}
     * @default true
     */


    get useDefaultEnv() {
      return this._useDefaultEnv;
    }
    /**
     * An URL to the JSON file that has annotation informations.
     * @type {string | null}
     * @default null
     */


    get annotationURL() {
      return this._annotationURL;
    }
    /**
     * An element or CSS selector of the annotation wrapper element.
     * @type {HTMLElement | string}
     * @default ".view3d-annotation-wrapper"
     */


    get annotationWrapper() {
      return this._annotationWrapper;
    }
    /**
     * CSS selector of the annotation elements inside the root element
     * @type {string}
     * @default ".view3d-annotation"
     */


    get annotationSelector() {
      return this._annotationSelector;
    }
    /**
     * Breakpoints for the annotation opacity, mapped by degree between (camera-model center-annotation) as key.
     * @type {Record<number, number>}
     * @default { 165: 0, 135: 0.4, 0: 1 }
     */


    get annotationBreakpoints() {
      return this._annotationBreakpoints;
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
     * Poster image that will be displayed before the 3D model is loaded.
     * If `string` URL is given, View3D will temporarily show poster image element with that url as src before the first model is loaded
     * If `string` CSS selector of DOM element inside view3d-wrapper or `HTMLElement` is given, View3D will remove that element after the first model is loaded
     * @type {string | HTMLElement | null}
     * @default null
     */


    get poster() {
      return this._poster;
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
    /**
     * Whether to retain 3D model's visual size on canvas resize
     * @type {boolean}
     * @default false
     */


    get maintainSize() {
      return this._maintainSize;
    }
    /**
     * Maximum delta time in any given frame
     * This can prevent a long frame hitch / lag
     * The default value is 1/30(30 fps). Set this value to `Infinity` to disable
     * @type {number}
     * @default 1/30
     */


    get maxDeltaTime() {
      return this._maxDeltaTime;
    }

    set initialZoom(val) {
      this._initialZoom = val;
    }

    set skybox(val) {
      void this._scene.setSkybox(val);
      this._skybox = val;

      if (!val && this._useDefaultEnv) {
        this._scene.setDefaultEnv();
      }
    }

    set envmap(val) {
      void this._scene.setEnvMap(val);
      this._envmap = val;

      if (!val && this._useDefaultEnv) {
        this._scene.setDefaultEnv();
      }
    }

    set exposure(val) {
      this._exposure = val;
      this._renderer.threeRenderer.toneMappingExposure = val;

      this._renderer.renderSingleFrame();
    }

    set skyboxBlur(val) {
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

    set toneMapping(val) {
      this._toneMapping = val;
      this._renderer.threeRenderer.toneMapping = val;

      this._renderer.renderSingleFrame();
    }

    set useGrabCursor(val) {
      this._useGrabCursor = val;

      this._control.updateCursor();
    }

    set autoResize(val) {
      this._autoResize = val;

      if (val) {
        this._autoResizer.enable();
      } else {
        this._autoResizer.disable();
      }
    }

    set maintainSize(val) {
      this._maintainSize = val;
    }

    set maxDeltaTime(val) {
      this._maxDeltaTime = val;
    }
    /**
     * Destroy View3D instance and remove all events attached to it
     * @returns {void}
     */


    destroy() {
      this._scene.reset();

      this._renderer.destroy();

      this._control.destroy();

      this._autoResizer.disable();

      this._animator.reset();

      this._annotationManager.destroy();

      this._plugins.forEach(plugin => plugin.teardown(this));

      this._plugins = [];
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

        const scene = this._scene;
        const renderer = this._renderer;
        const control = this._control;
        const annotationManager = this._annotationManager;
        const meshoptPath = this._meshoptPath;
        const tasks = [];
        this.resize();
        annotationManager.init();

        if (this._autoResize) {
          this._autoResizer.enable();
        }

        if (meshoptPath && !GLTFLoader.meshoptDecoder) {
          yield GLTFLoader.setMeshoptDecoder(meshoptPath);
        } // Load & set skybox / envmap before displaying model


        tasks.push(...scene.initTextures());

        const loadModel = this._loadModel(this._src);

        tasks.push(...loadModel);
        void this._resetLoadingContextOnFinish(tasks);
        yield Promise.race(loadModel);

        if (this._annotationURL) {
          yield this._annotationManager.load(this._annotationURL);
        }

        control.enable();

        if (this._autoplay) {
          this._autoPlayer.enable();
        } // Start rendering


        renderer.stopAnimationLoop();
        renderer.setAnimationLoop(renderer.defaultRenderLoop);
        renderer.renderSingleFrame();
        this._initialized = true;
        this.trigger(EVENTS$1.READY, {
          type: EVENTS$1.READY,
          target: this
        });
      });
    }
    /**
     * Resize View3D instance to fit current canvas size
     * @returns {void}
     */


    resize() {
      const renderer = this._renderer;
      const prevSize = this._initialized ? renderer.size : null;
      renderer.resize();
      const newSize = renderer.size;

      this._camera.resize(newSize, prevSize);

      this._control.resize(newSize);

      this._annotationManager.resize(); // Prevent flickering on resize


      renderer.renderSingleFrame(true);
      this.trigger(EVENTS$1.RESIZE, Object.assign(Object.assign({}, newSize), {
        type: EVENTS$1.RESIZE,
        target: this
      }));
    }
    /**
     * Load a new 3D model and replace it with the current one
     * @param {string | string[]} src Source URL to fetch 3D model from
     */


    load(src) {
      return __awaiter(this, void 0, void 0, function* () {
        if (this._initialized) {
          const loadModel = this._loadModel(src);

          void this._resetLoadingContextOnFinish(loadModel);
          yield Promise.race(loadModel); // Change the src later as an error can occur while loading the model

          this._src = src;
        } else {
          this._src = src;
          yield this.init();
        }
      });
    }
    /**
     * Display the given model in the canvas
     * @param {Model} model A model to display
     * @param {object} options Options for displaying model
     * @param {boolean} [options.resetCamera=true] Reset camera to default pose
     */


    display(model, {
      resetCamera = true
    } = {}) {
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
        camera.fit(model, this._center);
        void camera.reset(0);
      }

      animator.reset();
      animator.setClips(model.animations);

      if (model.animations.length > 0) {
        animator.play(0);
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

      renderer.renderSingleFrame();
      this.trigger(EVENTS$1.MODEL_CHANGE, {
        type: EVENTS$1.MODEL_CHANGE,
        target: this,
        model
      });
    }
    /**
     * Add new plugins to View3D
     * @param {View3DPlugin[]} plugins Plugins to add
     * @returns {Promise<void>} A promise that resolves when all plugins are initialized
     */


    loadPlugins(...plugins) {
      return __awaiter(this, void 0, void 0, function* () {
        yield this._initPlugins(plugins);

        this._plugins.push(...plugins);
      });
    }
    /**
     * Remove plugins from View3D
     * @param {View3DPlugin[]} plugins Plugins to remove
     * @returns {Promise<void>} A promise that resolves when all plugins are removed
     */


    removePlugins(...plugins) {
      return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(plugins.map(plugin => plugin.teardown(this)));
        plugins.forEach(plugin => {
          const pluginIdx = this._plugins.indexOf(plugin);

          if (pluginIdx < 0) return;

          this._plugins.splice(pluginIdx, 1);
        });
      });
    }
    /**
     * Take a screenshot of current rendered canvas image and download it
     */


    screenshot(fileName = "screenshot") {
      const canvas = this._renderer.canvas;
      const imgURL = canvas.toDataURL("png");
      const anchorEl = document.createElement("a");
      anchorEl.href = imgURL;
      anchorEl.download = fileName;
      anchorEl.click();
    }

    _loadModel(src) {
      const loader = new GLTFLoader(this);

      if (Array.isArray(src)) {
        const loaded = src.map(() => false);
        const loadModels = src.map((srcLevel, level) => this._loadSingleModel(loader, srcLevel, level, loaded));
        return loadModels;
      } else {
        return [this._loadSingleModel(loader, src, 0, [false])];
      }
    }

    _loadSingleModel(loader, src, level, loaded) {
      return __awaiter(this, void 0, void 0, function* () {
        const maxLevel = loaded.length - 1;
        this.trigger(EVENTS$1.LOAD_START, {
          type: EVENTS$1.LOAD_START,
          target: this,
          src,
          level,
          maxLevel
        });

        try {
          const model = yield loader.load(src);
          const higherLevelLoaded = loaded.slice(level + 1).some(val => !!val);
          const modelLoadedBefore = loaded.some(val => !!val);
          this.trigger(EVENTS$1.LOAD, {
            type: EVENTS$1.LOAD,
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
          this.trigger(EVENTS$1.LOAD_ERROR, {
            type: EVENTS$1.LOAD_ERROR,
            target: this,
            level,
            maxLevel,
            error
          });
          throw new View3DError(ERROR.MESSAGES.MODEL_FAIL_TO_LOAD(src), ERROR.CODES.MODEL_FAIL_TO_LOAD);
        }
      });
    }

    _addEventHandlers(events) {
      Object.keys(events).forEach(evtName => {
        this.on(evtName, events[evtName]);
      });
    }

    _addPosterImage() {
      const poster = this._poster;
      const rootEl = this._rootEl;
      if (!poster) return;
      const isPosterEl = isElement(poster);
      let posterEl;

      if (isPosterEl || isCSSSelector(poster)) {
        const elCandidate = isPosterEl ? poster : rootEl.querySelector(poster);

        if (!elCandidate) {
          throw new View3DError(ERROR.MESSAGES.ELEMENT_NOT_FOUND(poster), ERROR.CODES.ELEMENT_NOT_FOUND);
        }

        posterEl = elCandidate;
      } else {
        const imgEl = document.createElement("img");
        imgEl.className = DEFAULT_CLASS.POSTER;
        imgEl.src = poster;
        rootEl.appendChild(imgEl);
        posterEl = imgEl;
        this.once(EVENTS$1.READY, () => {
          if (imgEl.parentElement !== rootEl) return;
          rootEl.removeChild(imgEl);
        });
      }

      this.once(EVENTS$1.READY, () => {
        if (!posterEl.parentElement) return; // Remove that element from the parent element

        posterEl.parentElement.removeChild(posterEl);
      });
    }

    _initPlugins(plugins) {
      return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(plugins.map(plugin => plugin.init(this)));
      });
    }

    _resetLoadingContextOnFinish(tasks) {
      return __awaiter(this, void 0, void 0, function* () {
        void Promise.all(tasks).then(() => {
          this.trigger(EVENTS$1.LOAD_FINISH, {
            type: EVENTS$1.LOAD_FINISH,
            target: this
          });
          this._loadingContext = [];
        });
      });
    }

  }
  /**
   * Current version of the View3D
   * @type {string}
   * @readonly
   */


  View3D.VERSION = "2.4.2";

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

  class ARButton {
    /**
     * Create new instance of ARButton
     * @param {object} [options={}] Options for the ARButton
     * @param {string} [options.availableText="View in AR"] A text that will be shown on mouse hover when it's available to enter the AR session.
     * @param {string} [options.unavailableText="AR is not available in this browser"] A text that will be shown on mouse hover when it's not available to enter the AR session.
     * @param {string} [options.buttonClass="view3d-ar-button"] A class that will be applied to the button element.
     * @param {string} [options.tooltipClass="view3d-tooltip"] A class that will be applied to the tooltip element.
     */
    constructor(options = {}) {
      this._options = options;
      this._button = null;
    }

    init(view3D) {
      return __awaiter(this, void 0, void 0, function* () {
        yield this._addButton(view3D);
      });
    }

    teardown(view3D) {
      const button = this._button;
      if (!button) return;

      if (button.parentElement === view3D.rootEl) {
        view3D.rootEl.removeChild(button);
      }

      this._button = null;
    }

    _addButton(view3D) {
      return __awaiter(this, void 0, void 0, function* () {
        const {
          availableText = "View in AR",
          unavailableText = "AR is not available in this browser",
          buttonClass = "view3d-ar-button",
          tooltipClass = "view3d-tooltip"
        } = this._options;
        const arAvailable = yield view3D.ar.isAvailable();
        const button = document.createElement("button");
        const tooltip = document.createElement("div");
        const tooltipText = document.createTextNode(arAvailable ? availableText : unavailableText);
        button.classList.add(buttonClass);
        tooltip.classList.add(tooltipClass);
        button.disabled = true;
        button.innerHTML = ARIcon;
        button.appendChild(tooltip);
        tooltip.appendChild(tooltipText);
        view3D.rootEl.appendChild(button);
        this._button = button;

        if (view3D.initialized) {
          yield this._setAvailable(view3D, button, arAvailable);
        } else {
          view3D.once(EVENTS$1.MODEL_CHANGE, () => {
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

  class AROverlay {
    /**
     * Create new instance of AROverlay
     * @param {object} [options={}] Options for the AROverlay
     */
    constructor(options = {}) {
      this._options = options;
    }

    init(view3D) {
      return __awaiter(this, void 0, void 0, function* () {
        view3D.on(EVENTS$1.AR_START, ({
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
          view3D.once(EVENTS$1.AR_END, () => {
            if (closeButton.parentElement) {
              closeButton.parentElement.removeChild(closeButton);
            }

            closeButton.removeEventListener("click", closeButtonHandler);
          });
        });
      });
    }

    teardown() {// DO NOTHING
    }

  }

  /**
   * A plugin that displays loading bar while
   */

  class LoadingBar {
    /**
     * Create new instance of Spinner
     * @param {LoadingBarOptions} [options={}] Options for the Spinner
     */
    constructor(options = {}) {
      this._startLoading = ({
        target: view3D,
        level
      }) => {
        if (level !== 0) return;
        const {
          type = "default",
          loadingLabel = "Loading 3D Model...",
          parsingLabel = "Parsing 3D Model...",
          labelColor = "#ffffff",
          barWidth = "70%",
          barHeight = "10px",
          barBackground = "#bbbbbb",
          barForeground = "#3e8ed0",
          spinnerWidth = "30%",
          overlayBackground = "rgba(0, 0, 0, 0.3)"
        } = this._options;
        const loadingOverlay = document.createElement("div");
        const loadingWrapper = document.createElement("div");
        const loadingLabelEl = document.createElement("div");
        const loadingBar = document.createElement("div");
        const loadingFiller = document.createElement("div");
        loadingOverlay.classList.add("view3d-lb-overlay");
        loadingWrapper.classList.add("view3d-lb-wrapper");
        loadingBar.classList.add("view3d-lb-base");
        loadingLabelEl.classList.add("view3d-lb-label");
        loadingFiller.classList.add("view3d-lb-filler");
        loadingOverlay.style.backgroundColor = overlayBackground;

        if (type !== LoadingBar.TYPE.SPINNER) {
          loadingBar.style.height = barHeight;
          loadingBar.style.backgroundColor = barBackground;
          loadingFiller.style.backgroundColor = barForeground;
        } else {
          loadingBar.classList.add("type-spinner");
          loadingBar.style.width = spinnerWidth;
          loadingBar.style.paddingTop = spinnerWidth;
          loadingFiller.style.borderWidth = barHeight;
          loadingFiller.style.borderColor = barForeground;
          loadingFiller.style.borderLeftColor = "transparent";
        }

        if (type === LoadingBar.TYPE.TOP) {
          loadingOverlay.classList.add("type-top");
        } else if (type === LoadingBar.TYPE.DEFAULT) {
          loadingBar.style.width = barWidth;
        }

        loadingLabelEl.style.color = labelColor;
        loadingLabelEl.innerText = loadingLabel;
        loadingBar.appendChild(loadingFiller);
        loadingWrapper.appendChild(loadingBar);
        loadingWrapper.appendChild(loadingLabelEl);
        loadingOverlay.appendChild(loadingWrapper);
        view3D.rootEl.appendChild(loadingOverlay);

        if (type !== LoadingBar.TYPE.SPINNER) {
          const onProgress = () => {
            if (!view3D.loadingContext.every(ctx => ctx.initialized)) return;
            const [loaded, total] = view3D.loadingContext.filter(ctx => ctx.lengthComputable).reduce((values, ctx) => {
              values[0] += ctx.loaded;
              values[1] += ctx.total;
              return values;
            }, [0, 0]);
            if (total <= 0) return;
            const percentage = 100 * (loaded / total);
            loadingFiller.style.width = `${percentage.toFixed(2)}%`;

            if (loaded === total) {
              loadingLabelEl.innerText = parsingLabel;
            }
          };

          view3D.on(EVENTS$1.PROGRESS, onProgress);
          view3D.once(EVENTS$1.LOAD_FINISH, () => {
            view3D.off(EVENTS$1.PROGRESS, onProgress);
          });
        }

        view3D.once(EVENTS$1.LOAD_FINISH, () => {
          this._removeOverlay(view3D);
        });
        this._overlay = loadingOverlay;
      };

      this._options = options;
    }

    init(view3D) {
      return __awaiter(this, void 0, void 0, function* () {
        view3D.on(EVENTS$1.LOAD_START, this._startLoading);
      });
    }

    teardown(view3D) {
      view3D.off(EVENTS$1.LOAD_START, this._startLoading);

      this._removeOverlay(view3D);
    }

    _removeOverlay(view3D) {
      const overlay = this._overlay;
      if (!overlay) return;

      if (overlay.parentElement === view3D.rootEl) {
        view3D.rootEl.removeChild(overlay);
      }

      this._overlay = null;
    }

  }
  /**
   * Available styles of loading bar
   */


  LoadingBar.TYPE = {
    DEFAULT: "default",
    TOP: "top",
    SPINNER: "spinner"
  };

  /*
   * Copyright (c) 2020 NAVER Corp.
   * egjs projects are licensed under the MIT license
   */

  /**
   * Check whether View3D can be initialized without any issues.
   * View3D supports browsers with es6+ support.
   * @param {object} [features={}] Features to test
   * @returns {boolean} A boolean value indicating whether View3D is avilable
   */
  const isAvailable = ({
    webGL = true,
    fetch = true,
    stream = true,
    wasm = true
  } = {}) => {
    if (webGL) {
      const webglAvailable = checkWebGLAvailability();
      if (!webglAvailable) return false;
    }

    if (fetch) {
      const fetchAvailable = window && window.fetch;
      if (!fetchAvailable) return false;
    }

    if (stream) {
      const streamAvailable = window && window.ReadableStream;
      if (!streamAvailable) return false;
    }

    if (wasm) {
      const wasmAvailable = checkWASMAvailability();
      if (!wasmAvailable) return false;
    }

    return true;
  };

  const checkWebGLAvailability = () => {
    try {
      const canvas = document.createElement("canvas");
      return !!window.WebGLRenderingContext && !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch (e) {
      return false;
    }
  };

  const checkWASMAvailability = () => {
    try {
      if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
        const wasmModule = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));

        if (wasmModule instanceof WebAssembly.Module) {
          return new WebAssembly.Instance(wasmModule) instanceof WebAssembly.Instance;
        }
      }
    } catch (e) {
      return false;
    }
  };

  /*
   * Copyright (c) 2020 NAVER Corp.
   * egjs projects are licensed under the MIT license
   */

  var modules = {
    __proto__: null,
    'default': View3D,
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
    Skybox: Skybox,
    View3DError: View3DError,
    Annotation: Annotation,
    PointAnnotation: PointAnnotation,
    FaceAnnotation: FaceAnnotation,
    AnnotationManager: AnnotationManager,
    AnimationControl: AnimationControl,
    OrbitControl: OrbitControl,
    RotateControl: RotateControl,
    TranslateControl: TranslateControl,
    ZoomControl: ZoomControl,
    GLTFLoader: GLTFLoader,
    TextureLoader: TextureLoader,
    ARButton: ARButton,
    AROverlay: AROverlay,
    LoadingBar: LoadingBar,
    AUTO: AUTO,
    EVENTS: EVENTS$1,
    EASING: EASING,
    DEFAULT_CLASS: DEFAULT_CLASS,
    TONE_MAPPING: TONE_MAPPING,
    ZOOM_TYPE: ZOOM_TYPE,
    AR_SESSION_TYPE: AR_SESSION_TYPE,
    SCENE_VIEWER_MODE: SCENE_VIEWER_MODE,
    QUICK_LOOK_APPLE_PAY_BUTTON_TYPE: QUICK_LOOK_APPLE_PAY_BUTTON_TYPE,
    QUICK_LOOK_CUSTOM_BANNER_SIZE: QUICK_LOOK_CUSTOM_BANNER_SIZE,
    INPUT_TYPE: INPUT_TYPE,
    ERROR_CODES: ERROR_CODES,
    isAvailable: isAvailable
  };

  /*
   * Copyright (c) 2020 NAVER Corp.
   * egjs projects are licensed under the MIT license
   */
  merge(View3D, modules);

  return View3D;

})));
