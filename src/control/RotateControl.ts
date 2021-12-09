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
import { ControlEvents } from "../type/utils";

import CameraControl from "./CameraControl";

/**
 * Model's rotation control that supports both mouse & touch
 */
class RotateControl extends Component<ControlEvents> implements CameraControl {
  // Options
  private _scaleToElement: boolean;
  private _userScale: THREE.Vector2;

  // Internal values
  private _view3D: View3D;
  private _xMotion: Motion;
  private _yMotion: Motion;
  private _screenScale: THREE.Vector2 = new THREE.Vector2(0, 0);
  private _prevPos: THREE.Vector2 = new THREE.Vector2(0, 0);
  private _enabled: boolean = false;

  /**
   * Scale factor for panning, x is for horizontal and y is for vertical panning.
   * @type THREE.Vector2
   * @see https://threejs.org/docs/#api/en/math/Vector2
   * @example
   * ```ts
   * const rotateControl = new View3D.RotateControl();
   * rotateControl.scale.setX(2);
   * ```
   */
  public get scale() { return this._userScale; }
  /**
   * Whether to scale control to fit element size.
   * When this is true and {@link RotateControl#scale scale.x} is 1, panning through element's width will make 3d model's yaw rotate 360°.
   * When this is true and {@link RotateControl#scale scale.y} is 1, panning through element's height will make 3d model's pitch rotate 180°.
   * @default true
   * @example
   * ```ts
   * import View3D, { RotateControl } from "@egjs/view3d";
   * const view3d = new View3D("#view3d-canvas");
   * const rotateControl = new RotateControl();
   * rotateControl.scaleToElement = true;
   * view3d.controller.add(rotateControl);
   * view3d.resize();
   * ```
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

  public set scaleToElement(val: boolean) {
    this._scaleToElement = val;
  }

  /**
   * Create new RotateControl instance
   * @param {View3D} view3D An instance of View3D
   * @param {object} options Options
   * @param {number} [options.duration=500] Motion's duration
   * @param {function} [options.easing=(x: number) => 1 - Math.pow(1 - x, 3)] Motion's easing function
   * @param {THREE.Vector2} [options.scale=new THREE.Vector2(1, 1)] Scale factor for panning, x is for horizontal and y is for vertical panning
   * @param {boolean} [options.useGrabCursor=true] Whether to apply CSS style `cursor: grab` on the target element or not
   * @param {boolean} [options.scaleToElement=true] Whether to scale control to fit element size
   */
  public constructor(view3D: View3D, {
    duration = DEFAULT.ANIMATION_DURATION,
    easing = DEFAULT.EASING,
    scale = new THREE.Vector2(1, 1),
    scaleToElement = true
  } = {}) {
    super();

    this._view3D = view3D;
    this._userScale = scale;
    this._scaleToElement = scaleToElement;
    this._xMotion = new Motion({ duration, range: DEFAULT.INFINITE_RANGE, easing });
    this._yMotion = new Motion({ duration, range: DEFAULT.PITCH_RANGE, easing });
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
    const camera = this._view3D.camera;
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

    targetEl.addEventListener(BROWSER.EVENTS.MOUSE_DOWN, this._onMouseDown, false);

    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_START, this._onTouchStart, { passive: false, capture: false });
    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_MOVE, this._onTouchMove, { passive: false, capture: false });
    targetEl.addEventListener(BROWSER.EVENTS.TOUCH_END, this._onTouchEnd, { passive: false, capture: false });

    this._enabled = true;
    this.sync();

    this.trigger(CONTROL_EVENTS.ENABLE);
  }

  /**
   * Disable this input and remove all event handlers
   * @returns {void}
   */
  public disable(): void {
    if (!this._enabled) return;

    const targetEl = this._view3D.renderer.canvas;

    targetEl.removeEventListener(BROWSER.EVENTS.MOUSE_DOWN, this._onMouseDown, false);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_MOVE, this._onMouseMove, false);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);

    targetEl.removeEventListener(BROWSER.EVENTS.TOUCH_START, this._onTouchStart, false);
    targetEl.removeEventListener(BROWSER.EVENTS.TOUCH_MOVE, this._onTouchMove, false);
    targetEl.removeEventListener(BROWSER.EVENTS.TOUCH_END, this._onTouchEnd, false);

    this._enabled = false;

    this.trigger(CONTROL_EVENTS.DISABLE);
  }

  /**
   * Synchronize this control's state to given camera position
   * @param camera Camera to match state
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

    this.trigger(CONTROL_EVENTS.HOLD);
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

    this.trigger(CONTROL_EVENTS.RELEASE);
  };

  private _onTouchStart = (evt: TouchEvent) => {
    if (!this._view3D.scrollable) {
      evt.preventDefault();
    }

    const touch = evt.touches[0];
    this._prevPos.set(touch.clientX, touch.clientY);
  };

  private _onTouchMove = (evt: TouchEvent) => {
    // Only the one finger motion should be considered
    if (evt.touches.length > 1) return;

    const scrollable = this._view3D.scrollable;

    if (!scrollable && evt.cancelable !== false) {
      evt.preventDefault();
    }

    if (scrollable && !evt.cancelable) {
      return;
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
