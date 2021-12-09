/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import View3D from "../View3D";
import * as BROWSER from "../const/browser";
import { OptionGetters } from "../type/utils";

import CameraControl from "./CameraControl";

export interface AutoplayOptions {
  delay: number;
  delayOnMouseLeave: number;
  speed: number;
  pauseOnHover: boolean;
  canInterrupt: boolean;
  disableOnInterrupt: boolean;
}

/**
 * Control that animates model without user input
 */
class AutoControl implements CameraControl, OptionGetters<AutoplayOptions> {
  // Options
  private _delay: number;
  private _delayOnMouseLeave: number;
  private _speed: number;
  private _pauseOnHover: boolean;
  private _canInterrupt: boolean;
  private _disableOnInterrupt: boolean;

  // Internal values
  private _view3D: View3D;
  private _enabled: boolean = false;
  private _interrupted: boolean = false;
  private _interruptionTimer: number = -1;
  private _hovering: boolean = false;

  /**
   * Whether this control is enabled or not
   * @readonly
   */
  public get enabled() { return this._enabled; }
  /**
   * Reactivation delay after mouse input in milisecond
   */
  public get delay() { return this._delay; }
  /**
   * Reactivation delay after mouse leave
   * This option only works when {@link AutoControl#pauseOnHover pauseOnHover} is activated
   */
  public get delayOnMouseLeave() { return this._delayOnMouseLeave; }
  /**
   * Y-axis(yaw) rotation speed
   * @default 1
   */
  public get speed() { return this._speed; }
  /**
   * Whether to pause rotation on mouse hover
   * @default false
   */
  public get pauseOnHover() { return this._pauseOnHover; }
  /**
   * Whether user can interrupt the rotation with click/wheel input
   * @default true
   */
  public get canInterrupt() { return this._canInterrupt; }
  /**
   * Whether to disable control on user interrupt
   * @default false
   */
  public get disableOnInterrupt() { return this._disableOnInterrupt; }

  public set delay(val: number) { this._delay = val; }
  public set delayOnMouseLeave(val: number) { this._delayOnMouseLeave = val; }
  public set speed(val: number) { this._speed = val; }
  public set pauseOnHover(val: boolean) { this._pauseOnHover = val; }
  public set canInterrupt(val: boolean) { this._canInterrupt = val; }
  public set disableOnInterrupt(val: boolean) { this._disableOnInterrupt = val; }

  /**
   * Create new RotateControl instance
   * @param {View3D} view3D An instance of View3D
   * @param {object} options Options
   * @param {number} [options.delay=2000] Reactivation delay after mouse input in milisecond
   * @param {number} [options.delayOnMouseLeave=0] Reactivation delay after mouse leave
   * @param {number} [options.speed=1] Y-axis(yaw) rotation speed
   * @param {boolean} [options.pauseOnHover=false] Whether to pause rotation on mouse hover
   * @param {boolean} [options.canInterrupt=true] Whether user can interrupt the rotation with click/wheel input
   * @param {boolean} [options.disableOnInterrupt=false] Whether to disable control on user interrupt
   */
  public constructor(view3D: View3D, {
    delay = 2000,
    delayOnMouseLeave = 0,
    speed = 1,
    pauseOnHover = false,
    canInterrupt = true,
    disableOnInterrupt = false
  }: Partial<AutoplayOptions> = {}) {
    this._view3D = view3D;
    this._delay = delay;
    this._delayOnMouseLeave = delayOnMouseLeave;
    this._speed = speed;
    this._pauseOnHover = pauseOnHover;
    this._canInterrupt = canInterrupt;
    this._disableOnInterrupt = disableOnInterrupt;
  }

  /**
   * Destroy the instance and remove all event listeners attached
   * This also will reset CSS cursor to intial
   * @returns {void}
   */
  public destroy(): void {
    this.disable();
  }

