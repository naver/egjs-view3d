/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";
import Motion from "../core/Motion";
import * as BROWSER from "../consts/browser";
import * as DEFAULT from "../consts/default";

import CameraControl from "./CameraControl";

/**
 * Distance controller handling both mouse wheel and pinch zoom
 * @category Controls
 */
class DistanceControl implements CameraControl {
  // Options
  private _scale: number = 1;

  // Internal values
  private _view3D: View3D;
  private _scaleModifier: number = 0.25;
  private _motion: Motion;
  private _prevTouchDistance: number = -1;
  private _enabled: boolean = false;

  /**
   * Scale factor of the distance
   * @type number
   * @example
   * ```ts
   * import { DistanceControl } from "@egjs/view3d";
   * const distanceControl = new DistanceControl();
   * distanceControl.scale = 2;
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
   * Create new DistanceControl instance
   * @param {View3D} view3D An instance of View3D
   * @param {object} options Options
   * @param {HTMLElement | string | null} [options.element=null] Attaching element / selector of the element.
   * @param {number} [options.duration=500] Motion's duration.
   * @param {object} [options.range={min: 0, max: 500}] Motion's range.
   * @param {function} [options.easing=(x: number) => 1 - Math.pow(1 - x, 3)] Motion's easing function.
   */
  public constructor(view3D: View3D, {
    duration = DEFAULT.ANIMATION_DURATION,
    range = DEFAULT.DISTANCE_RANGE,
    easing = DEFAULT.EASING
  } = {}) {
    this._view3D = view3D;
    this._motion = new Motion({ duration, range, easing });
  }

  /**
   * Destroy the instance and remove all event listeners attached
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
  public update(deltaTime: number): void {
    const camera = this._view3D.camera;
    const motion = this._motion;

    camera.distance += motion.update(deltaTime);
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

    const targetEl = this._view3D.renderer.canvas;

    targetEl.addEventListener(BROWSER.EVENTS.WHEEL, this._onWheel, false);
    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_MOVE, this._onTouchMove, false);
    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_END, this._onTouchEnd, false);

    this._enabled = true;

    this.sync();
  }

  /**
   * Disable this input and remove all event handlers
   * @returns {void} Nothing
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
   * @returns {void} Nothing
   */
  public sync(): void {
    const camera = this._view3D.camera;

    this._motion.range.min = camera.minDistance;
    this._motion.range.max = camera.maxDistance;
    this._motion.reset(camera.distance);
  }

  private _onWheel = (evt: WheelEvent) => {
    if (evt.deltaY === 0) return;

    evt.preventDefault();
    evt.stopPropagation();

    const animation = this._motion;
    const delta = this._scale * this._scaleModifier * evt.deltaY;

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
    const delta = -(touchDistance - prevTouchDistance);

    this._prevTouchDistance = touchDistance;

    if (prevTouchDistance < 0) return;

    animation.setEndDelta(delta);
  };

  private _onTouchEnd = () => {
    this._prevTouchDistance = -1;
  };
}

export default DistanceControl;
