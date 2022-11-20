/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "./View3D";
import View3DError from "./core/View3DError";
import ERROR from "./const/error";
import { NoBoolean, TypedArray } from "./type/utils";
import { Model } from "./core";

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

// In Radians
export const directionToYawPitch = (direction: THREE.Vector3) => {
  const xz = new THREE.Vector2(direction.x, direction.z);
  const origin = new THREE.Vector2();
  const yaw = Math.abs(direction.y) <= 0.99
    ? getRotationAngle(origin, new THREE.Vector2(0, 1), xz)
    : 0;
  const pitch = Math.atan2(direction.y, xz.distanceTo(origin));

  return {
    yaw,
    pitch
  };
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

export const getSkinnedVertex = (posIdx: number, mesh: THREE.SkinnedMesh, positionScale: number, skinWeightScale: number) => {
  const geometry = mesh.geometry;
  const positions = geometry.attributes.position;
  const skinIndicies = geometry.attributes.skinIndex;
  const skinWeights = geometry.attributes.skinWeight;
  const skeleton = mesh.skeleton;
  const boneMatricies = skeleton.boneMatrices;

  const pos = new THREE.Vector3().fromBufferAttribute(positions, posIdx).multiplyScalar(positionScale);
  const skinned = new THREE.Vector4(0, 0, 0, 0);
  const skinVertex = new THREE.Vector4(pos.x, pos.y, pos.z).applyMatrix4(mesh.bindMatrix);

  const weights = [
    skinWeights.getX(posIdx),
    skinWeights.getY(posIdx),
    skinWeights.getZ(posIdx),
    skinWeights.getW(posIdx)
  ].map(weight => weight * skinWeightScale);

  const indicies = [
    skinIndicies.getX(posIdx),
    skinIndicies.getY(posIdx),
    skinIndicies.getZ(posIdx),
    skinIndicies.getW(posIdx)
  ];

  weights.forEach((weight, index) => {
    const boneMatrix = new THREE.Matrix4().fromArray(boneMatricies, indicies[index] * 16);
    skinned.add(skinVertex.clone().applyMatrix4(boneMatrix).multiplyScalar(weight));
  });

  const transformed = new THREE.Vector3().fromArray(skinned.applyMatrix4(mesh.bindMatrixInverse).toArray());
  transformed.applyMatrix4(mesh.matrixWorld);

  return transformed;
};

export const isSignedArrayBuffer = (buffer: TypedArray) => {
  const testBuffer = new (buffer.constructor as any)(1);

  testBuffer[0] = -1;

  return testBuffer[0] < 0;
};

export const checkHalfFloatAvailable = (renderer: THREE.WebGLRenderer) => {
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

export const getFaceVertices = (model: Model | null, meshIndex: number, faceIndex: number): THREE.Vector3[] | null => {
  if (!model || meshIndex < 0 || faceIndex < 0) return null;

  const mesh = model.meshes[meshIndex];
  const indexes = mesh?.geometry.index?.array;
  const face = indexes
    ? range(3).map(idx => indexes[3 * faceIndex + idx])
    : null;

  if (!mesh || !indexes || !face || face.some(val => val == null)) return null;

  const position = mesh.geometry.getAttribute("position");
  const vertices = face.map((index: number) => {
    return new THREE.Vector3().fromBufferAttribute(position, index);
  });

  return vertices;
};

export const getAnimatedFace = (model: Model | null, meshIndex: number, faceIndex: number): THREE.Vector3[] | null => {
  const vertices = getFaceVertices(model, meshIndex, faceIndex);
  if (!vertices) return null;

  const mesh = model!.meshes[meshIndex];
  const indexes = mesh.geometry.getIndex()!;
  const face = (indexes.array as TypedArray).slice(3 * faceIndex, 3 * faceIndex + 3);

  if ((mesh as THREE.SkinnedMesh).isSkinnedMesh) {
    const geometry = mesh.geometry;
    const positions = geometry.attributes.position;
    const skinWeights = geometry.attributes.skinWeight;

    const positionScale = getAttributeScale(positions);
    const skinWeightScale = getAttributeScale(skinWeights);

    vertices.forEach((vertex, idx) => {
      const posIdx = face[idx];
      const transformed = getSkinnedVertex(posIdx, mesh as THREE.SkinnedMesh, positionScale, skinWeightScale);

      vertex.copy(transformed);
    });
  } else {
    vertices.forEach(vertex => {
      vertex.applyMatrix4(mesh.matrixWorld);
    });
  }

  return vertices;
};

export const subclip = (sourceClip: THREE.AnimationClip, name: string, startTime: number, endTime: number) => {
  const clip = sourceClip.clone();
	clip.name = name;

	const tracks: THREE.KeyframeTrack[] = [];
  clip.tracks.forEach(track => {
    const valueSize = track.getValueSize();

    const times: number[] = [];
    const values: number[] = [];

    for (let timeIdx = 0; timeIdx < track.times.length; ++timeIdx) {
      const time = track.times[timeIdx];
      const nextTime = track.times[timeIdx + 1];
      const prevTime = track.times[timeIdx - 1];

      const isPrevFrame = nextTime && time < startTime && nextTime > startTime;
      const isMiddleFrame = time >= startTime && time < endTime;
      const isNextFrame = prevTime && time >= endTime && prevTime < endTime;

      if (!isPrevFrame && !isMiddleFrame && !isNextFrame) continue;

      times.push(time);

      for (let k = 0; k < valueSize; ++k) {
        values.push(track.values[timeIdx * valueSize + k]);
      }
    }

    if (times.length === 0) return;

    track.times = convertArray(times, track.times.constructor);
    track.values = convertArray(values, track.values.constructor);

    tracks.push(track);
  });

	clip.tracks = tracks;

	for (let i = 0; i < clip.tracks.length; ++i) {
		clip.tracks[i].shift(-startTime);
	}
  clip.duration = endTime - startTime;

	return clip;
};

// From three.js AnimationUtils
// https://github.com/mrdoob/three.js/blob/68daccedef9c9c325cc5f4c929fcaf05229aa1b3/src/animation/AnimationUtils.js#L20
// The MIT License
// Copyright © 2010-2022 three.js authors
const convertArray = (array, type, forceClone = false) => {
  if (!array || // let 'undefined' and 'null' pass
    !forceClone && array.constructor === type ) return array;

  if (typeof type.BYTES_PER_ELEMENT === "number") {
    return new type( array ); // create typed array
  }

  return Array.prototype.slice.call(array); // create Array
};

export const parseAsBboxRatio = (arr: Array<number | string>, bbox: THREE.Box3) => {
  const min = bbox.min.toArray();
  const size = new THREE.Vector3().subVectors(bbox.max, bbox.min).toArray();

  return new THREE.Vector3().fromArray(arr.map((val, idx) => {
    if (!isString(val)) return val;

    const ratio = parseFloat(val) * 0.01;

    return min[idx] + ratio * size[idx];
  }));
};
