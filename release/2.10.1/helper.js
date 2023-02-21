/*
Copyright (c) NAVER Corp.
name: @egjs/view3d
license: MIT
author: NAVER Corp.
repository: https://github.com/naver/egjs-view3d
version: 2.10.1
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.View3D = global.View3D || {}, global.View3D.Helper = factory()));
}(this, (function () { 'use strict';

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
  var isAvailable = function (_a) {
    var _b = _a === void 0 ? {} : _a,
      _c = _b.webGL,
      webGL = _c === void 0 ? true : _c,
      _d = _b.fetch,
      fetch = _d === void 0 ? true : _d,
      _e = _b.stream,
      stream = _e === void 0 ? true : _e,
      _f = _b.wasm,
      wasm = _f === void 0 ? true : _f;
    if (webGL) {
      var webglAvailable = checkWebGLAvailability();
      if (!webglAvailable) return false;
    }
    if (fetch) {
      var fetchAvailable = window && window.fetch;
      if (!fetchAvailable) return false;
    }
    if (stream) {
      var streamAvailable = window && window.ReadableStream;
      if (!streamAvailable) return false;
    }
    if (wasm) {
      var wasmAvailable = checkWASMAvailability();
      if (!wasmAvailable) return false;
    }
    return true;
  };
  var checkWebGLAvailability = function () {
    try {
      var canvas = document.createElement("canvas");
      return !!window.WebGLRenderingContext && !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch (e) {
      return false;
    }
  };
  var checkWASMAvailability = function () {
    try {
      if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
        var wasmModule = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
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
  var index_umd = {
    isAvailable: isAvailable
  };

  return index_umd;

})));
