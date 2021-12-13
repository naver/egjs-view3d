import * as THREE from "three";

import View3D from "../View3D";

export interface WhiteLightPresetOptions {
  sunColor: number | string;
  sunIntensity: number;
  sunPosition: number[];
  ambientColor: number | string;
  ambientIntensity: number;
}

class WhiteLightPreset {
  private _sunColor: WhiteLightPresetOptions["sunColor"];
  private _sunIntensity: WhiteLightPresetOptions["sunIntensity"];
  private _sunPosition: WhiteLightPresetOptions["sunPosition"];
  private _ambientColor: WhiteLightPresetOptions["ambientColor"];
  private _ambientIntensity: WhiteLightPresetOptions["ambientIntensity"];

  public constructor({
    sunColor = 0xffffff,
    sunIntensity = 0.9,
    sunPosition = [0, 1, 0],
    ambientColor = 0xffffff,
    ambientIntensity = 0.1
  }: Partial<WhiteLightPresetOptions> = {}) {
    this._sunColor = sunColor;
    this._sunIntensity = sunIntensity;
    this._sunPosition = sunPosition;
    this._ambientColor = ambientColor;
    this._ambientIntensity = ambientIntensity;
  }

  public init(view3D: View3D) {
    if (this._sunIntensity > 0) {
      const dirLight = new THREE.DirectionalLight(new THREE.Color(this._sunColor), this._sunIntensity);

      dirLight.position.fromArray(this._sunPosition);
      view3D.scene.add(dirLight, false);
    }

    if (this._ambientIntensity > 0) {
      const ambient = new THREE.AmbientLight(new THREE.Color(this._ambientColor), this._ambientIntensity);

      view3D.scene.add(ambient, false);
    }
  }
}

export default WhiteLightPreset;
