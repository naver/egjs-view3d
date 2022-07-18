/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import Component from "@egjs/component";

import View3D from "../View3D";
import Motion from "../core/Motion";
import * as BROWSER from "../const/browser";
import * as DEFAULT from "../const/default";
import { CONTROL_EVENTS } from "../const/internal";
import { INPUT_TYPE } from "../const/external";
import { ControlEvents, OptionGetters } from "../type/utils";

import CameraControl from "./CameraControl";

/**
 * @interface
 * @param {number} [scale=1] Scale factor for rotation
 * @param {number} [duration=300] Duration of the input animation (ms)
 * @param {function} [easing=EASING.EASE_OUT_CUBIC] Easing function of the animation
 * @param {boolean} [disablePitch=false] Disable X-axis(pitch) rotation
 * @param {boolean} [disableYaw=false] Disable Y-axis(yaw) rotation
 */
export interface RotateControlOptions {
  scale: number;
  duration: number;
  easing: (x: number) => number;
  disablePitch: boolean;
  disableYaw: boolean;
}

/**
 * Model's rotation control that supports both mouse & touch
 */
class RotateControl extends Component<ControlEvents> implements CameraControl, OptionGetters<RotateControlOptions> {
  // Options
  private _scale: RotateControlOptions["scale"];
  private _duration: RotateControlOptions["duration"];
  private _easing: RotateControlOptions["easing"];
  private _disablePitch: RotateControlOptions["disablePitch"];
  private _disableYaw: RotateControlOptions["disableYaw"];

  // Internal values
  private _view3D: View3D;
  private _xMotion: Motion;
  private _yMotion: Motion;
  private _screenScale: THREE.Vector2 = new THREE.Vector2(0, 0);
  private _prevPos: THREE.Vector2 = new THREE.Vector2(0, 0);
  private _isFirstTouch: boolean = false;
  private _scrolling: boolean = false;
  private _enabled: boolean = false;

  /**
   * Whether this control is enabled or not
   * @readonly
   * @type {boolean}
   */
  public get enabled() { return this._enabled; }
  /**
   * Whether this control is animating the camera
   * @readonly
   * @type {boolean}
   */
  public get animating() { return this._xMotion.activated || this._yMotion.activated; }

  /**
   * Scale factor for rotation
   * @type {number}
   * @default 1
   */
  public get scale() { return this._scale; }
  /**
   * Duration of the input animation (ms)
   * @type {number}
   * @default 300
   */
  public get duration() { return this._duration; }
  /**
   * Easing function of the animation
   * @type {function}
   * @default EASING.EASE_OUT_CUBIC
   * @see EASING
   */
  public get easing() { return this._easing; }
  /**
   * Disable X-axis(pitch) rotation
   * @type {boolean}
   * @default false
   */
  public get disablePitch() { return this._disablePitch; }
  /**
   * Disable Y-axis(yaw) rotation
   * @type {boolean}
   * @default false
   */
  public get disableYaw() { return this._disableYaw; }

  public set scale(val: RotateControlOptions["scale"]) {
    this._scale = val;
  }

  public set duration(val: RotateControlOptions["duration"]) {
    this._duration = val;
    this._xMotion.duration = val;
    this._yMotion.duration = val;
  }

  public set easing(val: RotateControlOptions["easing"]) {
    this._easing = val;
    this._xMotion.easing = val;
    this._yMotion.easing = val;
  }

  /**
   * Create new RotateControl instance
   * @param {View3D} view3D An instance of View3D
   * @param {RotateControlOptions} options Options
   */
  public constructor(view3D: View3D, {
    duration = DEFAULT.ANIMATION_DURATION,
    easing = DEFAULT.EASING,
    scale = 1,
    disablePitch = false,
    disableYaw = false
  }: Partial<RotateControlOptions> = {}) {
    super();

    this._view3D = view3D;
    this._scale = scale;
    this._duration = duration;
    this._easing = easing;
    this._disablePitch = disablePitch;
    this._disableYaw = disableYaw;

    this._xMotion = new Motion({ duration, range: DEFAULT.INFINITE_RANGE, easing });
    this._yMotion = new Motion({ duration, range: DEFAULT.PITCH_RANGE, easing });
  }

  /**
   * Destroy the instance and remove all event listeners attached
   * @returns {void}
   */
  public destroy(): void {
    this.disable();
    this.reset();
    this.off();
  }

  /**
   * Reset internal values
   * @returns {void}
   */
  public reset(): void {
    this._isFirstTouch = false;
    this._scrolling = false;
  }

  /**
   * Update control by given deltaTime
   * @param {number} deltaTime Number of milisec to update
   * @returns {void}
   */
  public update(deltaTime: number): void {
    const camera = this._view3D.camera;
    const xMotion = this._xMotion;
    const yMotion = this._yMotion;
    const newPose = camera.newPose;
    const yawEnabled = !this._disableYaw;
    const pitchEnabled = !this._disablePitch;

    const delta = new THREE.Vector2(
      xMotion.update(deltaTime),
      yMotion.update(deltaTime)
    );

    if (yawEnabled) {
      newPose.yaw += delta.x;
    }

    if (pitchEnabled) {
      newPose.pitch += delta.y;
    }
  }

