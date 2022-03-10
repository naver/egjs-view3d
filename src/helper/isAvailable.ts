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
}: Partial<{
  webGL: boolean;
  fetch: boolean;
  stream: boolean;
  wasm: boolean;
}> = {}) => {
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
    return !!window.WebGLRenderingContext &&
      !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch (e) {
    return false;
  }
};

const checkWASMAvailability = () => {
  try {
    if (typeof WebAssembly === "object"
        && typeof WebAssembly.instantiate === "function") {
      const wasmModule = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
      if (wasmModule instanceof WebAssembly.Module) {
        return new WebAssembly.Instance(wasmModule) instanceof WebAssembly.Instance;
      }
    }
  } catch (e) {
    return false;
  }
};

export default isAvailable;
