/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import * as THREE from "three";
import Model from "../core/Model";

/**
 * Effect for View3D.
 * Abstract class are used to verify the type with "instanceof" at runtime.
 * @interface
 */
export abstract class View3DEffect {

  public abstract getPass(): PassType | null;

  public abstract init(view3D: View3D): void;
}

/**
 * Interface for the effectComposer.
 * Both effectComposer of THREE.js and effectComposer of post-processing [library]{@link https://github.com/pmndrs/postprocessing} are corresponding interfaces.
 */
export interface Composer {
  render(deltaTime?: number): void;

  addPass(pass: PassType): void;

  setSize(width: number, height: number): void;

  passes: PassType[];

  reset(): void;
}

/**
 * Extract common type of Pass in postProcessing library and THREE.js
 */
export interface PassType {
  needsSwap: boolean;
  enabled: boolean;
  setSize(width: number, height: number): void;
  render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget,
    deltaTime?: number,
    maskActive?: boolean
  ): void;
}

type EffectCallbackParam = {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  model: Model | null;
  canvasSize: THREE.Vector2
};

export type EffectCallback = (param: EffectCallbackParam) => PassType | View3DEffect;

export type SetCustomEffectParam = (param: EffectCallbackParam) => Composer;

export default View3DEffect;
