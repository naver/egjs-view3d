/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";

import CameraControl from "./CameraControl";
import RotateControl from "./RotateControl";
import TranslateControl from "./TranslateControl";
import DistanceControl from "./DistanceControl";

/**
 * Aggregation of {@link RotateControl}, {@link TranslateControl}, and {@link DistanceControl}.
 * @category Controls
 */
class OrbitControl implements CameraControl {
  private _rotateControl: RotateControl;
  private _translateControl: TranslateControl;
  private _distanceControl: DistanceControl;
  private _enabled: boolean = false;

  /**
   * Whether this control is enabled or not
   * @readonly
   */
  public get enabled() { return this._enabled; }
  /**
   * {@link RotateControl} of this control
   */
  public get rotate() { return this._rotateControl; }
  /**
   * {@link TranslateControl} of this control
   */
  public get translate() { return this._translateControl; }
  /**
   * {@link DistanceControl} of this control
   */
  public get distance() { return this._distanceControl; }

  /**
   * Create new OrbitControl instance
   * @param {View3D} view3D An instance of View3D
   * @param {object} options Options
   * @param {object} [options.rotate={}] Constructor options of {@link RotateControl}
   * @param {object} [options.translate={}] Constructor options of {@link TranslateControl}
   * @param {object} [options.distance={}] Constructor options of {@link DistanceControl}
   */
  public constructor(view3D: View3D, {
    rotate = {},
    translate = {},
    distance = {}
  }: Partial<{
    rotate: ConstructorParameters<typeof RotateControl>[1];
    translate: ConstructorParameters<typeof TranslateControl>[1];
    distance: ConstructorParameters<typeof DistanceControl>[1];
  }> = {}) {
    this._rotateControl = new RotateControl(view3D, rotate);
    this._translateControl = new TranslateControl(view3D, translate);
    this._distanceControl = new DistanceControl(view3D, distance);
  }

  /**
   * Destroy the instance and remove all event listeners attached
   * This also will reset CSS cursor to intial
   * @returns {void} Nothing
   */
  public destroy(): void {
    this._rotateControl.destroy();
    this._translateControl.destroy();
    this._distanceControl.destroy();
  }

  /**
   * Update control by given deltaTime
   * @param camera Camera to update position
   * @param deltaTime Number of milisec to update
   * @returns {void} Nothing
   */
  public update(delta: number): void {
    this._rotateControl.update(delta);
    this._translateControl.update(delta);
    this._distanceControl.update(delta);
  }

  /**
   * Resize control to match target size
   * @param size {@link https://threejs.org/docs/#api/en/math/Vector2 THREE.Vector2} instance of width(x), height(y)
   */
  public resize(size: THREE.Vector2) {
    this._rotateControl.resize(size);
    this._translateControl.resize(size);
    this._distanceControl.resize(size);
  }

  /**
   * Enable this control and add event listeners
   * @returns {void} Nothingß
   */
  public enable(): void {
    if (this._enabled) return;

    this._rotateControl.enable();
    this._translateControl.enable();
    this._distanceControl.enable();

    this._enabled = true;
  }

  /**
   * Disable this control and remove all event handlers
   * @returns {void} Nothing
   */
  public disable(): void {
    if (!this._enabled) return;

    this._rotateControl.disable();
    this._translateControl.disable();
    this._distanceControl.disable();

    this._enabled = false;
  }

  /**
   * Synchronize this control's state to current camera position
   * @returns {void} Nothing
   */
  public sync(): void {
    this._rotateControl.sync();
    this._translateControl.sync();
    this._distanceControl.sync();
  }
}

export default OrbitControl;
