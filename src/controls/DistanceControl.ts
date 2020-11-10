/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import CameraControl from "./CameraControl";
import Motion from "./Motion";
import View3DError from "~/View3DError";
import Camera from "~/core/camera/Camera";
import { getElement } from "~/utils";
import { EVENTS } from "~/consts/event";
import * as DEFAULT from "~/consts/default";
import * as ERROR from "~/consts/error";

/**
 * Distance controller handling both mouse wheel and pinch zoom
 * @category Controls
 */
class DistanceControl implements CameraControl {
  // Options
  private _scale: number = 1;

  // Internal values
  private _targetEl: HTMLElement | null = null;
  private _scaleModifier: number = 0.25;
  private _motion: Motion;
  private _prevTouchDistance: number = -1;
  private _enabled: boolean = false;

  /**
   * Control's current target element to attach event listeners
   * @readonly
   */
  public get element() { return this._targetEl; }
  /**
   * Scale factor of the distance
   * @type number
   * @example
   * import { DistanceControl } from "@egjs/view3d";
   * const distanceControl = new DistanceControl();
   * distanceControl.scale = 2;
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
   * @tutorial Adding Controls
   * @param {object} options Options
   * @param {HTMLElement | string | null} [options.element=null] Attaching element / selector of the element.
   * @param {number} [options.duration=500] Motion's duration.
   * @param {object} [options.range={min: 0, max: 500}] Motion's range.
   * @param {function} [options.easing=(x: number) => 1 - Math.pow(1 - x, 3)] Motion's easing function.
   */
  constructor({
    element = DEFAULT.NULL_ELEMENT,
    duration = DEFAULT.ANIMATION_DURATION,
    range = DEFAULT.DISTANCE_RANGE,
    easing = DEFAULT.EASING,
  } = {}) {
    const targetEl = getElement(element);
    if (targetEl) {
      this.setElement(targetEl);
    }
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
  public update(camera: Camera, deltaTime: number): void {
    const motion = this._motion;

    camera.distance += motion.update(deltaTime);
  }

  // This is not documetned on purpose as it doesn't do nothing
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

    targetEl.addEventListener(EVENTS.WHEEL, this._onWheel, false);
    targetEl.addEventListener(EVENTS.TOUCH_MOVE, this._onTouchMove, false);
    targetEl.addEventListener(EVENTS.TOUCH_END, this._onTouchEnd, false);

    this._enabled = true;
  }

  /**
   * Disable this input and remove all event handlers
   * @returns {void} Nothing
   */
  public disable(): void {
    if (!this._enabled || !this._targetEl) return;

    const targetEl = this._targetEl;

    targetEl.removeEventListener(EVENTS.WHEEL, this._onWheel, false);
    targetEl.removeEventListener(EVENTS.TOUCH_MOVE, this._onTouchMove, false);
    targetEl.removeEventListener(EVENTS.TOUCH_END, this._onTouchEnd, false);

    this._enabled = false;
  }

  /**
   * Synchronize this control's state to given camera position
   * @param camera Camera to match state
   * @returns {void} Nothing
   */
  public sync(camera: Camera): void {
    this._motion.range.min = camera.minDistance;
    this._motion.range.max = camera.maxDistance;
    this._motion.reset(camera.distance);
  }

  /**
   * Set target element to attach event listener
   * @param element target element
   * @returns {void} Nothing
   */
  public setElement(element: HTMLElement): void {
    this._targetEl = element;
  }

  private _onWheel = (evt: MouseWheelEvent) => {
    if (evt.deltaY === 0) return;

    evt.preventDefault();
    evt.stopPropagation();

    const animation = this._motion;
    const delta = this._scale * this._scaleModifier * evt.deltaY;

    animation.setEndDelta(delta);
  }

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
  }

  private _onTouchEnd = () => {
    this._prevTouchDistance = -1;
  }
}

export default DistanceControl;
