/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import Component from "@egjs/component";

import * as DEFAULT from "../const/default";
import { circulate, clamp } from "../utils";

/**
 * Fires for every animation frame when animation is active.
 * @type object
 * @property {object} event Event object.
 * @property {number} [event.progress] Current animation progress value.
 * Value is ranged from 0(start) to 1(end).
 * @property {number} [event.easedProgress] Eased progress value.
 * @event Animation#progress
 */

/**
 * Fires for every animation loop except for the last loop
 * This will be triggered only when repeat > 0
 * @type object
 * @property {object} event Event object.
 * @property {number} [event.progress] Current animation progress value.
 * Value is ranged from 0(start) to 1(end).
 * @property {number} [event.easedProgress] Eased progress value.
 * @property {number} [event.loopIndex] Index of the current loop.
 * @event Animation#loop
 */

/**
 * Fires when animation ends.
 * @type void
 * @event Animation#finish
 */

/**
 * Self-running animation
 */
class Animation extends Component<{
  progress: (event: { progress: number; easedProgress: number }) => any;
  loop: (event: { progress: number; easedProgress: number; loopIndex: number }) => any;
  finish: void;
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
  public constructor({
    context = window,
    repeat = 0,
    duration = DEFAULT.ANIMATION_DURATION,
    easing = DEFAULT.EASING
  }: Partial<{
    context: any;
    repeat: number;
    duration: number;
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

    this._time = 0;
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
    const repeat = this._repeat;
    const prevTime = this._time;

    const time = prevTime + delta;

    const loopIncrease = Math.floor(time / duration);
    this._time = this._loopCount >= repeat
      ? clamp(time, 0, duration)
      : circulate(time, 0, duration);

    const progress = this._time / duration;
    const progressEvent = {
      progress,
      easedProgress: this._easing(progress)
    };
    this.trigger("progress", progressEvent);

    for (let loopIdx = 0; loopIdx < loopIncrease; loopIdx++) {
      this._loopCount++;
      if (this._loopCount > repeat) {
        this.trigger("finish");
        this.stop();
        return;
      } else {
        this.trigger("loop", {
          ...progressEvent,
          loopIndex: this._loopCount
        });
      }
    }

    this._rafId = this._ctx.requestAnimationFrame(this._loop);
  };

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
    this._clock = Date.now();
  }
}

export default Animation;
