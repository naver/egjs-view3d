/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";
import Motion from "../core/Motion";
import * as BROWSER from "../const/browser";
import * as DEFAULT from "../const/default";

import CameraControl from "./CameraControl";

/**
 * Distance controller handling both mouse wheel and pinch zoom
 */
class ZoomControl implements CameraControl {
  // Options
  private _scale: number;

  // Internal values
  private _view3D: View3D;
  private _scaleModifier: number = 0.02;
  private _motion: Motion;
  private _prevTouchDistance: number = -1;
  private _enabled: boolean = false;

  /**
   * Scale factor of the zoom
   * @type number
   * @example
   * ```ts
   * view3D.control.zoom.scale = 2;
   * ```
   */
  public get scale() { return this._scale; }
  /**
   * Whether this control is enabled or not
   * @readonly
   */
  public get enabled() { return this._enabled; }

  public set scale(val: number) { this._scale = val; }

  /**
   * Create new ZoomControl instance
   * @param {View3D} view3D An instance of View3D
   * @param {object} options Options
   * @param {HTMLElement | string | null} [options.element=null] Attaching element / selector of the element.
   * @param {number} [options.scale=1] Motion's scale.
   * @param {number} [options.duration=500] Motion's duration.
   * @param {object} [options.range={min: 0, max: 0}] Motion's range.
   * @param {function} [options.easing=(x: number) => 1 - Math.pow(1 - x, 3)] Motion's easing function.
   */
  public constructor(view3D: View3D, {
    scale = 1,
    duration = DEFAULT.ANIMATION_DURATION,
    range = { min: -15, max: 45 },
    easing = DEFAULT.EASING
  } = {}) {
    this._view3D = view3D;
    this._scale = scale;
    this._motion = new Motion({ duration, range, easing });
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

  public updateScaleModifier(defaultDist: number, minDist: number) {
    this._scaleModifier = (defaultDist - minDist) / 500;
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

  private _onWheel = (evt: WheelEvent) => {
    if (evt.deltaY === 0) return;

    evt.preventDefault();
    evt.stopPropagation();

    const animation = this._motion;
    const delta = -this._scale * this._scaleModifier * evt.deltaY;

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
    const touchDistance = touchDiff.length() * this._scale * this._scaleModifier;
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
