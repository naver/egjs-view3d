/*
Copyright (c) 2020-present NAVER Corp.
name: @egjs/view3d
license: MIT
author: NAVER Corp.
repository: https://github.com/naver/egjs-view3d
version: 1.1.0-snapshot
*/
import { Vector2, PCFSoftShadowMap, WebGLRenderer, sRGBEncoding, Clock, Vector3, Scene as Scene$1, Group, PerspectiveCamera, AnimationMixer, Box3, Matrix4, Object3D, Vector4, LoadingManager, PointsMaterial, MeshStandardMaterial, Points, Mesh, DirectionalLight, Quaternion, Euler, PlaneGeometry, ShadowMaterial, FileLoader, LoaderUtils, Color, AmbientLight, TextureLoader as TextureLoader$1, CubeTextureLoader, WebGLCubeRenderTarget, RingGeometry, MeshBasicMaterial, DoubleSide, BufferGeometry, LineBasicMaterial, Line, Ray, Plane, CanvasTexture, CircleGeometry, Geometry, Sphere, CylinderBufferGeometry, Texture } from 'three';
import * as THREE from 'three';
export { THREE };
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader as GLTFLoader$1 } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};
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
function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
}

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

var EventEmitter =
/*#__PURE__*/
function () {
  function EventEmitter() {
    this._listenerMap = {};
  }

  var __proto = EventEmitter.prototype;

  __proto.on = function (eventName, callback) {
    var listenerMap = this._listenerMap;
    var listeners = listenerMap[eventName];

    if (listeners && listeners.indexOf(callback) < 0) {
      listeners.push(callback);
    } else {
      listenerMap[eventName] = [callback];
    }

    return this;
  };

  __proto.once = function (eventName, callback) {

    var listenerMap = this._listenerMap;
    var listeners = listenerMap[eventName];

    if (listeners && listeners.indexOf(callback) < 0) {
      listeners.push(callback);
    } else {
      listenerMap[eventName] = [callback];
    }

    return this;
  };

  __proto.off = function (eventName, callback) {
    var listenerMap = this._listenerMap;

    if (!eventName) {
      this._listenerMap = {};
      return this;
    }

    if (!callback) {
      delete listenerMap[eventName];
      return this;
    }

    var listeners = listenerMap[eventName];

    if (listeners) {
      var callbackIdx = listeners.indexOf(callback);

      if (callbackIdx >= 0) {
        listeners.splice(callbackIdx, 1);
      }
    }

    return this;
  };

  __proto.emit = function (eventName) {
    var event = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      event[_i - 1] = arguments[_i];
    }

    var listeners = this._listenerMap[eventName];

    if (listeners) {
      listeners.forEach(function (callback) {
        callback.apply(void 0, __spread(event));
      });
    }

    return this;
  };

  return EventEmitter;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Renderer that renders View3D's Scene
 * @category Core
 */

