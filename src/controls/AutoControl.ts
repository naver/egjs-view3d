/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3DError from "../View3DError";
import Camera from "../core/camera/Camera";
import { getElement } from "../utils";
import { EVENTS, MOUSE_BUTTON } from "../consts/event";
import * as ERROR from "../consts/error";
import * as DEFAULT from "../consts/default";

import CameraControl from "./CameraControl";

/**
 * Control that animates model without user input
 * @category Controls
 */
class AutoControl implements CameraControl {
  // Options
  private _delay: number;
  private _delayOnMouseLeave: number;
  private _speed: number;
  private _pauseOnHover: boolean;
  private _canInterrupt: boolean;
  private _disableOnInterrupt: boolean;

  // Internal values
  private _targetEl: HTMLElement | null = null;
  private _enabled: boolean = false;
  private _interrupted: boolean = false;
  private _interruptionTimer: number = -1;
  private _hovering: boolean = false;

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
   * @param {object} options Options
   * @param {HTMLElement | string | null} [options.element=null] Attaching element / selector of the element
   * @param {number} [options.delay=2000] Reactivation delay after mouse input in milisecond
   * @param {number} [options.delayOnMouseLeave=0] Reactivation delay after mouse leave
   * @param {number} [options.speed=1] Y-axis(yaw) rotation speed
   * @param {boolean} [options.pauseOnHover=false] Whether to pause rotation on mouse hover
   * @param {boolean} [options.canInterrupt=true] Whether user can interrupt the rotation with click/wheel input
   * @param {boolean} [options.disableOnInterrupt=false] Whether to disable control on user interrupt
   * @tutorial Adding Controls
   */
  public constructor({
    element = DEFAULT.NULL_ELEMENT,
    delay = 2000,
    delayOnMouseLeave = 0,
    speed = 1,
    pauseOnHover = false,
    canInterrupt = true,
    disableOnInterrupt = false
  } = {}) {
    const targetEl = getElement(element);
    if (targetEl) {
      this.setElement(targetEl);
    }
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
   * @returns {void} Nothing
   */
  public destroy(): void {
    this.disable();
  }

  /**
   * Update control by given deltaTime
   * @param camera Camera to update position
   * @param deltaTime Number of milisec to update
   * @returns {void} Nothing
   */
  public update(camera: Camera, deltaTime: number): void {
    if (!this._enabled) return;
    if (this._interrupted) {
      if (this._disableOnInterrupt) {
        this.disable();
      }

      return;
    }

    camera.yaw += this._speed * deltaTime / 100;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public resize(size: THREE.Vector2) {
    // DO NOTHING
  }

  /**
   * Enable this input and add event listeners
   * @returns {void} Nothing
   */
  public enable(): void {
    if (this._enabled) return;
    if (!this._targetEl) {
      throw new View3DError(ERROR.MESSAGES.ADD_CONTROL_FIRST, ERROR.CODES.ADD_CONTROL_FIRST);
    }

    const targetEl = this._targetEl;

    targetEl.addEventListener(EVENTS.MOUSE_DOWN, this._onMouseDown, false);

    targetEl.addEventListener(EVENTS.TOUCH_START, this._onTouchStart, false);
    targetEl.addEventListener(EVENTS.TOUCH_END, this._onTouchEnd, false);

    targetEl.addEventListener(EVENTS.MOUSE_ENTER, this._onMouseEnter, false);
    targetEl.addEventListener(EVENTS.MOUSE_LEAVE, this._onMouseLeave, false);

    targetEl.addEventListener(EVENTS.WHEEL, this._onWheel, false);

    this._enabled = true;
  }

  /**
   * Disable this input and remove all event handlers
   * @returns {void} Nothing
   */
  public disable(): void {
    if (!this._enabled || !this._targetEl) return;

    const targetEl = this._targetEl;

    targetEl.removeEventListener(EVENTS.MOUSE_DOWN, this._onMouseDown, false);
    window.removeEventListener(EVENTS.MOUSE_UP, this._onMouseUp, false);

    targetEl.removeEventListener(EVENTS.TOUCH_START, this._onTouchStart, false);
    targetEl.removeEventListener(EVENTS.TOUCH_END, this._onTouchEnd, false);

    targetEl.removeEventListener(EVENTS.MOUSE_ENTER, this._onMouseEnter, false);
    targetEl.removeEventListener(EVENTS.MOUSE_LEAVE, this._onMouseLeave, false);

    targetEl.removeEventListener(EVENTS.WHEEL, this._onWheel, false);

    this._enabled = false;
    this._interrupted = false;
    this._hovering = false;

    this._clearTimeout();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public sync(camera: Camera): void {
    // Do nothing
  }

  /**
   * Set target element to attach event listener
   * @param element target element
   * @returns {void} Nothing
   */
  public setElement(element: HTMLElement): void {
    this._targetEl = element;
  }

  private _onMouseDown = (evt: MouseEvent) => {
    if (!this._canInterrupt) return;
    if (evt.button !== MOUSE_BUTTON.LEFT && evt.button !== MOUSE_BUTTON.RIGHT) return;

    this._interrupted = true;
    this._clearTimeout();
    window.addEventListener(EVENTS.MOUSE_UP, this._onMouseUp, false);
  };

  private _onMouseUp = () => {
    window.removeEventListener(EVENTS.MOUSE_UP, this._onMouseUp, false);
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
