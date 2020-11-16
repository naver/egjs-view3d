/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import EventEmitter from "./EventEmitter";
import { Time } from "~/consts/browser";
import * as DEFAULT from "~/consts/default";
import * as EASING from "~/consts/easing";
import { circulate } from "~/utils";

/**
 * Fires for every frame when animation is active.
 * @type object
 * @property {object} event Event object.
 * @property {number} [event.progress] Current animation progress value.
 * Value is ranged from 0(start) to 1(end).
 * @property {number} [event.easedProgress] Eased progress value.
 * @event Animation#progress
 */

 /**
  * @type object
  * @property {object} event Event object.
  * @property {number} [event.progress] Current animation progress value.
  * Value is ranged from 0(start) to 1(end).
  * @property {number} [event.easedProgress] Eased progress value.
  */

/**
 * Fires when animation ends.
 * @type void
 * @event Animation#finish
 */

/**
 * Self-running animation
 * @category Core
 */
class Animation extends EventEmitter<{
  progress: (event: { progress: number, easedProgress: number }) => any,
  loop: (event: { progress: number, easedProgress: number, loopIndex: number }) => any,
  finish: void,
}> {
  // Options
  private _ctx: any; // Window or XRSession
  private _repeat: number;
  private _duration: number;
  private _easing: (x: number) => number;

  // Internal state
  private _rafId: number;
  private _loopCount: number;
  private _time: number;
  private _clock: number;

  /**
   * Create new instance of the Animation
   * @param {object} [options={}] Options
   */
  constructor({
    context = window,
    repeat = 0,
    duration = DEFAULT.ANIMATION_DURATION,
    easing = EASING.EASE_OUT_CUBIC,
  }: Partial<{
    context: any,
    repeat: number,
    duration: number,
    easing: (x: number) => number;
  }> = {}) {
    super();

    // Options
    this._repeat = repeat;
    this._duration = duration;
    this._easing = easing;

    // Internal States
    this._ctx = context;
    this._rafId = -1;
    this._time = 0;
    this._clock = 0;
    this._loopCount = 0;
  }

  public start() {
    if (this._rafId >= 0) return;

    // This guarantees "progress" event with progress = 0 on first start
    this._updateClock();
    this._loop();
  }

  public stop() {
    if (this._rafId < 0) return;

    this._loopCount = 0;
    this._stopLoop();
  }

  public pause() {
    if (this._rafId < 0) return;

    this._stopLoop();
  }

  private _loop = () => {
    const delta = this._getDeltaTime();
    const duration = this._duration;
    this._time += delta;

    const loopIncrease = Math.floor(this._time / duration);
    this._time = circulate(this._time, 0, duration);

    const progress = this._time / duration;
    const progressEvent = {
      progress,
      easedProgress: this._easing(progress),
    };
    this.emit("progress", progressEvent);

    for (let loopIdx = 0; loopIdx < loopIncrease; loopIdx++) {
      this._loopCount++;
      if (this._loopCount > this._repeat) {
        this.emit("finish");
        this.stop();
        return;
      } else {
        this.emit("loop", {
          ...progressEvent,
          loopIndex: this._loopCount,
        });
      }
    }

    this._rafId = this._ctx.requestAnimationFrame(this._loop);
  }

  private _stopLoop() {
    this._ctx.cancelAnimationFrame(this._rafId);
    this._rafId = -1;
  }

  private _getDeltaTime() {
    const lastTime = this._clock;
    this._updateClock();
    return this._clock - lastTime;
  }

  private _updateClock() {
    this._clock = Time.now();
  }
}

export default Animation;
