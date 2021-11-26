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
import { ControlEvents } from "../type/internal";

import CameraControl from "./CameraControl";

/**
 * Model's translation control that supports both mouse & touch
 */
class TranslateControl extends Component<ControlEvents> implements CameraControl {
  // Options
  private _scaleToElement: boolean;
  private _userScale: THREE.Vector2;

  // Internal values
  private _view3D: View3D;
  private _enabled: boolean = false;
  // Sometimes, touchstart for second finger doesn't triggered.
  // This flag checks whether that happened
  private _touchInitialized: boolean = false;
  private _xMotion: Motion;
  private _yMotion: Motion;
  private _prevPos: THREE.Vector2 = new THREE.Vector2(0, 0);
  private _screenSize: THREE.Vector2 = new THREE.Vector2(0, 0);

  /**
   * Scale factor for translation
   * @type THREE.Vector2
   * @see https://threejs.org/docs/#api/en/math/Vector2
   * @example
   * ```ts
   * import { TranslateControl } from "@egjs/view3d";
   * const translateControl = new TranslateControl();
   * translateControl.scale.set(2, 2);
   * ```
   */
  public get scale() { return this._userScale; }
  /**
   * Scale control to fit element size.
   * When this is true, camera's pivot change will correspond same amount you've dragged.
   * @default true
   * @example
   * ```ts
   * import View3D, { TranslateControl } from "@egjs/view3d";
   * const view3d = new View3D("#view3d-canvas");
   * const translateControl = new TranslateControl();
   * translateControl.scaleToElement = true;
   * view3d.controller.add(translateControl);
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
   * Create new TranslateControl instance
   * @param {View3D} view3D An instance of View3D
   * @param {object} options Options
   * @param {function} [options.easing=(x: number) => 1 - Math.pow(1 - x, 3)] Motion's easing function.
   * @param {THREE.Vector2} [options.scale=new THREE.Vector2(1, 1)] Scale factor for translation.
   * @param {boolean} [options.useGrabCursor=true] Whether to apply CSS style `cursor: grab` on the target element or not.
   * @param {boolean} [options.scaleToElement=true] Whether to scale control to fit element size.
   */
  public constructor(view3D: View3D, {
    easing = DEFAULT.EASING,
    scale = new THREE.Vector2(1, 1),
    scaleToElement = true
  } = {}) {
    super();

    this._view3D = view3D;
    this._xMotion = new Motion({ duration: 0, range: DEFAULT.INFINITE_RANGE, easing });
    this._yMotion = new Motion({ duration: 0, range: DEFAULT.INFINITE_RANGE, easing });
    this._userScale = scale;
    this._scaleToElement = scaleToElement;
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
   * @param deltaTime Number of milisec to update
   * @returns {void}
   */
  public update(deltaTime: number): void {
    const camera = this._view3D.camera;
    const screenSize = this._screenSize;

    const delta = new THREE.Vector2(
      this._xMotion.update(deltaTime),
      this._yMotion.update(deltaTime),
    );

    const viewXDir = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.threeCamera.quaternion);
    const viewYDir = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.threeCamera.quaternion);

    if (this._scaleToElement) {
      const screenScale = new THREE.Vector2(camera.renderWidth, camera.renderHeight).divide(screenSize);
      delta.multiply(screenScale);
    }

    camera.pivot.add(viewXDir.multiplyScalar(delta.x));
    camera.pivot.add(viewYDir.multiplyScalar(delta.y));
  }

  /**
   * Resize control to match target size
   * This method is only meaningful when {@link RotateControl#scaleToElementSize scaleToElementSize} is enabled
   * @param {object} size New size to apply
   * @param {number} [size.width] New width
   * @param {number} [size.height] New height
   */
  public resize(size: { width: number; height: number }) {
    const screenSize = this._screenSize;

    screenSize.copy(new THREE.Vector2(size.width, size.height));
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

    targetEl.addEventListener(BROWSER.EVENTS.CONTEXT_MENU, this._onContextMenu, false);

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

    targetEl.removeEventListener(BROWSER.EVENTS.CONTEXT_MENU, this._onContextMenu, false);

    this._enabled = false;

    this.trigger(CONTROL_EVENTS.DISABLE);
  }

  /**
   * Synchronize this control's state to the camera position
   * @returns {void}
   */
  public sync(): void {
    this._xMotion.reset(0);
    this._yMotion.reset(0);
  }

  private _onMouseDown = (evt: MouseEvent) => {
    if (evt.button !== BROWSER.MOUSE_BUTTON.RIGHT) return;

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
    const delta = new THREE.Vector2(evt.clientX, evt.clientY)
      .sub(prevPos)
      .multiply(this._userScale);

    // X value is negated to match cursor direction
    this._xMotion.setEndDelta(-delta.x);
    this._yMotion.setEndDelta(delta.y);

    prevPos.set(evt.clientX, evt.clientY);
  };

  private _onMouseUp = () => {
    this._prevPos.set(0, 0);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_MOVE, this._onMouseMove, false);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);

    this.trigger(CONTROL_EVENTS.RELEASE);
  };

  private _onTouchStart = (evt: TouchEvent) => {
    // Only the two finger motion should be considered
    if (evt.touches.length !== 2) return;
    evt.preventDefault();

    this._prevPos.copy(this._getTouchesMiddle(evt.touches));
    this._touchInitialized = true;
  };

  private _onTouchMove = (evt: TouchEvent) => {
    // Only the two finger motion should be considered
    if (evt.touches.length !== 2) return;

    if (evt.cancelable !== false) {
      evt.preventDefault();
    }
    evt.stopPropagation();

    const prevPos = this._prevPos;
    const middlePoint = this._getTouchesMiddle(evt.touches);

    if (!this._touchInitialized) {
      prevPos.copy(middlePoint);
      this._touchInitialized = true;
      return;
    }

    const delta = new THREE.Vector2()
      .subVectors(middlePoint, prevPos)
      .multiply(this._userScale);

    // X value is negated to match cursor direction
    this._xMotion.setEndDelta(-delta.x);
    this._yMotion.setEndDelta(delta.y);

    prevPos.copy(middlePoint);
  };

  private _onTouchEnd = (evt: TouchEvent) => {
    // Only the two finger motion should be considered
    if (evt.touches.length !== 2) {
      this._touchInitialized = false;
      return;
    }

    // Three fingers to two fingers
    this._prevPos.copy(this._getTouchesMiddle(evt.touches));
    this._touchInitialized = true;
  };

  private _getTouchesMiddle(touches: TouchEvent["touches"]): THREE.Vector2 {
    return new THREE.Vector2(
      touches[0].clientX + touches[1].clientX,
      touches[0].clientY + touches[1].clientY,
    ).multiplyScalar(0.5);
  }

  private _onContextMenu = (evt: MouseEvent) => {
    evt.preventDefault();
  };
}

export default TranslateControl;
