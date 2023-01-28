/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import * as THREE from "three";
import Model from "../core/Model";

/**
 * Effect for View3D.
 * This can be used to verify the type using the "instanceof" operator at runtime.
 * @interface
 */
export abstract class View3DEffect {

  public abstract getPass(): PassType | null;

  public abstract init(view3D: View3D): PassType;
}

/**
 * This interface is for the effectComposer.
 * The interface is created to support both EffectComposer of THREE.js and EffectComposer of [postprocessing post-processing]{@link https://github.com/pmndrs/postprocessing}
 */
export interface Composer {
  render(deltaTime?: number): void;

  addPass(pass: PassType): void;

  setSize(width: number, height: number): void;

  passes: PassType[];

  reset(): void;

  removePass(pass: PassType): void;

  dispose?: () => unknown;
}

/**
 * This is created to support various pass type
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

  dispose?: () => unknown;
}

/**
 * This interface is used to create various custom effects
 */
export type AssetKit = {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  model: Model | null;
  canvasSize: THREE.Vector2
};

export type EffectCallback = (param: AssetKit) => PassType | View3DEffect;

export default View3DEffect;