  /**
   * Resize control to match target size
   * @param {object} size New size to apply
   * @param {number} [size.width] New width
   * @param {number} [size.height] New height
   */
  public resize(size: { width: number; height: number }) {
    this._screenScale.set(360 / size.width, 180 / size.height);
  }

  /**
   * Enable this input and add event listeners
   * @returns {void}
   */
  public enable(): void {
    if (this._enabled) return;

    const targetEl = this._view3D.renderer.canvas;

    targetEl.addEventListener(BROWSER.EVENTS.MOUSE_DOWN, this._onMouseDown);

    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_START, this._onTouchStart, { passive: false });
    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_MOVE, this._onTouchMove, { passive: false });
    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_END, this._onTouchEnd);

    this._enabled = true;
    this.sync();

    this.trigger(CONTROL_EVENTS.ENABLE, {
      inputType: INPUT_TYPE.ROTATE
    });
  }

  /**
   * Disable this input and remove all event handlers
   * @returns {void}
   */
  public disable(): void {
    if (!this._enabled) return;

    const targetEl = this._view3D.renderer.canvas;

    targetEl.removeEventListener(BROWSER.EVENTS.MOUSE_DOWN, this._onMouseDown);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_MOVE, this._onMouseMove, false);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);

    targetEl.removeEventListener(BROWSER.EVENTS.TOUCH_START, this._onTouchStart);
    targetEl.removeEventListener(BROWSER.EVENTS.TOUCH_MOVE, this._onTouchMove);
    targetEl.removeEventListener(BROWSER.EVENTS.TOUCH_END, this._onTouchEnd);

    this._enabled = false;

    this.trigger(CONTROL_EVENTS.DISABLE, {
      inputType: INPUT_TYPE.ROTATE
    });
  }

  /**
   * Synchronize this control's state to given camera position
   * @returns {void}
   */
  public sync(): void {
    const camera = this._view3D.camera;

    this._xMotion.reset(camera.yaw);
    this._yMotion.reset(camera.pitch);
  }

  private _onMouseDown = (evt: MouseEvent) => {
    if (evt.button !== BROWSER.MOUSE_BUTTON.LEFT) return;

    const targetEl = this._view3D.renderer.canvas;
    evt.preventDefault();

    if (!!targetEl.focus) {
      targetEl.focus();
    } else {
      window.focus();
    }

    this._prevPos.set(evt.clientX, evt.clientY);
    window.addEventListener(BROWSER.EVENTS.MOUSE_MOVE, this._onMouseMove, false);
    window.addEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);

    this.trigger(CONTROL_EVENTS.HOLD, {
      inputType: INPUT_TYPE.ROTATE
    });
  };

  private _onMouseMove = (evt: MouseEvent) => {
    evt.preventDefault();

    const prevPos = this._prevPos;
    const rotateDelta = new THREE.Vector2(evt.clientX, evt.clientY)
      .sub(prevPos)
      .multiplyScalar(this._scale);

    rotateDelta.multiply(this._screenScale);

    this._xMotion.setEndDelta(rotateDelta.x);
    this._yMotion.setEndDelta(rotateDelta.y);

    prevPos.set(evt.clientX, evt.clientY);
  };

  private _onMouseUp = () => {
    this._prevPos.set(0, 0);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_MOVE, this._onMouseMove, false);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);

    this.trigger(CONTROL_EVENTS.RELEASE, {
      inputType: INPUT_TYPE.ROTATE
    });
  };

  private _onTouchStart = (evt: TouchEvent) => {
    const touch = evt.touches[0];

    this._isFirstTouch = true;
    this._prevPos.set(touch.clientX, touch.clientY);

    this.trigger(CONTROL_EVENTS.HOLD, {
      inputType: INPUT_TYPE.ROTATE
    });
  };

  private _onTouchMove = (evt: TouchEvent) => {
    // Only the one finger motion should be considered
    if (evt.touches.length > 1 || this._scrolling) return;

    const touch = evt.touches[0];
    const scrollable = this._view3D.scrollable;

    if (this._isFirstTouch) {
      if (scrollable) {
        const delta = new THREE.Vector2(touch.clientX, touch.clientY)
          .sub(this._prevPos);

        if (Math.abs(delta.y) > Math.abs(delta.x)) {
          // Assume Scrolling
          this._scrolling = true;
          return;
        }
      }

      this._isFirstTouch = false;
    }

    if (evt.cancelable !== false) {
      evt.preventDefault();
    }
    evt.stopPropagation();

    const prevPos = this._prevPos;
    const rotateDelta = new THREE.Vector2(touch.clientX, touch.clientY)
      .sub(prevPos)
      .multiplyScalar(this._scale);

    rotateDelta.multiply(this._screenScale);

    this._xMotion.setEndDelta(rotateDelta.x);
    this._yMotion.setEndDelta(rotateDelta.y);

    prevPos.set(touch.clientX, touch.clientY);
  };

  private _onTouchEnd = (evt: TouchEvent) => {
    const touch = evt.touches[0];
    if (touch) {
      this._prevPos.set(touch.clientX, touch.clientY);
    } else {
      this._prevPos.set(0, 0);
      this.trigger(CONTROL_EVENTS.RELEASE, {
        inputType: INPUT_TYPE.ROTATE
      });
    }

    this._scrolling = false;
  };
}

export default RotateControl;
