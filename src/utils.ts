/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3DError from "./core/View3DError";
import * as ERROR from "./const/error";
import { NoBoolean } from "./type/utils";

export const getNullableElement = (el: HTMLElement | string | null, parent?: HTMLElement): HTMLElement | null => {
  let targetEl: HTMLElement | null = null;

  if (typeof el === "string") {
    const parentEl = parent ? parent : document;
    const queryResult = parentEl.querySelector(el);

    if (!queryResult) {
      throw new View3DError(ERROR.MESSAGES.ELEMENT_NOT_FOUND(el), ERROR.CODES.ELEMENT_NOT_FOUND);
    }

    targetEl = queryResult as HTMLElement;
  } else if (el && el.nodeType === Node.ELEMENT_NODE) {
    targetEl = el;
  }

  return targetEl;
};

export const getElement = (el: HTMLElement | string, parent?: HTMLElement): HTMLElement => {
  const targetEl = getNullableElement(el, parent);

  if (!targetEl) {
    throw new View3DError(ERROR.MESSAGES.WRONG_TYPE(el, ["HTMLElement", "string"]), ERROR.CODES.WRONG_TYPE);
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

export const range = (end: number): number[] => {
  if (!end || end <= 0) {
    return [];
  }

  return Array.apply(0, Array(end)).map((undef, idx) => idx);
};

export const toRadian = (x: number) => {
  return x * Math.PI / 180;
};

export const toDegree = (x: number) => {
  return x * 180 / Math.PI;
};

export const clamp = (x: number, min: number, max: number) => {
  return Math.max(Math.min(x, max), min);
};

export const findIndex = <T>(target: T, list: T[]) => {
  let index = -1;
  for (const itemIndex of range(list.length)) {
    if (list[itemIndex] === target) {
      index = itemIndex;
      break;
    }
  }
  return index;
};

// Linear interpolation between a and b
export const mix = (a: number, b: number, t: number) => {
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
