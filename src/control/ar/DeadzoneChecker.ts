/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import { GESTURE } from "../../const/internal";

enum STATE {
  WAITING,
  IN_DEADZONE,
  OUT_OF_DEADZONE,
}

/**
 * Options for {@link DeadzoneChecker}
 * @interface
 * @property {number} size Size of the deadzone circle.
 */
export interface DeadzoneCheckerOptions {
  size: number;
}

/**
 * Deadzone checker for deadzone-based controls
 */
class DeadzoneChecker {
  // Options
  private _size: number;

  // Internal States
  private _state = STATE.WAITING;
  private _detectedGesture = GESTURE.NONE;
  private _testingGestures = GESTURE.NONE;
  private _lastFingerCount = 0;
  private _aspect: number = 1;

  // Store two prev positions, as it should be maintained separately
  private _prevOneFingerPos = new THREE.Vector2();
  private _prevTwoFingerPos = new THREE.Vector2();
  private _initialTwoFingerDistance = 0;
  private _prevOneFingerPosInitialized = false;
  private _prevTwoFingerPosInitialized = false;

  /**
   * Size of the deadzone.
   * @type {number}
   */
  public get size() { return this._size; }

  /**
   * Whether the input is in the deadzone
   * @type {boolean}
   */
  public get inDeadzone() { return this._state === STATE.IN_DEADZONE; }

  public set size(val: number) { this._size = val; }

  /**
   * Create new DeadzoneChecker
   * @param {DeadzoneCheckerOptions} [options={}] Options
   * @param {number} [options.size=0.1] Size of the deadzone circle.
   */
  public constructor({
    size = 0.1
  }: Partial<DeadzoneCheckerOptions> = {}) {
    this._size = size;
  }

  /**
   * Set screen aspect(height / width)
   * @param aspect Screen aspect value
   */
  public setAspect(aspect: number) {
    this._aspect = aspect;
  }

  public setFirstInput(inputs: THREE.Vector2[]) {
    const fingerCount = inputs.length;

    if (fingerCount === 1 && !this._prevOneFingerPosInitialized) {
      this._prevOneFingerPos.copy(inputs[0]);
      this._prevOneFingerPosInitialized = true;
    } else if (fingerCount === 2 && !this._prevTwoFingerPosInitialized) {
      this._prevTwoFingerPos.copy(new THREE.Vector2().addVectors(inputs[0], inputs[1]).multiplyScalar(0.5));
      this._initialTwoFingerDistance = new THREE.Vector2().subVectors(inputs[0], inputs[1]).length();
      this._prevTwoFingerPosInitialized = true;
    }

    this._lastFingerCount = fingerCount;
    this._state = STATE.IN_DEADZONE;
  }

  public addTestingGestures(...gestures: GESTURE[]) {
    this._testingGestures = this._testingGestures | gestures.reduce((gesture, accumulated) => gesture | accumulated, GESTURE.NONE);
  }

  public cleanup() {
    this._testingGestures = GESTURE.NONE;
    this._lastFingerCount = 0;
    this._prevOneFingerPosInitialized = false;
    this._prevTwoFingerPosInitialized = false;
    this._initialTwoFingerDistance = 0;
    this._detectedGesture = GESTURE.NONE;
    this._state = STATE.WAITING;
  }

  public applyScreenAspect(inputs: THREE.Vector2[]) {
    const aspect = this._aspect;

    inputs.forEach(input => {
      if (aspect > 1) {
        input.setY(input.y * aspect);
      } else {
        input.setX(input.x / aspect);
      }
    });
  }

  public check(inputs: THREE.Vector2[]): GESTURE {
    const state = this._state;
    const deadzone = this._size;
    const testingGestures = this._testingGestures;
    const lastFingerCount = this._lastFingerCount;
    const fingerCount = inputs.length;

    if (state === STATE.OUT_OF_DEADZONE) {
      return this._detectedGesture;
    }

    this._lastFingerCount = fingerCount;
    this.applyScreenAspect(inputs);

    if (fingerCount !== lastFingerCount) {
      this.setFirstInput(inputs);
      return GESTURE.NONE;
    }

    if (fingerCount === 1) {
      const input = inputs[0];
      const prevPos = this._prevOneFingerPos.clone();

      const diff = new THREE.Vector2().subVectors(input, prevPos);
      if (diff.length() > deadzone) {
        if (Math.abs(diff.x) > Math.abs(diff.y)) {
          if (GESTURE.ONE_FINGER_HORIZONTAL & testingGestures) {
            this._detectedGesture = GESTURE.ONE_FINGER_HORIZONTAL;
          }
        } else {
          if (GESTURE.ONE_FINGER_VERTICAL & testingGestures) {
            this._detectedGesture = GESTURE.ONE_FINGER_VERTICAL;
          }
        }
      }
    } else if (fingerCount === 2) {
      const middle = new THREE.Vector2().addVectors(inputs[1], inputs[0]).multiplyScalar(0.5);
      const prevPos = this._prevTwoFingerPos.clone();

      const diff = new THREE.Vector2().subVectors(middle, prevPos);
      if (diff.length() > deadzone) {
        if (Math.abs(diff.x) > Math.abs(diff.y)) {
          if (GESTURE.TWO_FINGER_HORIZONTAL & testingGestures) {
            this._detectedGesture = GESTURE.TWO_FINGER_HORIZONTAL;
          }
        } else {
          if (GESTURE.TWO_FINGER_VERTICAL & testingGestures) {
            this._detectedGesture = GESTURE.TWO_FINGER_VERTICAL;
          }
        }
      }

      const distance = new THREE.Vector2().subVectors(inputs[1], inputs[0]).length();

      if (Math.abs(distance - this._initialTwoFingerDistance) > deadzone) {
        if (GESTURE.PINCH & testingGestures) {
          this._detectedGesture = GESTURE.PINCH;
        }
      }
    }

    if (this._detectedGesture !== GESTURE.NONE) {
      this._state = STATE.OUT_OF_DEADZONE;
    }

    return this._detectedGesture;
  }
}

export default DeadzoneChecker;
