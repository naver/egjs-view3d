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
 * Model's translation control that supports both mouse & touch
 * @category Controls
 */
class TranslateControl implements CameraControl {
  // Options
  private _useGrabCursor: boolean;
  private _scaleToElement: boolean;
  private _userScale: THREE.Vector2;

  // Internal values
  private _targetEl: HTMLElement | null = null;
  private _enabled: boolean = false;
  // Sometimes, touchstart for second finger doesn't triggered.
  // This flag checks whether that happened
  private _touchInitialized: boolean = false;
  private _xMotion: Motion;
  private _yMotion: Motion;
  private _prevPos: THREE.Vector2 = new THREE.Vector2(0, 0);
  private _screenSize: THREE.Vector2 = new THREE.Vector2(0, 0);

  /**
   * Control's current target element to attach event listeners
   * @readonly
   */
  public get element() { return this._targetEl; }
  /**
   * Scale factor for translation
   * @type THREE.Vector2
   * @see https://threejs.org/docs/#api/en/math/Vector2
   * @example
   * import { TranslateControl } from "@egjs/view3d";
   * const translateControl = new TranslateControl();
   * translateControl.scale.set(2, 2);
   */
  public get scale() { return this._userScale; }
  /**
   * Whether to apply CSS style `cursor: grab` on the target element or not
   * @default true
   * @example
   * import { TranslateControl } from "@egjs/view3d";
   * const translateControl = new TranslateControl();
   * translateControl.useGrabCursor = true;
   */
  public get useGrabCursor() { return this._useGrabCursor; }
  /**
   * Scale control to fit element size.
   * When this is true, camera's pivot change will correspond same amount you've dragged.
   * @default true
   * @example
   * import View3D, { TranslateControl } from "@egjs/view3d";
   * const view3d = new View3D("#view3d-canvas");
   * const translateControl = new TranslateControl();
   * translateControl.scaleToElement = true;
   * view3d.controller.add(translateControl);
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
   * Create new TranslateControl instance
   * @param {object} options Options
   * @param {HTMLElement | null} [options.element] Target element.
   * @param {function} [options.easing=(x: number) => 1 - Math.pow(1 - x, 3)] Motion's easing function.
   * @param {THREE.Vector2} [options.scale=new THREE.Vector2(1, 1)] Scale factor for translation.
   * @param {boolean} [options.useGrabCursor=true] Whether to apply CSS style `cursor: grab` on the target element or not.
   * @param {boolean} [options.scaleToElement=true] Whether to scale control to fit element size.
   * @tutorial Adding Controls
   */
  public constructor({
    element = DEFAULT.NULL_ELEMENT,
    easing = DEFAULT.EASING,
    scale = new THREE.Vector2(1, 1),
    useGrabCursor = true,
    scaleToElement = true
  } = {}) {
    const targetEl = getElement(element);
    if (targetEl) {
      this.setElement(targetEl);
    }
    this._xMotion = new Motion({ duration: 0, range: DEFAULT.INFINITE_RANGE, easing });
    this._yMotion = new Motion({ duration: 0, range: DEFAULT.INFINITE_RANGE, easing });
    this._userScale = scale;
    this._useGrabCursor = useGrabCursor;
    this._scaleToElement = scaleToElement;
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
   * @param deltaTime Number of milisec to update
   * @returns {void} Nothing
   */
  public update(camera: Camera, deltaTime: number): void {
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
   * @param size {@link https://threejs.org/docs/#api/en/math/Vector2 THREE.Vector2} instance of width(x), height(y)
   */
  public resize(size: THREE.Vector2) {
    const screenSize = this._screenSize;

    screenSize.copy(size);
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

    targetEl.addEventListener(BROWSER.EVENTS.CONTEXT_MENU, this._onContextMenu, false);

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

    targetEl.removeEventListener(BROWSER.EVENTS.CONTEXT_MENU, this._onContextMenu, false);

    this._setCursor("");
    this._enabled = false;
  }

  /**
   * Synchronize this control's state to given camera position
   * @param camera Camera to match state
   * @returns {void} Nothing
   */
  public sync(camera: Camera): void { // eslint-disable-line @typescript-eslint/no-unused-vars
    this._xMotion.reset(0);
    this._yMotion.reset(0);
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
    if (evt.button !== BROWSER.MOUSE_BUTTON.RIGHT) return;

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

    this._setCursor(CURSOR.GRAB);
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
