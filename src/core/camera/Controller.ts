/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import Camera from "./Camera";
import CameraControl from "~/controls/CameraControl";
import { findIndex } from "~/utils";

/**
 * Controller that controls camera of the View3D
 * @category Core
 */
class Controller {
  private _canvas: HTMLCanvasElement;
  private _camera: Camera;
  private _controls: CameraControl[] = [];

  /**
   * Create new Controller instance
   */
  constructor(canvas: HTMLCanvasElement, camera: Camera) {
    this._canvas = canvas;
    this._camera = camera;
  }

  /**
   * Remove all attached controls, and removes all event listeners attached by that controls.
   * @returns {void} Nothing
   */
  public clear(): void {
    this._controls.forEach(control => control.destroy());
    this._controls = [];
  }

  /**
   * Add a new control
   * @param control {@link Control Control} instance to add
   * @see Adding Controls
   * @returns {void} Nothing
   */
  public add(control: CameraControl): void {
    const canvas = this._canvas;
    if (!control.element) {
      // Set canvas as default element
      control.setElement(canvas);
    }
    control.sync(this._camera);
    control.enable();
    this._controls.push(control);
  }

  /**
   * Remove control and disable it
   * @param control {@link Control Control} instance to remove
   * @returns removed control or null if it doesn't exists
   */
  public remove(control: CameraControl): CameraControl | null {
    const controls = this._controls;
    const controlIndex = findIndex(control, controls);
    if (controlIndex < 0) return null;

    const removedControl = controls.splice(controlIndex, 1)[0];
    removedControl.disable();

    return removedControl;
  }

  /**
   * Enable all controls attached
   * @returns {void} Nothing
   */
  public enableAll(): void {
    this._controls.forEach(control => control.enable());
    this.syncToCamera();
  }

  /**
   * Disable all controls attached
   * @returns {void} Nothing
   */
  public disableAll(): void {
    this._controls.forEach(control => control.disable());
  }

  /**
   * Update all controls attached to given screen size.
   * @param size Size of the screen. Noramlly size of the canvas is used.
   * @returns {void} Nothing
   */
  public resize(size: THREE.Vector2): void {
    this._controls.forEach(control => control.resize(size));
  }

  /**
   * Synchronize all controls attached to current camera position.
   * @returns {void} Nothing
   */
  public syncToCamera(): void {
    this._controls.forEach(control => control.sync(this._camera));
  }

  /**
   * Update all controls attached to this controller & update camera position based on it.
   * @param delta number of seconds to update controls
   * @returns {void} Nothing
   */
  public update(delta: number): void {
    const deltaMiliSec = delta * 1000;
    const camera = this._camera;

    this._controls.forEach(control => {
      control.update(camera, deltaMiliSec);
    });

    camera.updatePosition();
  }
}

export default Controller;
