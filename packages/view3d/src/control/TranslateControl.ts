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
 * @param {number} [scale=1] Scale factor for panning
 * @param {number} [duration=0] Duration of the input animation (ms)
 * @param {function} [easing=EASING.EASE_OUT_CUBIC] Easing function of the animation
 */
export interface TranslateControlOptions {
  scale: number;
  duration: number;
  easing: (x: number) => number;
}

/**
 * Model's translation control that supports both mouse & touch
 */
class TranslateControl extends Component<ControlEvents> implements CameraControl, OptionGetters<TranslateControlOptions> {
  // Options
  private _scale: TranslateControlOptions["scale"];
  private _duration: TranslateControlOptions["duration"];
  private _easing: TranslateControlOptions["easing"];

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
   * Scale factor for translation
   * @type number
   * @default 1
   * @see https://threejs.org/docs/#api/en/math/Vector2
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

  public set scale(val: TranslateControlOptions["scale"]) {
    this._scale = val;
  }

  public set duration(val: TranslateControlOptions["duration"]) {
    this._duration = val;
    this._xMotion.duration = val;
    this._yMotion.duration = val;
  }

  public set easing(val: TranslateControlOptions["easing"]) {
    this._easing = val;
    this._xMotion.easing = val;
    this._yMotion.easing = val;
  }

  /**
   * Create new TranslateControl instance
   * @param {View3D} view3D An instance of View3D
   * @param {TranslateControlOptions} options Options
   */
  public constructor(view3D: View3D, {
    easing = DEFAULT.EASING,
    duration = 0,
    scale = 1
  }: Partial<TranslateControlOptions> = {}) {
    super();

    this._view3D = view3D;
    this._xMotion = new Motion({ duration, range: DEFAULT.INFINITE_RANGE, easing });
    this._yMotion = new Motion({ duration, range: DEFAULT.INFINITE_RANGE, easing });
    this._scale = scale;
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
    this._touchInitialized = false;
  }

  /**
   * Update control by given deltaTime
   * @param {number} deltaTime Number of milisec to update
   * @returns {void}
   */
  public update(deltaTime: number): void {
    const camera = this._view3D.camera;
    const newPose = camera.newPose;
    const screenSize = this._screenSize;

    const delta = new THREE.Vector2(
      this._xMotion.update(deltaTime),
      this._yMotion.update(deltaTime)
    );

    const viewXDir = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.threeCamera.quaternion);
    const viewYDir = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.threeCamera.quaternion);

    const screenScale = new THREE.Vector2(camera.renderWidth, camera.renderHeight).divide(screenSize);
    delta.multiply(screenScale);

    const newPivot = newPose.pivot.clone();
    newPose.pivot = newPivot
      .add(viewXDir.multiplyScalar(delta.x))
      .add(viewYDir.multiplyScalar(delta.y));
  }

  /**
   * Resize control to match target size
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

    this._enabled = true;
    this.sync();

    this.trigger(CONTROL_EVENTS.ENABLE, {
      inputType: INPUT_TYPE.TRANSLATE
    });
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

    window.removeEventListener(BROWSER.EVENTS.CONTEXT_MENU, this._onContextMenu, false);

    this._enabled = false;

    this.trigger(CONTROL_EVENTS.DISABLE, {
      inputType: INPUT_TYPE.TRANSLATE
    });
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
    window.addEventListener(BROWSER.EVENTS.CONTEXT_MENU, this._onContextMenu, false);

    this.trigger(CONTROL_EVENTS.HOLD, {
      inputType: INPUT_TYPE.TRANSLATE
    });
  };

  private _onMouseMove = (evt: MouseEvent) => {
    evt.preventDefault();

    const prevPos = this._prevPos;
    const delta = new THREE.Vector2(evt.clientX, evt.clientY)
      .sub(prevPos)
      .multiplyScalar(this._scale);

    // X value is negated to match cursor direction
    this._xMotion.setEndDelta(-delta.x);
    this._yMotion.setEndDelta(delta.y);

    prevPos.set(evt.clientX, evt.clientY);
  };

  private _onMouseUp = () => {
    this._prevPos.set(0, 0);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_MOVE, this._onMouseMove, false);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);

    this.trigger(CONTROL_EVENTS.RELEASE, {
      inputType: INPUT_TYPE.TRANSLATE
    });
  };

  private _onTouchStart = (evt: TouchEvent) => {
    // Only the two finger motion should be considered
    if (evt.touches.length !== 2) return;

    if (evt.cancelable !== false) {
      evt.preventDefault();
    }

    this._prevPos.copy(this._getTouchesMiddle(evt.touches));
    this._touchInitialized = true;

    this.trigger(CONTROL_EVENTS.HOLD, {
      inputType: INPUT_TYPE.TRANSLATE
    });
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
      .multiplyScalar(this._scale);

    // X value is negated to match cursor direction
    this._xMotion.setEndDelta(-delta.x);
    this._yMotion.setEndDelta(delta.y);

    prevPos.copy(middlePoint);
  };

  private _onTouchEnd = (evt: TouchEvent) => {
    // Only the two finger motion should be considered
    if (evt.touches.length !== 2) {
      if (this._touchInitialized) {
        this._touchInitialized = false;
        this.trigger(CONTROL_EVENTS.RELEASE, {
          inputType: INPUT_TYPE.TRANSLATE
        });
      }
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
    window.removeEventListener(BROWSER.EVENTS.CONTEXT_MENU, this._onContextMenu, false);
  };
}

export default TranslateControl;
