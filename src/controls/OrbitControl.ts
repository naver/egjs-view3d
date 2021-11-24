/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import Camera from "../core/camera/Camera";
import View3DError from "../View3DError";
import { getElement } from "../utils";
import * as ERROR from "../consts/error";
import * as DEFAULT from "../consts/default";

import CameraControl from "./CameraControl";
import RotateControl from "./RotateControl";
import TranslateControl from "./TranslateControl";
import DistanceControl from "./DistanceControl";

/**
 * Aggregation of {@link RotateControl}, {@link TranslateControl}, and {@link DistanceControl}.
 * @category Controls
 */
class OrbitControl implements CameraControl {
  private _targetEl: HTMLElement | null;
  private _rotateControl: RotateControl;
  private _translateControl: TranslateControl;
  private _distanceControl: DistanceControl;
  private _enabled: boolean = false;

  /**
   * Control's current target element to attach event listeners
   * @readonly
   */
  public get element() { return this._targetEl; }
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
   * @param {object} options Options
   * @param {HTMLElement | string | null} [options.element=null] Attaching element / selector of the element
   * @param {object} [options.rotate={}] Constructor options of {@link RotateControl}
   * @param {object} [options.translate={}] Constructor options of {@link TranslateControl}
   * @param {object} [options.distance={}] Constructor options of {@link DistanceControl}
   * @tutorial Adding Controls
   */
  public constructor({
    element = DEFAULT.NULL_ELEMENT,
    rotate = {},
    translate = {},
    distance = {}
  }: Partial<{
    rotate: ConstructorParameters<typeof RotateControl>[0];
    translate: ConstructorParameters<typeof TranslateControl>[0];
    distance: ConstructorParameters<typeof DistanceControl>[0];
    element: HTMLElement | string | null;
  }> = {}) {
    this._targetEl = getElement(element);
    this._rotateControl = new RotateControl({ ...rotate, element: rotate.element || this._targetEl });
    this._translateControl = new TranslateControl({ ...translate, element: translate.element || this._targetEl });
    this._distanceControl = new DistanceControl({ ...distance, element: distance.element || this._targetEl });
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
  public update(camera: Camera, deltaTime: number): void {
    this._rotateControl.update(camera, deltaTime);
    this._translateControl.update(camera, deltaTime);
    this._distanceControl.update(camera, deltaTime);
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
    if (!this._targetEl) {
      throw new View3DError(ERROR.MESSAGES.ADD_CONTROL_FIRST, ERROR.CODES.ADD_CONTROL_FIRST);
    }

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
    if (!this._enabled || !this._targetEl) return;

    this._rotateControl.disable();
    this._translateControl.disable();
    this._distanceControl.disable();

    this._enabled = false;
  }

  /**
   * Synchronize this control's state to given camera position
   * @param camera Camera to match state
   * @returns {void} Nothing
   */
  public sync(camera: Camera): void {
    this._rotateControl.sync(camera);
    this._translateControl.sync(camera);
    this._distanceControl.sync(camera);
  }

  /**
   * Set target element to attach event listener
   * @param element target element
   * @returns {void} Nothing
   */
  public setElement(element: HTMLElement): void {
    this._targetEl = element;
    this._rotateControl.setElement(element);
    this._translateControl.setElement(element);
    this._distanceControl.setElement(element);
  }
}

export default OrbitControl;
