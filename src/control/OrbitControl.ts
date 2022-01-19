/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import View3D from "../View3D";
import { CURSOR } from "../const/browser";
import { CONTROL_EVENTS } from "../const/internal";
import { getObjectOption } from "../utils";
import { ValueOf } from "../type/utils";

import RotateControl from "./RotateControl";
import TranslateControl from "./TranslateControl";
import ZoomControl from "./ZoomControl";

/**
 * Aggregation of {@link RotateControl}, {@link TranslateControl}, and {@link ZoomControl}.
 */
class OrbitControl {
  // Internal Values
  private _view3D: View3D;
  private _rotateControl: RotateControl;
  private _translateControl: TranslateControl;
  private _zoomControl: ZoomControl;


  // Internal Values Getter
  /**
   * {@link RotateControl} of this control
   */
  public get rotate() { return this._rotateControl; }
  /**
   * {@link TranslateControl} of this control
   */
  public get translate() { return this._translateControl; }
  /**
   * {@link ZoomControl} of this control
   */
  public get zoom() { return this._zoomControl; }

  /**
   * Create new OrbitControl instance
   * @param {View3D} view3D An instance of View3D
   */
  public constructor(view3D: View3D) {
    this._view3D = view3D;

    this._rotateControl = new RotateControl(view3D, getObjectOption(view3D.rotate));
    this._translateControl = new TranslateControl(view3D, getObjectOption(view3D.translate));
    this._zoomControl = new ZoomControl(view3D, getObjectOption(view3D.zoom));

    [this._rotateControl, this._translateControl].forEach(control => {
      control.on({
        [CONTROL_EVENTS.HOLD]: this._onHold,
        [CONTROL_EVENTS.RELEASE]: this._onRelease,
        [CONTROL_EVENTS.ENABLE]: this._onEnable,
        [CONTROL_EVENTS.DISABLE]: this._onDisable
      });
    });
  }

  /**
   * Destroy the instance and remove all event listeners attached
   * This also will reset CSS cursor to intial
   * @returns {void}
   */
  public destroy(): void {
    this._rotateControl.destroy();
    this._translateControl.destroy();
    this._zoomControl.destroy();
  }

  /**
   * Update control by given deltaTime
   * @param deltaTime Number of milisec to update
   * @returns {void}
   */
  public update(delta: number): void {
    this._rotateControl.update(delta);
    this._translateControl.update(delta);
    this._zoomControl.update(delta);
  }

  /**
   * Resize control to match target size
   * @param {object} size New size to apply
   * @param {number} [size.width] New width
   * @param {number} [size.height] New height
   * @returns {void}
   */
  public resize(size: { width: number; height: number }): void {
    this._rotateControl.resize(size);
    this._translateControl.resize(size);
    this._zoomControl.resize(size);
  }

  /**
   * Enable this control and add event listeners
   * @returns {void}
   */
  public enable(): void {
    const view3D = this._view3D;

    if (view3D.rotate) {
      this._rotateControl.enable();
    }

    if (view3D.translate) {
      this._translateControl.enable();
    }

    if (view3D.zoom) {
      this._zoomControl.enable();
    }
  }

  /**
   * Disable this control and remove all event handlers
   * @returns {void}
   */
  public disable(): void {
    this._rotateControl.disable();
    this._translateControl.disable();
    this._zoomControl.disable();
  }

  /**
   * Synchronize this control's state to current camera position
   * @returns {void}
   */
  public sync(): void {
    this._rotateControl.sync();
    this._translateControl.sync();
    this._zoomControl.sync();
  }

  /**
   * Update cursor to current option
   * @returns {void}
   */
  public updateCursor(): void {
    const cursor = this._view3D.useGrabCursor ? CURSOR.GRAB : CURSOR.NONE;

    this._setCursor(cursor);
  }

  private _setCursor(newCursor: ValueOf<typeof CURSOR>) {
    const view3D = this._view3D;

    if (!view3D.useGrabCursor && newCursor !== CURSOR.NONE) return;

    const targetEl = view3D.renderer.canvas;
    targetEl.style.cursor = newCursor;
  }

  private _onEnable = () => {
    const view3D = this._view3D;
    const canvas = view3D.renderer.canvas;

    const shouldSetGrabCursor = view3D.useGrabCursor
      && (this._rotateControl.enabled || this._translateControl.enabled)
      && canvas.style.cursor === CURSOR.NONE;

    if (shouldSetGrabCursor) {
      this._setCursor(CURSOR.GRAB);
    }
  };

  private _onDisable = () => {
    const canvas = this._view3D.renderer.canvas;

    const shouldRemoveGrabCursor = canvas.style.cursor !== CURSOR.NONE
      && (!this._rotateControl.enabled && !this._translateControl.enabled);

    if (shouldRemoveGrabCursor) {
      this._setCursor(CURSOR.NONE);
    }
  };

  private _onHold = () => {
    const grabCursorEnabled = this._view3D.useGrabCursor
      && (this._rotateControl.enabled || this._translateControl.enabled);

    if (grabCursorEnabled) {
      this._setCursor(CURSOR.GRABBING);
    }
  };

  private _onRelease = () => {
    const grabCursorEnabled = this._view3D.useGrabCursor
      && (this._rotateControl.enabled || this._translateControl.enabled);

    if (grabCursorEnabled) {
      this._setCursor(CURSOR.GRAB);
    }
  };
}

export default OrbitControl;