var Renderer =
/*#__PURE__*/
function () {
  /**
   * Create new Renderer instance
   * @param canvas \<canvas\> element to render 3d model
   */
  function Renderer(canvas) {
    this._canvas = canvas;
    this._renderer = new WebGLRenderer({
      canvas: this._canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this._renderer.xr.enabled = true;
    this._renderer.outputEncoding = sRGBEncoding;
    this._clock = new Clock(false);
    this.enableShadow();
  }

  var __proto = Renderer.prototype;
  Object.defineProperty(__proto, "canvas", {
    /**
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement HTMLCanvasElement} given when creating View3D instance
     * @type HTMLCanvasElement
     * @readonly
     */
    get: function () {
      return this._canvas;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "context", {
    /**
     * Current {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext WebGLRenderingContext}
     * @type WebGLRenderingContext
     * @readonly
     */
    get: function () {
      return this._renderer.context;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "size", {
    /**
     * The width and height of the renderer's output canvas
     * @see https://threejs.org/docs/#api/en/math/Vector2
     * @type THREE.Vector2
     */
    get: function () {
      return this._renderer.getSize(new Vector2());
    },
    set: function (val) {
      this._renderer.setSize(val.x, val.y, false);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "threeRenderer", {
    /**
     * Three.js {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer WebGLRenderer} instance
     * @type THREE.WebGLRenderer
     * @readonly
     */
    get: function () {
      return this._renderer;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Resize the renderer based on current canvas width / height
   * @returns {void} Nothing
   */

  __proto.resize = function () {
    var renderer = this._renderer;
    var canvas = this._canvas;
    if (renderer.xr.isPresenting) return;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);
  };
  /**
   * Render a scene using a camera.
   * @see https://threejs.org/docs/#api/en/renderers/WebGLRenderer.render
   * @param scene {@link Scene} to render
   * @param camera {@link Camera} to render
   */


  __proto.render = function (scene, camera) {
    this._renderer.render(scene.root, camera.threeCamera);
  };

  __proto.setAnimationLoop = function (callback) {
    var _this = this;

    this._clock.start();

    this._renderer.setAnimationLoop(function (timestamp, frame) {
      var delta = _this._clock.getDelta();

      callback(delta, frame);
    });
  };

  __proto.stopAnimationLoop = function () {
    this._clock.stop(); // See https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setAnimationLoop


    this._renderer.setAnimationLoop(null);
  };
  /**
   * Enable shadow map
   */


  __proto.enableShadow = function () {
    var threeRenderer = this._renderer;
    threeRenderer.shadowMap.enabled = true;
    threeRenderer.shadowMap.type = PCFSoftShadowMap;
  };
  /**
   * Disable shadow map
   */


  __proto.disableShadow = function () {
    var threeRenderer = this._renderer;
    threeRenderer.shadowMap.enabled = false;
  };

  return Renderer;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
// Constants that used internally
// Texture map names that used in THREE#MeshStandardMaterial
var STANDARD_MAPS = ["alphaMap", "aoMap", "bumpMap", "displacementMap", "emissiveMap", "envMap", "lightMap", "map", "metalnessMap", "normalMap", "roughnessMap"];

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

var View3DError =
/*#__PURE__*/
function (_super) {
  __extends(View3DError, _super);

  function View3DError(message, code) {
    var _this = _super.call(this, message) || this;

    _this.message = message;
    _this.code = code;
    Object.setPrototypeOf(_this, View3DError.prototype);
    _this.name = "View3DError";
    return _this;
  }

  return View3DError;
}(Error);

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/**
 * Error codes of {@link View3DError}
 * @name ERROR_CODES
 * @memberof Constants
 * @type object
 * @property {number} WRONG_TYPE 0
 * @property {number} ELEMENT_NOT_FOUND 1
 * @property {number} CANVAS_NOT_FOUND 2
 * @property {number} WEBGL_NOT_SUPPORTED 3
 * @property {number} ADD_CONTROL_FIRST 4
 * @property {number} PROVIDE_WIDTH_OR_HEIGHT 5
 */
var CODES = {
  WRONG_TYPE: 0,
  ELEMENT_NOT_FOUND: 1,
  ELEMENT_NOT_CANVAS: 2,
  WEBGL_NOT_SUPPORTED: 3,
  ADD_CONTROL_FIRST: 4,
  PROVIDE_WIDTH_OR_HEIGHT: 5
};
var MESSAGES = {
  WRONG_TYPE: function (val, types) {
    return typeof val + " is not a " + types.map(function (type) {
      return "\"" + type + "\"";
    }).join(" or ") + ".";
  },
  ELEMENT_NOT_FOUND: function (query) {
    return "Element with selector \"" + query + "\" not found.";
  },
  ELEMENT_NOT_CANVAS: function (el) {
    return "Given element <" + el.tagName + "> is not a canvas.";
  },
  WEBGL_NOT_SUPPORTED: "WebGL is not supported on this browser.",
  ADD_CONTROL_FIRST: "Control is enabled before setting a target element.",
  PROVIDE_WIDTH_OR_HEIGHT: "Either width or height should be given."
};

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
function getElement(el, parent) {
  var targetEl = null;

  if (typeof el === "string") {
    var parentEl = parent ? parent : document;
    var queryResult = parentEl.querySelector(el);

    if (!queryResult) {
      throw new View3DError(MESSAGES.ELEMENT_NOT_FOUND(el), CODES.ELEMENT_NOT_FOUND);
    }

    targetEl = queryResult;
  } else if (el && el.nodeType === Node.ELEMENT_NODE) {
    targetEl = el;
  }

  return targetEl;
}
function getCanvas(el) {
  var targetEl = getElement(el);

  if (!targetEl) {
    throw new View3DError(MESSAGES.WRONG_TYPE(el, ["HTMLElement", "string"]), CODES.WRONG_TYPE);
  }

  if (!/^canvas$/i.test(targetEl.tagName)) {
    throw new View3DError(MESSAGES.ELEMENT_NOT_CANVAS(targetEl), CODES.ELEMENT_NOT_CANVAS);
  }

  return targetEl;
}
function range(end) {
  if (!end || end <= 0) {
    return [];
  }

  return Array.apply(0, Array(end)).map(function (undef, idx) {
    return idx;
  });
}
function toRadian(x) {
  return x * Math.PI / 180;
}
function clamp(x, min, max) {
  return Math.max(Math.min(x, max), min);
}
function findIndex(target, list) {
  var e_1, _a;

  var index = -1;

  try {
    for (var _b = __values(range(list.length)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var itemIndex = _c.value;

      if (list[itemIndex] === target) {
        index = itemIndex;
        break;
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return index;
} // Linear interpolation between a and b

function mix(a, b, t) {
  return a * (1 - t) + b * t;
}
function circulate(val, min, max) {
  var size = Math.abs(max - min);

  if (val < min) {
    var offset = (min - val) % size;
    val = max - offset;
  } else if (val > max) {
    var offset = (val - max) % size;
    val = min + offset;
  }

  return val;
}
function merge(target) {
  var srcs = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    srcs[_i - 1] = arguments[_i];
  }

  srcs.forEach(function (source) {
    Object.keys(source).forEach(function (key) {
      var value = source[key];

      if (Array.isArray(target[key]) && Array.isArray(value)) {
        target[key] = __spread(target[key], value);
      } else {
        target[key] = value;
      }
    });
  });
  return target;
}
function getBoxPoints(box) {
  return [box.min.clone(), new Vector3(box.min.x, box.min.y, box.max.z), new Vector3(box.min.x, box.max.y, box.min.z), new Vector3(box.min.x, box.max.y, box.max.z), new Vector3(box.max.x, box.min.y, box.min.z), new Vector3(box.max.x, box.min.y, box.max.z), new Vector3(box.max.x, box.max.y, box.min.z), box.max.clone()];
}
function toPowerOfTwo(val) {
  var result = 1;

  while (result < val) {
    result *= 2;
  }

  return result;
}
function getPrimaryAxisIndex(basis, viewDir) {
  var primaryIdx = 0;
  var maxDot = 0;
  basis.forEach(function (axes, axesIdx) {
    var dotProduct = Math.abs(viewDir.dot(axes));

    if (dotProduct > maxDot) {
      primaryIdx = axesIdx;
      maxDot = dotProduct;
    }
  });
  return primaryIdx;
} // In radian

function getRotationAngle(center, v1, v2) {
  var centerToV1 = new Vector2().subVectors(v1, center).normalize();
  var centerToV2 = new Vector2().subVectors(v2, center).normalize(); // Get the rotation angle with the model's NDC coordinates as the center.

  var deg = centerToV2.angle() - centerToV1.angle();
  var compDeg = -Math.sign(deg) * (2 * Math.PI - Math.abs(deg)); // Take the smaller deg

  var rotationAngle = Math.abs(deg) < Math.abs(compDeg) ? deg : compDeg;
  return rotationAngle;
}

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Scene that View3D will render.
 * All model datas including Mesh, Lights, etc. will be included on this
 * @category Core
 */

var Scene =
/*#__PURE__*/
function () {
  /**
   * Create new Scene instance
   */
  function Scene() {
    this._root = new Scene$1();
    this._userObjects = new Group();
    this._envObjects = new Group();
    this._envs = [];
    var root = this._root;
    var userObjects = this._userObjects;
    var envObjects = this._envObjects;
    userObjects.name = "userObjects";
    envObjects.name = "envObjects";
    root.add(userObjects);
    root.add(envObjects);
  }

  var __proto = Scene.prototype;
  Object.defineProperty(__proto, "root", {
    /**
     * Root {@link https://threejs.org/docs/#api/en/scenes/Scene THREE.Scene} object
     */
    get: function () {
      return this._root;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "environments", {
    /**
     * {@link Environment}s inside scene
     */
    get: function () {
      return this._envs;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "visible", {
    /**
     * Return the visibility of the root scene
     */
    get: function () {
      return this._root.visible;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Update scene to fit the given model
   * @param model model to fit
   * @param override options for specific environments
   */

  __proto.update = function (model, override) {
    this._envs.forEach(function (env) {
      return env.fit(model, override);
    });
  };
  /**
   * Reset scene to initial state
   * @returns {void} Nothing
   */


  __proto.reset = function () {
    this.resetModel();
    this.resetEnv();
  };
  /**
   * Fully remove all objects that added by calling {@link Scene#add add()}
   * @returns {void} Nothing
   */


  __proto.resetModel = function () {
    this._removeChildsOf(this._userObjects);
  };
  /**
   * Remove all objects that added by calling {@link Scene#addEnv addEnv()}
   * This will also reset scene background & envmap
   * @returns {void} Nothing
   */


  __proto.resetEnv = function () {
    this._removeChildsOf(this._envObjects);

    this._envs = [];
    this._root.background = null;
    this._root.environment = null;
  };
  /**
   * Add new Three.js {@link https://threejs.org/docs/#api/en/core/Object3D Object3D} into the scene
   * @param object {@link https://threejs.org/docs/#api/en/core/Object3D THREE.Object3D}s to add
   * @returns {void} Nothing
   */


  __proto.add = function () {
    var _a;

    var object = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      object[_i] = arguments[_i];
    }

    (_a = this._userObjects).add.apply(_a, __spread(object));
  };
  /**
   * Add new {@link Environment} or Three.js {@link https://threejs.org/docs/#api/en/core/Object3D Object3D}s to the scene, which won't be removed after displaying another 3D model
   * @param envs {@link Environment} | {@link https://threejs.org/docs/#api/en/core/Object3D THREE.Object3D}s to add
   * @returns {void} Nothing
   */


  __proto.addEnv = function () {
    var _this = this;

    var envs = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      envs[_i] = arguments[_i];
    }

    envs.forEach(function (env) {
      var _a;

      if (env.isObject3D) {
        _this._envObjects.add(env);
      } else {
        _this._envs.push(env);

        (_a = _this._envObjects).add.apply(_a, __spread(env.objects));
      }
    });
  };
  /**
   * Remove Three.js {@link https://threejs.org/docs/#api/en/core/Object3D Object3D} into the scene
   * @param object {@link https://threejs.org/docs/#api/en/core/Object3D THREE.Object3D}s to add
   * @returns {void} Nothing
   */


  __proto.remove = function () {
    var _a;

    var object = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      object[_i] = arguments[_i];
    }

    (_a = this._userObjects).remove.apply(_a, __spread(object));
  };
  /**
   * Remove {@link Environment} or Three.js {@link https://threejs.org/docs/#api/en/core/Object3D Object3D}s to the scene, which won't be removed after displaying another 3D model
   * @param envs {@link Environment} | {@link https://threejs.org/docs/#api/en/core/Object3D THREE.Object3D}s to add
   * @returns {void} Nothing
   */


  __proto.removeEnv = function () {
    var _this = this;

    var envs = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      envs[_i] = arguments[_i];
    }

    envs.forEach(function (env) {
      var _a;

      if (env.isObject3D) {
        _this._envObjects.remove(env);
      } else {
        var envIndex = findIndex(env, _this._envs);

        if (envIndex > -1) {
          _this._envs.splice(envIndex, 1);
        }

        (_a = _this._envObjects).remove.apply(_a, __spread(env.objects));
      }
    });
  };
  /**
   * Set background of the scene.
   * @see {@link https://threejs.org/docs/#api/en/scenes/Scene.background THREE.Scene.background}
   * @param background A texture to set as background
   * @returns {void} Nothing
   */


  __proto.setBackground = function (background) {
    // Three.js's type definition does not include WebGLCubeRenderTarget, but it works and defined on their document
    // See https://threejs.org/docs/#api/en/scenes/Scene.background
    this._root.background = background;
  };
  /**
   * Set scene's environment map that affects all physical materials in the scene
   * @see {@link https://threejs.org/docs/#api/en/scenes/Scene.environment THREE.Scene.environment}
   * @param envmap A texture to set as environment map
   * @returns {void} Nothing
   */


  __proto.setEnvMap = function (envmap) {
    // Next line written to silence Three.js's warning
    var environment = envmap.texture ? envmap.texture : envmap;
    this._root.environment = environment;
  };
  /**
   * Make this scene visible
   * @returns {void} Nothing
   */


  __proto.show = function () {
    this._root.visible = true;
  };
  /**
   * Make this scene invisible
   * @returns {void} Nothing
   */


  __proto.hide = function () {
    this._root.visible = false;
  };

  __proto._removeChildsOf = function (obj) {
    obj.traverse(function (child) {
      if (child.isMesh) {
        var mesh = child; // Release geometry & material memory

        mesh.geometry.dispose();
        var materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach(function (mat) {
          STANDARD_MAPS.forEach(function (map) {
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
  };

  return Scene;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Controller that controls camera of the View3D
 * @category Core
 */

var Controller =
/*#__PURE__*/
function () {
  /**
   * Create new Controller instance
   */
  function Controller(canvas, camera) {
    this._controls = [];
    this._canvas = canvas;
    this._camera = camera;
  }

  var __proto = Controller.prototype;
  Object.defineProperty(__proto, "controls", {
    /**
     * {@link CameraControl CameraControl} instances that is added on this controller.
     */
    get: function () {
      return this._controls;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Remove all attached controls, and removes all event listeners attached by that controls.
   * @returns {void} Nothing
   */

  __proto.clear = function () {
    this._controls.forEach(function (control) {
      return control.destroy();
    });

    this._controls = [];
  };
  /**
   * Add a new control
   * @param control {@link CameraControl CameraControl} instance to add
   * @see Adding Controls
   * @returns {void} Nothing
   */


  __proto.add = function (control) {
    var canvas = this._canvas;

    if (!control.element) {
      // Set canvas as default element
      control.setElement(canvas);
    }

    control.sync(this._camera);
    control.enable();

    this._controls.push(control);
  };
  /**
   * Remove control and disable it
   * @param control {@link CameraControl CameraControl} instance to remove
   * @returns removed control or null if it doesn't exists
   */


  __proto.remove = function (control) {
    var controls = this._controls;
    var controlIndex = findIndex(control, controls);
    if (controlIndex < 0) return null;
    var removedControl = controls.splice(controlIndex, 1)[0];
    removedControl.disable();
    return removedControl;
  };
  /**
   * Enable all controls attached
   * @returns {void} Nothing
   */


  __proto.enableAll = function () {
    this._controls.forEach(function (control) {
      return control.enable();
    });

    this.syncToCamera();
  };
  /**
   * Disable all controls attached
   * @returns {void} Nothing
   */


  __proto.disableAll = function () {
    this._controls.forEach(function (control) {
      return control.disable();
    });
  };
  /**
   * Update all controls attached to given screen size.
   * @param size Size of the screen. Noramlly size of the canvas is used.
   * @returns {void} Nothing
   */


  __proto.resize = function (size) {
    this._controls.forEach(function (control) {
      return control.resize(size);
    });
  };
  /**
   * Synchronize all controls attached to current camera position.
   * @returns {void} Nothing
   */


  __proto.syncToCamera = function () {
    var _this = this;

    this._controls.forEach(function (control) {
      return control.sync(_this._camera);
    });
  };
  /**
   * Update all controls attached to this controller & update camera position based on it.
   * @param delta number of seconds to update controls
   * @returns {void} Nothing
   */


  __proto.update = function (delta) {
    var deltaMiliSec = delta * 1000;
    var camera = this._camera;

    this._controls.forEach(function (control) {
      control.update(camera, deltaMiliSec);
    });

    camera.updatePosition();
  };

  return Controller;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Data class of camera's pose
 */

var Pose =
/*#__PURE__*/
function () {
  /**
   * Create new instance of pose
   * @param yaw yaw
   * @param pitch pitch
   * @param distance distance
   * @param pivot pivot
   * @see https://threejs.org/docs/#api/en/math/Vector3
   * @example
   * import { THREE, Pose } from "@egjs/view3d";
   *
   * const pose = new Pose(180, 45, 150, new THREE.Vector3(5, -1, 3));
   */
  function Pose(yaw, pitch, distance, pivot) {
    if (pivot === void 0) {
      pivot = new Vector3(0, 0, 0);
    }

    this.yaw = yaw;
    this.pitch = pitch;
    this.distance = distance;
    this.pivot = pivot;
  }
  /**
   * Clone this pose
   * @returns Cloned pose
   */


  var __proto = Pose.prototype;

  __proto.clone = function () {
    return new Pose(this.yaw, this.pitch, this.distance, this.pivot.clone());
  };

  return Pose;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/**
 * Collection of easing functions
 * @namespace EASING
 * @example
 * import View3D, { RotateControl, EASING } from "@egjs/view3d";
 *
 * new RotateControl({
 *  easing: EASING.EASE_OUT_CUBIC,
 * });
 */

/**
 * @memberof EASING
 * @name SINE_WAVE
 */
var SINE_WAVE = function (x) {
  return Math.sin(x * Math.PI * 2);
};
/**
 * @memberof EASING
 * @name EASE_OUT_CUBIC
 */

var EASE_OUT_CUBIC = function (x) {
  return 1 - Math.pow(1 - x, 3);
};
/**
 * @memberof EASING
 * @name EASE_OUT_BOUNCE
 */

var EASE_OUT_BOUNCE = function (x) {
  var n1 = 7.5625;
  var d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
};

var easing = {
    __proto__: null,
    SINE_WAVE: SINE_WAVE,
    EASE_OUT_CUBIC: EASE_OUT_CUBIC,
    EASE_OUT_BOUNCE: EASE_OUT_BOUNCE
};

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
var MODEL_SIZE = 80; // Animation related

var EASING = EASE_OUT_CUBIC;
var ANIMATION_DURATION = 500;
var ANIMATION_LOOP = false;
var ANIMATION_RANGE = {
  min: 0,
  max: 1
}; // Camera related

var CAMERA_POSE = new Pose(0, 0, 100, new Vector3(0, 0, 0));
var INFINITE_RANGE = {
  min: -Infinity,
  max: Infinity
};
var PITCH_RANGE = {
  min: -89.9,
  max: 89.9
};
var DISTANCE_RANGE = {
  min: 0,
  max: 500
};
var MINIMUM_DISTANCE = 1;
var MAXIMUM_DISTANCE = 500;
var NULL_ELEMENT = null;
var DRACO_DECODER_URL = "https://www.gstatic.com/draco/v1/decoders/";

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

var Motion =
/*#__PURE__*/
function () {
  function Motion(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.duration,
        duration = _c === void 0 ? ANIMATION_DURATION : _c,
        _d = _b.loop,
        loop = _d === void 0 ? ANIMATION_LOOP : _d,
        _e = _b.range,
        range = _e === void 0 ? ANIMATION_RANGE : _e,
        _f = _b.easing,
        easing = _f === void 0 ? EASING : _f;

    this._duration = duration;
    this._loop = loop;
    this._range = range;
    this._easing = easing;
    this._activated = false;
    this.reset(0);
  }

  var __proto = Motion.prototype;
  Object.defineProperty(__proto, "val", {
    get: function () {
      return this._val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "start", {
    get: function () {
      return this._start;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "end", {
    get: function () {
      return this._end;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "progress", {
    get: function () {
      return this._progress;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "duration", {
    get: function () {
      return this._duration;
    },
    set: function (val) {
      this._duration = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "loop", {
    get: function () {
      return this._loop;
    },
    set: function (val) {
      this._loop = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "range", {
    get: function () {
      return this._range;
    },
    set: function (val) {
      this._range = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "easing", {
    get: function () {
      return this._easing;
    },
    set: function (val) {
      this._easing = val;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Update motion and progress it by given deltaTime
   * @param deltaTime number of milisec to update motion
   * @returns Difference(delta) of the value from the last update.
   */

  __proto.update = function (deltaTime) {
    if (!this._activated) return 0;
    var start = this._start;
    var end = this._end;
    var duration = this._duration;
    var prev = this._val;
    var loop = this._loop;
    var nextProgress = this._progress + deltaTime / duration;
    this._progress = loop ? circulate(nextProgress, 0, 1) : clamp(nextProgress, 0, 1);

    var easedProgress = this._easing(this._progress);

    this._val = mix(start, end, easedProgress);

    if (!loop && this._progress >= 1) {
      this._activated = false;
    }

    return this._val - prev;
  };

  __proto.reset = function (defaultVal) {
    var range = this._range;
    var val = clamp(defaultVal, range.min, range.max);
    this._start = val;
    this._end = val;
    this._val = val;
    this._progress = 0;
    this._activated = false;
  };

  __proto.setEndDelta = function (delta) {
    var range = this._range;
    this._start = this._val;
    this._end = clamp(this._end + delta, range.min, range.max);
    this._progress = 0;
    this._activated = true;
  };

  return Motion;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Control that animates model without user input
 * @category Controls
 */

var AnimationControl =
/*#__PURE__*/
function () {
  /**
   * Create new instance of AnimationControl
   * @param from Start pose
   * @param to End pose
   * @param {object} options Options
   * @param {number} [options.duration=500] Animation duration
   * @param {function} [options.easing=(x: number) => 1 - Math.pow(1 - x, 3)] Animation easing function
   */
  function AnimationControl(from, to, _a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.duration,
        duration = _c === void 0 ? ANIMATION_DURATION : _c,
        _d = _b.easing,
        easing = _d === void 0 ? EASING : _d;

    this._enabled = false;
    this._finishCallbacks = [];
    from = from.clone();
    to = to.clone();
    from.yaw = circulate(from.yaw, 0, 360);
    to.yaw = circulate(to.yaw, 0, 360); // Take the smaller degree

    if (Math.abs(to.yaw - from.yaw) > 180) {
      to.yaw = to.yaw < from.yaw ? to.yaw + 360 : to.yaw - 360;
    }

    this._motion = new Motion({
      duration: duration,
      range: ANIMATION_RANGE,
      easing: easing
    });
    this._from = from;
    this._to = to;
  }

  var __proto = AnimationControl.prototype;
  Object.defineProperty(__proto, "element", {
    get: function () {
      return null;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "enabled", {
    /**
     * Whether this control is enabled or not
     * @readonly
     */
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "duration", {
    /**
     * Duration of the animation
     */
    get: function () {
      return this._motion.duration;
    },
    set: function (val) {
      this._motion.duration = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "easing", {
    /**
     * Easing function of the animation
     */
    get: function () {
      return this._motion.easing;
    },
    set: function (val) {
      this._motion.easing = val;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Destroy the instance and remove all event listeners attached
   * This also will reset CSS cursor to intial
   * @returns {void} Nothing
   */

  __proto.destroy = function () {
    this.disable();
  };
  /**
   * Update control by given deltaTime
   * @param camera Camera to update position
   * @param deltaTime Number of milisec to update
   * @returns {void} Nothing
   */


  __proto.update = function (camera, deltaTime) {
    if (!this._enabled) return;
    var from = this._from;
    var to = this._to;
    var motion = this._motion;
    motion.update(deltaTime); // Progress that easing is applied

    var progress = motion.val;
    camera.yaw = mix(from.yaw, to.yaw, progress);
    camera.pitch = mix(from.pitch, to.pitch, progress);
    camera.distance = mix(from.distance, to.distance, progress);
    camera.pivot = from.pivot.clone().lerp(to.pivot, progress);

    if (motion.progress >= 1) {
      this.disable();

      this._finishCallbacks.forEach(function (callback) {
        return callback();
      });
    }
  };
  /**
   * Enable this input and add event listeners
   * @returns {void} Nothing
   */


  __proto.enable = function () {
    if (this._enabled) return;
    this._enabled = true;

    this._motion.reset(0);

    this._motion.setEndDelta(1);
  };
  /**
   * Disable this input and remove all event handlers
   * @returns {void} Nothing
   */


  __proto.disable = function () {
    if (!this._enabled) return;
    this._enabled = false;
  };
  /**
   * Add callback which is called when animation is finished
   * @param callback Callback that will be called when animation finishes
   * @returns {void} Nothing
   */


  __proto.onFinished = function (callback) {
    this._finishCallbacks.push(callback);
  };
  /**
   * Remove all onFinished callbacks
   * @returns {void} Nothing
   */


  __proto.clearFinished = function () {
    this._finishCallbacks = [];
  };

  __proto.resize = function (size) {// DO NOTHING
  };

  __proto.setElement = function (element) {// DO NOTHING
  };

  __proto.sync = function (camera) {// Do nothing
  };

  return AnimationControl;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Camera that renders the scene of View3D
 * @category Core
 */

var Camera =
/*#__PURE__*/
function () {
  /**
   * Create new Camera instance
   * @param canvas \<canvas\> element to render 3d model
   */
  function Camera(canvas) {
    this._minDistance = MINIMUM_DISTANCE;
    this._maxDistance = MAXIMUM_DISTANCE;
    this._defaultPose = CAMERA_POSE;
    this._currentPose = this._defaultPose.clone();
    this._threeCamera = new PerspectiveCamera();
    this._controller = new Controller(canvas, this);
  }

  var __proto = Camera.prototype;
  Object.defineProperty(__proto, "threeCamera", {
    /**
     * Three.js {@link https://threejs.org/docs/#api/en/cameras/PerspectiveCamera PerspectiveCamera} instance
     * @readonly
     * @type THREE.PerspectiveCamera
     */
    get: function () {
      return this._threeCamera;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "controller", {
    /**
     * Controller of the camera
     * @readonly
     * @type Controller
     */
    get: function () {
      return this._controller;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "defaultPose", {
    /**
     * Camera's default pose(yaw, pitch, distance, pivot)
     * This will be new currentPose when {@link Camera#reset reset()} is called
     * @readonly
     * @type Pose
     */
    get: function () {
      return this._defaultPose;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "currentPose", {
    /**
     * Camera's current pose value
     * @readonly
     * @type Pose
     */
    get: function () {
      return this._currentPose.clone();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "yaw", {
    /**
     * Camera's current yaw
     * {@link Camera#updatePosition} should be called after changing this value, and normally it is called every frame.
     * @type number
     */
    get: function () {
      return this._currentPose.yaw;
    },
    set: function (val) {
      this._currentPose.yaw = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "pitch", {
    /**
     * Camera's current pitch
     * {@link Camera#updatePosition} should be called after changing this value, and normally it is called every frame.
     * @type number
     */
    get: function () {
      return this._currentPose.pitch;
    },
    set: function (val) {
      this._currentPose.pitch = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "distance", {
    /**
     * Camera's current distance
     * {@link Camera#updatePosition} should be called after changing this value, and normally it is called every frame.
     * @type number
     */
    get: function () {
      return this._currentPose.distance;
    },
    set: function (val) {
      this._currentPose.distance = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "pivot", {
    /**
     * Current pivot point of camera rotation
     * @readonly
     * @type THREE.Vector3
     * @see {@link https://threejs.org/docs/#api/en/math/Vector3 THREE#Vector3}
     */
    get: function () {
      return this._currentPose.pivot;
    },
    set: function (val) {
      this._currentPose.pivot = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "minDistance", {
    /**
     * Minimum distance from lookAtPosition
     * @type number
     * @example
     * import View3D from "@egjs/view3d";
     *
     * const view3d = new View3D("#view3d-canvas");
     * view3d.camera.minDistance = 100;
     */
    get: function () {
      return this._minDistance;
    },
    set: function (val) {
      this._minDistance = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "maxDistance", {
    /**
     * Maximum distance from lookAtPosition
     * @type number
     * @example
     * import View3D from "@egjs/view3d";
     *
     * const view3d = new View3D("#view3d-canvas");
     * view3d.camera.maxDistance = 400;
     */
    get: function () {
      return this._maxDistance;
    },
    set: function (val) {
      this._maxDistance = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "fov", {
    /**
     * Camera's focus of view value
     * @type number
     * @see {@link https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.fov THREE#PerspectiveCamera}
     */
    get: function () {
      return this._threeCamera.fov;
    },
    set: function (val) {
      this._threeCamera.fov = val;

      this._threeCamera.updateProjectionMatrix();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "renderWidth", {
    /**
     * Camera's frustum width on current distance value
     * @type number
     */
    get: function () {
      return this.renderHeight * this._threeCamera.aspect;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "renderHeight", {
    /**
     * Camera's frustum height on current distance value
     * @type number
     */
    get: function () {
      return 2 * this.distance * Math.tan(toRadian(this.fov / 2));
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "pose", {
    set: function (val) {
      this._currentPose = val;

      this._controller.syncToCamera();
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Reset camera to default pose
   * @param duration Duration of the reset animation
   * @param easing Easing function for the reset animation
   * @returns Promise that resolves when the animation finishes
   */

  __proto.reset = function (duration, easing) {
    if (duration === void 0) {
      duration = 0;
    }

    if (easing === void 0) {
      easing = EASING;
    }

    var controller = this._controller;
    var currentPose = this._currentPose;
    var defaultPose = this._defaultPose;

    if (duration <= 0) {
      // Reset camera immediately
      this._currentPose = defaultPose.clone();
      controller.syncToCamera();
      return Promise.resolve();
    } else {
      // Add reset animation control to controller
      var resetControl_1 = new AnimationControl(currentPose, defaultPose);
      resetControl_1.duration = duration;
      resetControl_1.easing = easing;
      return new Promise(function (resolve) {
        resetControl_1.onFinished(function () {
          controller.remove(resetControl_1);
          controller.syncToCamera();
          resolve();
        });
        controller.add(resetControl_1);
      });
    }
  };
  /**
   * Update camera's aspect to given size
   * @param size {@link THREE.Vector2} instance that has width(x), height(y)
   * @returns {void} Nothing
   */


  __proto.resize = function (size) {
    var cam = this._threeCamera;
    var aspect = size.x / size.y;
    cam.aspect = aspect;
    cam.updateProjectionMatrix();

    this._controller.resize(size);
  };
  /**
   * Set default position of camera relative to the 3d model
   * New default pose will be used when {@link Camera#reset reset()} is called
   * @param newDefaultPose new default pose to apply
   * @returns {void} Nothing
   */


  __proto.setDefaultPose = function (newDefaultPose) {
    var defaultPose = this._defaultPose;
    var yaw = newDefaultPose.yaw,
        pitch = newDefaultPose.pitch,
        distance = newDefaultPose.distance,
        pivot = newDefaultPose.pivot;

    if (yaw != null) {
      defaultPose.yaw = yaw;
    }

    if (pitch != null) {
      defaultPose.pitch = pitch;
    }

    if (distance != null) {
      defaultPose.distance = distance;
    }

    if (pivot != null) {
      defaultPose.pivot = pivot;
    }
  };
  /**
   * Update camera position base on the {@link Camera#currentPose currentPose} value
   * @returns {void} Nothing
   */


  __proto.updatePosition = function () {
    this._clampCurrentPose();

    var threeCamera = this._threeCamera;
    var pose = this._currentPose;
    var yaw = toRadian(pose.yaw);
    var pitch = toRadian(pose.pitch); // Should use minimum distance to prevent distance becomes 0, which makes whole x,y,z to 0 regardless of pose

    var distance = Math.max(pose.distance + this._minDistance, MINIMUM_DISTANCE);
    var newCamPos = new Vector3(0, 0, 0);
    newCamPos.y = distance * Math.sin(pitch);
    newCamPos.z = distance * Math.cos(pitch);
    newCamPos.x = newCamPos.z * Math.sin(-yaw);
    newCamPos.z = newCamPos.z * Math.cos(-yaw);
    newCamPos.add(pose.pivot);
    threeCamera.position.copy(newCamPos);
    threeCamera.lookAt(pose.pivot);
    threeCamera.updateProjectionMatrix();
  };

  __proto._clampCurrentPose = function () {
    var currentPose = this._currentPose;
    currentPose.yaw = circulate(currentPose.yaw, 0, 360);
    currentPose.pitch = clamp(currentPose.pitch, PITCH_RANGE.min, PITCH_RANGE.max);
    currentPose.distance = clamp(currentPose.distance, this._minDistance, this._maxDistance);
  };

  return Camera;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Component that manages animations of the 3D Model
 * @category Core
 */

var ModelAnimator =
/*#__PURE__*/
function () {
  /**
   * Create new ModelAnimator instance
   * @param scene {@link https://threejs.org/docs/index.html#api/en/scenes/Scene THREE.Scene} instance that is root of all 3d objects
   */
  function ModelAnimator(scene) {
    this._mixer = new AnimationMixer(scene);
    this._clips = [];
    this._actions = [];
  }

  var __proto = ModelAnimator.prototype;
  Object.defineProperty(__proto, "clips", {
    /**
     * Three.js {@link https://threejs.org/docs/#api/en/animation/AnimationClip AnimationClip}s that stored
     * @type THREE.AnimationClip
     * @readonly
     */
    get: function () {
      return this._clips;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "mixer", {
    /**
     * {@link https://threejs.org/docs/index.html#api/en/animation/AnimationMixer THREE.AnimationMixer} instance
     * @type THREE.AnimationMixer
     * @readonly
     */
    get: function () {
      return this._mixer;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Store the given clips
   * @param clips Three.js {@link https://threejs.org/docs/#api/en/animation/AnimationClip AnimationClip}s of the model
   * @returns {void} Nothing
   * @example
   * // After loading model
   * view3d.animator.setClips(model.animations);
   */

  __proto.setClips = function (clips) {
    var mixer = this._mixer;
    this._clips = clips;
    this._actions = clips.map(function (clip) {
      return mixer.clipAction(clip);
    });
  };
  /**
   * Play one of the model's animation
   * @param index Index of the animation to play
   * @returns {void} Nothing
   */


  __proto.play = function (index) {
    var action = this._actions[index];

    if (action) {
      action.play();
    }
  };
  /**
   * Pause one of the model's animation
   * If you want to stop animation completely, you should call {@link ModelAnimator#stop stop} instead
   * You should call {@link ModelAnimator#resume resume} to resume animation
   * @param index Index of the animation to pause
   * @returns {void} Nothing
   */


  __proto.pause = function (index) {
    var action = this._actions[index];

    if (action) {
      action.timeScale = 0;
    }
  };
  /**
   * Resume one of the model's animation
   * This will play animation from the point when the animation is paused
   * @param index Index of the animation to resume
   * @returns {void} Nothing
   */


  __proto.resume = function (index) {
    var action = this._actions[index];

    if (action) {
      action.timeScale = 1;
    }
  };
  /**
   * Fully stops one of the model's animation
   * @param index Index of the animation to stop
   * @returns {void} Nothing
   */


  __proto.stop = function (index) {
    var action = this._actions[index];

    if (action) {
      action.stop();
    }
  };
  /**
   * Update animations
   * @param delta number of seconds to play animations attached
   * @returns {void} Nothing
   */


  __proto.update = function (delta) {
    this._mixer.update(delta);
  };
  /**
   * Reset the instance and remove all cached animation clips attached to it
   * @returns {void} Nothing
   */


  __proto.reset = function () {
    var mixer = this._mixer;
    mixer.uncacheRoot(mixer.getRoot());
    this._clips = [];
    this._actions = [];
  };

  return ModelAnimator;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * XRManager that manages XRSessions
 * @category Core
 */

var XRManager =
/*#__PURE__*/
function () {
  /**
   * Create a new instance of the XRManager
   * @param view3d Instance of the View3D
   */
  function XRManager(view3d) {
    this._view3d = view3d;
    this._sessions = [];
    this._currentSession = null;
  }

  var __proto = XRManager.prototype;
  Object.defineProperty(__proto, "sessions", {
    /**
     * Array of {@link XRSession}s added
     */
    get: function () {
      return this._sessions;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "currentSession", {
    /**
     * Current entry session. Note that only WebXR type session can be returned.
     */
    get: function () {
      return this._currentSession;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Return a Promise containing whether any of the added session is available
   */

  __proto.isAvailable = function () {
    return __awaiter(this, void 0, void 0, function () {
      var results;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , Promise.all(this._sessions.map(function (session) {
              return session.isAvailable();
            }))];

          case 1:
            results = _a.sent();
            return [2
            /*return*/
            , results.some(function (result) {
              return result === true;
            })];
        }
      });
    });
  };
  /**
   * Add new {@link XRSession}.
   * The XRSession's order added is the same as the order of entry.
   * @param xrSession XRSession to add
   */


  __proto.addSession = function () {
    var _a;

    var xrSession = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      xrSession[_i] = arguments[_i];
    }

    (_a = this._sessions).push.apply(_a, __spread(xrSession));
  };
  /**
   * Enter XR Session.
   */


  __proto.enter = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2
        /*return*/
        , this._enterSession(0, [])];
      });
    });
  };
  /**
   * Exit current XR Session.
   */


  __proto.exit = function () {
    if (this._currentSession) {
      this._currentSession.exit(this._view3d);

      this._currentSession = null;
    }
  };

  __proto._enterSession = function (sessionIdx, errors) {
    return __awaiter(this, void 0, void 0, function () {
      var view3d, sessions, xrSession, isSessionAvailable;

      var _this = this;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            view3d = this._view3d;
            sessions = this._sessions;

            if (sessionIdx >= sessions.length) {
              if (errors.length < 1) {
                errors.push(new Error("No sessions available"));
              }

              return [2
              /*return*/
              , Promise.reject(errors)];
            }

            xrSession = sessions[sessionIdx];
            return [4
            /*yield*/
            , xrSession.isAvailable()];

          case 1:
            isSessionAvailable = _a.sent();

            if (!isSessionAvailable) {
              return [2
              /*return*/
              , this._enterSession(sessionIdx + 1, errors)];
            }

            return [4
            /*yield*/
            , xrSession.enter(view3d).then(function () {
              if (xrSession.isWebXRSession) {
                // Non-webxr sessions are ignored
                _this._currentSession = xrSession;
                xrSession.session.addEventListener("end", function () {
                  _this._currentSession = null;
                });
              }

              return errors;
            }).catch(function (e) {
              errors.push(e);
              return _this._enterSession(sessionIdx + 1, errors);
            })];

          case 2:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  };

  return XRManager;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
var EVENTS = {
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
  MOUSE_LEAVE: "mouseleave"
}; // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.button

var MOUSE_BUTTON;

(function (MOUSE_BUTTON) {
  MOUSE_BUTTON[MOUSE_BUTTON["LEFT"] = 0] = "LEFT";
  MOUSE_BUTTON[MOUSE_BUTTON["MIDDLE"] = 1] = "MIDDLE";
  MOUSE_BUTTON[MOUSE_BUTTON["RIGHT"] = 2] = "RIGHT";
})(MOUSE_BUTTON || (MOUSE_BUTTON = {}));

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
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

var View3D =
/*#__PURE__*/
function (_super) {
  __extends(View3D, _super);
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


  function View3D(el) {
    var _this = _super.call(this) || this;
    /**
     * Resize View3D instance to fit current canvas size
     * @method
     * @returns {void} Nothing
     */


    _this.resize = function () {
      _this._renderer.resize();

      var newSize = _this._renderer.size;

      _this._camera.resize(newSize);

      _this.emit("resize", __assign(__assign({}, newSize), {
        target: _this
      }));
    };
    /**
     * View3D's basic render loop function
     * @param delta Number of seconds passed since last frame
     */


    _this.renderLoop = function (delta) {
      var renderer = _this._renderer;
      var scene = _this._scene;
      var camera = _this._camera;
      var controller = _this.controller;
      var animator = _this._animator;
      animator.update(delta);
      controller.update(delta);

      _this.emit("beforeRender", _this);

      renderer.render(scene, camera);

      _this.emit("afterRender", _this);
    };

    var canvas = getCanvas(el);
    _this._renderer = new Renderer(canvas);
    _this._camera = new Camera(canvas);
    _this._scene = new Scene();
    _this._animator = new ModelAnimator(_this._scene.root);
    _this._xr = new XRManager(_this);
    _this._model = null;

    _this.resize();

    window.addEventListener(EVENTS.RESIZE, _this.resize);
    return _this;
  }

  var __proto = View3D.prototype;
  Object.defineProperty(__proto, "renderer", {
    /**
     * {@link Renderer} instance of the View3D
     * @type {Renderer}
     */
    get: function () {
      return this._renderer;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "scene", {
    /**
     * {@link Scene} instance of the View3D
     * @type {Scene}
     */
    get: function () {
      return this._scene;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "camera", {
    /**
     * {@link Camera} instance of the View3D
     * @type {Camera}
     */
    get: function () {
      return this._camera;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "controller", {
    /**
     * {@link Controller} instance of the Camera
     * @type {Controller}
     */
    get: function () {
      return this._camera.controller;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "animator", {
    /**
     * {@link ModelAnimator} instance of the View3D
     * @type {ModelAnimator}
     */
    get: function () {
      return this._animator;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "xr", {
    /**
     * {@link XRManager} instance of the View3D
     * @type {XRManager}
     */
    get: function () {
      return this._xr;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "model", {
    /**
     * {@link Model} that View3D is currently showing
     * @type {Model|null}
     */
    get: function () {
      return this._model;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Destroy View3D instance and remove all events attached to it
   * @returns {void} Nothing
   */

  __proto.destroy = function () {
    this._scene.reset();

    this.controller.clear();
    this._model = null;
    window.removeEventListener(EVENTS.RESIZE, this.resize);
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
   * @returns {void} Nothing
   */


  __proto.display = function (model, _a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.applySize,
        applySize = _c === void 0 ? true : _c,
        _d = _b.size,
        size = _d === void 0 ? MODEL_SIZE : _d,
        _e = _b.resetView,
        resetView = _e === void 0 ? true : _e;

    var renderer = this._renderer;
    var scene = this._scene;
    var camera = this._camera;
    var animator = this._animator;

    if (applySize) {
      model.size = size;
    } // model.moveToOrigin();


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
  };
  /**
   * Current version of the View3D
   */


  View3D.VERSION = "1.1.0-snapshot";
  return View3D;
}(EventEmitter);

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Data class for loaded 3d model
 * @category Core
 */

var Model =
/*#__PURE__*/
function () {
  /**
   * Create new Model instance
   */
  function Model(_a) {
    var scenes = _a.scenes,
        _b = _a.animations,
        animations = _b === void 0 ? [] : _b,
        _c = _a.fixSkinnedBbox,
        fixSkinnedBbox = _c === void 0 ? false : _c,
        _d = _a.castShadow,
        castShadow = _d === void 0 ? true : _d,
        _e = _a.receiveShadow,
        receiveShadow = _e === void 0 ? false : _e; // This guarantees model's root has identity matrix at creation

    this._scene = new Group();
    var pivot = new Object3D();
    pivot.name = "Pivot";
    pivot.add.apply(pivot, __spread(scenes));

    this._scene.add(pivot);

    this._animations = animations;
    this._fixSkinnedBbox = fixSkinnedBbox;
    this._cachedLights = null;
    this._cachedMeshes = null;

    this._setInitialBbox();

    var bboxCenter = this._initialBbox.getCenter(new Vector3());

    pivot.position.copy(bboxCenter.negate());

    this._moveInitialBboxToCenter();

    this._originalSize = this.size;
    this.castShadow = castShadow;
    this.receiveShadow = receiveShadow;
  }

  var __proto = Model.prototype;
  Object.defineProperty(__proto, "scene", {
    /**
     * Scene of the model, see {@link https://threejs.org/docs/#api/en/objects/Group THREE.Group}
     * @readonly
     */
    get: function () {
      return this._scene;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "animations", {
    /**
     * {@link https://threejs.org/docs/#api/en/animation/AnimationClip THREE.AnimationClip}s inside model
     */
    get: function () {
      return this._animations;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "lights", {
    /***
     * {@link https://threejs.org/docs/#api/en/lights/Light THREE.Light}s inside model if there's any.
     * @readonly
     */
    get: function () {
      return this._cachedLights ? this._cachedLights : this._getAllLights();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "meshes", {
    /**
     * {@link https://threejs.org/docs/#api/en/objects/Mesh THREE.Mesh}es inside model if there's any.
     * @readonly
     */
    get: function () {
      return this._cachedMeshes ? this._cachedMeshes : this._getAllMeshes();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "bbox", {
    /**
     * Get a copy of model's current bounding box
     * @type THREE#Box3
     * @see https://threejs.org/docs/#api/en/math/Box3
     */
    get: function () {
      return this._getTransformedBbox();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "initialBbox", {
    /**
     * Get a copy of model's initial bounding box without transform
     */
    get: function () {
      return this._initialBbox.clone();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "size", {
    /**
     * Model's bounding box size
     * Changing this will scale the model.
     * @type number
     * @example
     * import { GLTFLoader } from "@egjs/view3d";
     * new GLTFLoader().load(URL_TO_GLTF)
     *  .then(model => {
     *    model.size = 100;
     *  })
     */
    get: function () {
      return this._getTransformedBbox().getSize(new Vector3()).length();
    },
    set: function (val) {
      var scene = this._scene;
      var initialBbox = this._initialBbox; // Modify scale

      var bboxSize = initialBbox.getSize(new Vector3());
      var scale = val / bboxSize.length();
      scene.scale.setScalar(scale);
      scene.updateMatrix();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "fixSkinnedBbox", {
    /**
     * Whether to apply inference from skeleton when calculating bounding box
     * This can fix some models with skinned mesh when it has wrong bounding box
     * @type boolean
     */
    get: function () {
      return this._fixSkinnedBbox;
    },
    set: function (val) {
      this._fixSkinnedBbox = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "originalSize", {
    /**
     * Return the model's original bbox size before applying any transform
     * @type number
     */
    get: function () {
      return this._originalSize;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "castShadow", {
    /**
     * Whether the model's meshes gets rendered into shadow map
     * @type boolean
     * @example
     * model.castShadow = true;
     */
    set: function (val) {
      var meshes = this.meshes;
      meshes.forEach(function (mesh) {
        return mesh.castShadow = val;
      });
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "receiveShadow", {
    /**
     * Whether the model's mesh materials receive shadows
     * @type boolean
     * @example
     * model.receiveShadow = true;
     */
    set: function (val) {
      var meshes = this.meshes;
      meshes.forEach(function (mesh) {
        return mesh.receiveShadow = val;
      });
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Translate the model to center the model's bounding box to world origin (0, 0, 0).
   */

  __proto.moveToOrigin = function () {
    // Translate scene position to origin
    var scene = this._scene;

    var initialBbox = this._initialBbox.clone();

    initialBbox.min.multiply(scene.scale);
    initialBbox.max.multiply(scene.scale);
    var bboxCenter = initialBbox.getCenter(new Vector3());
    scene.position.copy(bboxCenter.negate());
    scene.updateMatrix();
  };

  __proto._setInitialBbox = function () {
    this._scene.updateMatrixWorld();

    if (this._fixSkinnedBbox && this._hasSkinnedMesh()) {
      this._initialBbox = this._getSkeletonBbox();
    } else {
      this._initialBbox = new Box3().setFromObject(this._scene);
    }
  };

  __proto._getSkeletonBbox = function () {
    var bbox = new Box3();
    this.meshes.forEach(function (mesh) {
      if (!mesh.isSkinnedMesh) {
        bbox.expandByObject(mesh);
        return;
      }

      var geometry = mesh.geometry;
      var positions = geometry.attributes.position;
      var skinIndicies = geometry.attributes.skinIndex;
      var skinWeights = geometry.attributes.skinWeight;
      var skeleton = mesh.skeleton;
      skeleton.update();
      var boneMatricies = skeleton.boneMatrices;
      var finalMatrix = new Matrix4();

      var _loop_1 = function (posIdx) {
        finalMatrix.identity();
        var skinned = new Vector4();
        skinned.set(0, 0, 0, 0);
        var skinVertex = new Vector4();
        skinVertex.set(positions.getX(posIdx), positions.getY(posIdx), positions.getZ(posIdx), 1).applyMatrix4(mesh.bindMatrix);
        var weights = [skinWeights.getX(posIdx), skinWeights.getY(posIdx), skinWeights.getZ(posIdx), skinWeights.getW(posIdx)];
        var indicies = [skinIndicies.getX(posIdx), skinIndicies.getY(posIdx), skinIndicies.getZ(posIdx), skinIndicies.getW(posIdx)];
        weights.forEach(function (weight, index) {
          var boneMatrix = new Matrix4().fromArray(boneMatricies, indicies[index] * 16);
          skinned.add(skinVertex.clone().applyMatrix4(boneMatrix).multiplyScalar(weight));
        });
        var transformed = new Vector3().fromArray(skinned.applyMatrix4(mesh.bindMatrixInverse).toArray());
        transformed.applyMatrix4(mesh.matrixWorld);
        bbox.expandByPoint(transformed);
      };

      for (var posIdx = 0; posIdx < positions.count; posIdx++) {
        _loop_1(posIdx);
      }
    });
    return bbox;
  };

  __proto._moveInitialBboxToCenter = function () {
    var bboxCenter = this._initialBbox.getCenter(new Vector3());

    this._initialBbox.translate(bboxCenter.negate());
  };

  __proto._getAllLights = function () {
    var lights = [];

    this._scene.traverse(function (obj) {
      if (obj.isLight) {
        lights.push(obj);
      }
    });

    this._cachedLights = lights;
    return lights;
  };
  /**
   * Get all {@link https://threejs.org/docs/#api/en/objects/Mesh THREE.Mesh}es inside model if there's any.
   * @private
   * @returns Meshes found at model's scene
   */


  __proto._getAllMeshes = function () {
    var meshes = [];

    this._scene.traverse(function (obj) {
      if (obj.isMesh) {
        meshes.push(obj);
      }
    });

    this._cachedMeshes = meshes;
    return meshes;
  };

  __proto._hasSkinnedMesh = function () {
    return this.meshes.some(function (mesh) {
      return mesh.isSkinnedMesh;
    });
  };

  __proto._getTransformedBbox = function () {
    return this._initialBbox.clone().applyMatrix4(this._scene.matrix);
  };

  return Model;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Control that animates model without user input
 * @category Controls
 */

var AutoControl =
/*#__PURE__*/
function () {
  /**
   * Create new RotateControl instance
   * @param {object} options Options
   * @param {HTMLElement | string | null} [options.element=null] Attaching element / selector of the element
   * @param {number} [options.delay=2000] Reactivation delay after mouse input in milisecond
   * @param {number} [options.delayOnMouseLeave=0] Reactivation delay after mouse leave
   * @param {number} [options.speed=1] Y-axis(yaw) rotation speed
   * @param {boolean} [options.pauseOnHover=false] Whether to pause rotation on mouse hover
   * @param {boolean} [options.canInterrupt=true] Whether user can interrupt the rotation with click/wheel input
   * @param {boolean} [options.disableOnInterrupt=false] Whether to disable control on user interrupt
   * @tutorial Adding Controls
   */
  function AutoControl(_a) {
    var _this = this;

    var _b = _a === void 0 ? {} : _a,
        _c = _b.element,
        element = _c === void 0 ? NULL_ELEMENT : _c,
        _d = _b.delay,
        delay = _d === void 0 ? 2000 : _d,
        _e = _b.delayOnMouseLeave,
        delayOnMouseLeave = _e === void 0 ? 0 : _e,
        _f = _b.speed,
        speed = _f === void 0 ? 1 : _f,
        _g = _b.pauseOnHover,
        pauseOnHover = _g === void 0 ? false : _g,
        _h = _b.canInterrupt,
        canInterrupt = _h === void 0 ? true : _h,
        _j = _b.disableOnInterrupt,
        disableOnInterrupt = _j === void 0 ? false : _j; // Internal values


    this._targetEl = null;
    this._enabled = false;
    this._interrupted = false;
    this._interruptionTimer = -1;
    this._hovering = false;

    this._onMouseDown = function (evt) {
      if (!_this._canInterrupt) return;
      if (evt.button !== MOUSE_BUTTON.LEFT && evt.button !== MOUSE_BUTTON.RIGHT) return;
      _this._interrupted = true;

      _this._clearTimeout();

      window.addEventListener(EVENTS.MOUSE_UP, _this._onMouseUp, false);
    };

    this._onMouseUp = function () {
      window.removeEventListener(EVENTS.MOUSE_UP, _this._onMouseUp, false);

      _this._setUninterruptedAfterDelay(_this._delay);
    };

    this._onTouchStart = function () {
      if (!_this._canInterrupt) return;
      _this._interrupted = true;

      _this._clearTimeout();
    };

    this._onTouchEnd = function () {
      _this._setUninterruptedAfterDelay(_this._delay);
    };

    this._onMouseEnter = function () {
      if (!_this._pauseOnHover) return;
      _this._interrupted = true;
      _this._hovering = true;
    };

    this._onMouseLeave = function () {
      if (!_this._pauseOnHover) return;
      _this._hovering = false;

      _this._setUninterruptedAfterDelay(_this._delayOnMouseLeave);
    };

    this._onWheel = function () {
      if (!_this._canInterrupt) return;
      _this._interrupted = true;

      _this._setUninterruptedAfterDelay(_this._delay);
    };

    var targetEl = getElement(element);

    if (targetEl) {
      this.setElement(targetEl);
    }

    this._delay = delay;
    this._delayOnMouseLeave = delayOnMouseLeave;
    this._speed = speed;
    this._pauseOnHover = pauseOnHover;
    this._canInterrupt = canInterrupt;
    this._disableOnInterrupt = disableOnInterrupt;
  }

  var __proto = AutoControl.prototype;
  Object.defineProperty(__proto, "element", {
    /**
     * Control's current target element to attach event listeners
     * @readonly
     */
    get: function () {
      return this._targetEl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "enabled", {
    /**
     * Whether this control is enabled or not
     * @readonly
     */
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "delay", {
    /**
     * Reactivation delay after mouse input in milisecond
     */
    get: function () {
      return this._delay;
    },
    set: function (val) {
      this._delay = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "delayOnMouseLeave", {
    /**
     * Reactivation delay after mouse leave
     * This option only works when {@link AutoControl#pauseOnHover pauseOnHover} is activated
     */
    get: function () {
      return this._delayOnMouseLeave;
    },
    set: function (val) {
      this._delayOnMouseLeave = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "speed", {
    /**
     * Y-axis(yaw) rotation speed
     * @default 1
     */
    get: function () {
      return this._speed;
    },
    set: function (val) {
      this._speed = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "pauseOnHover", {
    /**
     * Whether to pause rotation on mouse hover
     * @default false
     */
    get: function () {
      return this._pauseOnHover;
    },
    set: function (val) {
      this._pauseOnHover = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "canInterrupt", {
    /**
     * Whether user can interrupt the rotation with click/wheel input
     * @default true
     */
    get: function () {
      return this._canInterrupt;
    },
    set: function (val) {
      this._canInterrupt = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "disableOnInterrupt", {
    /**
     * Whether to disable control on user interrupt
     * @default false
     */
    get: function () {
      return this._disableOnInterrupt;
    },
    set: function (val) {
      this._disableOnInterrupt = val;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Destroy the instance and remove all event listeners attached
   * This also will reset CSS cursor to intial
   * @returns {void} Nothing
   */

  __proto.destroy = function () {
    this.disable();
  };
  /**
   * Update control by given deltaTime
   * @param camera Camera to update position
   * @param deltaTime Number of milisec to update
   * @returns {void} Nothing
   */


  __proto.update = function (camera, deltaTime) {
    if (!this._enabled) return;

    if (this._interrupted) {
      if (this._disableOnInterrupt) {
        this.disable();
      }

      return;
    }

    camera.yaw += this._speed * deltaTime / 100;
  }; // This is not documetned on purpose as it doesn't do nothing


  __proto.resize = function (size) {// DO NOTHING
  };
  /**
   * Enable this input and add event listeners
   * @returns {void} Nothing
   */


  __proto.enable = function () {
    if (this._enabled) return;

    if (!this._targetEl) {
      throw new View3DError(MESSAGES.ADD_CONTROL_FIRST, CODES.ADD_CONTROL_FIRST);
    }

    var targetEl = this._targetEl;
    targetEl.addEventListener(EVENTS.MOUSE_DOWN, this._onMouseDown, false);
    targetEl.addEventListener(EVENTS.TOUCH_START, this._onTouchStart, false);
    targetEl.addEventListener(EVENTS.TOUCH_END, this._onTouchEnd, false);
    targetEl.addEventListener(EVENTS.MOUSE_ENTER, this._onMouseEnter, false);
    targetEl.addEventListener(EVENTS.MOUSE_LEAVE, this._onMouseLeave, false);
    targetEl.addEventListener(EVENTS.WHEEL, this._onWheel, false);
    this._enabled = true;
  };
  /**
   * Disable this input and remove all event handlers
   * @returns {void} Nothing
   */


  __proto.disable = function () {
    if (!this._enabled || !this._targetEl) return;
    var targetEl = this._targetEl;
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
  }; // This does nothing


  __proto.sync = function (camera) {// Do nothing
  };
  /**
   * Set target element to attach event listener
   * @param element target element
   * @returns {void} Nothing
   */


  __proto.setElement = function (element) {
    this._targetEl = element;
  };

  __proto._setUninterruptedAfterDelay = function (delay) {
    var _this = this;

    if (this._hovering) return;

    this._clearTimeout();

    if (delay > 0) {
      this._interruptionTimer = window.setTimeout(function () {
        _this._interrupted = false;
        _this._interruptionTimer = -1;
      }, delay);
    } else {
      this._interrupted = false;
      this._interruptionTimer = -1;
    }
  };

  __proto._clearTimeout = function () {
    if (this._interruptionTimer >= 0) {
      window.clearTimeout(this._interruptionTimer);
      this._interruptionTimer = -1;
    }
  };

  return AutoControl;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
var CURSOR = {
  GRAB: "grab",
  GRABBING: "grabbing"
};

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Model's rotation control that supports both mouse & touch
 * @category Controls
 */

var RotateControl =
/*#__PURE__*/
function () {
  /**
   * Create new RotateControl instance
   * @param {object} options Options
   * @param {HTMLElement | null} [options.element] Target element.
   * @param {number} [options.duration=500] Motion's duration.
   * @param {function} [options.easing=(x: number) => 1 - Math.pow(1 - x, 3)] Motion's easing function.
   * @param {THREE.Vector2} [options.scale=new THREE.Vector2(1, 1)] Scale factor for panning, x is for horizontal and y is for vertical panning.
   * @param {boolean} [options.useGrabCursor=true] Whether to apply CSS style `cursor: grab` on the target element or not.
   * @param {boolean} [options.scaleToElement=true] Whether to scale control to fit element size.
   * @tutorial Adding Controls
   */
  function RotateControl(_a) {
    var _this = this;

    var _b = _a === void 0 ? {} : _a,
        _c = _b.element,
        element = _c === void 0 ? NULL_ELEMENT : _c,
        _d = _b.duration,
        duration = _d === void 0 ? ANIMATION_DURATION : _d,
        _e = _b.easing,
        easing = _e === void 0 ? EASING : _e,
        _f = _b.scale,
        scale = _f === void 0 ? new Vector2(1, 1) : _f,
        _g = _b.useGrabCursor,
        useGrabCursor = _g === void 0 ? true : _g,
        _h = _b.scaleToElement,
        scaleToElement = _h === void 0 ? true : _h; // Internal values


    this._targetEl = null;
    this._screenScale = new Vector2(0, 0);
    this._prevPos = new Vector2(0, 0);
    this._enabled = false;

    this._onMouseDown = function (evt) {
      if (evt.button !== MOUSE_BUTTON.LEFT) return;
      var targetEl = _this._targetEl;
      evt.preventDefault();
      targetEl.focus ? targetEl.focus() : window.focus();

      _this._prevPos.set(evt.clientX, evt.clientY);

      window.addEventListener(EVENTS.MOUSE_MOVE, _this._onMouseMove, false);
      window.addEventListener(EVENTS.MOUSE_UP, _this._onMouseUp, false);

      _this._setCursor(CURSOR.GRABBING);
    };

    this._onMouseMove = function (evt) {
      evt.preventDefault();
      var prevPos = _this._prevPos;
      var rotateDelta = new Vector2(evt.clientX, evt.clientY).sub(prevPos).multiply(_this._userScale);

      if (_this._scaleToElement) {
        rotateDelta.multiply(_this._screenScale);
      }

      _this._xMotion.setEndDelta(rotateDelta.x);

      _this._yMotion.setEndDelta(rotateDelta.y);

      prevPos.set(evt.clientX, evt.clientY);
    };

    this._onMouseUp = function () {
      _this._prevPos.set(0, 0);

      window.removeEventListener(EVENTS.MOUSE_MOVE, _this._onMouseMove, false);
      window.removeEventListener(EVENTS.MOUSE_UP, _this._onMouseUp, false);

      _this._setCursor(CURSOR.GRAB);
    };

    this._onTouchStart = function (evt) {
      evt.preventDefault();
      var touch = evt.touches[0];

      _this._prevPos.set(touch.clientX, touch.clientY);
    };

    this._onTouchMove = function (evt) {
      // Only the one finger motion should be considered
      if (evt.touches.length > 1) return;

      if (evt.cancelable !== false) {
        evt.preventDefault();
      }

      evt.stopPropagation();
      var touch = evt.touches[0];
      var prevPos = _this._prevPos;
      var rotateDelta = new Vector2(touch.clientX, touch.clientY).sub(prevPos).multiply(_this._userScale);

      if (_this._scaleToElement) {
        rotateDelta.multiply(_this._screenScale);
      }

      _this._xMotion.setEndDelta(rotateDelta.x);

      _this._yMotion.setEndDelta(rotateDelta.y);

      prevPos.set(touch.clientX, touch.clientY);
    };

    this._onTouchEnd = function (evt) {
      var touch = evt.touches[0];

      if (touch) {
        _this._prevPos.set(touch.clientX, touch.clientY);
      } else {
        _this._prevPos.set(0, 0);
      }
    };

    var targetEl = getElement(element);

    if (targetEl) {
      this.setElement(targetEl);
    }

    this._userScale = scale;
    this._useGrabCursor = useGrabCursor;
    this._scaleToElement = scaleToElement;
    this._xMotion = new Motion({
      duration: duration,
      range: INFINITE_RANGE,
      easing: easing
    });
    this._yMotion = new Motion({
      duration: duration,
      range: PITCH_RANGE,
      easing: easing
    });
  }

  var __proto = RotateControl.prototype;
  Object.defineProperty(__proto, "element", {
    /**
     * Control's current target element to attach event listeners
     * @readonly
     */
    get: function () {
      return this._targetEl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "scale", {
    /**
     * Scale factor for panning, x is for horizontal and y is for vertical panning.
     * @type THREE.Vector2
     * @see https://threejs.org/docs/#api/en/math/Vector2
     * @example
     * const rotateControl = new View3D.RotateControl();
     * rotateControl.scale.setX(2);
     */
    get: function () {
      return this._userScale;
    },
    set: function (val) {
      this._userScale.copy(val);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "useGrabCursor", {
    /**
     * Whether to apply CSS style `cursor: grab` on the target element or not
     * @default true
     * @example
     * const rotateControl = new View3D.RotateControl();
     * rotateControl.useGrabCursor = true;
     */
    get: function () {
      return this._useGrabCursor;
    },
    set: function (val) {
      if (!val) {
        this._setCursor("");

        this._useGrabCursor = false;
      } else {
        this._useGrabCursor = true;

        this._setCursor(CURSOR.GRAB);
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "scaleToElement", {
    /**
     * Whether to scale control to fit element size.
     * When this is true and {@link RotateControl#scale scale.x} is 1, panning through element's width will make 3d model's yaw rotate 360°.
     * When this is true and {@link RotateControl#scale scale.y} is 1, panning through element's height will make 3d model's pitch rotate 180°.
     * @default true
     * @example
     * import View3D, { RotateControl } from "@egjs/view3d";
     * const view3d = new View3D("#view3d-canvas");
     * const rotateControl = new RotateControl();
     * rotateControl.scaleToElement = true;
     * view3d.controller.add(rotateControl);
     * view3d.resize();
     */
    get: function () {
      return this._scaleToElement;
    },
    set: function (val) {
      this._scaleToElement = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "enabled", {
    /**
     * Whether this control is enabled or not
     * @readonly
     */
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Destroy the instance and remove all event listeners attached
   * This also will reset CSS cursor to intial
   * @returns {void} Nothing
   */

  __proto.destroy = function () {
    this.disable();
  };
  /**
   * Update control by given deltaTime
   * @param camera Camera to update position
   * @param deltaTime Number of milisec to update
   * @returns {void} Nothing
   */


  __proto.update = function (camera, deltaTime) {
    var xMotion = this._xMotion;
    var yMotion = this._yMotion;
    var delta = new Vector2(xMotion.update(deltaTime), yMotion.update(deltaTime));
    camera.yaw += delta.x;
    camera.pitch += delta.y;
  };
  /**
   * Resize control to match target size
   * This method is only meaningful when {@link RotateControl#scaleToElement scaleToElement} is enabled
   * @param size {@link https://threejs.org/docs/#api/en/math/Vector2 THREE.Vector2} instance of width(x), height(y)
   */


  __proto.resize = function (size) {
    this._screenScale.set(360 / size.x, 180 / size.y);
  };
  /**
   * Enable this input and add event listeners
   * @returns {void} Nothing
   */


  __proto.enable = function () {
    if (this._enabled) return;

    if (!this._targetEl) {
      throw new View3DError(MESSAGES.ADD_CONTROL_FIRST, CODES.ADD_CONTROL_FIRST);
    }

    var targetEl = this._targetEl;
    targetEl.addEventListener(EVENTS.MOUSE_DOWN, this._onMouseDown, false);
    targetEl.addEventListener(EVENTS.TOUCH_START, this._onTouchStart, false);
    targetEl.addEventListener(EVENTS.TOUCH_MOVE, this._onTouchMove, false);
    targetEl.addEventListener(EVENTS.TOUCH_END, this._onTouchEnd, false);
    this._enabled = true;

    this._setCursor(CURSOR.GRAB);
  };
  /**
   * Disable this input and remove all event handlers
   * @returns {void} Nothing
   */


  __proto.disable = function () {
    if (!this._enabled || !this._targetEl) return;
    var targetEl = this._targetEl;
    targetEl.removeEventListener(EVENTS.MOUSE_DOWN, this._onMouseDown, false);
    window.removeEventListener(EVENTS.MOUSE_MOVE, this._onMouseMove, false);
    window.removeEventListener(EVENTS.MOUSE_UP, this._onMouseUp, false);
    targetEl.removeEventListener(EVENTS.TOUCH_START, this._onTouchStart, false);
    targetEl.removeEventListener(EVENTS.TOUCH_MOVE, this._onTouchMove, false);
    targetEl.removeEventListener(EVENTS.TOUCH_END, this._onTouchEnd, false);

    this._setCursor("");

    this._enabled = false;
  };
  /**
   * Synchronize this control's state to given camera position
   * @param camera Camera to match state
   * @returns {void} Nothing
   */


  __proto.sync = function (camera) {
    this._xMotion.reset(camera.yaw);

    this._yMotion.reset(camera.pitch);
  };
  /**
   * Set target element to attach event listener
   * @param element target element
   * @returns {void} Nothing
   */


  __proto.setElement = function (element) {
    this._targetEl = element;
    this.resize(new Vector2(element.offsetWidth, element.offsetHeight));
  };

  __proto._setCursor = function (val) {
    var targetEl = this._targetEl;
    if (!this._useGrabCursor || !targetEl || !this._enabled) return;
    targetEl.style.cursor = val;
  };

  return RotateControl;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Model's translation control that supports both mouse & touch
 * @category Controls
 */

var TranslateControl =
/*#__PURE__*/
function () {
  /**
   * Create new TranslateControl instance
   * @param {object} options Options
   * @param {HTMLElement | null} [options.element] Target element.
   * @param {function} [options.easing=(x: number) => 1 - Math.pow(1 - x, 3)] Motion's easing function.
   * @param {THREE.Vector2} [options.scale=new THREE.Vector2(1, 1)] Scale factor for translation.
   * @param {boolean} [options.useGrabCursor=true] Whether to apply CSS style `cursor: grab` on the target element or not.
   * @param {boolean} [options.scaleToElement=true] Whether to scale control to fit element size.
   * @tutorial Adding Controls
   */
  function TranslateControl(_a) {
    var _this = this;

    var _b = _a === void 0 ? {} : _a,
        _c = _b.element,
        element = _c === void 0 ? NULL_ELEMENT : _c,
        _d = _b.easing,
        easing = _d === void 0 ? EASING : _d,
        _e = _b.scale,
        scale = _e === void 0 ? new Vector2(1, 1) : _e,
        _f = _b.useGrabCursor,
        useGrabCursor = _f === void 0 ? true : _f,
        _g = _b.scaleToElement,
        scaleToElement = _g === void 0 ? true : _g; // Internal values


    this._targetEl = null;
    this._enabled = false; // Sometimes, touchstart for second finger doesn't triggered.
    // This flag checks whether that happened

    this._touchInitialized = false;
    this._prevPos = new Vector2(0, 0);
    this._screenSize = new Vector2(0, 0);

    this._onMouseDown = function (evt) {
      if (evt.button !== MOUSE_BUTTON.RIGHT) return;
      var targetEl = _this._targetEl;
      evt.preventDefault();
      targetEl.focus ? targetEl.focus() : window.focus();

      _this._prevPos.set(evt.clientX, evt.clientY);

      window.addEventListener(EVENTS.MOUSE_MOVE, _this._onMouseMove, false);
      window.addEventListener(EVENTS.MOUSE_UP, _this._onMouseUp, false);

      _this._setCursor(CURSOR.GRABBING);
    };

    this._onMouseMove = function (evt) {
      evt.preventDefault();
      var prevPos = _this._prevPos;
      var delta = new Vector2(evt.clientX, evt.clientY).sub(prevPos).multiply(_this._userScale); // X value is negated to match cursor direction

      _this._xMotion.setEndDelta(-delta.x);

      _this._yMotion.setEndDelta(delta.y);

      prevPos.set(evt.clientX, evt.clientY);
    };

    this._onMouseUp = function () {
      _this._prevPos.set(0, 0);

      window.removeEventListener(EVENTS.MOUSE_MOVE, _this._onMouseMove, false);
      window.removeEventListener(EVENTS.MOUSE_UP, _this._onMouseUp, false);

      _this._setCursor(CURSOR.GRAB);
    };

    this._onTouchStart = function (evt) {
      // Only the two finger motion should be considered
      if (evt.touches.length !== 2) return;
      evt.preventDefault();

      _this._prevPos.copy(_this._getTouchesMiddle(evt.touches));

      _this._touchInitialized = true;
    };

    this._onTouchMove = function (evt) {
      // Only the two finger motion should be considered
      if (evt.touches.length !== 2) return;

      if (evt.cancelable !== false) {
        evt.preventDefault();
      }

      evt.stopPropagation();
      var prevPos = _this._prevPos;

      var middlePoint = _this._getTouchesMiddle(evt.touches);

      if (!_this._touchInitialized) {
        prevPos.copy(middlePoint);
        _this._touchInitialized = true;
        return;
      }

      var delta = new Vector2().subVectors(middlePoint, prevPos).multiply(_this._userScale); // X value is negated to match cursor direction

      _this._xMotion.setEndDelta(-delta.x);

      _this._yMotion.setEndDelta(delta.y);

      prevPos.copy(middlePoint);
    };

    this._onTouchEnd = function (evt) {
      // Only the two finger motion should be considered
      if (evt.touches.length !== 2) {
        _this._touchInitialized = false;
        return;
      } // Three fingers to two fingers


      _this._prevPos.copy(_this._getTouchesMiddle(evt.touches));

      _this._touchInitialized = true;
    };

    this._onContextMenu = function (evt) {
      evt.preventDefault();
    };

    var targetEl = getElement(element);

    if (targetEl) {
      this.setElement(targetEl);
    }

    this._xMotion = new Motion({
      duration: 0,
      range: INFINITE_RANGE,
      easing: easing
    });
    this._yMotion = new Motion({
      duration: 0,
      range: INFINITE_RANGE,
      easing: easing
    });
    this._userScale = scale;
    this._useGrabCursor = useGrabCursor;
    this._scaleToElement = scaleToElement;
  }

  var __proto = TranslateControl.prototype;
  Object.defineProperty(__proto, "element", {
    /**
     * Control's current target element to attach event listeners
     * @readonly
     */
    get: function () {
      return this._targetEl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "scale", {
    /**
     * Scale factor for translation
     * @type THREE.Vector2
     * @see https://threejs.org/docs/#api/en/math/Vector2
     * @example
     * import { TranslateControl } from "@egjs/view3d";
     * const translateControl = new TranslateControl();
     * translateControl.scale.set(2, 2);
     */
    get: function () {
      return this._userScale;
    },
    set: function (val) {
      this._userScale.copy(val);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "useGrabCursor", {
    /**
     * Whether to apply CSS style `cursor: grab` on the target element or not
     * @default true
     * @example
     * import { TranslateControl } from "@egjs/view3d";
     * const translateControl = new TranslateControl();
     * translateControl.useGrabCursor = true;
     */
    get: function () {
      return this._useGrabCursor;
    },
    set: function (val) {
      if (!val) {
        this._setCursor("");

        this._useGrabCursor = false;
      } else {
        this._useGrabCursor = true;

        this._setCursor(CURSOR.GRAB);
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "scaleToElement", {
    /**
     * Scale control to fit element size.
     * When this is true, camera's pivot change will correspond same amount you've dragged.
     * @default true
     * @example
     * import View3D, { TranslateControl } from "@egjs/view3d";
     * const view3d = new View3D("#view3d-canvas");
     * const translateControl = new TranslateControl();
     * translateControl.scaleToElement = true;
     * view3d.controller.add(translateControl);
     * view3d.resize();
     */
    get: function () {
      return this._scaleToElement;
    },
    set: function (val) {
      this._scaleToElement = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "enabled", {
    /**
     * Whether this control is enabled or not
     * @readonly
     */
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Destroy the instance and remove all event listeners attached
   * This also will reset CSS cursor to intial
   * @returns {void} Nothing
   */

  __proto.destroy = function () {
    this.disable();
  };
  /**
   * Update control by given deltaTime
   * @param deltaTime Number of milisec to update
   * @returns {void} Nothing
   */


  __proto.update = function (camera, deltaTime) {
    var screenSize = this._screenSize;
    var delta = new Vector2(this._xMotion.update(deltaTime), this._yMotion.update(deltaTime));
    var viewXDir = new Vector3(1, 0, 0).applyQuaternion(camera.threeCamera.quaternion);
    var viewYDir = new Vector3(0, 1, 0).applyQuaternion(camera.threeCamera.quaternion);

    if (this._scaleToElement) {
      var screenScale = new Vector2(camera.renderWidth, camera.renderHeight).divide(screenSize);
      delta.multiply(screenScale);
    }

    camera.pivot.add(viewXDir.multiplyScalar(delta.x));
    camera.pivot.add(viewYDir.multiplyScalar(delta.y));
  };
  /**
   * Resize control to match target size
   * This method is only meaningful when {@link RotateControl#scaleToElementSize scaleToElementSize} is enabled
   * @param size {@link https://threejs.org/docs/#api/en/math/Vector2 THREE.Vector2} instance of width(x), height(y)
   */


  __proto.resize = function (size) {
    var screenSize = this._screenSize;
    screenSize.copy(size);
  };
  /**
   * Enable this input and add event listeners
   * @returns {void} Nothing
   */


  __proto.enable = function () {
    if (this._enabled) return;

    if (!this._targetEl) {
      throw new View3DError(MESSAGES.ADD_CONTROL_FIRST, CODES.ADD_CONTROL_FIRST);
    }

    var targetEl = this._targetEl;
    targetEl.addEventListener(EVENTS.MOUSE_DOWN, this._onMouseDown, false);
    targetEl.addEventListener(EVENTS.TOUCH_START, this._onTouchStart, false);
    targetEl.addEventListener(EVENTS.TOUCH_MOVE, this._onTouchMove, false);
    targetEl.addEventListener(EVENTS.TOUCH_END, this._onTouchEnd, false);
    targetEl.addEventListener(EVENTS.CONTEXT_MENU, this._onContextMenu, false);
    this._enabled = true;

    this._setCursor(CURSOR.GRAB);
  };
  /**
   * Disable this input and remove all event handlers
   * @returns {void} Nothing
   */


  __proto.disable = function () {
    if (!this._enabled || !this._targetEl) return;
    var targetEl = this._targetEl;
    targetEl.removeEventListener(EVENTS.MOUSE_DOWN, this._onMouseDown, false);
    window.removeEventListener(EVENTS.MOUSE_MOVE, this._onMouseMove, false);
    window.removeEventListener(EVENTS.MOUSE_UP, this._onMouseUp, false);
    targetEl.removeEventListener(EVENTS.TOUCH_START, this._onTouchStart, false);
    targetEl.removeEventListener(EVENTS.TOUCH_MOVE, this._onTouchMove, false);
    targetEl.removeEventListener(EVENTS.TOUCH_END, this._onTouchEnd, false);
    targetEl.removeEventListener(EVENTS.CONTEXT_MENU, this._onContextMenu, false);

    this._setCursor("");

    this._enabled = false;
  };
  /**
   * Synchronize this control's state to given camera position
   * @param camera Camera to match state
   * @returns {void} Nothing
   */


  __proto.sync = function (camera) {
    this._xMotion.reset(0);

    this._yMotion.reset(0);
  };
  /**
   * Set target element to attach event listener
   * @param element target element
   * @returns {void} Nothing
   */


  __proto.setElement = function (element) {
    this._targetEl = element;
    this.resize(new Vector2(element.offsetWidth, element.offsetHeight));
  };

  __proto._setCursor = function (val) {
    var targetEl = this._targetEl;
    if (!this._useGrabCursor || !targetEl || !this._enabled) return;
    targetEl.style.cursor = val;
  };

  __proto._getTouchesMiddle = function (touches) {
    return new Vector2(touches[0].clientX + touches[1].clientX, touches[0].clientY + touches[1].clientY).multiplyScalar(0.5);
  };

  return TranslateControl;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Distance controller handling both mouse wheel and pinch zoom
 * @category Controls
 */

var DistanceControl =
/*#__PURE__*/
function () {
  /**
   * Create new DistanceControl instance
   * @tutorial Adding Controls
   * @param {object} options Options
   * @param {HTMLElement | string | null} [options.element=null] Attaching element / selector of the element.
   * @param {number} [options.duration=500] Motion's duration.
   * @param {object} [options.range={min: 0, max: 500}] Motion's range.
   * @param {function} [options.easing=(x: number) => 1 - Math.pow(1 - x, 3)] Motion's easing function.
   */
  function DistanceControl(_a) {
    var _this = this;

    var _b = _a === void 0 ? {} : _a,
        _c = _b.element,
        element = _c === void 0 ? NULL_ELEMENT : _c,
        _d = _b.duration,
        duration = _d === void 0 ? ANIMATION_DURATION : _d,
        _e = _b.range,
        range = _e === void 0 ? DISTANCE_RANGE : _e,
        _f = _b.easing,
        easing = _f === void 0 ? EASING : _f; // Options


    this._scale = 1; // Internal values

    this._targetEl = null;
    this._scaleModifier = 0.25;
    this._prevTouchDistance = -1;
    this._enabled = false;

    this._onWheel = function (evt) {
      if (evt.deltaY === 0) return;
      evt.preventDefault();
      evt.stopPropagation();
      var animation = _this._motion;
      var delta = _this._scale * _this._scaleModifier * evt.deltaY;
      animation.setEndDelta(delta);
    };

    this._onTouchMove = function (evt) {
      var touches = evt.touches;
      if (touches.length !== 2) return;

      if (evt.cancelable !== false) {
        evt.preventDefault();
      }

      evt.stopPropagation();
      var animation = _this._motion;
      var prevTouchDistance = _this._prevTouchDistance;
      var touchPoint1 = new Vector2(touches[0].pageX, touches[0].pageY);
      var touchPoint2 = new Vector2(touches[1].pageX, touches[1].pageY);
      var touchDiff = touchPoint1.sub(touchPoint2);

      var touchDistance = touchDiff.length() * _this._scale * _this._scaleModifier;

      var delta = -(touchDistance - prevTouchDistance);
      _this._prevTouchDistance = touchDistance;
      if (prevTouchDistance < 0) return;
      animation.setEndDelta(delta);
    };

    this._onTouchEnd = function () {
      _this._prevTouchDistance = -1;
    };

    var targetEl = getElement(element);

    if (targetEl) {
      this.setElement(targetEl);
    }

    this._motion = new Motion({
      duration: duration,
      range: range,
      easing: easing
    });
  }

  var __proto = DistanceControl.prototype;
  Object.defineProperty(__proto, "element", {
    /**
     * Control's current target element to attach event listeners
     * @readonly
     */
    get: function () {
      return this._targetEl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "scale", {
    /**
     * Scale factor of the distance
     * @type number
     * @example
     * import { DistanceControl } from "@egjs/view3d";
     * const distanceControl = new DistanceControl();
     * distanceControl.scale = 2;
     */
    get: function () {
      return this._scale;
    },
    set: function (val) {
      this._scale = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "enabled", {
    /**
     * Whether this control is enabled or not
     * @readonly
     */
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Destroy the instance and remove all event listeners attached
   * @returns {void} Nothing
   */

  __proto.destroy = function () {
    this.disable();
  };
  /**
   * Update control by given deltaTime
   * @param camera Camera to update position
   * @param deltaTime Number of milisec to update
   * @returns {void} Nothing
   */


  __proto.update = function (camera, deltaTime) {
    var motion = this._motion;
    camera.distance += motion.update(deltaTime);
  }; // This is not documetned on purpose as it doesn't do nothing


  __proto.resize = function (size) {// DO NOTHING
  };
  /**
   * Enable this input and add event listeners
   * @returns {void} Nothing
   */


  __proto.enable = function () {
    if (this._enabled) return;

    if (!this._targetEl) {
      throw new View3DError(MESSAGES.ADD_CONTROL_FIRST, CODES.ADD_CONTROL_FIRST);
    }

    var targetEl = this._targetEl;
    targetEl.addEventListener(EVENTS.WHEEL, this._onWheel, false);
    targetEl.addEventListener(EVENTS.TOUCH_MOVE, this._onTouchMove, false);
    targetEl.addEventListener(EVENTS.TOUCH_END, this._onTouchEnd, false);
    this._enabled = true;
  };
  /**
   * Disable this input and remove all event handlers
   * @returns {void} Nothing
   */


  __proto.disable = function () {
    if (!this._enabled || !this._targetEl) return;
    var targetEl = this._targetEl;
    targetEl.removeEventListener(EVENTS.WHEEL, this._onWheel, false);
    targetEl.removeEventListener(EVENTS.TOUCH_MOVE, this._onTouchMove, false);
    targetEl.removeEventListener(EVENTS.TOUCH_END, this._onTouchEnd, false);
    this._enabled = false;
  };
  /**
   * Synchronize this control's state to given camera position
   * @param camera Camera to match state
   * @returns {void} Nothing
   */


  __proto.sync = function (camera) {
    this._motion.range.min = camera.minDistance;
    this._motion.range.max = camera.maxDistance;

    this._motion.reset(camera.distance);
  };
  /**
   * Set target element to attach event listener
   * @param element target element
   * @returns {void} Nothing
   */


  __proto.setElement = function (element) {
    this._targetEl = element;
  };

  return DistanceControl;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Aggregation of {@link RotateControl}, {@link TranslateControl}, and {@link DistanceControl}.
 * @category Controls
 */

var OrbitControl =
/*#__PURE__*/
function () {
  /**
   * Create new OrbitControl instance
   * @param {object} options Options
   * @param {HTMLElement | string | null} [options.element=null] Attaching element / selector of the element
   * @param {object} [options.rotate={}] Constructor options of {@link RotateControl}
   * @param {object} [options.translate={}] Constructor options of {@link TranslateControl}
   * @param {object} [options.distance={}] Constructor options of {@link DistanceControl}
   * @tutorial Adding Controls
   */
  function OrbitControl(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.element,
        element = _c === void 0 ? NULL_ELEMENT : _c,
        _d = _b.rotate,
        rotate = _d === void 0 ? {} : _d,
        _e = _b.translate,
        translate = _e === void 0 ? {} : _e,
        _f = _b.distance,
        distance = _f === void 0 ? {} : _f;

    this._enabled = false;
    this._targetEl = getElement(element);
    this._rotateControl = new RotateControl(__assign(__assign({}, rotate), {
      element: rotate.element || this._targetEl
    }));
    this._translateControl = new TranslateControl(__assign(__assign({}, translate), {
      element: translate.element || this._targetEl
    }));
    this._distanceControl = new DistanceControl(__assign(__assign({}, distance), {
      element: distance.element || this._targetEl
    }));
  }

  var __proto = OrbitControl.prototype;
  Object.defineProperty(__proto, "element", {
    /**
     * Control's current target element to attach event listeners
     * @readonly
     */
    get: function () {
      return this._targetEl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "enabled", {
    /**
     * Whether this control is enabled or not
     * @readonly
     */
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "rotate", {
    /**
     * {@link RotateControl} of this control
     */
    get: function () {
      return this._rotateControl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "translate", {
    /**
     * {@link TranslateControl} of this control
     */
    get: function () {
      return this._translateControl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "distance", {
    /**
     * {@link DistanceControl} of this control
     */
    get: function () {
      return this._distanceControl;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Destroy the instance and remove all event listeners attached
   * This also will reset CSS cursor to intial
   * @returns {void} Nothing
   */

  __proto.destroy = function () {
    this._rotateControl.destroy();

    this._translateControl.destroy();

    this._distanceControl.destroy();
  };
  /**
   * Update control by given deltaTime
   * @param camera Camera to update position
   * @param deltaTime Number of milisec to update
   * @returns {void} Nothing
   */


  __proto.update = function (camera, deltaTime) {
    this._rotateControl.update(camera, deltaTime);

    this._translateControl.update(camera, deltaTime);

    this._distanceControl.update(camera, deltaTime);
  };
  /**
   * Resize control to match target size
   * @param size {@link https://threejs.org/docs/#api/en/math/Vector2 THREE.Vector2} instance of width(x), height(y)
   */


  __proto.resize = function (size) {
    this._rotateControl.resize(size);

    this._translateControl.resize(size);

    this._distanceControl.resize(size);
  };
  /**
   * Enable this control and add event listeners
   * @returns {void} Nothingß
   */


  __proto.enable = function () {
    if (this._enabled) return;

    if (!this._targetEl) {
      throw new View3DError(MESSAGES.ADD_CONTROL_FIRST, CODES.ADD_CONTROL_FIRST);
    }

    this._rotateControl.enable();

    this._translateControl.enable();

    this._distanceControl.enable();

    this._enabled = true;
  };
  /**
   * Disable this control and remove all event handlers
   * @returns {void} Nothing
   */


  __proto.disable = function () {
    if (!this._enabled || !this._targetEl) return;

    this._rotateControl.disable();

    this._translateControl.disable();

    this._distanceControl.disable();

    this._enabled = false;
  };
  /**
   * Synchronize this control's state to given camera position
   * @param camera Camera to match state
   * @returns {void} Nothing
   */


  __proto.sync = function (camera) {
    this._rotateControl.sync(camera);

    this._translateControl.sync(camera);

    this._distanceControl.sync(camera);
  };
  /**
   * Set target element to attach event listener
   * @param element target element
   * @returns {void} Nothing
   */


  __proto.setElement = function (element) {
    this._targetEl = element;

    this._rotateControl.setElement(element);

    this._translateControl.setElement(element);

    this._distanceControl.setElement(element);
  };

  return OrbitControl;
}();

/**
 * DracoLoader
 * @category Loaders
 */

var DracoLoader =
/*#__PURE__*/
function () {
  function DracoLoader() {}
  /**
   * Load new DRC model from the given url
   * @param url URL to fetch .drc file
   * @param options Options for a loaded model
   * @returns Promise that resolves {@link Model}
   */


  var __proto = DracoLoader.prototype;

  __proto.load = function (url, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var loader = new DRACOLoader();
    loader.setCrossOrigin("anonymous");
    loader.setDecoderPath(DRACO_DECODER_URL);
    loader.manager = new LoadingManager();
    return new Promise(function (resolve, reject) {
      loader.load(url, function (geometry) {
        var model = _this._parseToModel(geometry, options);

        loader.dispose();
        resolve(model);
      }, undefined, function (err) {
        loader.dispose();
        reject(err);
      });
    });
  };

  __proto._parseToModel = function (geometry, _a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.fixSkinnedBbox,
        fixSkinnedBbox = _c === void 0 ? false : _c,
        _d = _b.color,
        color = _d === void 0 ? 0xffffff : _d,
        _e = _b.point,
        point = _e === void 0 ? false : _e,
        _f = _b.pointOptions,
        pointOptions = _f === void 0 ? {} : _f;

    geometry.computeVertexNormals();
    var material = point ? new PointsMaterial(__assign({
      color: color
    }, pointOptions)) : new MeshStandardMaterial({
      color: color
    });
    var mesh = point ? new Points(geometry, material) : new Mesh(geometry, material);
    var model = new Model({
      scenes: [mesh],
      fixSkinnedBbox: fixSkinnedBbox
    });
    return model;
  };

  return DracoLoader;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * THREE.DirectionalLight wrapper that will automatically update its shadow size to model
 * Shadow is enabled by default, use {@link AutoDirectionalLight#disableShadow disableShadow} to disable it
 * @category Environment
 */

var AutoDirectionalLight =
/*#__PURE__*/
function () {
  /**
   * Create new instance of AutoDirectionalLight
   * @param [color="#ffffff"] Color of the light
   * @param [intensity=1] Intensity of the light
   * @param {object} [options={}] Additional options
   * @param {THREE.Vector3} [options.direction=new THREE.Vector3(-1, -1, -1)] Direction of the light
   */
  function AutoDirectionalLight(color, intensity, _a) {
    if (color === void 0) {
      color = "#ffffff";
    }

    if (intensity === void 0) {
      intensity = 1;
    }

    var _b = (_a === void 0 ? {} : _a).direction,
        direction = _b === void 0 ? new Vector3(-1, -1, -1) : _b;
    this._light = new DirectionalLight(color, intensity); // Set the default position ratio of the directional light

    var light = this._light;
    light.castShadow = true; // Is enabled by default

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.matrixAutoUpdate = false;
    this._direction = direction.clone().normalize();
  }

  var __proto = AutoDirectionalLight.prototype;
  Object.defineProperty(__proto, "objects", {
    /**
     * Array of lights that used in this preset
     * @see https://threejs.org/docs/#api/en/lights/Light
     */
    get: function () {
      return [this._light, this._light.target];
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "light", {
    /**
     * The actual THREE.DirectionalLight
     * @type THREE#DirectionalLight
     * @see https://threejs.org/docs/#api/en/lights/DirectionalLight
     */
    get: function () {
      return this._light;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "position", {
    /**
     * Position of the light
     * @type THREE#Vector3
     * @see https://threejs.org/docs/#api/en/math/Vector3
     */
    get: function () {
      return this._light.position;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "direction", {
    get: function () {
      return this._direction;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Make light cast a shadow
   */

  __proto.enableShadow = function () {
    this._light.castShadow = true;
  };
  /**
   * Make light don't cast a shadow
   */


  __proto.disableShadow = function () {
    this._light.castShadow = false;
  };
  /**
   * Modify light's position & shadow camera size from model's bounding box
   * @param model Model to fit size
   * @param scale Scale factor for shadow camera size
   */


  __proto.fit = function (model, _a) {
    var _b = (_a === void 0 ? {} : _a).scale,
        scale = _b === void 0 ? 1.5 : _b;
    var bbox = model.bbox;
    var light = this._light;
    var direction = this._direction;
    var boxSize = bbox.getSize(new Vector3()).length();
    var boxCenter = bbox.getCenter(new Vector3()); // Position fitting

    var newPos = new Vector3().addVectors(boxCenter, direction.clone().negate().multiplyScalar(boxSize * 0.5));
    light.position.copy(newPos);
    light.target.position.copy(boxCenter);
    light.updateMatrix(); // Shadowcam fitting

    var shadowCam = light.shadow.camera;
    shadowCam.near = 0;
    shadowCam.far = 2 * boxSize;
    shadowCam.position.copy(newPos);
    shadowCam.lookAt(boxCenter);
    shadowCam.left = -1;
    shadowCam.right = 1;
    shadowCam.top = 1;
    shadowCam.bottom = -1;
    shadowCam.updateMatrixWorld();
    shadowCam.updateProjectionMatrix();
    var bboxPoints = getBoxPoints(bbox);
    var projectedPoints = bboxPoints.map(function (position) {
      return position.project(shadowCam);
    });
    var screenBbox = new Box3().setFromPoints(projectedPoints);
    shadowCam.left *= -scale * screenBbox.min.x;
    shadowCam.right *= scale * screenBbox.max.x;
    shadowCam.top *= scale * screenBbox.max.y;
    shadowCam.bottom *= -scale * screenBbox.min.y;
    shadowCam.updateProjectionMatrix();
  };

  return AutoDirectionalLight;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Helper class to easily add shadow plane under your 3D model
 * @category Environment
 * @example
 * import View3D, { ShadowPlane } from "@egjs/view3d";
 *
 * const view3d = new View3D("#view3d-canvas");
 * const shadowPlane = new ShadowPlane();
 * view3d.scene.addEnv(shadowPlane);
 */

var ShadowPlane =
/*#__PURE__*/
function () {
  /**
   * Create new shadow plane
   * @param {object} options Options
   * @param {number} [options.size=10000] Size of the shadow plane
   * @param {number} [options.opacity=0.3] Opacity of the shadow
   */
  function ShadowPlane(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.size,
        size = _c === void 0 ? 10000 : _c,
        _d = _b.opacity,
        opacity = _d === void 0 ? 0.3 : _d;

    this.geometry = new PlaneGeometry(size, size, 100, 100);
    this.material = new ShadowMaterial({
      opacity: opacity
    });
    this.mesh = new Mesh(this.geometry, this.material);
    var mesh = this.mesh;
    mesh.rotateX(-Math.PI / 2);
    mesh.receiveShadow = true;
  }

  var __proto = ShadowPlane.prototype;
  Object.defineProperty(__proto, "objects", {
    get: function () {
      return [this.mesh];
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "opacity", {
    /**
     * Shadow opacity, value can be between 0(invisible) and 1(solid)
     * @type number
     */
    get: function () {
      return this.material.opacity;
    },
    set: function (val) {
      this.material.opacity = val;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Fit shadow plane's size & position to given model
   * @param model Model to fit
   */

  __proto.fit = function (model, _a) {
    var _b = _a === void 0 ? {} : _a,
        floorPosition = _b.floorPosition,
        _c = _b.floorRotation,
        floorRotation = _c === void 0 ? new Quaternion(0, 0, 0, 1) : _c;

    var modelPosition = model.scene.position;
    var localYAxis = new Vector3(0, 1, 0).applyQuaternion(floorRotation); // Apply position

    if (floorPosition) {
      // Apply a tiny offset to prevent z-fighting with original model
      this.mesh.position.copy(floorPosition.clone().add(localYAxis.clone().multiplyScalar(0.001)));
    } else {
      var modelBbox = model.bbox;
      var modelBboxYOffset = modelBbox.getCenter(new Vector3()).y - modelBbox.min.y;
      var modelFloor = new Vector3().addVectors(modelPosition, // Apply a tiny offset to prevent z-fighting with original model
      localYAxis.multiplyScalar(-modelBboxYOffset + 0.0001));
      this.mesh.position.copy(modelFloor);
    } // Apply rotation


    var rotX90 = new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0));
    var shadowRotation = new Quaternion().multiplyQuaternions(floorRotation, rotX90);
    this.mesh.quaternion.copy(shadowRotation);
    this.mesh.updateMatrix();
  };

  return ShadowPlane;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * GLTFLoader
 * @category Loaders
 */

var GLTFLoader =
/*#__PURE__*/
function () {
  /**
   * Create a new instance of GLTFLoader
   */
  function GLTFLoader() {
    this._loader = new GLTFLoader$1();
    this._dracoLoader = new DRACOLoader();
    var loader = this._loader;
    loader.setCrossOrigin("anonymous");
    var dracoLoader = this._dracoLoader;
    dracoLoader.setDecoderPath(DRACO_DECODER_URL);
    loader.setDRACOLoader(dracoLoader);
  }

  var __proto = GLTFLoader.prototype;
  Object.defineProperty(__proto, "loader", {
    get: function () {
      return this._loader;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "dracoLoader", {
    get: function () {
      return this._dracoLoader;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Load new GLTF model from the given url
   * @param url URL to fetch glTF/glb file
   * @param options Options for a loaded model
   * @returns Promise that resolves {@link Model}
   */

  __proto.load = function (url, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var loader = this._loader;
    loader.manager = new LoadingManager();
    return new Promise(function (resolve, reject) {
      loader.load(url, function (gltf) {
        var model = _this._parseToModel(gltf, options);

        resolve(model);
      }, undefined, function (err) {
        reject(err);
      });
    });
  };
  /**
   * Load preset generated from View3D editor.
   * @param viewer Instance of the {@link View3D}.
   * @param url Preset url
   * @param {object} options Options
   * @param {string} [options.path] Base path for additional files.
   * @param {function} [options.onLoad] Callback which called after each model LOD is loaded.
   * @returns {Model} Model instance with highest LOD
   */


  __proto.loadPreset = function (viewer, url, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var loader = this._loader;
    var fileLoader = new FileLoader();
    return fileLoader.loadAsync(url).then(function (jsonRaw) {
      return new Promise(function (resolve, reject) {
        var json = JSON.parse(jsonRaw);
        var baseURL = LoaderUtils.extractUrlBase(url); // Reset

        viewer.scene.reset();
        viewer.camera.reset();
        viewer.animator.reset();
        var modelOptions = json.model;
        var cameraOptions = json.camera;
        var environmentOptions = json.env;
        viewer.camera.setDefaultPose({
          yaw: cameraOptions.yaw,
          pitch: cameraOptions.pitch
        });
        viewer.camera.minDistance = cameraOptions.distanceRange[0];
        viewer.camera.maxDistance = cameraOptions.distanceRange[1];

        if (environmentOptions.background) {
          viewer.scene.setBackground(new Color(environmentOptions.background));
        }

        var shadowPlane = new ShadowPlane();
        shadowPlane.opacity = environmentOptions.shadow.opacity;
        viewer.scene.addEnv(shadowPlane);
        var ambientOptions = environmentOptions.ambient;
        var ambient = new AmbientLight(new Color(ambientOptions.color), ambientOptions.intensity);
        viewer.scene.addEnv(ambient);
        var lightOptions = [environmentOptions.light1, environmentOptions.light2, environmentOptions.light3];
        lightOptions.forEach(function (lightOption) {
          var lightDirection = new Vector3(lightOption.x, lightOption.y, lightOption.z).negate();
          var directional = new AutoDirectionalLight(new Color(lightOption.color), lightOption.intensity, {
            direction: lightDirection
          });
          directional.light.castShadow = lightOption.castShadow;
          directional.light.updateMatrixWorld();
          viewer.scene.addEnv(directional);
        });
        var isFirstLoad = true;
        var loadFlags = json.LOD.map(function () {
          return false;
        });
        json.LOD.forEach(function (fileName, lodIndex) {
          var glbURL = _this._resolveURL("" + baseURL + fileName, options.path || "");

          loader.load(glbURL, function (gltf) {
            loadFlags[lodIndex] = true;
            var higherLODLoaded = loadFlags.slice(lodIndex + 1).some(function (loaded) {
              return loaded;
            });
            if (higherLODLoaded) return;

            var model = _this._parseToModel(gltf);

            viewer.display(model, {
              size: modelOptions.size,
              resetView: isFirstLoad
            });
            isFirstLoad = false;
            model.castShadow = modelOptions.castShadow;
            model.receiveShadow = modelOptions.receiveShadow;

            if (options.onLoad) {
              options.onLoad(model, lodIndex);
            }

            if (lodIndex === json.LOD.length - 1) {
              resolve(model);
            }
          }, undefined, function (err) {
            reject(err);
          });
        });
      });
    });
  };
  /**
   * Load new GLTF model from the given files
   * @param files Files that has glTF/glb and all its associated resources like textures and .bin data files
   * @param options Options for a loaded model
   * @returns Promise that resolves {@link Model}
   */


  __proto.loadFromFiles = function (files, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var objectURLs = [];

    var revokeURLs = function () {
      objectURLs.forEach(function (url) {
        URL.revokeObjectURL(url);
      });
    };

    return new Promise(function (resolve, reject) {
      if (files.length <= 0) {
        reject(new Error("No files found"));
        return;
      }

      var gltfFile = files.find(function (file) {
        return /\.(gltf|glb)$/i.test(file.name);
      });

      if (!gltfFile) {
        reject(new Error("No glTF file found"));
        return;
      }

      var filesMap = new Map();
      files.forEach(function (file) {
        filesMap.set(file.name, file);
      });
      var gltfURL = URL.createObjectURL(gltfFile);
      objectURLs.push(gltfURL);
      var manager = new LoadingManager();
      manager.setURLModifier(function (fileURL) {
        var fileNameResult = /[^\/|\\]+$/.exec(fileURL);
        var fileName = fileNameResult && fileNameResult[0] || "";

        if (filesMap.has(fileName)) {
          var blob = filesMap.get(fileName);
          var blobURL = URL.createObjectURL(blob);
          objectURLs.push(blobURL);
          return blobURL;
        }

        return fileURL;
      });
      var loader = _this._loader;
      loader.manager = manager;
      loader.load(gltfURL, function (gltf) {
        var model = _this._parseToModel(gltf, options);

        resolve(model);
        revokeURLs();
      }, undefined, function (err) {
        reject(err);
        revokeURLs();
      });
    });
  };
  /**
   * Parse from array buffer
   * @param data glTF asset to parse, as an ArrayBuffer or JSON string.
   * @param path The base path from which to find subsequent glTF resources such as textures and .bin data files.
   * @param options Options for a loaded model
   * @returns Promise that resolves {@link Model}
   */


  __proto.parse = function (data, path, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var loader = this._loader;
    loader.manager = new LoadingManager();
    return new Promise(function (resolve, reject) {
      loader.parse(data, path, function (gltf) {
        var model = _this._parseToModel(gltf, options);

        resolve(model);
      }, function (err) {
        reject(err);
      });
    });
  };

  __proto._parseToModel = function (gltf, _a) {
    var _b = (_a === void 0 ? {} : _a).fixSkinnedBbox,
        fixSkinnedBbox = _b === void 0 ? false : _b;
    var model = new Model({
      scenes: gltf.scenes,
      animations: gltf.animations,
      fixSkinnedBbox: fixSkinnedBbox
    });
    model.meshes.forEach(function (mesh) {
      var materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach(function (mat) {
        if (mat.map) {
          mat.map.encoding = sRGBEncoding;
        }
      });
    });
    return model;
  }; // Grabbed from three.js/GLTFLoader
  // Original code: https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/GLTFLoader.js#L1221
  // License: MIT


  __proto._resolveURL = function (url, path) {
    // Invalid URL
    if (typeof url !== "string" || url === "") return ""; // Host Relative URL

    if (/^https?:\/\//i.test(path) && /^\//.test(url)) {
      path = path.replace(/(^https?:\/\/[^\/]+).*/i, "$1");
    } // Absolute URL http://,https://,//


    if (/^(https?:)?\/\//i.test(url)) return url; // Data URI

    if (/^data:.*,.*$/i.test(url)) return url; // Blob URL

    if (/^blob:.*$/i.test(url)) return url; // Relative URL

    return path + url;
  };

  return GLTFLoader;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Texture loader
 * @category Loaders
 */

var TextureLoader =
/*#__PURE__*/
function () {
  /**
   * Create new TextureLoader instance
   * @param renderer {@link Renderer} instance of View3D
   */
  function TextureLoader(renderer) {
    this._renderer = renderer;
  }
  /**
   * Create new {@link https://threejs.org/docs/index.html#api/en/textures/Texture Texture} with given url
   * Texture's {@link https://threejs.org/docs/index.html#api/en/textures/Texture.flipY flipY} property is `true` by Three.js's policy, so be careful when using it as a map texture.
   * @param url url to fetch image
   */


  var __proto = TextureLoader.prototype;

  __proto.load = function (url) {
    return new Promise(function (resolve, reject) {
      var loader = new TextureLoader$1();
      loader.load(url, resolve, undefined, reject);
    });
  };
  /**
   * Create new {@link https://threejs.org/docs/#api/en/renderers/WebGLCubeRenderTarget WebGLCubeRenderTarget} with given equirectangular image url
   * Be sure that equirectangular image has height of power of 2, as it will be resized if it isn't
   * @param url url to fetch equirectangular image
   * @returns WebGLCubeRenderTarget created
   */


  __proto.loadEquirectagularTexture = function (url) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      var loader = new TextureLoader$1();
      loader.load(url, function (skyboxTexture) {
        resolve(_this._equirectToCubemap(skyboxTexture));
      }, undefined, reject);
    });
  };
  /**
   * Create new {@link https://threejs.org/docs/#api/en/textures/CubeTexture CubeTexture} with given cubemap image urls
   * Image order should be: px, nx, py, ny, pz, nz
   * @param urls cubemap image urls
   * @returns CubeTexture created
   */


  __proto.loadCubeTexture = function (urls) {
    return new Promise(function (resolve, reject) {
      var loader = new CubeTextureLoader();
      loader.load(urls, resolve, undefined, reject);
    });
  };
  /**
   * Create new texture with given HDR(RGBE) image url
   * @param url image url
   * @param isEquirectangular Whether to read this image as a equirectangular texture
   */


  __proto.loadHDRTexture = function (url, isEquirectangular) {
    var _this = this;

    if (isEquirectangular === void 0) {
      isEquirectangular = true;
    }

    return new Promise(function (resolve, reject) {
      var loader = new RGBELoader();
      loader.load(url, function (texture) {
        if (isEquirectangular) {
          resolve(_this._equirectToCubemap(texture));
        } else {
          resolve(texture);
        }
      }, undefined, reject);
    });
  };

  __proto._equirectToCubemap = function (texture) {
    return new WebGLCubeRenderTarget(texture.image.height).fromEquirectangularTexture(this._renderer.threeRenderer, texture);
  };

  return TextureLoader;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
var QUICKLOOK_SUPPORTED = function () {
  var anchorEl = document.createElement("a");
  return anchorEl.relList && anchorEl.relList.supports && anchorEl.relList.supports("ar");
}();
var WEBXR_SUPPORTED = navigator.xr && navigator.xr.isSessionSupported;
var HIT_TEST_SUPPORTED = window.XRSession && window.XRSession.prototype.requestHitTestSource;
var DOM_OVERLAY_SUPPORTED = window.XRDOMOverlayState != null;
var SESSION = {
  AR: "immersive-ar",
  VR: "immersive-ar"
};
var REFERENCE_SPACE = {
  LOCAL: "local",
  LOCAL_FLOOR: "local-floor",
  VIEWER: "viewer"
};
var EVENTS$1 = {
  SELECT_START: "selectstart",
  SELECT: "select",
  SELECT_END: "selectend"
};
var INPUT_PROFILE = {
  TOUCH: "generic-touchscreen"
};
var FEATURES = {
  HIT_TEST: {
    requiredFeatures: ["hit-test"]
  },
  DOM_OVERLAY: function (root) {
    return {
      optionalFeatures: ["dom-overlay"],
      domOverlay: {
        root: root
      }
    };
  }
}; // For type definition

var EMPTY_FEATURES = {};
var SCENE_VIEWER = {
  INTENT_AR_CORE: function (params, fallback) {
    return "intent://arvr.google.com/scene-viewer/1.1?" + params + "#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;" + (fallback ? "S.browser_fallback_url=" + fallback + ";" : "") + "end;";
  },
  INTENT_SEARCHBOX: function (params, fallback) {
    return "intent://arvr.google.com/scene-viewer/1.1?" + params + "#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;" + (fallback ? "S.browser_fallback_url=" + fallback + ";" : "") + "end;";
  },
  FALLBACK_DEFAULT: function (params) {
    return "https://arvr.google.com/scene-viewer?" + params;
  }
};

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Manager for WebXR dom-overlay feature
 * @category XR
 */

var DOMOverlay =
/*#__PURE__*/
function () {
  /**
   * Create new DOMOverlay instance
   * @param {object} [options] Options
   * @param {HTMLElement} [options.root] Overlay root element
   * @param {HTMLElement | null} [options.loadingEl] Model loading indicator element which will be invisible after placing model on the floor.
   */
  function DOMOverlay(options) {
    this._root = options.root;
    this._loadingEl = options.loadingEl;
  }

  var __proto = DOMOverlay.prototype;
  Object.defineProperty(__proto, "root", {
    /**
     * Overlay root element
     */
    get: function () {
      return this._root;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "loadingElement", {
    /**
     * Loading indicator element, if there's any
     */
    get: function () {
      return this._loadingEl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "features", {
    /**
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit XRSessionInit} object for dom-overlay feature
     */
    get: function () {
      return FEATURES.DOM_OVERLAY(this._root);
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Return whether dom-overlay feature is available
   */

  __proto.isAvailable = function () {
    return DOM_OVERLAY_SUPPORTED;
  };
  /**
   * Show loading indicator, if there's any
   */


  __proto.showLoading = function () {
    if (!this._loadingEl) return;
    this._loadingEl.style.visibility = "visible";
  };
  /**
   * Hide loading indicator, if there's any
   */


  __proto.hideLoading = function () {
    if (!this._loadingEl) return;
    this._loadingEl.style.visibility = "hidden";
  };

  return DOMOverlay;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * WebXR based abstract AR session class
 * @category XR
 * @fires WebARSession#start
 * @fires WebARSession#end
 * @fires WebARSession#canPlace
 * @fires WebARSession#modelPlaced
 */

var WebARSession =
/*#__PURE__*/
function (_super) {
  __extends(WebARSession, _super);
  /**
   * Emitted when session is started.
   * @event start
   * @category XR
   * @memberof WebARSession
   * @type void
   */

  /**
   * Emitted when session is ended.
   * @event end
   * @category XR
   * @memberof WebARSession
   * @type void
   */

  /**
   * Emitted when model can be placed on the space.
   * @event canPlace
   * @category XR
   * @memberof WebARSession
   * @type void
   */

  /**
   * Emitted when model is placed.
   * @event modelPlaced
   * @category XR
   * @memberof WebARSession
   * @type void
   */

  /**
   * Create new instance of WebARSession
   * @param {object} [options={}] Options
   * @param {object} [options.features={}] You can set additional features(see {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit XRSessionInit}) with this option.
   * @param {number} [options.maxModelSize=Infinity] If model's size is too big to show on AR, you can restrict it's size with this option. Model with size bigger than this value will clamped to this value.
   * @param {HTMLElement|string|null} [options.overlayRoot=null] If this value is set, dom-overlay feature will be automatically added for this session. And this value will be used as dom-overlay's root element. You can set either HTMLElement or query selector for that element.
   * @param {HTMLElement|string|null} [options.loadingEl=null] This will be used for loading indicator element, which will automatically invisible after placing 3D model by setting `visibility: hidden`. This element must be placed under `overlayRoot`. You can set either HTMLElement or query selector for that element.
   * @param {boolean} [options.forceOverlay=false] Whether to apply `dom-overlay` feature as required. If set to false, `dom-overlay` will be optional feature.
   */


  function WebARSession(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.features,
        userFeatures = _c === void 0 ? EMPTY_FEATURES : _c,
        // https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit
    _d = _b.maxModelSize,
        // https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit
    maxModelSize = _d === void 0 ? Infinity : _d,
        _e = _b.overlayRoot,
        overlayRoot = _e === void 0 ? NULL_ELEMENT : _e,
        _f = _b.loadingEl,
        loadingEl = _f === void 0 ? NULL_ELEMENT : _f,
        _g = _b.forceOverlay,
        forceOverlay = _g === void 0 ? false : _g;

    var _this = _super.call(this) || this;
    /**
     * Whether it's webxr-based session or not
     * @type true
     */


    _this.isWebXRSession = true;
    _this._session = null;
    _this._domOverlay = null;
    var overlayEl = getElement(overlayRoot);
    var features = [];

    if (overlayEl) {
      _this._domOverlay = new DOMOverlay({
        root: overlayEl,
        loadingEl: getElement(loadingEl, overlayEl)
      });
      features.push(_this._domOverlay.features);
    }

    _this._features = merge.apply(void 0, __spread([{}], features, [userFeatures]));
    _this._maxModelSize = maxModelSize;
    _this._forceOverlay = forceOverlay;
    return _this;
  }

  var __proto = WebARSession.prototype;
  Object.defineProperty(__proto, "session", {
    /**
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSession XRSession} of this session
     * This value is only available after calling enter
     */
    get: function () {
      return this._session;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "features", {
    /**
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit XRSessionInit} object for this session.
     */
    get: function () {
      return this._features;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Return availability of this session
   * @returns {Promise} A Promise that resolves availability of this session(boolean).
   */

  __proto.isAvailable = function () {
    var domOverlay = this._domOverlay;
    if (!WEBXR_SUPPORTED || !HIT_TEST_SUPPORTED) return Promise.resolve(false);

    if (this._forceOverlay) {
      if (domOverlay && !domOverlay.isAvailable()) return Promise.resolve(false);
    }

    return navigator.xr.isSessionSupported(SESSION.AR);
  };
  /**
   * Enter session
   * @param view3d Instance of the View3D
   * @returns {Promise}
   */


  __proto.enter = function (view3d) {
    var _this = this; // Model not loaded yet


    if (!view3d.model) return Promise.reject("3D Model is not loaded");
    var model = view3d.model;
    return navigator.xr.requestSession(SESSION.AR, this._features).then(function (session) {
      var renderer = view3d.renderer;
      var threeRenderer = renderer.threeRenderer;
      var xrContext = {
        view3d: view3d,
        model: model,
        session: session
      }; // Cache original values

      var originalMatrix = model.scene.matrix.clone();
      var originalModelSize = model.size;
      var originalBackground = view3d.scene.root.background;
      var arModelSize = Math.min(model.originalSize, _this._maxModelSize);
      model.size = arModelSize;
      model.moveToOrigin();
      view3d.scene.setBackground(null); // Cache original model rotation

      threeRenderer.xr.setReferenceSpaceType(REFERENCE_SPACE.LOCAL);
      threeRenderer.xr.setSession(session);
      threeRenderer.setPixelRatio(1);

      _this.onStart(xrContext);

      session.addEventListener("end", function () {
        _this.onEnd(xrContext); // Restore original values


        model.scene.matrix.copy(originalMatrix);
        model.scene.matrix.decompose(model.scene.position, model.scene.quaternion, model.scene.scale);
        model.size = originalModelSize;
        model.moveToOrigin();
        view3d.scene.update(model);
        view3d.scene.setBackground(originalBackground); // Restore renderer values

        threeRenderer.xr.setSession(null);
        threeRenderer.setPixelRatio(window.devicePixelRatio); // Restore render loop

        renderer.stopAnimationLoop();
        renderer.setAnimationLoop(view3d.renderLoop);
      }, {
        once: true
      }); // Set XR session render loop

      renderer.stopAnimationLoop();
      renderer.setAnimationLoop(function (delta, frame) {
        var xrCam = threeRenderer.xr.getCamera(new PerspectiveCamera());
        var referenceSpace = threeRenderer.xr.getReferenceSpace();
        var glLayer = session.renderState.baseLayer;
        var size = {
          width: glLayer.framebufferWidth,
          height: glLayer.framebufferHeight
        };

        var renderContext = __assign(__assign({}, xrContext), {
          delta: delta,
          frame: frame,
          referenceSpace: referenceSpace,
          xrCam: xrCam,
          size: size
        });

        _this._beforeRender(renderContext);

        view3d.renderLoop(delta);
      });
    });
  };
  /**
   * Exit this session
   * @param view3d Instance of the View3D
   */


  __proto.exit = function (view3d) {
    var session = view3d.renderer.threeRenderer.xr.getSession();
    session.end();
  };

  __proto.onStart = function (ctx) {
    var _a;

    this._session = ctx.session;
    (_a = this._domOverlay) === null || _a === void 0 ? void 0 : _a.showLoading();
    this.emit("start");
  };

  __proto.onEnd = function (ctx) {
    var _a;

    this._session = null;
    (_a = this._domOverlay) === null || _a === void 0 ? void 0 : _a.hideLoading();
    this.emit("end");
  };

  return WebARSession;
}(EventEmitter);

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Manager for WebXR hit-test feature
 * @category XR
 */

var HitTest =
/*#__PURE__*/
function () {
  function HitTest() {
    this._source = null;
  }

  var __proto = HitTest.prototype;
  Object.defineProperty(__proto, "ready", {
    /**
     * Return whether hit-test is ready
     */
    get: function () {
      return this._source != null;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "features", {
    /**
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit XRSessionInit} object for hit-test feature
     */
    get: function () {
      return FEATURES.HIT_TEST;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Destroy instance
   */

  __proto.destroy = function () {
    if (this._source) {
      this._source.cancel();

      this._source = null;
    }
  };
  /**
   * Initialize hit-test feature
   * @param {XRSession} session XRSession instance
   */


  __proto.init = function (session) {
    var _this = this;

    session.requestReferenceSpace(REFERENCE_SPACE.VIEWER).then(function (referenceSpace) {
      session.requestHitTestSource({
        space: referenceSpace
      }).then(function (source) {
        _this._source = source;
      });
    });
  };
  /**
   * Return whether hit-test feature is available
   */


  __proto.isAvailable = function () {
    return HIT_TEST_SUPPORTED;
  };
  /**
   * Get hit-test results
   * @param {XRFrame} frame XRFrame instance
   */


  __proto.getResults = function (frame) {
    return frame.getHitTestResults(this._source);
  };

  return HitTest;
}();

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
 * @category Core
 */

var Animation =
/*#__PURE__*/
function (_super) {
  __extends(Animation, _super);
  /**
   * Create new instance of the Animation
   * @param {object} [options={}] Options
   */


  function Animation(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.context,
        context = _c === void 0 ? window : _c,
        _d = _b.repeat,
        repeat = _d === void 0 ? 0 : _d,
        _e = _b.duration,
        duration = _e === void 0 ? ANIMATION_DURATION : _e,
        _f = _b.easing,
        easing$1 = _f === void 0 ? EASE_OUT_CUBIC : _f;

    var _this = _super.call(this) || this;

    _this._loop = function () {
      var delta = _this._getDeltaTime();

      var duration = _this._duration;
      _this._time += delta;
      var loopIncrease = Math.floor(_this._time / duration);
      _this._time = circulate(_this._time, 0, duration);
      var progress = _this._time / duration;
      var progressEvent = {
        progress: progress,
        easedProgress: _this._easing(progress)
      };

      _this.emit("progress", progressEvent);

      for (var loopIdx = 0; loopIdx < loopIncrease; loopIdx++) {
        _this._loopCount++;

        if (_this._loopCount > _this._repeat) {
          _this.emit("finish");

          _this.stop();

          return;
        } else {
          _this.emit("loop", __assign(__assign({}, progressEvent), {
            loopIndex: _this._loopCount
          }));
        }
      }

      _this._rafId = _this._ctx.requestAnimationFrame(_this._loop);
    }; // Options


    _this._repeat = repeat;
    _this._duration = duration;
    _this._easing = easing$1; // Internal States

    _this._ctx = context;
    _this._rafId = -1;
    _this._time = 0;
    _this._clock = 0;
    _this._loopCount = 0;
    return _this;
  }

  var __proto = Animation.prototype;

  __proto.start = function () {
    if (this._rafId >= 0) return; // This guarantees "progress" event with progress = 0 on first start

    this._updateClock();

    this._loop();
  };

  __proto.stop = function () {
    if (this._rafId < 0) return;
    this._time = 0;
    this._loopCount = 0;

    this._stopLoop();
  };

  __proto.pause = function () {
    if (this._rafId < 0) return;

    this._stopLoop();
  };

  __proto._stopLoop = function () {
    this._ctx.cancelAnimationFrame(this._rafId);

    this._rafId = -1;
  };

  __proto._getDeltaTime = function () {
    var lastTime = this._clock;

    this._updateClock();

    return this._clock - lastTime;
  };

  __proto._updateClock = function () {
    this._clock = Date.now();
  };

  return Animation;
}(EventEmitter);

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Rotation indicator for ARHoverSession
 * @category Controls-AR
 */

var RotationIndicator =
/*#__PURE__*/
function () {
  /**
   * Create new RotationIndicator
   * @param {RotationIndicatorOption} [options={}] Options
   */
  function RotationIndicator(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.ringColor,
        ringColor = _c === void 0 ? 0xffffff : _c,
        _d = _b.axisColor,
        axisColor = _d === void 0 ? 0xffffff : _d;

    var ringGeometry = new RingGeometry(0.99, 1, 150, 1, 0, Math.PI * 2);
    var ringMaterial = new MeshBasicMaterial({
      color: ringColor,
      side: DoubleSide
    });
    this._ring = new Mesh(ringGeometry, ringMaterial);
    var axisVertices = [new Vector3(0, 0, -1000), new Vector3(0, 0, +1000)];
    var axisGeometry = new BufferGeometry().setFromPoints(axisVertices);
    var axisMaterial = new LineBasicMaterial({
      color: axisColor
    });
    this._axis = new Line(axisGeometry, axisMaterial);
    this._obj = new Group();

    this._obj.add(this._ring);

    this._obj.add(this._axis);

    this.hide();
  }

  var __proto = RotationIndicator.prototype;
  Object.defineProperty(__proto, "object", {
    /**
     * {@link https://threejs.org/docs/index.html#api/en/objects/Group THREE.Group} object that contains ring & axis.
     */
    get: function () {
      return this._obj;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Show indicator
   */

  __proto.show = function () {
    this._obj.visible = true;
  };
  /**
   * Hide indicator
   */


  __proto.hide = function () {
    this._obj.visible = false;
  };
  /**
   * Change the position of the indicator
   * @param position New position
   */


  __proto.updatePosition = function (position) {
    this._obj.position.copy(position);
  };
  /**
   * Update scale of the ring
   * @param scale New scale
   */


  __proto.updateScale = function (scale) {
    this._ring.scale.setScalar(scale);
  };
  /**
   * Update indicator's rotation
   * @param rotation Quaternion value set as new rotation.
   */


  __proto.updateRotation = function (rotation) {
    this._obj.quaternion.copy(rotation);
  };

  return RotationIndicator;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * One finger swirl control on single axis
 * @category Controls-AR
 */

var ARSwirlControl =
/*#__PURE__*/
function () {
  /**
   * Create new ARSwirlControl
   * @param {ARSwirlControlOption} [options={}] Options
   */
  function ARSwirlControl(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.scale,
        scale = _c === void 0 ? 1 : _c,
        _d = _b.showIndicator,
        showIndicator = _d === void 0 ? true : _d;
    /**
     * Current rotation value
     */


    this.rotation = new Quaternion(); // Internal States

    this._axis = new Vector3(0, 1, 0);
    this._enabled = true;
    this._active = false;
    this._prevPos = new Vector2();
    this._fromQuat = new Quaternion();
    this._toQuat = new Quaternion();
    this._motion = new Motion({
      range: INFINITE_RANGE
    });
    this._userScale = scale;

    if (showIndicator) {
      this._rotationIndicator = new RotationIndicator();
    }
  }

  var __proto = ARSwirlControl.prototype;
  Object.defineProperty(__proto, "enabled", {
    /**
     * Whether this control is enabled or not.
     * @readonly
     */
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "scale", {
    /**
     * Scale(speed) factor of this control.
     */
    get: function () {
      return this._userScale;
    },
    set: function (val) {
      this._userScale = val;
    },
    enumerable: false,
    configurable: true
  });

  __proto.init = function (_a) {
    var view3d = _a.view3d;
    var initialRotation = view3d.model.scene.quaternion;
    this.updateRotation(initialRotation);

    if (this._rotationIndicator) {
      view3d.scene.add(this._rotationIndicator.object);
    }
  };

  __proto.destroy = function (_a) {
    var view3d = _a.view3d;

    if (this._rotationIndicator) {
      view3d.scene.remove(this._rotationIndicator.object);
    }
  };

  __proto.updateRotation = function (rotation) {
    this.rotation.copy(rotation);

    this._fromQuat.copy(rotation);

    this._toQuat.copy(rotation);
  };
  /**
   * Enable this control
   */


  __proto.enable = function () {
    this._enabled = true;
  };
  /**
   * Disable this control
   */


  __proto.disable = function () {
    this._enabled = false;
  };

  __proto.activate = function (_a, gesture) {
    var view3d = _a.view3d;
    if (!this._enabled) return;
    this._active = true;
    var model = view3d.model;
    var rotationIndicator = this._rotationIndicator;

    if (rotationIndicator) {
      rotationIndicator.show();
      rotationIndicator.updatePosition(model.bbox.getCenter(new Vector3()));
      rotationIndicator.updateScale(model.size / 2);
      rotationIndicator.updateRotation(model.scene.quaternion);
    }
  };

  __proto.deactivate = function () {
    this._active = false;

    if (this._rotationIndicator) {
      this._rotationIndicator.hide();
    }
  };

  __proto.updateAxis = function (axis) {
    this._axis.copy(axis);
  };

  __proto.setInitialPos = function (coords) {
    this._prevPos.copy(coords[0]);
  };

  __proto.process = function (_a, _b) {
    var view3d = _a.view3d,
        xrCam = _a.xrCam;
    var coords = _b.coords;
    if (!this._active || coords.length !== 1) return;
    var prevPos = this._prevPos;
    var motion = this._motion;
    var model = view3d.model;
    var coord = coords[0];
    var modelPos = model.scene.position.clone();
    var ndcModelPos = new Vector2().fromArray(modelPos.project(xrCam).toArray()); // Get the rotation angle with the model's NDC coordinates as the center.

    var rotationAngle = getRotationAngle(ndcModelPos, prevPos, coord) * this._userScale;

    var rotation = new Quaternion().setFromAxisAngle(this._axis, rotationAngle);

    var interpolated = this._getInterpolatedQuaternion();

    this._fromQuat.copy(interpolated);

    this._toQuat.premultiply(rotation);

    motion.reset(0);
    motion.setEndDelta(1);
    prevPos.copy(coord);
  };

  __proto.update = function (_a, deltaTime) {
    var model = _a.model;
    if (!this._active) return;
    var motion = this._motion;
    motion.update(deltaTime);

    var interpolated = this._getInterpolatedQuaternion();

    this.rotation.copy(interpolated);
    model.scene.quaternion.copy(interpolated);
  };

  __proto._getInterpolatedQuaternion = function () {
    var motion = this._motion;
    var toEuler = this._toQuat;
    var fromEuler = this._fromQuat;
    var progress = motion.val;
    return new Quaternion().copy(fromEuler).slerp(toEuler, progress);
  };

  return ARSwirlControl;
}();

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
 * Model's translation(position) control for {@link ARFloorControl}
 * @category Controls-AR
 */


var ARFloorTranslateControl =
/*#__PURE__*/
function () {
  /**
   * Create new instance of ARTranslateControl
   * @param {ARFloorTranslateControlOption} [options={}] Options
   */
  function ARFloorTranslateControl(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.hoverAmplitude,
        hoverAmplitude = _c === void 0 ? 0.01 : _c,
        _d = _b.hoverHeight,
        hoverHeight = _d === void 0 ? 0.1 : _d,
        _e = _b.hoverPeriod,
        hoverPeriod = _e === void 0 ? 1000 : _e,
        _f = _b.hoverEasing,
        hoverEasing = _f === void 0 ? SINE_WAVE : _f,
        _g = _b.bounceDuration,
        bounceDuration = _g === void 0 ? 1000 : _g,
        _h = _b.bounceEasing,
        bounceEasing = _h === void 0 ? EASE_OUT_BOUNCE : _h; // Internal states


    this._modelPosition = new Vector3();
    this._hoverPosition = new Vector3();
    this._floorPosition = new Vector3();
    this._dragPlane = new Plane();
    this._enabled = true;
    this._state = STATE.WAITING;
    this._initialPos = new Vector2();
    this._hoverAmplitude = hoverAmplitude;
    this._hoverHeight = hoverHeight;
    this._hoverMotion = new Motion({
      loop: true,
      duration: hoverPeriod,
      easing: hoverEasing
    });
    this._bounceMotion = new Motion({
      duration: bounceDuration,
      easing: bounceEasing,
      range: INFINITE_RANGE
    });
  }

  var __proto = ARFloorTranslateControl.prototype;
  Object.defineProperty(__proto, "enabled", {
    /**
     * Whether this control is enabled or not
     * @readonly
     */
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "modelPosition", {
    /**
     * Position including hover/bounce animation offset from the floor.
     * @readonly
     */
    get: function () {
      return this._modelPosition.clone();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "floorPosition", {
    /**
     * Last detected floor position
     * @readonly
     */
    get: function () {
      return this._floorPosition.clone();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "hoverAmplitude", {
    /**
     * How much model will hover up and down, in meter.
     */
    get: function () {
      return this._hoverAmplitude;
    },
    set: function (val) {
      this._hoverAmplitude = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "hoverHeight", {
    /**
     * How much model will float from the floor, in meter.
     */
    get: function () {
      return this._hoverHeight;
    },
    set: function (val) {
      this._hoverHeight = val;
    },
    enumerable: false,
    configurable: true
  });

  __proto.initFloorPosition = function (position) {
    this._modelPosition.copy(position);

    this._floorPosition.copy(position);

    this._hoverPosition.copy(position);

    this._hoverPosition.setY(position.y + this._hoverHeight);
  }; // tslint:disable-next-line no-empty


  __proto.init = function (ctx) {}; // tslint:disable-next-line no-empty


  __proto.destroy = function (ctx) {};
  /**
   * Enable this control
   */


  __proto.enable = function () {
    this._enabled = true;
  };
  /**
   * Disable this control
   */


  __proto.disable = function () {
    this._enabled = false;
    this.deactivate();
  };

  __proto.activate = function (_a, gesture) {
    var model = _a.model;
    if (!this._enabled) return;
    var modelBbox = model.bbox;
    var modelBboxYOffset = modelBbox.getCenter(new Vector3()).y - modelBbox.min.y;

    this._dragPlane.set(new Vector3(0, 1, 0), -(this._floorPosition.y + this._hoverHeight + modelBboxYOffset));

    this._hoverMotion.reset(0);

    this._hoverMotion.setEndDelta(1);

    this._state = STATE.TRANSLATING;
  };

  __proto.deactivate = function () {
    if (!this._enabled || this._state === STATE.WAITING) {
      this._state = STATE.WAITING;
      return;
    }

    this._state = STATE.BOUNCING;
    var floorPosition = this._floorPosition;
    var modelPosition = this._modelPosition;
    var hoverPosition = this._hoverPosition;
    var bounceMotion = this._bounceMotion;
    var hoveringAmount = modelPosition.y - floorPosition.y;
    bounceMotion.reset(modelPosition.y);
    bounceMotion.setEndDelta(-hoveringAmount); // Restore hover pos

    hoverPosition.copy(floorPosition);
    hoverPosition.setY(floorPosition.y + this._hoverHeight);
  };

  __proto.setInitialPos = function (coords) {
    this._initialPos.copy(coords[0]);
  };

  __proto.process = function (_a, _b) {
    var view3d = _a.view3d,
        model = _a.model,
        frame = _a.frame,
        referenceSpace = _a.referenceSpace,
        xrCam = _a.xrCam;
    var hitResults = _b.hitResults;
    var state = this._state;
    var notActive = state === STATE.WAITING || state === STATE.BOUNCING;
    if (!hitResults || hitResults.length !== 1 || notActive) return;
    var hitResult = hitResults[0];

    var prevFloorPosition = this._floorPosition.clone();

    var floorPosition = this._floorPosition;
    var hoverPosition = this._hoverPosition;
    var hoverHeight = this._hoverHeight;
    var dragPlane = this._dragPlane;
    var modelBbox = model.bbox;
    var modelBboxYOffset = modelBbox.getCenter(new Vector3()).y - modelBbox.min.y;
    var hitPose = hitResult.results[0] && hitResult.results[0].getPose(referenceSpace);
    var isFloorHit = hitPose && hitPose.transform.matrix[5] >= 0.75;
    var camPos = new Vector3().setFromMatrixPosition(xrCam.matrixWorld);

    if (!hitPose || !isFloorHit) {
      // Use previous drag plane if no hit plane is found
      var targetRayPose = frame.getPose(hitResult.inputSource.targetRaySpace, view3d.renderer.threeRenderer.xr.getReferenceSpace());
      var fingerDir = new Vector3().copy(targetRayPose.transform.position).sub(camPos).normalize();
      var fingerRay = new Ray(camPos, fingerDir);
      var intersection = fingerRay.intersectPlane(dragPlane, new Vector3());

      if (intersection) {
        floorPosition.copy(intersection);
        floorPosition.setY(prevFloorPosition.y);
        hoverPosition.copy(intersection);
        hoverPosition.setY(intersection.y - modelBboxYOffset);
      }

      return;
    }

    var hitMatrix = new Matrix4().fromArray(hitPose.transform.matrix);
    var hitPosition = new Vector3().setFromMatrixPosition(hitMatrix); // Set new floor level when it's increased at least 10cm

    var currentDragPlaneHeight = -dragPlane.constant;
    var hitDragPlaneHeight = hitPosition.y + hoverHeight + modelBboxYOffset;

    if (hitDragPlaneHeight - currentDragPlaneHeight > 0.1) {
      dragPlane.constant = -hitDragPlaneHeight;
    }

    var camToHitDir = new Vector3().subVectors(hitPosition, camPos).normalize();
    var camToHitRay = new Ray(camPos, camToHitDir);
    var hitOnDragPlane = camToHitRay.intersectPlane(dragPlane, new Vector3());
    if (!hitOnDragPlane) return;
    floorPosition.copy(hitOnDragPlane);
    floorPosition.setY(hitPosition.y);
    hoverPosition.copy(hitOnDragPlane);
    hoverPosition.setY(hitOnDragPlane.y - modelBboxYOffset);
  };

  __proto.update = function (_a, delta) {
    var model = _a.model;
    var state = this._state;
    var modelPosition = this._modelPosition;
    var hoverPosition = this._hoverPosition;
    if (state === STATE.WAITING) return;

    if (state !== STATE.BOUNCING) {
      // Hover
      var hoverMotion = this._hoverMotion;
      hoverMotion.update(delta); // Change only x, y component of position

      var hoverOffset = hoverMotion.val * this._hoverAmplitude;
      modelPosition.copy(hoverPosition);
      modelPosition.setY(hoverPosition.y + hoverOffset);
    } else {
      // Bounce
      var bounceMotion = this._bounceMotion;
      bounceMotion.update(delta);
      modelPosition.setY(bounceMotion.val);

      if (bounceMotion.progress >= 1) {
        this._state = STATE.WAITING;
      }
    }

    var modelBbox = model.bbox;
    var modelYOffset = modelBbox.getCenter(new Vector3()).y - modelBbox.min.y; // modelPosition = where model.bbox.min.y should be

    model.scene.position.copy(modelPosition.clone().setY(modelPosition.y + modelYOffset));
  };

  return ARFloorTranslateControl;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * UI element displaying model's scale percentage info when user chaning model's scale.
 * @category Controls-AR
 */

var ScaleUI =
/*#__PURE__*/
function () {
  /**
   * Create new instance of ScaleUI
   * @param {ScaleUIOption} [options={}] Options
   */
  function ScaleUI(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.width,
        width = _c === void 0 ? 0.1 : _c,
        _d = _b.padding,
        padding = _d === void 0 ? 20 : _d,
        _e = _b.offset,
        offset = _e === void 0 ? 0.05 : _e,
        _f = _b.font,
        font = _f === void 0 ? "64px sans-serif" : _f,
        _g = _b.color,
        color = _g === void 0 ? "white" : _g;

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.font = font; // Maximum canvas width should be equal to this

    var maxText = ctx.measureText("100%"); // Following APIs won't work on IE, but it's WebXR so I think it's okay

    var maxWidth = maxText.actualBoundingBoxLeft + maxText.actualBoundingBoxRight;
    var maxHeight = maxText.actualBoundingBoxAscent + maxText.actualBoundingBoxDescent;
    var widthPowerOfTwo = toPowerOfTwo(maxWidth);
    canvas.width = widthPowerOfTwo;
    canvas.height = widthPowerOfTwo; // This considers increased amount by making width to power of two

    var planeWidth = width * (widthPowerOfTwo / maxWidth);
    this._ctx = ctx;
    this._canvas = canvas;
    this._height = planeWidth * maxHeight / maxWidth; // Text height inside plane

    this._texture = new CanvasTexture(canvas); // Plane is square

    var uiGeometry = new PlaneGeometry(planeWidth, planeWidth);
    var mesh = new Mesh(uiGeometry, new MeshBasicMaterial({
      map: this._texture,
      transparent: true
    }));
    mesh.matrixAutoUpdate = false;
    this._mesh = mesh;
    this._font = font;
    this._color = color;
    this._padding = padding;
    this._offset = offset;
  }

  var __proto = ScaleUI.prototype;
  Object.defineProperty(__proto, "mesh", {
    /**
     * Scale UI's plane mesh
     * @readonly
     */
    get: function () {
      return this._mesh;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "height", {
    /**
     * Scale UI's height value
     * @readonly
     */
    get: function () {
      return this._height;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "visible", {
    /**
     * Whether UI is visible or not.
     * @readonly
     */
    get: function () {
      return this._mesh.visible;
    },
    enumerable: false,
    configurable: true
  });

  __proto.updatePosition = function (position, focus) {
    // Update mesh
    var mesh = this._mesh;
    mesh.lookAt(focus);
    mesh.position.copy(position);
    mesh.position.setY(position.y + this._height / 2 + this._offset);
    mesh.updateMatrix();
  };

  __proto.updateScale = function (scale) {
    var ctx = this._ctx;
    var canvas = this._canvas;
    var padding = this._padding;
    var scalePercentage = (scale * 100).toFixed(0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2; // Draw round rect

    var textSize = ctx.measureText(scalePercentage + "%");
    var halfWidth = (textSize.actualBoundingBoxLeft + textSize.actualBoundingBoxRight) / 2;
    var halfHeight = (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) / 2;
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
    ctx.fillText(scalePercentage + "%", centerX, centerY);
    this._texture.needsUpdate = true;
  };
  /**
   * Show UI
   */


  __proto.show = function () {
    this._mesh.visible = true;
  };
  /**
   * Hide UI
   */


  __proto.hide = function () {
    this._mesh.visible = false;
  };

  return ScaleUI;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Model's scale controller which works on AR(WebXR) mode.
 * @category Controls-AR
 */

var ARScaleControl =
/*#__PURE__*/
function () {
  /**
   * Create new instance of ARScaleControl
   * @param {ARScaleControlOption} [options={}] Options
   */
  function ARScaleControl(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.min,
        min = _c === void 0 ? 0.05 : _c,
        _d = _b.max,
        max = _d === void 0 ? 2 : _d;

    this._enabled = true;
    this._active = false;
    this._prevCoordDistance = -1;
    this._scaleMultiplier = 1;
    this._initialScale = new Vector3();
    this._ui = new ScaleUI();
    this._motion = new Motion({
      duration: 0,
      range: {
        min: min,
        max: max
      }
    });

    this._motion.reset(1); // default scale is 1(100%)


    this._ui = new ScaleUI();
  }

  var __proto = ARScaleControl.prototype;
  Object.defineProperty(__proto, "enabled", {
    /**
     * Whether this control is enabled or not
     * @readonly
     */
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "scale", {
    get: function () {
      return this._initialScale.clone().multiplyScalar(this._scaleMultiplier);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "scaleMultiplier", {
    get: function () {
      return this._scaleMultiplier;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "range", {
    /**
     * Range of the scale
     * @readonly
     */
    get: function () {
      return this._motion.range;
    },
    enumerable: false,
    configurable: true
  });

  __proto.init = function (_a) {
    var view3d = _a.view3d;

    this._initialScale.copy(view3d.model.scene.scale);

    view3d.scene.add(this._ui.mesh);
  };

  __proto.destroy = function (_a) {
    var view3d = _a.view3d;
    view3d.scene.remove(this._ui.mesh);
  };

  __proto.setInitialPos = function (coords) {
    this._prevCoordDistance = new Vector2().subVectors(coords[0], coords[1]).length();
  };
  /**
   * Enable this control
   */


  __proto.enable = function () {
    this._enabled = true;
  };
  /**
   * Disable this control
   */


  __proto.disable = function () {
    this._enabled = false;
    this.deactivate();
  };

  __proto.activate = function (ctx, gesture) {
    this._active = true;

    this._ui.show();

    this._updateUIPosition(ctx);
  };

  __proto.deactivate = function () {
    this._active = false;

    this._ui.hide();

    this._prevCoordDistance = -1;
  };
  /**
   * Update scale range
   * @param min Minimum scale
   * @param max Maximum scale
   */


  __proto.setRange = function (min, max) {
    this._motion.range = {
      min: min,
      max: max
    };
  };

  __proto.process = function (ctx, _a) {
    var coords = _a.coords;
    if (coords.length !== 2 || !this._enabled || !this._active) return;
    var motion = this._motion;
    var distance = new Vector2().subVectors(coords[0], coords[1]).length();
    var delta = distance - this._prevCoordDistance;
    motion.setEndDelta(delta);
    this._prevCoordDistance = distance;

    this._updateUIPosition(ctx);
  };

  __proto.update = function (_a, deltaTime) {
    var model = _a.model;
    if (!this._enabled || !this._active) return;
    var motion = this._motion;
    motion.update(deltaTime);
    this._scaleMultiplier = motion.val;

    this._ui.updateScale(this._scaleMultiplier);

    model.scene.scale.copy(this.scale);
  };

  __proto._updateUIPosition = function (_a) {
    var view3d = _a.view3d,
        xrCam = _a.xrCam; // Update UI

    var model = view3d.model;
    var camPos = new Vector3().setFromMatrixPosition(xrCam.matrixWorld);
    var uiPos = model.scene.position.clone().setY(model.bbox.max.y);

    this._ui.updatePosition(uiPos, camPos);
  };

  return ARScaleControl;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Ring type indicator for showing where the model's at.
 * @category Controls-AR
 */

var FloorIndicator =
/*#__PURE__*/
function () {
  /**
   * Create new instance of FloorIndicator
   * @param {FloorIndicatorOption} [options={}] Options
   */
  function FloorIndicator(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.ringOpacity,
        ringOpacity = _c === void 0 ? 0.3 : _c,
        _d = _b.dirIndicatorOpacity,
        dirIndicatorOpacity = _d === void 0 ? 1 : _d,
        _e = _b.fadeoutDuration,
        fadeoutDuration = _e === void 0 ? 1000 : _e;

    var deg10 = Math.PI / 18;
    var dimmedRingGeomtry = new RingGeometry(0.975, 1, 150, 1, -6 * deg10, 30 * deg10);
    var reticle = new CircleGeometry(0.1, 30, 0, Math.PI * 2);
    dimmedRingGeomtry.merge(reticle);
    var highlightedRingGeometry = new RingGeometry(0.96, 1.015, 30, 1, 25 * deg10, 4 * deg10); // Create little triangle in ring

    var ringVertices = highlightedRingGeometry.vertices;
    var trianglePart = ringVertices.slice(Math.floor(11 * ringVertices.length / 16), Math.floor(13 * ringVertices.length / 16));
    var firstY = trianglePart[0].y;
    var midIndex = Math.floor(trianglePart.length / 2);
    trianglePart.forEach(function (vec, vecIdx) {
      var offsetAmount = 0.025 * (midIndex - Math.abs(vecIdx - midIndex));
      vec.setY(firstY - offsetAmount);
    });
    var indicatorMat = new Matrix4().makeRotationX(-Math.PI / 2);
    var mergedGeometry = new Geometry();
    mergedGeometry.merge(dimmedRingGeomtry, indicatorMat, 0);
    mergedGeometry.merge(highlightedRingGeometry, indicatorMat, 1);
    var dimmedMaterial = new MeshBasicMaterial({
      transparent: true,
      opacity: ringOpacity,
      color: 0xffffff
    });
    var highlightMaterial = new MeshBasicMaterial({
      transparent: true,
      opacity: dirIndicatorOpacity,
      color: 0xffffff
    });
    var materials = [dimmedMaterial, highlightMaterial];
    this._mesh = new Mesh(mergedGeometry, materials);
    this._mesh.matrixAutoUpdate = false;
    this._animator = new Motion({
      duration: fadeoutDuration
    });
    this._opacityRange = {
      min: ringOpacity,
      max: dirIndicatorOpacity
    };
  }

  var __proto = FloorIndicator.prototype;
  Object.defineProperty(__proto, "mesh", {
    /**
     * Ring mesh
     */
    get: function () {
      return this._mesh;
    },
    enumerable: false,
    configurable: true
  });

  __proto.update = function (_a) {
    var delta = _a.delta,
        scale = _a.scale,
        position = _a.position,
        rotation = _a.rotation;
    var mesh = this._mesh;
    var animator = this._animator;
    if (!this._mesh.visible) return;
    animator.update(delta);
    var materials = this._mesh.material;
    var minOpacityMat = materials[0];
    var maxOpacityMat = materials[1];
    var opacityRange = this._opacityRange;
    minOpacityMat.opacity = animator.val * opacityRange.min;
    maxOpacityMat.opacity = animator.val * opacityRange.max;

    if (animator.val <= 0) {
      mesh.visible = false;
    } // Update mesh


    mesh.scale.setScalar(scale);
    mesh.position.copy(position);
    mesh.quaternion.copy(rotation);
    mesh.updateMatrix();
  };

  __proto.show = function () {
    this._mesh.visible = true;

    this._animator.reset(1);
  };

  __proto.fadeout = function () {
    this._animator.setEndDelta(-1);
  };

  return FloorIndicator;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
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
var STATE$1;

(function (STATE) {
  STATE[STATE["WAITING"] = 0] = "WAITING";
  STATE[STATE["IN_DEADZONE"] = 1] = "IN_DEADZONE";
  STATE[STATE["OUT_OF_DEADZONE"] = 2] = "OUT_OF_DEADZONE";
})(STATE$1 || (STATE$1 = {}));
/**
 * Deadzone checker for deadzone-based controls
 * @category Controls-AR
 */


var DeadzoneChecker =
/*#__PURE__*/
function () {
  /**
   * Create new DeadzoneChecker
   * @param {DeadzoneCheckerOption} [options={}] Options
   */
  function DeadzoneChecker(_a) {
    var _b = (_a === void 0 ? {} : _a).size,
        size = _b === void 0 ? 0.1 : _b; // Internal States

    this._state = STATE$1.WAITING;
    this._detectedGesture = GESTURE.NONE;
    this._testingGestures = GESTURE.NONE;
    this._lastFingerCount = 0;
    this._aspect = 1; // Store two prev positions, as it should be maintained separately

    this._prevOneFingerPos = new Vector2();
    this._prevTwoFingerPos = new Vector2();
    this._initialTwoFingerDistance = 0;
    this._prevOneFingerPosInitialized = false;
    this._prevTwoFingerPosInitialized = false;
    this._size = size;
  }

  var __proto = DeadzoneChecker.prototype;
  Object.defineProperty(__proto, "size", {
    /**
     * Size of the deadzone.
     * @type number
     */
    get: function () {
      return this._size;
    },
    set: function (val) {
      this._size = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "inDeadzone", {
    get: function () {
      return this._state === STATE$1.IN_DEADZONE;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Set screen aspect(height / width)
   * @param aspect Screen aspect value
   */

  __proto.setAspect = function (aspect) {
    this._aspect = aspect;
  };

  __proto.setFirstInput = function (inputs) {
    var fingerCount = inputs.length;

    if (fingerCount === 1 && !this._prevOneFingerPosInitialized) {
      this._prevOneFingerPos.copy(inputs[0]);

      this._prevOneFingerPosInitialized = true;
    } else if (fingerCount === 2 && !this._prevTwoFingerPosInitialized) {
      this._prevTwoFingerPos.copy(new Vector2().addVectors(inputs[0], inputs[1]).multiplyScalar(0.5));

      this._initialTwoFingerDistance = new Vector2().subVectors(inputs[0], inputs[1]).length();
      this._prevTwoFingerPosInitialized = true;
    }

    this._lastFingerCount = fingerCount;
    this._state = STATE$1.IN_DEADZONE;
  };

  __proto.addTestingGestures = function () {
    var gestures = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      gestures[_i] = arguments[_i];
    }

    this._testingGestures = this._testingGestures | gestures.reduce(function (gesture, accumulated) {
      return gesture | accumulated;
    }, GESTURE.NONE);
  };

  __proto.cleanup = function () {
    this._testingGestures = GESTURE.NONE;
    this._lastFingerCount = 0;
    this._prevOneFingerPosInitialized = false;
    this._prevTwoFingerPosInitialized = false;
    this._initialTwoFingerDistance = 0;
    this._detectedGesture = GESTURE.NONE;
    this._state = STATE$1.WAITING;
  };

  __proto.applyScreenAspect = function (inputs) {
    var aspect = this._aspect;
    inputs.forEach(function (input) {
      if (aspect > 1) {
        input.setY(input.y * aspect);
      } else {
        input.setX(input.x / aspect);
      }
    });
  };

  __proto.check = function (inputs) {
    var state = this._state;
    var deadzone = this._size;
    var testingGestures = this._testingGestures;
    var lastFingerCount = this._lastFingerCount;
    var fingerCount = inputs.length;

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
      var input = inputs[0];

      var prevPos = this._prevOneFingerPos.clone();

      var diff = new Vector2().subVectors(input, prevPos);

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
      var middle = new Vector2().addVectors(inputs[1], inputs[0]).multiplyScalar(0.5);

      var prevPos = this._prevTwoFingerPos.clone();

      var diff = new Vector2().subVectors(middle, prevPos);

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

      var distance = new Vector2().subVectors(inputs[1], inputs[0]).length();

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
  };

  return DeadzoneChecker;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * AR control for {@link FloorARSession}
 * @category Controls-AR
 */

var ARFloorControl =
/*#__PURE__*/
function () {
  /**
   * Create new instance of ARFloorControl
   * @param {ARFloorControlOption} options Options
   */
  function ARFloorControl(options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    this._enabled = true;
    this._initialized = false;
    this._modelHit = false;
    this._hitTestSource = null;

    this.onSelectStart = function (ctx) {
      var view3d = ctx.view3d,
          frame = ctx.frame,
          xrCam = ctx.xrCam,
          referenceSpace = ctx.referenceSpace;
      var hitTestSource = _this._hitTestSource;
      if (!hitTestSource || !_this._enabled) return;
      var deadzoneChecker = _this._deadzoneChecker;
      var rotateControl = _this._rotateControl;
      var translateControl = _this._translateControl;
      var scaleControl = _this._scaleControl; // Update deadzone testing gestures

      if (rotateControl.enabled) {
        deadzoneChecker.addTestingGestures(GESTURE.ONE_FINGER);
      }

      if (translateControl.enabled) {
        deadzoneChecker.addTestingGestures(GESTURE.ONE_FINGER);
      }

      if (scaleControl.enabled) {
        deadzoneChecker.addTestingGestures(GESTURE.PINCH);
      }

      var hitResults = frame.getHitTestResultsForTransientInput(hitTestSource);

      var coords = _this._hitResultToVector(hitResults);

      deadzoneChecker.applyScreenAspect(coords);
      deadzoneChecker.setFirstInput(coords);

      if (coords.length === 1) {
        // Check finger is on the model
        var modelBbox = view3d.model.bbox;
        var targetRayPose = frame.getPose(hitResults[0].inputSource.targetRaySpace, referenceSpace);
        var camPos = new Vector3().setFromMatrixPosition(xrCam.matrixWorld);
        var fingerDir = new Vector3().copy(targetRayPose.transform.position).sub(camPos).normalize();
        var fingerRay = new Ray(camPos, fingerDir);
        var intersection = fingerRay.intersectBox(modelBbox, new Vector3());

        if (intersection) {
          // Touch point intersected with model
          _this._modelHit = true;
        }
      }

      _this._floorIndicator.show();
    };

    this.onSelectEnd = function () {
      _this.deactivate();

      _this._floorIndicator.fadeout();
    };

    this._rotateControl = new ARSwirlControl(__assign({
      showIndicator: false
    }, options.rotate));
    this._translateControl = new ARFloorTranslateControl(options.translate);
    this._scaleControl = new ARScaleControl(options.scale);
    this._floorIndicator = new FloorIndicator(options.floorIndicator);
    this._deadzoneChecker = new DeadzoneChecker(options.deadzone);
  }

  var __proto = ARFloorControl.prototype;
  Object.defineProperty(__proto, "enabled", {
    /**
     * Return whether this control is enabled or not
     */
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "rotate", {
    /**
     * {@link ARSwirlControl} in this control
     */
    get: function () {
      return this._rotateControl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "translate", {
    /**
     * {@link ARFloorTranslateControl} in this control
     */
    get: function () {
      return this._translateControl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "scale", {
    /**
     * {@link ARScaleControl} in this control
     */
    get: function () {
      return this._scaleControl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "controls", {
    get: function () {
      return [this._rotateControl, this._translateControl, this._scaleControl];
    },
    enumerable: false,
    configurable: true
  });

  __proto.init = function (ctx, initialFloorPos) {
    var _this = this;

    var session = ctx.session,
        view3d = ctx.view3d,
        size = ctx.size;
    this.controls.forEach(function (control) {
      return control.init(ctx);
    });

    this._translateControl.initFloorPosition(initialFloorPos);

    this._deadzoneChecker.setAspect(size.height / size.width);

    view3d.scene.add(this._floorIndicator.mesh);
    this._initialized = true;
    session.requestHitTestSourceForTransientInput({
      profile: INPUT_PROFILE.TOUCH
    }).then(function (transientHitTestSource) {
      _this._hitTestSource = transientHitTestSource;
    });
  };
  /**
   * Destroy this control and deactivate it
   * @param view3d Instance of the {@link View3D}
   */


  __proto.destroy = function (ctx) {
    if (!this._initialized) return;

    if (this._hitTestSource) {
      this._hitTestSource.cancel();

      this._hitTestSource = null;
    }

    ctx.view3d.scene.remove(this._floorIndicator.mesh);
    this.deactivate();
    this.controls.forEach(function (control) {
      return control.destroy(ctx);
    });
    this._initialized = false;
  };

  __proto.deactivate = function () {
    this._modelHit = false;

    this._deadzoneChecker.cleanup();

    this.controls.forEach(function (control) {
      return control.deactivate();
    });
  };
  /**
   * Enable this control
   */


  __proto.enable = function () {
    this._enabled = true;
  };
  /**
   * Disable this control
   */


  __proto.disable = function () {
    this._enabled = false;
    this.deactivate();
  };

  __proto.update = function (ctx) {
    var view3d = ctx.view3d,
        session = ctx.session,
        frame = ctx.frame;
    var hitTestSource = this._hitTestSource;
    if (!hitTestSource || !view3d.model) return;
    var deadzoneChecker = this._deadzoneChecker;
    var inputSources = session.inputSources;
    var hitResults = frame.getHitTestResultsForTransientInput(hitTestSource);

    var coords = this._hitResultToVector(hitResults);

    var xrInputs = {
      coords: coords,
      inputSources: inputSources,
      hitResults: hitResults
    };

    if (deadzoneChecker.inDeadzone) {
      this._checkDeadzone(ctx, xrInputs);
    } else {
      this._processInput(ctx, xrInputs);
    }

    this._updateControls(ctx);
  };

  __proto._checkDeadzone = function (ctx, _a) {
    var coords = _a.coords;

    var gesture = this._deadzoneChecker.check(coords.map(function (coord) {
      return coord.clone();
    }));

    var rotateControl = this._rotateControl;
    var translateControl = this._translateControl;
    var scaleControl = this._scaleControl;
    if (gesture === GESTURE.NONE) return;

    switch (gesture) {
      case GESTURE.ONE_FINGER_HORIZONTAL:
      case GESTURE.ONE_FINGER_VERTICAL:
        if (this._modelHit) {
          translateControl.activate(ctx, gesture);
          translateControl.setInitialPos(coords);
        } else {
          rotateControl.activate(ctx, gesture);
          rotateControl.setInitialPos(coords);
        }

        break;

      case GESTURE.PINCH:
        scaleControl.activate(ctx, gesture);
        scaleControl.setInitialPos(coords);
        break;
    }
  };

  __proto._processInput = function (ctx, inputs) {
    this.controls.forEach(function (control) {
      return control.process(ctx, inputs);
    });
  };

  __proto._updateControls = function (ctx) {
    var view3d = ctx.view3d,
        model = ctx.model,
        delta = ctx.delta;
    var deltaMilisec = delta * 1000;
    this.controls.forEach(function (control) {
      return control.update(ctx, deltaMilisec);
    });
    model.scene.updateMatrix();
    var modelRotation = this._rotateControl.rotation;
    var floorPosition = this._translateControl.floorPosition;
    view3d.scene.update(model, {
      floorPosition: floorPosition
    }); // Get a scaled bbox, which only has scale applied on it.

    var scaleControl = this._scaleControl;
    var scaledBbox = model.initialBbox;
    scaledBbox.min.multiply(scaleControl.scale);
    scaledBbox.max.multiply(scaleControl.scale);
    var floorIndicator = this._floorIndicator;
    var boundingSphere = scaledBbox.getBoundingSphere(new Sphere());
    floorIndicator.update({
      delta: deltaMilisec,
      scale: boundingSphere.radius,
      position: floorPosition,
      rotation: modelRotation
    });
  };

  __proto._hitResultToVector = function (hitResults) {
    return hitResults.map(function (input) {
      return new Vector2().set(input.inputSource.gamepad.axes[0], -input.inputSource.gamepad.axes[1]);
    });
  };

  return ARFloorControl;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * WebXR based AR session which puts model on the detected floor.
 * @category XR
 * @fires WebARSession#start
 * @fires WebARSession#end
 * @fires WebARSession#canPlace
 * @fires WebARSession#modelPlaced
 */

var FloorARSession =
/*#__PURE__*/
function (_super) {
  __extends(FloorARSession, _super);
  /**
   * Create new instance of FloorARSession
   * @param {FloorARSessionOption} options Options
   */


  function FloorARSession(options) {
    if (options === void 0) {
      options = {};
    }

    var _this = _super.call(this, options) || this;

    _this.onStart = function (ctx) {
      var view3d = ctx.view3d,
          session = ctx.session;

      _super.prototype.onStart.call(_this, ctx);

      _this._control = new ARFloorControl(_this._options);
      view3d.scene.hide();

      _this._hitTest.init(session);
    };

    _this.onEnd = function (ctx) {
      var view3d = ctx.view3d,
          session = ctx.session;

      _super.prototype.onEnd.call(_this, ctx);

      _this._renderContext = null;
      _this._modelPlaced = false;
      session.removeEventListener(EVENTS$1.SELECT_START, _this._onSelectStart);
      session.removeEventListener(EVENTS$1.SELECT_END, _this._onSelectEnd);

      _this._hitTest.destroy();

      _this._control.destroy(ctx);

      _this._control = null;
      view3d.scene.show();
    };

    _this._beforeRender = function (ctx) {
      _this._renderContext = ctx;

      if (!_this._modelPlaced) {
        _this._initModelPosition(ctx);
      } else {
        _this._control.update(ctx);
      }
    };

    _this._onSelectStart = function (e) {
      _this._control.onSelectStart(__assign(__assign({}, _this._renderContext), {
        frame: e.frame
      }));
    };

    _this._onSelectEnd = function () {
      _this._control.onSelectEnd();
    };

    _this._control = null;
    _this._renderContext = null;
    _this._modelPlaced = false;
    _this._hitTest = new HitTest();
    _this._features = merge(_this._features, _this._hitTest.features);
    _this._options = options;
    return _this;
  }

  var __proto = FloorARSession.prototype;
  Object.defineProperty(__proto, "control", {
    /**
     * {@link ARControl} instance of this session
     * @type ARFloorControl | null
     */
    get: function () {
      return this._control;
    },
    enumerable: false,
    configurable: true
  });

  __proto._initModelPosition = function (ctx) {
    var _a;

    var view3d = ctx.view3d,
        frame = ctx.frame,
        session = ctx.session;
    var model = view3d.model;
    var hitTest = this._hitTest; // Make sure the model is loaded

    if (!hitTest.ready || !model) return;
    var control = this._control;
    var referenceSpace = view3d.renderer.threeRenderer.xr.getReferenceSpace();
    var hitTestResults = hitTest.getResults(frame);
    if (hitTestResults.length <= 0) return;
    var hit = hitTestResults[0];
    var hitMatrix = new Matrix4().fromArray(hit.getPose(referenceSpace).transform.matrix); // If transformed coords space's y axis is not facing up, don't use it.

    if (hitMatrix.elements[5] < 0.75) return;
    var modelRoot = model.scene;
    var hitPosition = new Vector3().setFromMatrixPosition(hitMatrix); // Reset rotation & update position

    modelRoot.quaternion.set(0, 0, 0, 1);
    modelRoot.position.copy(hitPosition);
    modelRoot.position.setY(modelRoot.position.y - model.bbox.min.y);
    modelRoot.updateMatrix();
    view3d.scene.update(model);
    view3d.scene.show();
    this.emit("canPlace"); // Don't need it

    hitTest.destroy();
    session.addEventListener(EVENTS$1.SELECT_START, this._onSelectStart);
    session.addEventListener(EVENTS$1.SELECT_END, this._onSelectEnd);
    (_a = this._domOverlay) === null || _a === void 0 ? void 0 : _a.hideLoading();
    this._modelPlaced = true;
    this.emit("modelPlaced"); // Show scale up animation

    var originalModelScale = modelRoot.scale.clone();
    var scaleUpAnimation = new Animation({
      context: session
    });
    scaleUpAnimation.on("progress", function (evt) {
      var newScale = originalModelScale.clone().multiplyScalar(evt.easedProgress);
      modelRoot.scale.copy(newScale);
    });
    scaleUpAnimation.on("finish", function () {
      modelRoot.scale.copy(originalModelScale);
      control.init(ctx, hitPosition);
    });
    scaleUpAnimation.start();
  };

  return FloorARSession;
}(WebARSession);

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Arrow indicator for AR model translatioon.
 * @category Controls-AR
 */

var ArrowIndicator =
/*#__PURE__*/
function () {
  /**
   * Create new ArrowIndicator
   * @param {ArrowIndicatorOption} [options={}] Options
   */
  function ArrowIndicator(_a) {
    var _this = this;

    var _b = (_a === void 0 ? {} : _a).color,
        color = _b === void 0 ? 0xffffff : _b;
    var bodyGeometry = new CylinderBufferGeometry(0.1, 0.1, 1);
    var coneGeometry = new CylinderBufferGeometry(0, 0.5, 1, 30, 1);
    bodyGeometry.translate(0, 0.5, 0);
    coneGeometry.translate(0, 1.5, 0);
    var body = new Mesh(bodyGeometry, new MeshBasicMaterial({
      color: color
    }));
    var cone = new Mesh(coneGeometry, new MeshBasicMaterial({
      color: color
    }));
    var arrow = new Group();
    arrow.add(body);
    arrow.add(cone);
    this._arrows = [arrow];
    this._obj = new Group();

    this._obj.add(arrow);

    range(3).forEach(function (idx) {
      var copied = arrow.clone(true);
      copied.rotateZ(Math.PI / 2 * (idx + 1));

      _this._obj.add(copied);

      _this._arrows.push(copied);
    });
    this.hide();
  }

  var __proto = ArrowIndicator.prototype;
  Object.defineProperty(__proto, "object", {
    /**
     * {@link https://threejs.org/docs/index.html#api/en/objects/Group THREE.Group} object that contains arrows.
     */
    get: function () {
      return this._obj;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Show indicator
   */

  __proto.show = function () {
    this._obj.visible = true;
  };
  /**
   * Hide indicator
   */


  __proto.hide = function () {
    this._obj.visible = false;
  };
  /**
   * Change the center of the arrows to a given position
   * @param position Position to set as center of the arrows
   */


  __proto.updatePosition = function (position) {
    this._obj.position.copy(position);
  };
  /**
   * Update the arrow's offset from the center
   * @param offset Offset vector.
   */


  __proto.updateOffset = function (offset) {
    this._arrows.forEach(function (arrow, idx) {
      var facingDirection = new Vector3(0, 1, 0).applyQuaternion(arrow.quaternion);
      var facingOffset = facingDirection.multiply(offset);
      arrow.position.copy(facingOffset);
    });
  };
  /**
   * Update arrow's scale
   * @param scale Scale vector
   */


  __proto.updateScale = function (scale) {
    this._arrows.forEach(function (arrow) {
      return arrow.scale.setScalar(scale);
    });
  };
  /**
   * Update arrow's rotation.
   * @param rotation Quaternion value to rotate arrows.
   */


  __proto.updateRotation = function (rotation) {
    this._obj.quaternion.copy(rotation);
  };

  return ArrowIndicator;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Model's translation(position) control for {@link ARWallControl}
 * @category Controls-AR
 */

var ARWallTranslateControl =
/*#__PURE__*/
function () {
  /**
   * Create new instance of ARTranslateControl
   * @param {ARWallTranslateControlOption} [options={}] Options
   */
  function ARWallTranslateControl(options) {
    if (options === void 0) {
      options = {};
    }

    this.position = new Vector3();
    this.wallPosition = new Vector3();
    this.hitRotation = new Quaternion(); // Global Y guaranteed rotation matrix

    this.wallRotation = new Quaternion(); // Options
    // Internal states

    this._dragPlane = new Plane();
    this._enabled = true;
    this._active = false;
    this._initialPos = new Vector2();
    this._arrowIndicator = new ArrowIndicator(options.arrow);
  }

  var __proto = ARWallTranslateControl.prototype;
  Object.defineProperty(__proto, "enabled", {
    /**
     * Whether this control is enabled or not
     * @readonly
     */
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });

  __proto.initWallTransform = function (_a) {
    var hitPosition = _a.hitPosition,
        hitRotation = _a.hitRotation,
        modelPosition = _a.modelPosition,
        wallRotation = _a.wallRotation;
    this.position.copy(modelPosition);
    this.hitRotation.copy(hitRotation);
    this.wallPosition.copy(hitPosition);
    this.wallRotation.copy(wallRotation);
    var wallNormal = new Vector3(0, 1, 0).applyQuaternion(wallRotation);

    this._dragPlane.set(wallNormal, -wallNormal.dot(modelPosition));
  };

  __proto.init = function (_a) {
    var view3d = _a.view3d;
    view3d.scene.add(this._arrowIndicator.object);
  };

  __proto.destroy = function (_a) {
    var view3d = _a.view3d;
    view3d.scene.remove(this._arrowIndicator.object);
  };
  /**
   * Enable this control
   */


  __proto.enable = function () {
    this._enabled = true;
  };
  /**
   * Disable this control
   */


  __proto.disable = function () {
    this._enabled = false;
    this.deactivate();
  };

  __proto.activate = function (_a, gesture) {
    var model = _a.model;
    if (!this._enabled) return;
    this._active = true; // Update arrows

    var arrowIndicator = this._arrowIndicator;
    var modelBbox = model.initialBbox;
    modelBbox.min.multiply(model.scene.scale);
    modelBbox.max.multiply(model.scene.scale);
    modelBbox.translate(model.scene.position);
    arrowIndicator.show();
    arrowIndicator.updatePosition(modelBbox.getCenter(new Vector3()));
    arrowIndicator.updateScale(model.size / 16);
    var arrowPlaneRotation = model.scene.quaternion.clone();
    arrowIndicator.updateRotation(arrowPlaneRotation);
    arrowIndicator.updateOffset(new Vector3().subVectors(modelBbox.max, modelBbox.min).multiplyScalar(0.5));
  };

  __proto.deactivate = function () {
    this._active = false;

    this._arrowIndicator.hide();
  };

  __proto.setInitialPos = function (coords) {
    this._initialPos.copy(coords[0]);
  };

  __proto.process = function (_a, _b) {
    var view3d = _a.view3d,
        model = _a.model,
        frame = _a.frame,
        referenceSpace = _a.referenceSpace,
        xrCam = _a.xrCam;
    var hitResults = _b.hitResults;
    if (!hitResults || hitResults.length !== 1 || !this._active) return;
    var dragPlane = this._dragPlane;
    var modelRoot = model.scene;
    var modelZOffset = -model.initialBbox.min.z * modelRoot.scale.z;
    var camPos = new Vector3().setFromMatrixPosition(xrCam.matrixWorld);
    var hitResult = hitResults[0];
    var hitPose = hitResult.results[0] && hitResult.results[0].getPose(referenceSpace);
    var isWallHit = hitPose && hitPose.transform.matrix[5] < 0.25;

    if (!hitPose || !isWallHit) {
      // Use previous drag plane if no hit plane is found
      var targetRayPose = frame.getPose(hitResult.inputSource.targetRaySpace, view3d.renderer.threeRenderer.xr.getReferenceSpace());
      var fingerDir = new Vector3().copy(targetRayPose.transform.position).sub(camPos).normalize();
      var fingerRay = new Ray(camPos, fingerDir);
      var intersection = fingerRay.intersectPlane(dragPlane, new Vector3());

      if (intersection) {
        this.wallPosition.copy(intersection.clone().sub(dragPlane.normal.clone().multiplyScalar(modelZOffset)));
        this.position.copy(intersection);
      }

      return;
    }

    var hitMatrix = new Matrix4().fromArray(hitPose.transform.matrix);
    var hitOrientation = new Quaternion().copy(hitPose.transform.orientation);
    var hitPosition = new Vector3().setFromMatrixPosition(hitMatrix);
    var worldYAxis = new Vector3(0, 1, 0);
    /*
     * ^ wallU
     * |
     * ⨀---> wallV
     * wallNormal
     */

    var wallNormal = new Vector3(0, 1, 0).applyQuaternion(hitOrientation).normalize();
    var wallU = new Vector3().crossVectors(worldYAxis, wallNormal);
    var wallV = wallNormal.clone().applyAxisAngle(wallU, -Math.PI / 2); // Reconstruct wall matrix with prev Y(normal) direction as Z axis

    var wallMatrix = new Matrix4().makeBasis(wallU, wallV, wallNormal);
    var modelPosition = hitPosition.clone().add(wallNormal.clone().multiplyScalar(modelZOffset)); // Update position

    this.position.copy(modelPosition);
    this.wallPosition.copy(hitPosition); // Update rotation if it differs more than 10deg

    var prevWallNormal = new Vector3(0, 1, 0).applyQuaternion(this.hitRotation).normalize();

    if (Math.acos(Math.abs(prevWallNormal.dot(wallNormal))) >= Math.PI / 18) {
      var prevWallRotation = this.wallRotation.clone();
      var wallRotation = new Quaternion().setFromRotationMatrix(wallMatrix);
      var rotationDiff = prevWallRotation.inverse().premultiply(wallRotation);
      modelRoot.quaternion.premultiply(rotationDiff);
      this.wallRotation.copy(wallRotation);
      this.hitRotation.copy(hitOrientation);

      this._arrowIndicator.updateRotation(modelRoot.quaternion); // Update drag plane


      dragPlane.set(wallNormal, -modelPosition.dot(wallNormal));
    }
  };

  __proto.update = function (_a, delta) {
    var model = _a.model;
    model.scene.position.copy(this.position);

    this._arrowIndicator.updatePosition(this.position);

    model.scene.updateMatrix();
  };

  return ARWallTranslateControl;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * AR control for {@link WallARSession}.
 * @category Controls-AR
 */

var ARWallControl =
/*#__PURE__*/
function () {
  /**
   * Create new instance of ARControl
   * @param {ARWallControlOption} options Options
   */
  function ARWallControl(options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    this._enabled = true;
    this._initialized = false;
    this._modelHit = false;
    this._hitTestSource = null;

    this.onSelectStart = function (ctx) {
      var view3d = ctx.view3d,
          session = ctx.session,
          frame = ctx.frame,
          referenceSpace = ctx.referenceSpace,
          xrCam = ctx.xrCam;
      var hitTestSource = _this._hitTestSource;
      if (!hitTestSource || !_this._enabled) return;
      var deadzoneChecker = _this._deadzoneChecker;
      var rotateControl = _this._rotateControl;
      var translateControl = _this._translateControl;
      var scaleControl = _this._scaleControl; // Update deadzone testing gestures

      if (rotateControl.enabled) {
        deadzoneChecker.addTestingGestures(GESTURE.ONE_FINGER);
      }

      if (translateControl.enabled) {
        deadzoneChecker.addTestingGestures(GESTURE.ONE_FINGER);
      }

      if (scaleControl.enabled) {
        deadzoneChecker.addTestingGestures(GESTURE.PINCH);
      }

      var hitResults = frame.getHitTestResultsForTransientInput(hitTestSource);

      var coords = _this._hitResultToVector(hitResults);

      deadzoneChecker.applyScreenAspect(coords);
      deadzoneChecker.setFirstInput(coords);

      if (coords.length === 1) {
        // Check finger is on the model
        var modelBbox = view3d.model.bbox;
        var targetRayPose = frame.getPose(session.inputSources[0].targetRaySpace, referenceSpace);
        var camPos = new Vector3().setFromMatrixPosition(xrCam.matrixWorld);
        var fingerDir = new Vector3().copy(targetRayPose.transform.position).sub(camPos).normalize();
        var fingerRay = new Ray(camPos, fingerDir);
        var intersection = fingerRay.intersectBox(modelBbox, new Vector3());

        if (intersection) {
          // Touch point intersected with model
          _this._modelHit = true;
        }
      }

      _this._floorIndicator.show();
    };

    this.onSelectEnd = function () {
      _this.deactivate();

      _this._floorIndicator.fadeout();
    }; // TODO: bind options


    this._rotateControl = new ARSwirlControl(__assign(__assign({}, options.rotate), {
      showIndicator: false
    }));
    this._translateControl = new ARWallTranslateControl(options.translate);
    this._scaleControl = new ARScaleControl(options.scale);
    this._floorIndicator = new FloorIndicator(options.floorIndicator);
    this._deadzoneChecker = new DeadzoneChecker(options.deadzone);
  }

  var __proto = ARWallControl.prototype;
  Object.defineProperty(__proto, "enabled", {
    /**
     * Return whether this control is enabled or not
     */
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "rotate", {
    /**
     * {@link ARSwirlControlOptions} in this control
     */
    get: function () {
      return this._rotateControl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "translate", {
    /**
     * {@link ARTranslateControl} in this control
     */
    get: function () {
      return this._translateControl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "scale", {
    /**
     * {@link ARScaleControl} in this control
     */
    get: function () {
      return this._scaleControl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "controls", {
    get: function () {
      return [this._rotateControl, this._translateControl, this._scaleControl];
    },
    enumerable: false,
    configurable: true
  });

  __proto.init = function (ctx, initialTransform) {
    var _this = this;

    var session = ctx.session,
        view3d = ctx.view3d,
        size = ctx.size;
    this.controls.forEach(function (control) {
      return control.init(ctx);
    });

    this._translateControl.initWallTransform(initialTransform);

    this._deadzoneChecker.setAspect(size.height / size.width);

    view3d.scene.add(this._floorIndicator.mesh);
    this._initialized = true;
    session.requestHitTestSourceForTransientInput({
      profile: INPUT_PROFILE.TOUCH
    }).then(function (transientHitTestSource) {
      _this._hitTestSource = transientHitTestSource;
    });
  };
  /**
   * Destroy this control and deactivate it
   * @param view3d Instance of the {@link View3D}
   */


  __proto.destroy = function (ctx) {
    if (!this._initialized) return;

    if (this._hitTestSource) {
      this._hitTestSource.cancel();

      this._hitTestSource = null;
    }

    ctx.view3d.scene.remove(this._floorIndicator.mesh);
    this.deactivate();
    this.controls.forEach(function (control) {
      return control.destroy(ctx);
    });
    this._initialized = false;
  };

  __proto.deactivate = function () {
    this._modelHit = false;

    this._deadzoneChecker.cleanup();

    this.controls.forEach(function (control) {
      return control.deactivate();
    });
  };
  /**
   * Enable this control
   */


  __proto.enable = function () {
    this._enabled = true;
  };
  /**
   * Disable this control
   */


  __proto.disable = function () {
    this._enabled = false;
    this.deactivate();
  };

  __proto.update = function (ctx) {
    var view3d = ctx.view3d,
        session = ctx.session,
        frame = ctx.frame;
    var hitTestSource = this._hitTestSource;
    if (!hitTestSource || !view3d.model) return;
    var deadzoneChecker = this._deadzoneChecker;
    var inputSources = session.inputSources;
    var hitResults = frame.getHitTestResultsForTransientInput(hitTestSource);

    var coords = this._hitResultToVector(hitResults);

    var xrInputs = {
      coords: coords,
      inputSources: inputSources,
      hitResults: hitResults
    };

    if (deadzoneChecker.inDeadzone) {
      this._checkDeadzone(ctx, xrInputs);
    } else {
      this._processInput(ctx, xrInputs);
    }

    this._updateControls(ctx);
  };

  __proto._checkDeadzone = function (ctx, _a) {
    var coords = _a.coords;
    var model = ctx.model;

    var gesture = this._deadzoneChecker.check(coords.map(function (coord) {
      return coord.clone();
    }));

    var rotateControl = this._rotateControl;
    var translateControl = this._translateControl;
    var scaleControl = this._scaleControl;
    if (gesture === GESTURE.NONE) return;

    switch (gesture) {
      case GESTURE.ONE_FINGER_HORIZONTAL:
      case GESTURE.ONE_FINGER_VERTICAL:
        if (this._modelHit) {
          translateControl.activate(ctx, gesture);
          translateControl.setInitialPos(coords);
        } else {
          rotateControl.activate(ctx, gesture);
          rotateControl.updateAxis(new Vector3(0, 1, 0).applyQuaternion(translateControl.hitRotation));
          rotateControl.updateRotation(model.scene.quaternion);
          rotateControl.setInitialPos(coords);
        }

        break;

      case GESTURE.PINCH:
        scaleControl.activate(ctx, gesture);
        scaleControl.setInitialPos(coords);
        break;
    }
  };

  __proto._processInput = function (ctx, inputs) {
    this.controls.forEach(function (control) {
      return control.process(ctx, inputs);
    });
  };

  __proto._updateControls = function (ctx) {
    var view3d = ctx.view3d,
        model = ctx.model,
        delta = ctx.delta;
    var deltaMilisec = delta * 1000;
    this.controls.forEach(function (control) {
      return control.update(ctx, deltaMilisec);
    });
    model.scene.updateMatrix();
    var translateControl = this._translateControl;
    var floorPosition = translateControl.wallPosition;
    view3d.scene.update(model, {
      floorPosition: floorPosition,
      floorRotation: translateControl.hitRotation
    }); // Get a scaled bbox, which only has scale applied on it.

    var scaleControl = this._scaleControl;
    var scaledBbox = model.initialBbox;
    scaledBbox.min.multiply(scaleControl.scale);
    scaledBbox.max.multiply(scaleControl.scale);
    var floorIndicator = this._floorIndicator;
    var boundingSphere = scaledBbox.getBoundingSphere(new Sphere());
    var rotX90 = new Quaternion().setFromEuler(new Euler(Math.PI / 2, 0, 0));
    var floorRotation = model.scene.quaternion.clone().multiply(rotX90);
    floorIndicator.update({
      delta: deltaMilisec,
      scale: boundingSphere.radius,
      position: floorPosition,
      rotation: floorRotation
    });
  };

  __proto._hitResultToVector = function (hitResults) {
    return hitResults.map(function (input) {
      return new Vector2().set(input.inputSource.gamepad.axes[0], -input.inputSource.gamepad.axes[1]);
    });
  };

  return ARWallControl;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * AR session which places model on the wall
 * @category XR
 * @fires WebARSession#start
 * @fires WebARSession#end
 * @fires WebARSession#canPlace
 * @fires WebARSession#modelPlaced
 */

var WallARSession =
/*#__PURE__*/
function (_super) {
  __extends(WallARSession, _super);
  /**
   * Create new instance of WallARSession
   * @param {WallARSessionOption} [options={}] Options
   */


  function WallARSession(options) {
    if (options === void 0) {
      options = {};
    }

    var _this = _super.call(this, options) || this;

    _this.onStart = function (ctx) {
      var view3d = ctx.view3d,
          session = ctx.session;

      _super.prototype.onStart.call(_this, ctx);

      _this._control = new ARWallControl(_this._options);
      view3d.scene.hide();

      _this._hitTest.init(session);
    };

    _this.onEnd = function (ctx) {
      var view3d = ctx.view3d,
          session = ctx.session;

      _super.prototype.onEnd.call(_this, ctx);

      _this._renderContext = null;
      _this._modelPlaced = false;
      session.removeEventListener(EVENTS$1.SELECT_START, _this._onSelectStart);
      session.removeEventListener(EVENTS$1.SELECT_END, _this._onSelectEnd);

      _this._hitTest.destroy();

      _this._control.destroy(ctx);

      _this._control = null;
      view3d.scene.show();
    };

    _this._beforeRender = function (ctx) {
      _this._renderContext = ctx;

      if (!_this._modelPlaced) {
        _this._initModelPosition(ctx);
      } else {
        _this._control.update(ctx);
      }
    };

    _this._onSelectStart = function (e) {
      _this._control.onSelectStart(__assign(__assign({}, _this._renderContext), {
        frame: e.frame
      }));
    };

    _this._onSelectEnd = function () {
      _this._control.onSelectEnd();
    };

    _this._control = null;
    _this._renderContext = null;
    _this._modelPlaced = false;
    _this._hitTest = new HitTest();
    _this._features = merge(_this._features, _this._hitTest.features);
    _this._options = options;
    return _this;
  }

  var __proto = WallARSession.prototype;
  Object.defineProperty(__proto, "control", {
    /**
     * {@link ARWallControl} instance of this session
     * @type ARWallControl | null
     */
    get: function () {
      return this._control;
    },
    enumerable: false,
    configurable: true
  });

  __proto._initModelPosition = function (ctx) {
    var _a;

    var view3d = ctx.view3d,
        frame = ctx.frame,
        session = ctx.session;
    var model = view3d.model;
    var hitTest = this._hitTest; // Make sure the model is loaded

    if (!hitTest.ready || !model) return;
    var control = this._control;
    var referenceSpace = view3d.renderer.threeRenderer.xr.getReferenceSpace();
    var hitTestResults = hitTest.getResults(frame);
    if (hitTestResults.length <= 0) return;
    var hit = hitTestResults[0];
    var hitPose = hit.getPose(referenceSpace);
    var hitMatrix = new Matrix4().fromArray(hitPose.transform.matrix); // If transformed coord space's y axis is facing up or down, don't use it.

    if (hitMatrix.elements[5] >= 0.25 || hitMatrix.elements[5] <= -0.25) return;
    var modelRoot = model.scene;
    var hitRotation = new Quaternion().copy(hitPose.transform.orientation);
    var hitPosition = new Vector3().setFromMatrixPosition(hitMatrix);
    var modelZOffset = -model.initialBbox.min.z * modelRoot.scale.z;
    var modelPosition = hitPosition.clone().setZ(hitPosition.z + modelZOffset);
    var worldYAxis = new Vector3(0, 1, 0);
    /*
     * ^ wallU
     * |
     * ⨀---> wallV
     * wallNormal
     */

    var wallNormal = new Vector3(0, 1, 0).applyQuaternion(hitRotation).normalize();
    var wallU = new Vector3().crossVectors(worldYAxis, wallNormal);
    var wallV = wallNormal.clone().applyAxisAngle(wallU, -Math.PI / 2); // Reconstruct wall matrix with prev Y(normal) direction as Z axis

    var wallMatrix = new Matrix4().makeBasis(wallU, wallV, wallNormal);
    var wallRotation = new Quaternion().setFromRotationMatrix(wallMatrix);
    var modelRotation = model.scene.quaternion.clone().premultiply(wallRotation); // Update rotation & position

    modelRoot.quaternion.copy(modelRotation);
    modelRoot.position.copy(modelPosition);
    modelRoot.updateMatrix();
    view3d.scene.update(model);
    view3d.scene.show(); // Don't need it

    hitTest.destroy();
    session.addEventListener(EVENTS$1.SELECT_START, this._onSelectStart);
    session.addEventListener(EVENTS$1.SELECT_END, this._onSelectEnd);
    (_a = this._domOverlay) === null || _a === void 0 ? void 0 : _a.hideLoading();
    this._modelPlaced = true; // Show scale up animation

    var originalModelScale = model.scene.scale.clone();
    var scaleUpAnimation = new Animation({
      context: session
    });
    scaleUpAnimation.on("progress", function (evt) {
      var newScale = originalModelScale.clone().multiplyScalar(evt.easedProgress);
      model.scene.scale.copy(newScale);
    });
    scaleUpAnimation.on("finish", function () {
      model.scene.scale.copy(originalModelScale);
      control.init(ctx, {
        hitPosition: hitPosition,
        hitRotation: hitRotation,
        wallRotation: wallRotation,
        modelPosition: modelPosition
      });
    });
    scaleUpAnimation.start();
  };

  return WallARSession;
}(WebARSession);

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
var STATE$2;

(function (STATE) {
  STATE[STATE["WAITING"] = 0] = "WAITING";
  STATE[STATE["ROTATE_HORIZONTAL"] = 1] = "ROTATE_HORIZONTAL";
  STATE[STATE["ROTATE_VERTICAL"] = 2] = "ROTATE_VERTICAL";
})(STATE$2 || (STATE$2 = {}));
/**
 * Two finger swipe control
 * @category Controls-AR
 */


var ARSwipeControl =
/*#__PURE__*/
function () {
  /**
   * Create new ARSwipeControl
   * @param {ARSwipeControlOption} [options={}] Options
   */
  function ARSwipeControl(_a) {
    var _b = (_a === void 0 ? {} : _a).scale,
        scale = _b === void 0 ? 1 : _b;
    /**
     * Current rotation value
     */

    this.rotation = new Quaternion(); // Internal States

    this._state = STATE$2.WAITING;
    this._enabled = true;
    this._active = false;
    this._prevPos = new Vector2();
    this._fromQuat = new Quaternion();
    this._toQuat = new Quaternion();
    this._horizontalAxis = new Vector3();
    this._verticalAxis = new Vector3();
    this._motion = new Motion({
      range: INFINITE_RANGE
    });
    this._rotationIndicator = new RotationIndicator();
    this._userScale = scale;
  }

  var __proto = ARSwipeControl.prototype;
  Object.defineProperty(__proto, "enabled", {
    /**
     * Whether this control is enabled or not.
     * @readonly
     */
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "scale", {
    /**
     * Scale(speed) factor of this control.
     */
    get: function () {
      return this._userScale;
    },
    set: function (val) {
      this._userScale = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "horizontalAxis", {
    get: function () {
      return this._horizontalAxis;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "verticalAxis", {
    get: function () {
      return this._verticalAxis;
    },
    enumerable: false,
    configurable: true
  });

  __proto.init = function (_a) {
    var view3d = _a.view3d;
    var initialRotation = view3d.model.scene.quaternion;
    this.updateRotation(initialRotation);
    view3d.scene.add(this._rotationIndicator.object);
  };

  __proto.destroy = function (_a) {
    var view3d = _a.view3d;
    view3d.scene.remove(this._rotationIndicator.object);
  };

  __proto.updateRotation = function (rotation) {
    this.rotation.copy(rotation);

    this._fromQuat.copy(rotation);

    this._toQuat.copy(rotation);
  };
  /**
   * Enable this control
   */


  __proto.enable = function () {
    this._enabled = true;
  };
  /**
   * Disable this control
   */


  __proto.disable = function () {
    this._enabled = false;
  };

  __proto.updateAxis = function (horizontal, vertical) {
    this._horizontalAxis.copy(horizontal);

    this._verticalAxis.copy(vertical);
  };

  __proto.activate = function (_a, gesture) {
    var view3d = _a.view3d;
    if (!this._enabled) return;
    var model = view3d.model;
    var rotationIndicator = this._rotationIndicator;
    this._active = true;
    rotationIndicator.show();
    rotationIndicator.updatePosition(model.bbox.getCenter(new Vector3()));
    rotationIndicator.updateScale(model.size / 2);

    if (gesture === GESTURE.TWO_FINGER_HORIZONTAL) {
      rotationIndicator.updateRotation(model.scene.quaternion.clone().multiply(new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0))));
      this._state = STATE$2.ROTATE_HORIZONTAL;
    } else if (gesture === GESTURE.TWO_FINGER_VERTICAL) {
      rotationIndicator.updateRotation(model.scene.quaternion.clone().multiply(new Quaternion().setFromEuler(new Euler(0, Math.PI / 2, 0))));
      this._state = STATE$2.ROTATE_VERTICAL;
    }
  };

  __proto.deactivate = function () {
    this._active = false;

    this._rotationIndicator.hide();

    this._state = STATE$2.WAITING;
  };

  __proto.setInitialPos = function (coords) {
    if (coords.length < 2) return;

    this._prevPos.set((coords[0].x + coords[1].x) / 2, (coords[0].y + coords[1].y) / 2);
  };

  __proto.process = function (ctx, _a) {
    var coords = _a.coords;
    if (!this._active || coords.length !== 2) return;
    var state = this._state;
    var prevPos = this._prevPos;
    var motion = this._motion;
    var scale = this._userScale;
    var middlePos = new Vector2((coords[0].x + coords[1].x) / 2, (coords[0].y + coords[1].y) / 2);
    var posDiff = new Vector2().subVectors(prevPos, middlePos);
    var rotationAxis = state === STATE$2.ROTATE_HORIZONTAL ? this._horizontalAxis : this._verticalAxis;
    var rotationAngle = state === STATE$2.ROTATE_HORIZONTAL ? posDiff.x * scale : -posDiff.y * scale;
    var rotation = new Quaternion().setFromAxisAngle(rotationAxis, rotationAngle);

    var interpolated = this._getInterpolatedQuaternion();

    this._fromQuat.copy(interpolated);

    this._toQuat.premultiply(rotation);

    motion.reset(0);
    motion.setEndDelta(1);
    prevPos.copy(middlePos);
  };

  __proto.update = function (_a, deltaTime) {
    var model = _a.model;
    var motion = this._motion;
    motion.update(deltaTime);

    var interpolated = this._getInterpolatedQuaternion();

    this.rotation.copy(interpolated);
    model.scene.quaternion.copy(this.rotation);
  };

  __proto._getInterpolatedQuaternion = function () {
    var motion = this._motion;
    var toEuler = this._toQuat;
    var fromEuler = this._fromQuat;
    var progress = motion.val;
    return new Quaternion().copy(fromEuler).slerp(toEuler, progress);
  };

  return ARSwipeControl;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Model's yaw(local y-axis rotation) controller which works on AR(WebXR) mode.
 * @category Controls-AR
 */

var ARHoverRotateControl =
/*#__PURE__*/
function () {
  /**
   * Create new instance of ARRotateControl
   * @param {ARHoverRotateControlOption} options Options
   */
  function ARHoverRotateControl(options) {
    if (options === void 0) {
      options = {};
    }
    /**
     * Current rotation value
     */


    this.rotation = new Quaternion();
    this._zRotationControl = new ARSwirlControl(options.swirl);
    this._xyRotationControl = new ARSwipeControl(options.swipe);
    this._activatedControl = null;
  }

  var __proto = ARHoverRotateControl.prototype;
  Object.defineProperty(__proto, "enabled", {
    /**
     * Whether this control is enabled or not.
     * This returns true when either one finger control or two finger control is enabled.
     * @readonly
     */
    get: function () {
      return this._zRotationControl.enabled || this._xyRotationControl.enabled;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "swirl", {
    /**
     * {@link ARSwirlControl} of this control.
     */
    get: function () {
      return this._zRotationControl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "swipe", {
    /**
     * {@link ARSwipeControl} of this control.
     */
    get: function () {
      return this._xyRotationControl;
    },
    enumerable: false,
    configurable: true
  });

  __proto.init = function (ctx) {
    var initialRotation = ctx.view3d.model.scene.quaternion;
    this.rotation.copy(initialRotation);

    this._zRotationControl.init(ctx);

    this._xyRotationControl.init(ctx);
  };

  __proto.destroy = function (ctx) {
    this._zRotationControl.destroy(ctx);

    this._xyRotationControl.destroy(ctx);
  };
  /**
   * Enable this control
   */


  __proto.enable = function () {
    this._zRotationControl.enable();

    this._xyRotationControl.enable();
  };
  /**
   * Disable this control
   */


  __proto.disable = function () {
    this._zRotationControl.disable();

    this._xyRotationControl.disable();
  };

  __proto.activate = function (ctx, gesture) {
    var zRotationControl = this._zRotationControl;
    var xyRotationControl = this._xyRotationControl;

    if (gesture & GESTURE.ONE_FINGER) {
      zRotationControl.activate(ctx, gesture);
      zRotationControl.updateRotation(this.rotation);
      this._activatedControl = zRotationControl;
    } else if (gesture & GESTURE.TWO_FINGER) {
      xyRotationControl.activate(ctx, gesture);
      xyRotationControl.updateRotation(this.rotation);
      this._activatedControl = xyRotationControl;
    }
  };

  __proto.deactivate = function () {
    this._zRotationControl.deactivate();

    this._xyRotationControl.deactivate();
  };

  __proto.process = function (ctx, inputs) {
    this._zRotationControl.process(ctx, inputs);

    this._xyRotationControl.process(ctx, inputs);
  };

  __proto.setInitialPos = function (coords) {
    this._zRotationControl.setInitialPos(coords);

    this._xyRotationControl.setInitialPos(coords);
  };

  __proto.update = function (ctx, deltaTime) {
    if (this._activatedControl) {
      this._activatedControl.update(ctx, deltaTime);

      this.rotation.copy(this._activatedControl.rotation);
    }
  };

  __proto.updateRotateAxis = function (_a) {
    var view3d = _a.view3d,
        xrCam = _a.xrCam;
    var model = view3d.model;
    var zRotateAxis = new Vector3();
    var horizontalRotateAxis = new Vector3();
    var verticalRotateAxis = new Vector3();
    var cameraRotation = new Quaternion().setFromRotationMatrix(xrCam.matrixWorld);
    var cameraBasis = [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)].map(function (axis) {
      return axis.applyQuaternion(cameraRotation).normalize();
    });
    var modelBasis = [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)].map(function (axis) {
      return axis.applyQuaternion(model.scene.quaternion);
    }); // Always use z-rotation

    zRotateAxis.copy(modelBasis[2]); // Use more appropriate one between x/y axis

    horizontalRotateAxis.copy(modelBasis[1]);
    verticalRotateAxis.copy(modelBasis[0]); // If it's facing other direction, negate it to face correct direction

    if (zRotateAxis.dot(cameraBasis[2]) < 0) {
      zRotateAxis.negate();
    }

    if (horizontalRotateAxis.dot(cameraBasis[1]) > 0) {
      horizontalRotateAxis.negate();
    }

    if (verticalRotateAxis.dot(cameraBasis[0]) > 0) {
      verticalRotateAxis.negate();
    }

    this._zRotationControl.updateAxis(zRotateAxis);

    this._xyRotationControl.updateAxis(horizontalRotateAxis, verticalRotateAxis);
  };

  return ARHoverRotateControl;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Model's translation(position) control for {@link ARHoverControl}
 * @category Controls-AR
 */

var ARHoverTranslateControl =
/*#__PURE__*/
function () {
  /**
   * Create new instance of ARTranslateControl
   * @param {ARHoverTranslateControlOption} [options={}] Options
   */
  function ARHoverTranslateControl(options) {
    if (options === void 0) {
      options = {};
    } // Internal states


    this._position = new Vector3();
    this._dragPlane = new Plane();
    this._enabled = true;
    this._active = false;
    this._initialPos = new Vector2();
    this._arrowIndicator = new ArrowIndicator(options.arrow);
  }

  var __proto = ARHoverTranslateControl.prototype;
  Object.defineProperty(__proto, "enabled", {
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "position", {
    get: function () {
      return this._position.clone();
    },
    enumerable: false,
    configurable: true
  });

  __proto.init = function (_a) {
    var view3d = _a.view3d;

    this._position.copy(view3d.model.scene.position);

    view3d.scene.add(this._arrowIndicator.object);
  };

  __proto.destroy = function (_a) {
    var view3d = _a.view3d;
    view3d.scene.remove(this._arrowIndicator.object);
  };
  /**
   * Enable this control
   */


  __proto.enable = function () {
    this._enabled = true;
  };
  /**
   * Disable this control
   */


  __proto.disable = function () {
    this._enabled = false;
    this.deactivate();
  };

  __proto.activate = function (_a, gesture) {
    var model = _a.model,
        xrCam = _a.xrCam;
    if (!this._enabled) return;
    var modelPos = model.scene.position;
    var camPos = new Vector3().setFromMatrixPosition(xrCam.matrixWorld);
    var modelBasis = [new Vector3(), new Vector3(), new Vector3()];
    model.scene.matrixWorld.extractBasis(modelBasis[0], modelBasis[1], modelBasis[2]);
    modelBasis.forEach(function (axes) {
      return axes.normalize();
    });
    var camToModelDir = new Vector3().subVectors(modelPos, camPos).clone().normalize();
    var primaryAxisIdx = getPrimaryAxisIndex(modelBasis, camToModelDir);
    var primaryAxis = modelBasis[primaryAxisIdx]; // If axes is facing the opposite of camera, negate it

    if (primaryAxis.dot(camToModelDir) < 0) {
      primaryAxis.negate();
    }

    var originToDragPlane = new Plane(primaryAxis, 0).distanceToPoint(modelPos);

    this._dragPlane.set(primaryAxis, -originToDragPlane);

    this._active = true; // Update arrows

    var arrowIndicator = this._arrowIndicator;
    var modelBbox = model.initialBbox;
    modelBbox.min.multiply(model.scene.scale);
    modelBbox.max.multiply(model.scene.scale);
    modelBbox.translate(modelPos);
    arrowIndicator.show();
    arrowIndicator.updatePosition(modelBbox.getCenter(new Vector3()));
    arrowIndicator.updateScale(model.size / 16);
    var arrowPlaneRotation = model.scene.quaternion.clone();

    if (primaryAxisIdx === 0) {
      arrowPlaneRotation.multiply(new Quaternion().setFromEuler(new Euler(0, Math.PI / 2, 0)));
    } else if (primaryAxisIdx === 1) {
      arrowPlaneRotation.multiply(new Quaternion().setFromEuler(new Euler(Math.PI / 2, 0, 0)));
    }

    arrowIndicator.updateRotation(arrowPlaneRotation);
    arrowIndicator.updateOffset(new Vector3().subVectors(modelBbox.max, modelBbox.min).multiplyScalar(0.5));
  };

  __proto.deactivate = function () {
    this._active = false;

    this._arrowIndicator.hide();
  };

  __proto.setInitialPos = function (coords) {
    this._initialPos.copy(coords[0]);
  };

  __proto.process = function (_a, _b) {
    var view3d = _a.view3d,
        frame = _a.frame,
        referenceSpace = _a.referenceSpace,
        xrCam = _a.xrCam;
    var inputSources = _b.inputSources;
    if (inputSources.length !== 1 || !this._active) return;
    var inputSource = inputSources[0];
    var dragPlane = this._dragPlane;
    var targetRayPose = frame.getPose(inputSource.targetRaySpace, referenceSpace);
    var camPos = new Vector3().setFromMatrixPosition(xrCam.matrixWorld);
    var fingerDir = new Vector3().copy(targetRayPose.transform.position).sub(camPos).normalize();
    var fingerRay = new Ray(camPos, fingerDir);
    var intersection = fingerRay.intersectPlane(dragPlane, new Vector3());

    if (intersection) {
      this._position.copy(intersection); // Update arrow position. As position is not a center of model, we should apply offset from it


      var model = view3d.model;
      var centerYOffset = model.initialBbox.getCenter(new Vector3()).multiply(model.scene.scale).y;
      var modelLocalYDir = new Vector3().applyQuaternion(model.scene.quaternion);
      var newCenter = intersection.add(modelLocalYDir.multiplyScalar(centerYOffset));

      this._arrowIndicator.updatePosition(newCenter);
    }
  };

  __proto.update = function (_a, delta) {
    var model = _a.model;
    model.scene.position.copy(this._position);
  };

  return ARHoverTranslateControl;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * AR control for {@link HoverARSession}
 * @category Controls-AR
 */

var ARHoverControl =
/*#__PURE__*/
function () {
  /**
   * Create new instance of ARHoverControl
   * @param {ARHoverControlOption} options Options
   */
  function ARHoverControl(options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    this._enabled = true;
    this._initialized = false;
    this._modelHit = false;

    this.onSelectStart = function (ctx) {
      var view3d = ctx.view3d,
          session = ctx.session,
          frame = ctx.frame,
          referenceSpace = ctx.referenceSpace,
          xrCam = ctx.xrCam;
      if (!_this._enabled) return;
      var deadzoneChecker = _this._deadzoneChecker;
      var rotateControl = _this._rotateControl;
      var translateControl = _this._translateControl;
      var scaleControl = _this._scaleControl; // Update rotation axis

      if (rotateControl.enabled) {
        rotateControl.updateRotateAxis(ctx);
      } // Update deadzone testing gestures


      if (rotateControl.swirl.enabled) {
        deadzoneChecker.addTestingGestures(GESTURE.ONE_FINGER);
      }

      if (rotateControl.swipe.enabled) {
        deadzoneChecker.addTestingGestures(GESTURE.TWO_FINGER);
      }

      if (translateControl.enabled) {
        deadzoneChecker.addTestingGestures(GESTURE.ONE_FINGER);
      }

      if (scaleControl.enabled) {
        deadzoneChecker.addTestingGestures(GESTURE.PINCH);
      }

      var coords = _this._inputSourceToVector(session.inputSources);

      deadzoneChecker.applyScreenAspect(coords);
      deadzoneChecker.setFirstInput(coords);

      if (coords.length === 1) {
        // Check finger is on the model
        var modelBbox = view3d.model.bbox;
        var targetRayPose = frame.getPose(session.inputSources[0].targetRaySpace, referenceSpace);
        var camPos = new Vector3().setFromMatrixPosition(xrCam.matrixWorld);
        var fingerDir = new Vector3().copy(targetRayPose.transform.position).sub(camPos).normalize();
        var fingerRay = new Ray(camPos, fingerDir);
        var intersection = fingerRay.intersectBox(modelBbox, new Vector3());

        if (intersection) {
          // Touch point intersected with model
          _this._modelHit = true;
        }
      }
    };

    this.onSelectEnd = function () {
      _this.deactivate();
    };

    this._rotateControl = new ARHoverRotateControl(options.rotate);
    this._translateControl = new ARHoverTranslateControl(options.translate);
    this._scaleControl = new ARScaleControl(options.scale);
    this._deadzoneChecker = new DeadzoneChecker();
  }

  var __proto = ARHoverControl.prototype;
  Object.defineProperty(__proto, "enabled", {
    /**
     * Return whether this control is enabled or not
     */
    get: function () {
      return this._enabled;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "rotate", {
    /**
     * {@link ARHoverRotateControlOption} in this control
     */
    get: function () {
      return this._rotateControl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "translate", {
    /**
     * {@link ARHoverTranslateControlOption} in this control
     */
    get: function () {
      return this._translateControl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "scale", {
    /**
     * {@link ARScaleControl} in this control
     */
    get: function () {
      return this._scaleControl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "controls", {
    get: function () {
      return [this._rotateControl, this._translateControl, this._scaleControl];
    },
    enumerable: false,
    configurable: true
  });

  __proto.init = function (ctx) {
    var size = ctx.size;
    this.controls.forEach(function (control) {
      return control.init(ctx);
    });

    this._deadzoneChecker.setAspect(size.height / size.width);

    this._initialized = true;
  };
  /**
   * Destroy this control and deactivate it
   * @param view3d Instance of the {@link View3D}
   */


  __proto.destroy = function (ctx) {
    if (!this._initialized) return;
    this.deactivate();
    this.controls.forEach(function (control) {
      return control.destroy(ctx);
    });
    this._initialized = false;
  };

  __proto.deactivate = function () {
    this._modelHit = false;

    this._deadzoneChecker.cleanup();

    this.controls.forEach(function (control) {
      return control.deactivate();
    });
  };
  /**
   * Enable this control
   */


  __proto.enable = function () {
    this._enabled = true;
  };
  /**
   * Disable this control
   */


  __proto.disable = function () {
    this._enabled = false;
    this.deactivate();
  };

  __proto.update = function (ctx) {
    var session = ctx.session;
    if (!this._initialized) return;
    var deadzoneChecker = this._deadzoneChecker;
    var inputSources = session.inputSources;

    if (deadzoneChecker.inDeadzone) {
      this._checkDeadzone(ctx, inputSources);
    } else {
      this._processInput(ctx, inputSources);
    }

    this._updateControls(ctx);
  };

  __proto._checkDeadzone = function (ctx, inputSources) {
    var coords = this._inputSourceToVector(inputSources);

    var gesture = this._deadzoneChecker.check(coords.map(function (coord) {
      return coord.clone();
    }));

    var rotateControl = this._rotateControl;
    var translateControl = this._translateControl;
    var scaleControl = this._scaleControl;
    if (gesture === GESTURE.NONE) return;

    switch (gesture) {
      case GESTURE.ONE_FINGER_HORIZONTAL:
      case GESTURE.ONE_FINGER_VERTICAL:
        if (this._modelHit) {
          translateControl.activate(ctx, gesture);
          translateControl.setInitialPos(coords);
        } else {
          rotateControl.activate(ctx, gesture);
          rotateControl.setInitialPos(coords);
        }

        break;

      case GESTURE.TWO_FINGER_HORIZONTAL:
      case GESTURE.TWO_FINGER_VERTICAL:
        rotateControl.activate(ctx, gesture);
        rotateControl.setInitialPos(coords);
        break;

      case GESTURE.PINCH:
        scaleControl.activate(ctx, gesture);
        scaleControl.setInitialPos(coords);
        break;
    }
  };

  __proto._processInput = function (ctx, inputSources) {
    var coords = this._inputSourceToVector(inputSources);

    this.controls.forEach(function (control) {
      return control.process(ctx, {
        coords: coords,
        inputSources: inputSources
      });
    });
  };

  __proto._updateControls = function (ctx) {
    var view3d = ctx.view3d,
        model = ctx.model,
        delta = ctx.delta;
    var deltaMilisec = delta * 1000;
    this.controls.forEach(function (control) {
      return control.update(ctx, deltaMilisec);
    });
    model.scene.updateMatrix();
    view3d.scene.update(model);
  };

  __proto._inputSourceToVector = function (inputSources) {
    return Array.from(inputSources).map(function (inputSource) {
      var axes = inputSource.gamepad.axes;
      return new Vector2(axes[0], -axes[1]);
    });
  };

  return ARHoverControl;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * WebXR based AR session which puts model at the space front of camera.
 * @category XR
 * @fires WebARSession#start
 * @fires WebARSession#end
 * @fires WebARSession#canPlace
 * @fires WebARSession#modelPlaced
 */

var HoverARSession =
/*#__PURE__*/
function (_super) {
  __extends(HoverARSession, _super);
  /**
   * Create new instance of HoverARSession
   * @param {HoverARSessionOption} options Options
   */


  function HoverARSession(options) {
    if (options === void 0) {
      options = {};
    }

    var _this = _super.call(this, options) || this;

    _this.onStart = function (ctx) {
      var view3d = ctx.view3d;

      _super.prototype.onStart.call(_this, ctx);

      _this._control = new ARHoverControl(_this._options);
      view3d.scene.hide();
    };

    _this.onEnd = function (ctx) {
      var view3d = ctx.view3d,
          session = ctx.session;

      _super.prototype.onEnd.call(_this, ctx);

      _this._renderContext = null;
      _this._modelPlaced = false;
      session.removeEventListener(EVENTS$1.SELECT_START, _this._onSelectStart);
      session.removeEventListener(EVENTS$1.SELECT_END, _this._onSelectEnd);

      _this._control.destroy(ctx);

      _this._control = null;
      view3d.scene.show();
    };

    _this._beforeRender = function (ctx) {
      _this._renderContext = ctx;

      if (!_this._modelPlaced) {
        _this._initModelPosition(ctx);
      } else {
        _this._control.update(ctx);
      }
    };

    _this._onSelectStart = function (e) {
      _this._control.onSelectStart(__assign(__assign({}, _this._renderContext), {
        frame: e.frame
      }));
    };

    _this._onSelectEnd = function () {
      _this._control.onSelectEnd();
    };

    _this._control = null;
    _this._renderContext = null;
    _this._modelPlaced = false;
    _this._options = options;
    return _this;
  }

  var __proto = HoverARSession.prototype;
  Object.defineProperty(__proto, "control", {
    /**
     * {@link ARControl} instance of this session
     * @type ARHoverControl | null
     */
    get: function () {
      return this._control;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Place model on the current position
   */

  __proto.placeModel = function () {
    var ctx = this._renderContext; // Not ready to place model yet

    if (!ctx || !ctx.view3d.scene.visible || this._modelPlaced) return;
    var session = ctx.session,
        view3d = ctx.view3d;
    var modelRoot = view3d.model.scene;
    var control = this._control;
    session.addEventListener(EVENTS$1.SELECT_START, this._onSelectStart);
    session.addEventListener(EVENTS$1.SELECT_END, this._onSelectEnd);
    this._modelPlaced = true;
    this.emit("modelPlaced"); // Show scale up animation

    var originalModelScale = modelRoot.scale.clone();
    var scaleUpAnimation = new Animation({
      context: session
    });
    scaleUpAnimation.on("progress", function (evt) {
      var newScale = originalModelScale.clone().multiplyScalar(evt.easedProgress);
      modelRoot.scale.copy(newScale);
    });
    scaleUpAnimation.on("finish", function () {
      modelRoot.scale.copy(originalModelScale);
      control.init(ctx);
    });
    scaleUpAnimation.start();
  };

  __proto._initModelPosition = function (ctx) {
    var view3d = ctx.view3d,
        xrCam = ctx.xrCam;
    var model = view3d.model; // Make sure the model exist

    if (!model) return;
    var modelRoot = model.scene;
    var camPos = new Vector3().setFromMatrixPosition(xrCam.matrixWorld);
    var camQuat = new Quaternion().setFromRotationMatrix(xrCam.matrixWorld);
    var viewDir = new Vector3(0, 0, -1).applyQuaternion(camQuat);
    var modelBbox = model.bbox;
    var bboxDiff = new Vector3().subVectors(modelBbox.max, modelBbox.min);
    var maxComponent = Math.max(bboxDiff.x, bboxDiff.y, bboxDiff.z); // Reset rotation & update position

    modelRoot.position.copy(camPos);
    modelRoot.position.add(viewDir.multiplyScalar(clamp(maxComponent, 0.5, 3))); // Place at 1m from camera

    modelRoot.lookAt(camPos.setY(modelRoot.position.y));
    modelRoot.updateMatrix();
    view3d.scene.update(model);

    if (!view3d.scene.visible) {
      view3d.scene.show();
      this.emit("canPlace");
    }
  };

  return HoverARSession;
}(WebARSession);

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
// Browser related constants
var IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
var IS_ANDROID = /android/i.test(navigator.userAgent);
var IS_SAFARI = /safari/i.test(navigator.userAgent);

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * AR session using Google's scene-viewer
 * @category XR
 * @see https://developers.google.com/ar/develop/java/scene-viewer
 */

var SceneViewerSession =
/*#__PURE__*/
function () {
  /**
   * Create new instance of SceneViewerSession
   * @see https://developers.google.com/ar/develop/java/scene-viewer
   * @param params Session params
   * @param {string} [params.file] This URL specifies the glTF or glb file that should be loaded into Scene Viewer. This should be URL-escaped.
   * @param {string} [params.browser_fallback_url] This is a Google Chrome feature supported only for web-based implementations. When the Google app com.google.android.googlequicksearchbox is not present on the device, this is the URL that Google Chrome navigates to.
   * @param {string} [params.mode="ar_only"] See {@link https://developers.google.com/ar/develop/java/scene-viewer} for available modes.
   * @param {string} [params.title] A name for the model. If present, it will be displayed in the UI. The name will be truncated with ellipses after 60 characters.
   * @param {string} [params.link] A URL for an external webpage. If present, a button will be surfaced in the UI that intents to this URL when clicked.
   * @param {string} [params.sound] A URL to a looping audio track that is synchronized with the first animation embedded in a glTF file. It should be provided alongside a glTF with an animation of matching length. If present, the sound is looped after the model is loaded. This should be URL-escaped.
   * @param {string} [params.resizable=true] When set to false, users will not be able to scale the model in the AR experience. Scaling works normally in the 3D experience.
   */
  function SceneViewerSession(params) {
    this.params = params;
    this.isWebXRSession = false;

    if (!this.params.mode) {
      // Default mode is "ar_only", which should use com.google.ar.core package
      this.params.mode = "ar_only";
    }
  }
  /**
   * Return the availability of SceneViewerSession.
   * Scene-viewer is available on all android devices with google ARCore installed.
   * @returns {Promise} A Promise that resolves availability of this session(boolean).
   */


  var __proto = SceneViewerSession.prototype;

  __proto.isAvailable = function () {
    return Promise.resolve(IS_ANDROID);
  };
  /**
   * Enter Scene-viewer AR session
   */


  __proto.enter = function () {
    var params = Object.assign({}, this.params);
    var fallback = params.browser_fallback_url;
    delete params.browser_fallback_url;
    var resizable = params.resizable;
    delete params.resizable;

    if (resizable === true) {
      params.resizable = "true";
    } else if (resizable === false) {
      params.resizable = "false";
    } else if (resizable) {
      params.resizable = resizable;
    }

    var queryString = Object.keys(params).filter(function (key) {
      return params[key] != null;
    }).map(function (key) {
      return key + "=" + params[key];
    }).join("&");
    var intentURL = params.mode === "ar_only" ? SCENE_VIEWER.INTENT_AR_CORE(queryString, fallback) : SCENE_VIEWER.INTENT_SEARCHBOX(queryString, fallback || SCENE_VIEWER.FALLBACK_DEFAULT(queryString));
    var anchor = document.createElement("a");
    anchor.href = intentURL;
    anchor.click();
    return Promise.resolve();
  };

  __proto.exit = function () {// DO NOTHING
  };

  return SceneViewerSession;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * AR Session using Apple AR Quick Look Viewer
 * @category XR
 * @see https://developer.apple.com/augmented-reality/quick-look/
 */

var QuickLookSession =
/*#__PURE__*/
function () {
  /**
   * Create new instance of QuickLookSession
   * @param {object} [options] Quick Look options
   * @param {string} [options.file] USDZ file's location URL.
   * @param {boolean} [options.allowsContentScaling=true] Whether to allow content scaling.
   */
  function QuickLookSession(_a) {
    var file = _a.file,
        _b = _a.allowsContentScaling,
        allowsContentScaling = _b === void 0 ? true : _b;
    /**
     * Whether it's webxr-based session or not
     * @type false
     */

    this.isWebXRSession = false;
    this._file = file;
    this._allowsContentScaling = allowsContentScaling;
  }
  /**
   * Return the availability of QuickLookSession.
   * QuickLook AR is available on iOS12+ on Safari & Chrome browser
   * Note that iOS Chrome won't show up QuickLook AR when it's local dev environment
   * @returns {Promise} A Promise that resolves availability of this session(boolean).
   */


  var __proto = QuickLookSession.prototype;

  __proto.isAvailable = function () {
    // This can handle all WebKit based browsers including iOS Safari & iOS Chrome
    return Promise.resolve(QUICKLOOK_SUPPORTED && IS_IOS && IS_SAFARI);
  };
  /**
   * Enter QuickLook AR Session
   */


  __proto.enter = function () {
    var anchor = document.createElement("a");
    anchor.setAttribute("rel", "ar");
    anchor.appendChild(document.createElement("img"));
    var usdzURL = new URL(this._file, window.location.toString());

    if (!this._allowsContentScaling) {
      usdzURL.hash = "allowsContentScaling=0";
    }

    anchor.setAttribute("href", usdzURL.toString());
    anchor.click();
    return Promise.resolve();
  };

  __proto.exit = function () {// DO NOTHING
  };

  return QuickLookSession;
}();

/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/**
 * Texture(image) model
 * @category Extra
 */

var TextureModel =
/*#__PURE__*/
function (_super) {
  __extends(TextureModel, _super);
  /**
   * Create new TextureModel
   * @param {object} options Options
   * @param {number} [options.width] Width of the model.
   * @param {number} [options.height] Height of the model.
   * @param {boolean} [options.billboard=false] When set to true, model will keep rotate to show its front face to camera. Only Y-axis rotation is considered.
   * @throws {View3DError} `CODES.PROVIDE_WIDTH_OR_HEIGHT` When both width and height are not given.
   */


  function TextureModel(_a) {
    var image = _a.image,
        width = _a.width,
        height = _a.height,
        _b = _a.billboard,
        billboard = _b === void 0 ? false : _b;

    var _this = this;

    var texture = image.isTexture ? image : new Texture(image);
    var aspect = texture.image.width / texture.image.height;

    if (width == null && height == null) {
      throw new View3DError(MESSAGES.PROVIDE_WIDTH_OR_HEIGHT, CODES.PROVIDE_WIDTH_OR_HEIGHT);
    }

    if (width == null) {
      width = height * aspect;
    } else if (height == null) {
      height = width / aspect;
    }

    texture.encoding = sRGBEncoding;
    var geometry = new PlaneGeometry(width, height);
    var material = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide
    });
    var mesh = new Mesh(geometry, material);
    _this = _super.call(this, {
      scenes: [mesh]
    }) || this;
    _this._texture = texture;
    _this._mesh = mesh;

    if (billboard) {
      var root_1 = mesh;

      root_1.onBeforeRender = function (renderer, scene, camera) {
        var pos = root_1.getWorldPosition(new Vector3());
        var camPos = new Vector3().setFromMatrixPosition(camera.matrixWorld);
        root_1.lookAt(camPos.setY(pos.y));
        mesh.updateMatrix();
      };
    }

    return _this;
  }

  var __proto = TextureModel.prototype;
  Object.defineProperty(__proto, "texture", {
    /**
     * Texture that used for this model
     * @see https://threejs.org/docs/index.html#api/en/textures/Texture
     * @type THREE.Texture
     */
    get: function () {
      return this._texture;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(__proto, "mesh", {
    /**
     * Model's mesh object
     * @see https://threejs.org/docs/index.html#api/en/objects/Mesh
     * @type THREE.Mesh
     */
    get: function () {
      return this._mesh;
    },
    enumerable: false,
    configurable: true
  });
  return TextureModel;
}(Model);

export default View3D;
export { AnimationControl, AutoControl, AutoDirectionalLight, Camera, Controller, DistanceControl, DracoLoader, easing as EASING, CODES as ERROR_CODES, FloorARSession, GLTFLoader, HoverARSession, Model, ModelAnimator, Motion, OrbitControl, Pose, QuickLookSession, Renderer, RotateControl, Scene, SceneViewerSession, ShadowPlane, TextureLoader, TextureModel, TranslateControl, View3DError, WallARSession, WebARSession, XRManager };
//# sourceMappingURL=view3d.esm.js.map
