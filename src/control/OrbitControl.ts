/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import View3D from "../View3D";
import { CURSOR } from "../const/browser";
import { CONTROL_EVENTS } from "../const/internal";
import { getObjectOption } from "../utils";
import { EVENTS, INPUT_TYPE } from "../const/external";
import { ControlEvents, ValueOf } from "../type/utils";

import CameraControl from "./CameraControl";
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
  private _extraControls: CameraControl[];

  // Internal Values Getter
  /**
   * Rotate(left-click) part of this control
   * @type {RotateControl}
   * @readonly
   */
  public get rotate() { return this._rotateControl; }
  /**
   * Translation(right-click) part of this control
   * @type {TranslateControl}
   * @readonly
   */
  public get translate() { return this._translateControl; }
  /**
   * Zoom(mouse wheel) part of this control
   * @type {ZoomControl}
   * @readonly
   */
  public get zoom() { return this._zoomControl; }
  /**
   * Base controls
   * @type {CameraControl[]}
   * @readonly
   */
  public get controls() { return [this._rotateControl, this._translateControl, this._zoomControl]; }
  /**
   * Extra camera controls added, like {@link AnimationControl}
   * @type {CameraControl[]}
   * @readonly
   */
  public get extraControls() { return this._extraControls; }
  /**
   * Whether one of the controls is animating at the moment
   * @type {boolean}
   * @readonly
   */
  public get animating() {
    return this._rotateControl.animating
      || this._translateControl.animating
      || this._zoomControl.animating
      || this._extraControls.some(control => control.animating);
  }

  /**
   * Create new OrbitControl instance
   * @param {View3D} view3D An instance of View3D
   */
  public constructor(view3D: View3D) {
    this._view3D = view3D;

    this._rotateControl = new RotateControl(view3D, getObjectOption(view3D.rotate));
    this._translateControl = new TranslateControl(view3D, getObjectOption(view3D.translate));
    this._zoomControl = new ZoomControl(view3D, getObjectOption(view3D.zoom));
    this._extraControls = [];

    [this._rotateControl, this._translateControl, this._zoomControl].forEach(control => {
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
    this._extraControls.forEach(control => control.destroy());
    this._extraControls = [];
  }

  /**
   * Update control by given deltaTime
   * @param {number} deltaTime Number of milisec to update
   * @returns {void}
   */
  public update(deltaTime: number): void {
    this._rotateControl.update(deltaTime);
    this._translateControl.update(deltaTime);
    this._zoomControl.update(deltaTime);
    this._extraControls.forEach(control => control.update(deltaTime));
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
    this._extraControls.forEach(control => control.resize(size));
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

    this._extraControls.forEach(control => control.enable());
  }

  /**
   * Disable this control and remove all event handlers
   * @returns {void}
   */
  public disable(): void {
    this._rotateControl.disable();
    this._translateControl.disable();
    this._zoomControl.disable();
    this._extraControls.forEach(control => control.disable());
  }

  /**
   * Synchronize this control's state to current camera position
   * @returns {void}
   */
  public sync(): void {
    this._rotateControl.sync();
    this._translateControl.sync();
    this._zoomControl.sync();
    this._extraControls.forEach(control => control.sync());
  }

  /**
   * Add extra control
   * @param {CameraControl} control Control to add
   * @returns {void}
   */
  public add(control: CameraControl) {
    this._extraControls.push(control);
  }

  /**
   * Remove extra control
   * @param {CameraControl} control Control to add
   * @returns {void}
   */
  public remove(control: CameraControl) {
    const extraControls = this._extraControls;
    const controlIdx = extraControls.findIndex(ctrl => ctrl === control);

    if (controlIdx >= 0) {
      extraControls.splice(controlIdx, 1);
    }
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

  private _onEnable = ({ inputType }: ControlEvents["enable"]) => {
    if (inputType === INPUT_TYPE.ZOOM) return;

    const view3D = this._view3D;
    const canvas = view3D.renderer.canvas;

    const shouldSetGrabCursor = view3D.useGrabCursor
      && (this._rotateControl.enabled || this._translateControl.enabled)
      && canvas.style.cursor === CURSOR.NONE;

    if (shouldSetGrabCursor) {
      this._setCursor(CURSOR.GRAB);
    }
  };

  private _onDisable = ({ inputType }: ControlEvents["disable"]) => {
    if (inputType === INPUT_TYPE.ZOOM) return;

    const canvas = this._view3D.renderer.canvas;
    const shouldRemoveGrabCursor = canvas.style.cursor !== CURSOR.NONE
      && (!this._rotateControl.enabled && !this._translateControl.enabled);

    if (shouldRemoveGrabCursor) {
      this._setCursor(CURSOR.NONE);
    }
  };

  private _onHold = ({ inputType }: ControlEvents["hold"]) => {
    const view3D = this._view3D;

    if (inputType !== INPUT_TYPE.ZOOM) {
      const grabCursorEnabled = view3D.useGrabCursor
        && (this._rotateControl.enabled || this._translateControl.enabled);

      if (grabCursorEnabled) {
        this._setCursor(CURSOR.GRABBING);
      }
    }

    view3D.trigger(EVENTS.INPUT_START, {
      type: EVENTS.INPUT_START,
      target: view3D,
      inputType
    });
  };

  private _onRelease = ({ inputType }: ControlEvents["release"]) => {
    const view3D = this._view3D;

    if (inputType !== INPUT_TYPE.ZOOM) {
      const grabCursorEnabled = view3D.useGrabCursor
        && (this._rotateControl.enabled || this._translateControl.enabled);

      if (grabCursorEnabled) {
        this._setCursor(CURSOR.GRAB);
      }
    }

    view3D.trigger(EVENTS.INPUT_END, {
      type: EVENTS.INPUT_END,
      target: view3D,
      inputType
    });
  };
}

export default OrbitControl;
