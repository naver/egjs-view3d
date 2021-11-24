/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3DError from "../View3DError";
import Camera from "../core/camera/Camera";
import { getElement } from "../utils";
import { CURSOR } from "../consts/css";
import * as BROWSER from "../consts/browser";
import * as DEFAULT from "../consts/default";
import * as ERROR from "../consts/error";
import { ValueOf } from "../type/internal";

import CameraControl from "./CameraControl";
import Motion from "./Motion";

/**
 * Model's rotation control that supports both mouse & touch
 * @category Controls
 */
class RotateControl implements CameraControl {
  // Options
  private _useGrabCursor: boolean;
  private _scaleToElement: boolean;
  private _userScale: THREE.Vector2;

  // Internal values
  private _targetEl: HTMLElement | null = null;
  private _xMotion: Motion;
  private _yMotion: Motion;
  private _screenScale: THREE.Vector2 = new THREE.Vector2(0, 0);
  private _prevPos: THREE.Vector2 = new THREE.Vector2(0, 0);
  private _enabled: boolean = false;

  /**
   * Control's current target element to attach event listeners
   * @readonly
   */
  public get element() { return this._targetEl; }
  /**
   * Scale factor for panning, x is for horizontal and y is for vertical panning.
   * @type THREE.Vector2
   * @see https://threejs.org/docs/#api/en/math/Vector2
   * @example
   * const rotateControl = new View3D.RotateControl();
   * rotateControl.scale.setX(2);
   */
  public get scale() { return this._userScale; }
  /**
   * Whether to apply CSS style `cursor: grab` on the target element or not
   * @default true
   * @example
   * const rotateControl = new View3D.RotateControl();
   * rotateControl.useGrabCursor = true;
   */
  public get useGrabCursor() { return this._useGrabCursor; }
  /**
   * Whether to scale control to fit element size.
   * When this is true and {@link RotateControl#scale scale.x} is 1, panning through element's width will make 3d model's yaw rotate 360°.
   * When this is true and {@link RotateControl#scale scale.y} is 1, panning through element's height will make 3d model's pitch rotate 180°.
   * @default true
   * @example
   * import View3D, { RotateControl } from "@egjs/view3d";
   * const view3d = new View3D("#view3d-canvas");
   * const rotateControl = new RotateControl();
   * rotateControl.scaleToElement = true;
   * view3d.controller.add(rotateControl);
   * view3d.resize();
   */
  public get scaleToElement() { return this._scaleToElement; }
  /**
   * Whether this control is enabled or not
   * @readonly
   */
  public get enabled() { return this._enabled; }

  public set scale(val: THREE.Vector2) {
    this._userScale.copy(val);
  }

  public set useGrabCursor(val: boolean) {
    if (!val) {
      this._setCursor("");
      this._useGrabCursor = false;
    } else {
      this._useGrabCursor = true;
      this._setCursor(CURSOR.GRAB);
    }
  }

  public set scaleToElement(val: boolean) {
    this._scaleToElement = val;
  }

  /**
   * Create new RotateControl instance
   * @param {object} options Options
   * @param {HTMLElement | null} [options.element] Target element.
   * @param {number} [options.duration=500] Motion's duration.
   * @param {function} [options.easing=(x: number) => 1 - Math.pow(1 - x, 3)] Motion's easing function.
   * @param {THREE.Vector2} [options.scale=new THREE.Vector2(1, 1)] Scale factor for panning, x is for horizontal and y is for vertical panning.
   * @param {boolean} [options.useGrabCursor=true] Whether to apply CSS style `cursor: grab` on the target element or not.
   * @param {boolean} [options.scaleToElement=true] Whether to scale control to fit element size.
   * @tutorial Adding Controls
   */
  public constructor({
    element = DEFAULT.NULL_ELEMENT,
    duration = DEFAULT.ANIMATION_DURATION,
    easing = DEFAULT.EASING,
    scale = new THREE.Vector2(1, 1),
    useGrabCursor = true,
    scaleToElement = true
  } = {}) {
    const targetEl = getElement(element);
    if (targetEl) {
      this.setElement(targetEl);
    }
    this._userScale = scale;
    this._useGrabCursor = useGrabCursor;
    this._scaleToElement = scaleToElement;
    this._xMotion = new Motion({ duration, range: DEFAULT.INFINITE_RANGE, easing });
    this._yMotion = new Motion({ duration, range: DEFAULT.PITCH_RANGE, easing });
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
    const xMotion = this._xMotion;
    const yMotion = this._yMotion;

    const delta = new THREE.Vector2(
      xMotion.update(deltaTime),
      yMotion.update(deltaTime),
    );

    camera.yaw += delta.x;
    camera.pitch += delta.y;
  }