  /**
   * Update control by given deltaTime
   * @param camera Camera to update position
   * @param deltaTime Number of milisec to update
   * @returns {void}
   */
  public update(deltaTime: number): void {
    if (!this._enabled) return;
    if (this._interrupted) {
      if (this._disableOnInterrupt) {
        this.disable();
      }

      return;
    }

    const camera = this._view3D.camera;

    camera.yaw += this._speed * deltaTime / 100;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public resize(size: { width: number; height: number }) {
    // DO NOTHING
  }

  /**
   * Enable this input and add event listeners
   * @returns {void}
   */
  public enable(): void {
    if (this._enabled) return;

    const targetEl = this._view3D.renderer.canvas;

    targetEl.addEventListener(BROWSER.EVENTS.MOUSE_DOWN, this._onMouseDown, false);

    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_START, this._onTouchStart, false);
    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_END, this._onTouchEnd, false);

    targetEl.addEventListener(BROWSER.EVENTS.MOUSE_ENTER, this._onMouseEnter, false);
    targetEl.addEventListener(BROWSER.EVENTS.MOUSE_LEAVE, this._onMouseLeave, false);

    targetEl.addEventListener(BROWSER.EVENTS.WHEEL, this._onWheel, false);

    this._enabled = true;
  }

  /**
   * Disable this input and remove all event handlers
   * @returns {void}
   */
  public disable(): void {
    if (!this._enabled) return;

    const targetEl = this._view3D.renderer.canvas;

    targetEl.removeEventListener(BROWSER.EVENTS.MOUSE_DOWN, this._onMouseDown, false);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);

    targetEl.removeEventListener(BROWSER.EVENTS.TOUCH_START, this._onTouchStart, false);
    targetEl.removeEventListener(BROWSER.EVENTS.TOUCH_END, this._onTouchEnd, false);

    targetEl.removeEventListener(BROWSER.EVENTS.MOUSE_ENTER, this._onMouseEnter, false);
    targetEl.removeEventListener(BROWSER.EVENTS.MOUSE_LEAVE, this._onMouseLeave, false);

    targetEl.removeEventListener(BROWSER.EVENTS.WHEEL, this._onWheel, false);

    this._enabled = false;
    this._interrupted = false;
    this._hovering = false;

    this._clearTimeout();
  }

  public sync(): void {
    // Do nothing
  }

  private _onMouseDown = (evt: MouseEvent) => {
    if (!this._canInterrupt) return;
    if (evt.button !== BROWSER.MOUSE_BUTTON.LEFT && evt.button !== BROWSER.MOUSE_BUTTON.RIGHT) return;

    this._interrupted = true;
    this._clearTimeout();
    window.addEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);
  };

  private _onMouseUp = () => {
    window.removeEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);
    this._setUninterruptedAfterDelay(this._delay);
  };

  private _onTouchStart = () => {
    if (!this._canInterrupt) return;
    this._interrupted = true;
    this._clearTimeout();
  };

  private _onTouchEnd = () => {
    this._setUninterruptedAfterDelay(this._delay);
  };

  private _onMouseEnter = () => {
    if (!this._pauseOnHover) return;
    this._interrupted = true;
    this._hovering = true;
  };

  private _onMouseLeave = () => {
    if (!this._pauseOnHover) return;
    this._hovering = false;
    this._setUninterruptedAfterDelay(this._delayOnMouseLeave);
  };

  private _onWheel = () => {
    if (!this._canInterrupt) return;
    this._interrupted = true;
    this._setUninterruptedAfterDelay(this._delay);
  };

  private _setUninterruptedAfterDelay(delay: number): void {
    if (this._hovering) return;

    this._clearTimeout();

    if (delay > 0) {
      this._interruptionTimer = window.setTimeout(() => {
        this._interrupted = false;
        this._interruptionTimer = -1;
      }, delay);
    } else {
      this._interrupted = false;
      this._interruptionTimer = -1;
    }
  }

  private _clearTimeout(): void {
    if (this._interruptionTimer >= 0) {
      window.clearTimeout(this._interruptionTimer);
      this._interruptionTimer = -1;
    }
  }
}

export default AutoControl;
