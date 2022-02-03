/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";
import Motion from "../core/Motion";
import * as BROWSER from "../const/browser";
import * as DEFAULT from "../const/default";
import { AUTO } from "../const/external";
import { OptionGetters, Range } from "../type/utils";

import CameraControl from "./CameraControl";

/**
 * @interface
 * @param {number} [scale=1] Scale factor for panning
 * @param {number} [duration=300] Duration of the input animation (ms)
 * @param {number} [minFov=1] Minimum vertical fov(field of view).
 * You can get a bigger image with the smaller value of this.
 * @param {number} [maxFov="auto"] Maximum vertical fov(field of view).
 * You can get a smaller image with the bigger value of this.
 * If `"auto"` is given, it will use Math.min(default fov + 45, 175).
 * @param {function} [easing=EASING.EASE_OUT_CUBIC] Easing function of the animation
 */
export interface ZoomControlOptions {
  scale: number;
  duration: number;
  minFov: number;
  maxFov: typeof AUTO | number;
  easing: (x: number) => number;
}

/**
 * Distance controller handling both mouse wheel and pinch zoom(fov)
 */
class ZoomControl implements CameraControl, OptionGetters<ZoomControlOptions> {
  // Options
  private _scale: ZoomControlOptions["scale"];
  private _duration: ZoomControlOptions["duration"];
  private _minFov: ZoomControlOptions["minFov"];
  private _maxFov: ZoomControlOptions["maxFov"];
  private _easing: ZoomControlOptions["easing"];

  // Internal values
  private _view3D: View3D;
  private _range: Range;
  private _wheelModifier: number = 0.02;
  private _touchModifier: number = 0.05;
  private _motion: Motion;
  private _prevTouchDistance: number = -1;
  private _enabled: boolean = false;

  /**
   * Whether this control is enabled or not
   * @readonly
   */
  public get enabled() { return this._enabled; }

  /**
   * Actual fov range
   * @readonly
   */
  public get range() { return this._range; }

  /**
   * Scale factor of the zoom
   * @type number
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
   * Minimum vertical fov(field of view).
   * You can get a bigger image with the smaller value of this.
   * @type {number}
   * @default 1
   */
  public get minFov() { return this._minFov; }
  /**
   * Maximum vertical fov(field of view).
   * You can get a smaller image with the bigger value of this.
   * If `"auto"` is given, it will use Math.min(default fov + 45, 175).
   * @type {"auto" | number}
   * @default "auto"
   */
  public get maxFov() { return this._maxFov; }
  /**
   * Easing function of the animation
   * @type {function}
   * @default EASING.EASE_OUT_CUBIC
   * @see EASING
   */
  public get easing() { return this._easing; }

  public set scale(val: number) { this._scale = val; }

  /**
   * Create new ZoomControl instance
   * @param {View3D} view3D An instance of View3D
   * @param {ZoomControlOptions} options Options
   */
  public constructor(view3D: View3D, {
    scale = 1,
    duration = DEFAULT.ANIMATION_DURATION,
    minFov = 1,
    maxFov = AUTO,
    easing = DEFAULT.EASING
  }: Partial<ZoomControlOptions> = {}) {
    this._view3D = view3D;
    this._scale = scale;
    this._duration = duration;
    this._minFov = minFov;
    this._maxFov = maxFov;
    this._easing = easing;

    this._range = { min: minFov, max: maxFov === AUTO ? 180 : maxFov };
    this._motion = new Motion({ duration, easing });
  }

  /**
   * Destroy the instance and remove all event listeners attached
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
    const camera = this._view3D.camera;
    const motion = this._motion;

    camera.zoom -= motion.update(deltaTime);
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

    targetEl.addEventListener(BROWSER.EVENTS.WHEEL, this._onWheel, { passive: false, capture: false });
    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_MOVE, this._onTouchMove, { passive: false, capture: false });
    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_END, this._onTouchEnd, { passive: false, capture: false });

    this._enabled = true;

    this.sync();
  }

  /**
   * Disable this input and remove all event handlers
   * @returns {void}
   */
  public disable(): void {
    if (!this._enabled) return;

    const targetEl = this._view3D.renderer.canvas;

    targetEl.removeEventListener(BROWSER.EVENTS.WHEEL, this._onWheel, false);
    targetEl.removeEventListener(BROWSER.EVENTS.TOUCH_MOVE, this._onTouchMove, false);
    targetEl.removeEventListener(BROWSER.EVENTS.TOUCH_END, this._onTouchEnd, false);

    this._enabled = false;
  }

  /**
   * Synchronize this control's state to given camera position
   * @param camera Camera to match state
   * @returns {void}
   */
  public sync(): void {
    const camera = this._view3D.camera;

    this._motion.reset(camera.zoom);
  }

  /**
   * Update fov range by the camera's current fov value
   * @returns {void}
   */
  public updateRange(): void {
    const max = this._maxFov;
    const range = this._range;
    const motion = this._motion;
    const { camera } = this._view3D;
    const baseFov = camera.baseFov;

    if (max === AUTO) {
      range.max = Math.min(baseFov + 45, 175);
    }

    motion.range.min = range.min - baseFov;
    motion.range.max = range.max - baseFov;
  }

  private _onWheel = (evt: WheelEvent) => {
    const wheelScrollable = this._view3D.wheelScrollable;

    if (evt.deltaY === 0 || wheelScrollable) return;

    evt.preventDefault();
    evt.stopPropagation();

    const animation = this._motion;
    const delta = -this._scale * this._wheelModifier * evt.deltaY;

    animation.setEndDelta(delta);
  };

  private _onTouchMove = (evt: TouchEvent) => {
    const touches = evt.touches;
    if (touches.length !== 2) return;

    if (evt.cancelable !== false) {
      evt.preventDefault();
    }
    evt.stopPropagation();

    const animation = this._motion;
    const prevTouchDistance = this._prevTouchDistance;

    const touchPoint1 = new THREE.Vector2(touches[0].pageX, touches[0].pageY);
    const touchPoint2 = new THREE.Vector2(touches[1].pageX, touches[1].pageY);
    const touchDiff = touchPoint1.sub(touchPoint2);
    const touchDistance = touchDiff.length() * this._scale * this._touchModifier;
    const delta = touchDistance - prevTouchDistance;

    this._prevTouchDistance = touchDistance;

    if (prevTouchDistance < 0) return;

    animation.setEndDelta(delta);
  };

  private _onTouchEnd = () => {
    this._prevTouchDistance = -1;
  };
}

export default ZoomControl;
