/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "./View3D";
import View3DError from "./core/View3DError";
import ERROR from "./const/error";
import { NoBoolean, TypedArray } from "./type/utils";

export const isNumber = (val: any): val is number => typeof val === "number";
export const isString = (val: any): val is string => typeof val === "string";
export const isElement = (val: any): val is Element => !!val && val.nodeType === Node.ELEMENT_NODE;

export const getNullableElement = (el: HTMLElement | string | null, parent?: HTMLElement): HTMLElement | null => {
  let targetEl: HTMLElement | null = null;

  if (isString(el)) {
    const parentEl = parent ? parent : document;
    const queryResult = parentEl.querySelector(el);

    if (!queryResult) {
      return null;
    }

    targetEl = queryResult as HTMLElement;
  } else if (isElement(el)) {
    targetEl = el;
  }

  return targetEl;
};

export const getElement = (el: HTMLElement | string, parent?: HTMLElement): HTMLElement => {
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

export const findCanvas = (root: HTMLElement, selector: string): HTMLCanvasElement => {
  const canvas = root.querySelector(selector) as HTMLCanvasElement;

  if (!canvas) {
    throw new View3DError(ERROR.MESSAGES.CANVAS_NOT_FOUND, ERROR.CODES.CANVAS_NOT_FOUND);
  }

  return canvas;
};

export const isCSSSelector = (val: any) => {
  if (!isString(val)) return false;

  const dummyEl = document.createDocumentFragment();

  try {
    dummyEl.querySelector(val);
  } catch {
    return false;
  }

  return true;
};

export const range = (end: number): number[] => {
  if (!end || end <= 0) {
    return [];
  }

  return Array.apply(0, Array(end)).map((undef, idx) => idx);
};

export const toRadian = (x: number) => x * Math.PI / 180;
export const toDegree = (x: number) => x * 180 / Math.PI;
export const clamp = (x: number, min: number, max: number) => Math.max(Math.min(x, max), min);

// Linear interpolation between a and b
export const lerp = (a: number, b: number, t: number) => {
  return a * (1 - t) + b * t;
};

export const circulate = (val: number, min: number, max: number) => {
  const size = Math.abs(max - min);

  if (val < min) {
    const offset = (min - val) % size;
    val = max - offset;
  } else if (val > max) {
    const offset = (val - max) % size;
    val = min + offset;
  }

  return val;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const merge = (target: object, ...srcs: object[]): object => {
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

export const getBoxPoints = (box: THREE.Box3) => {
  return [
    box.min.clone(),
    new THREE.Vector3(box.min.x, box.min.y, box.max.z),
    new THREE.Vector3(box.min.x, box.max.y, box.min.z),
    new THREE.Vector3(box.min.x, box.max.y, box.max.z),
    new THREE.Vector3(box.max.x, box.min.y, box.min.z),
    new THREE.Vector3(box.max.x, box.min.y, box.max.z),
    new THREE.Vector3(box.max.x, box.max.y, box.min.z),
    box.max.clone()
  ];
};

export const toPowerOfTwo = (val: number) => {
  let result = 1;

  while (result < val) {
    result *= 2;
  }

  return result;
};

export const getPrimaryAxisIndex = (basis: THREE.Vector3[], viewDir: THREE.Vector3) => {
  let primaryIdx = 0;
  let maxDot = 0;

  basis.forEach((axes, axesIdx) => {
    const dotProduct = Math.abs(viewDir.dot(axes));

    if (dotProduct > maxDot) {
      primaryIdx = axesIdx;
      maxDot = dotProduct;
    }
  });

  return primaryIdx;
};

// In radian
export const getRotationAngle = (center: THREE.Vector2, v1: THREE.Vector2, v2: THREE.Vector2) => {
  const centerToV1 = new THREE.Vector2().subVectors(v1, center).normalize();
  const centerToV2 = new THREE.Vector2().subVectors(v2, center).normalize();

  // Get the rotation angle with the model's NDC coordinates as the center.
  const deg = centerToV2.angle() - centerToV1.angle();
  const compDeg = -Math.sign(deg) * (2 * Math.PI - Math.abs(deg));
  // Take the smaller deg
  const rotationAngle = Math.abs(deg) < Math.abs(compDeg) ? deg : compDeg;

  return rotationAngle;
};

export const getObjectOption = <T extends boolean | Partial<object>>(val: T): NoBoolean<T> => typeof val === "object" ? val : {} as any;
export const toBooleanString = (val: boolean) => val ? "true" : "false";

export const getRotatedPosition = (distance: number, yawDeg: number, pitchDeg: number) => {
  const yaw = toRadian(yawDeg);
  const pitch = toRadian(pitchDeg);
  const newPos = new THREE.Vector3(0, 0, 0);

  newPos.y = distance * Math.sin(pitch);
  newPos.z = distance * Math.cos(pitch);

  newPos.x = newPos.z * Math.sin(-yaw);
  newPos.z = newPos.z * Math.cos(-yaw);

  return newPos;
};

export const createLoadingContext = (view3D: View3D, src: string): View3D["loadingContext"][0] => {
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

export const getAttributeScale = (attrib: THREE.BufferAttribute | THREE.InterleavedBufferAttribute) => {
  if (attrib.normalized && ArrayBuffer.isView(attrib.array)) {
    const buffer = attrib.array as TypedArray;
    const isSigned = isSignedArrayBuffer(buffer);
    const scale = 1 / (Math.pow(2, 8 * buffer.BYTES_PER_ELEMENT) - 1);

    return isSigned ? scale * 2 : scale;
  } else {
    return 1;
  }
};

export const isSignedArrayBuffer = (buffer: TypedArray) => {
  const testBuffer = new (buffer.constructor as any)(1);

  testBuffer[0] = -1;

  return testBuffer[0] < 0;
};
