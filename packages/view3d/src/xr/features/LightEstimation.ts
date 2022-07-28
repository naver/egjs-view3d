/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";
import { XREstimatedLight } from "three/examples/jsm/webxr/XREstimatedLight";

import View3D from "../../View3D";
import ARScene from "../ARScene";
import * as XR from "../../const/xr";

/**
 * Manager for WebXR light-estimation feature
 */
class LightEstimation {
  /**
   * As light estimation is optional, always return true
   * @type {true}
   */
  public static isAvailable() {
    return true;
  }

  private _view3D: View3D;
  private _arScene: ARScene;
  private _light: XREstimatedLight | null;
  private _origEnvironment: THREE.Scene["environment"];

  public constructor(view3D: View3D, arScene: ARScene) {
    this._view3D = view3D;
    this._arScene = arScene;
    this._light = null;
    this._origEnvironment = null;
  }

  /**
   * "light-estimation" as optionalFeatures
   */
  public getFeatures() {
    return XR.FEATURES.LIGHT_ESTIMATION;
  }

  public init() {
    const renderer = this._view3D.renderer.threeRenderer;
    const estimatedLight = new XREstimatedLight(renderer);

    this._light = estimatedLight;
    estimatedLight.addEventListener(XR.EVENTS.ESTIMATION_START, this._onEstimationStart);
    estimatedLight.addEventListener(XR.EVENTS.ESTIMATION_END, this._onEstimationEnd);
  }

  public destroy() {
    const estimatedLight = this._light;

    if (!estimatedLight) return;

    estimatedLight.removeEventListener(XR.EVENTS.ESTIMATION_START, this._onEstimationStart);
    estimatedLight.removeEventListener(XR.EVENTS.ESTIMATION_END, this._onEstimationEnd);
    this._light = null;
  }

  private _onEstimationStart = () => {
    const estimatedLight = this._light;
    const scene = this._arScene;

    if (!estimatedLight) return;

    scene.add(estimatedLight);

    if (estimatedLight.environment) {
      scene.root.environment = estimatedLight.environment;
    }
  };

  private _onEstimationEnd = () => {
    const estimatedLight = this._light;
    const scene = this._arScene;

    if (!estimatedLight) return;

    scene.remove(estimatedLight);
    scene.root.environment = this._origEnvironment;
  };
}

export default LightEstimation;