  /**
   * Resize control to match target size
   * This method is only meaningful when {@link RotateControl#scaleToElement scaleToElement} is enabled
   * @param size {@link https://threejs.org/docs/#api/en/math/Vector2 THREE.Vector2} instance of width(x), height(y)
   */
  public resize(size: THREE.Vector2) {
    this._screenScale.set(360 / size.x, 180 / size.y);
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

    targetEl.addEventListener(BROWSER.EVENTS.MOUSE_DOWN, this._onMouseDown, false);

    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_START, this._onTouchStart, false);
    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_MOVE, this._onTouchMove, false);
    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_END, this._onTouchEnd, false);

    this._enabled = true;
    this._setCursor(CURSOR.GRAB);
  }

  /**
   * Disable this input and remove all event handlers
   * @returns {void} Nothing
   */
  public disable(): void {
    if (!this._enabled || !this._targetEl) return;

    const targetEl = this._targetEl;

    targetEl.removeEventListener(BROWSER.EVENTS.MOUSE_DOWN, this._onMouseDown, false);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_MOVE, this._onMouseMove, false);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);

    targetEl.removeEventListener(BROWSER.EVENTS.TOUCH_START, this._onTouchStart, false);
    targetEl.removeEventListener(BROWSER.EVENTS.TOUCH_MOVE, this._onTouchMove, false);
    targetEl.removeEventListener(BROWSER.EVENTS.TOUCH_END, this._onTouchEnd, false);

    this._setCursor("");
    this._enabled = false;
  }

  /**
   * Synchronize this control's state to given camera position
   * @param camera Camera to match state
   * @returns {void} Nothing
   */
  public sync(camera: Camera): void {
    this._xMotion.reset(camera.yaw);
    this._yMotion.reset(camera.pitch);
  }

  /**
   * Set target element to attach event listener
   * @param element target element
   * @returns {void} Nothing
   */
  public setElement(element: HTMLElement): void {
    this._targetEl = element;
    this.resize(new THREE.Vector2(element.offsetWidth, element.offsetHeight));
  }

  private _setCursor(val: ValueOf<typeof CURSOR> | "") {
    const targetEl = this._targetEl;
    if (!this._useGrabCursor || !targetEl || !this._enabled) return;

    targetEl.style.cursor = val;
  }

  private _onMouseDown = (evt: MouseEvent) => {
    if (evt.button !== BROWSER.MOUSE_BUTTON.LEFT) return;

    const targetEl = this._targetEl!;
    evt.preventDefault();

    if (!!targetEl.focus) {
      targetEl.focus();
    } else {
      window.focus();
    }

    this._prevPos.set(evt.clientX, evt.clientY);
    window.addEventListener(BROWSER.EVENTS.MOUSE_MOVE, this._onMouseMove, false);
    window.addEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);

    this._setCursor(CURSOR.GRABBING);
  };

  private _onMouseMove = (evt: MouseEvent) => {
    evt.preventDefault();

    const prevPos = this._prevPos;
    const rotateDelta = new THREE.Vector2(evt.clientX, evt.clientY)
      .sub(prevPos)
      .multiply(this._userScale);

    if (this._scaleToElement) {
      rotateDelta.multiply(this._screenScale);
    }

    this._xMotion.setEndDelta(rotateDelta.x);
    this._yMotion.setEndDelta(rotateDelta.y);

    prevPos.set(evt.clientX, evt.clientY);
  };

  private _onMouseUp = () => {
    this._prevPos.set(0, 0);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_MOVE, this._onMouseMove, false);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);

    this._setCursor(CURSOR.GRAB);
  };

  private _onTouchStart = (evt: TouchEvent) => {
    evt.preventDefault();

    const touch = evt.touches[0];
    this._prevPos.set(touch.clientX, touch.clientY);
  };

  private _onTouchMove = (evt: TouchEvent) => {
    // Only the one finger motion should be considered
    if (evt.touches.length > 1) return;

    if (evt.cancelable !== false) {
      evt.preventDefault();
    }
    evt.stopPropagation();

    const touch = evt.touches[0];

    const prevPos = this._prevPos;
    const rotateDelta = new THREE.Vector2(touch.clientX, touch.clientY)
      .sub(prevPos)
      .multiply(this._userScale);

    if (this._scaleToElement) {
      rotateDelta.multiply(this._screenScale);
    }

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
    }
  };
}

export default RotateControl;
