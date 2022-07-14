/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../../View3D";
import { EVENTS } from "../../const/external";
import * as BROWSER from "../../const/browser";
import { RenderEvent } from "../../type/event";
import { clamp } from "../../utils";

import ControlBar from "./ControlBar";
import ControlBarItem from "./ControlBarItem";

/**
 * @param {string} [position="top"] Position inside the control bar
 * @param {number} [order=9999] Order within the current position, items will be sorted in ascending order
 */
export interface AnimationProgressBarOptions {
  position: ControlBarItem["position"];
  order: ControlBarItem["order"];
}

/**
 * Show animation progress bar, use with ControlBar
 */
class AnimationProgressBar implements ControlBarItem {
  public position: AnimationProgressBarOptions["position"];
  public order: AnimationProgressBarOptions["order"];

  public get element() { return this._rootEl; }
  public get enabled() { return this._enabled; }

  private _view3D: View3D;
  private _controlBar: ControlBar;
  private _rootEl: HTMLElement;
  private _thumbEl: HTMLElement;
  private _trackEl: HTMLElement;
  private _fillerEl: HTMLElement;
  private _rootBbox: DOMRect;
  private _enabled: boolean;
  private _firstTouch: { x: number; y: number } | null;
  private _scrolling: boolean;
  private _origTimeScale: number;

  /** */
  public constructor(view3D: View3D, controlBar: ControlBar, {
    position = ControlBar.POSITION.TOP,
    order = 9999
  }: Partial<AnimationProgressBarOptions> = {}) {
    this.position = position;
    this.order = order;

    this._view3D = view3D;
    this._controlBar = controlBar;
    this._createElements();
    this._enabled = false;
    this._firstTouch = null;
    this._scrolling = false;
    this._origTimeScale = 1;
  }

  /**
   * Enable control item
   */
  public enable() {
    const view3D = this._view3D;
    if (this._enabled) return;

    this._rootBbox = this._trackEl.getBoundingClientRect();
    this._enabled = true;

    view3D.on(EVENTS.RESIZE, this._onResize);
    view3D.on(EVENTS.RENDER, this._onRender);

    this._fill(0);
    this.enableInput();
  }

  /**
   * Disable control item
   */
  public disable() {
    const view3D = this._view3D;
    if (!this._enabled) return;

    this._enabled = false;

    view3D.off(EVENTS.RESIZE, this._onResize);
    view3D.off(EVENTS.RENDER, this._onRender);

    this.disableInput();
  }

  /**
   * Enable mouse / touch inputs
   */
  public enableInput() {
    const root = this._rootEl;
    const view3D = this._view3D;

    this._firstTouch = null;
    this._scrolling = false;

    if (view3D.animator.animationCount <= 0) return;

    root.addEventListener(BROWSER.EVENTS.MOUSE_DOWN, this._onMouseDown);

    root.addEventListener(BROWSER.EVENTS.TOUCH_START, this._onTouchStart, { passive: false });
    root.addEventListener(BROWSER.EVENTS.TOUCH_MOVE, this._onTouchMove, { passive: false });
    root.addEventListener(BROWSER.EVENTS.TOUCH_END, this._onTouchEnd);
  }

  /**
   * Disable mouse / touch inputs
   */
  public disableInput() {
    const root = this._rootEl;

    root.removeEventListener(BROWSER.EVENTS.MOUSE_DOWN, this._onMouseDown);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_MOVE, this._onMouseMove, false);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);

    root.removeEventListener(BROWSER.EVENTS.TOUCH_START, this._onTouchStart);
    root.removeEventListener(BROWSER.EVENTS.TOUCH_MOVE, this._onTouchMove);
    root.removeEventListener(BROWSER.EVENTS.TOUCH_END, this._onTouchEnd);
  }

  private _createElements() {
    const controlBar = this._controlBar;
    const className = {
      ...controlBar.className,
      ...ControlBar.DEFAULT_CLASS
    };

    const root = document.createElement(BROWSER.EL_DIV);
    root.classList.add(className.PROGRESS_ROOT);
    root.draggable = false;

    const track = document.createElement(BROWSER.EL_DIV);
    track.classList.add(className.PROGRESS_TRACK);

    const thumb = document.createElement(BROWSER.EL_DIV);
    thumb.classList.add(className.PROGRESS_THUMB);

    const filler = document.createElement(BROWSER.EL_DIV);
    filler.classList.add(className.PROGRESS_FILLER);

    track.appendChild(filler);
    track.appendChild(thumb);
    root.appendChild(track);

    this._rootEl = root;
    this._trackEl = track;
    this._thumbEl = thumb;
    this._fillerEl = filler;
  }

  private _onResize = () => {
    this._rootBbox = this._trackEl.getBoundingClientRect();
  };

  private _onRender = ({ target: view3D }: RenderEvent) => {
    const animator = view3D.animator;
    const activeAnimationIdx = animator.activeAnimationIndex;
    const activeAnimationClip = animator.activeAnimation;
    const activeAnimationAction = animator.actions[activeAnimationIdx];

    if (!activeAnimationClip || !activeAnimationAction) return;

    const progress = activeAnimationAction.time / activeAnimationClip.duration;

    this._fill(progress);
  };

  private _fill(progress: number) {
    this._fillerEl.style.width = `${progress * 100}%`;
    this._thumbEl.style.transform = `translateX(${progress * this._rootBbox.width}px)`;
  }

  private _onMouseDown = (evt: MouseEvent) => {
    if (evt.button !== BROWSER.MOUSE_BUTTON.LEFT) return;

    const animator = this._view3D.animator;
    const activeAnimationIdx = animator.activeAnimationIndex;
    const activeAnimationAction = animator.actions[activeAnimationIdx];

    evt.preventDefault();
    window.addEventListener(BROWSER.EVENTS.MOUSE_MOVE, this._onMouseMove, false);
    window.addEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);

    this._rootBbox = this._trackEl.getBoundingClientRect();
    this._showThumb();
    this._origTimeScale = activeAnimationAction.getEffectiveTimeScale();
    this._setAnimationTimeScale(0);
    this._updateAnimationProgress(evt.pageX);
  };

  private _onMouseMove = (evt: MouseEvent) => {
    evt.preventDefault();
    this._updateAnimationProgress(evt.pageX);
  };

  private _onMouseUp = () => {
    window.removeEventListener(BROWSER.EVENTS.MOUSE_MOVE, this._onMouseMove, false);
    window.removeEventListener(BROWSER.EVENTS.MOUSE_UP, this._onMouseUp, false);
    this._hideThumb();
    this._setAnimationTimeScale(this._origTimeScale);
  };

  private _onTouchStart = (evt: TouchEvent) => {
    if (evt.touches.length > 1) return;

    const touch = evt.touches[0];
    const animator = this._view3D.animator;
    const activeAnimationIdx = animator.activeAnimationIndex;
    const activeAnimationAction = animator.actions[activeAnimationIdx];

    this._rootBbox = this._trackEl.getBoundingClientRect();
    this._showThumb();
    this._firstTouch = { x: touch.pageX, y: touch.pageY };
    this._origTimeScale = activeAnimationAction.getEffectiveTimeScale();
    this._setAnimationTimeScale(0);
    this._updateAnimationProgress(touch.pageX);
  };

  private _onTouchMove = (evt: TouchEvent) => {
    // Only the one finger motion should be considered
    if (evt.touches.length > 1 || this._scrolling) return;

    const touch = evt.touches[0];
    const scrollable = this._view3D.scrollable;
    const firstTouch = this._firstTouch;

    if (firstTouch) {
      if (scrollable) {
        const delta = new THREE.Vector2(touch.pageX, touch.pageY)
          .sub(new THREE.Vector2(firstTouch.x, firstTouch.y));

        if (Math.abs(delta.y) > Math.abs(delta.x)) {
          // Assume Scrolling
          this._scrolling = true;
          this._release();
          return;
        }
      }

      this._firstTouch = null;
    }

    if (evt.cancelable) {
      evt.preventDefault();
    }

    evt.stopPropagation();
    this._setAnimationTimeScale(0);
    this._updateAnimationProgress(touch.pageX);
  };

  private _onTouchEnd = (evt: TouchEvent) => {
    if (evt.touches.length > 0) return;

    this._release();
    this._scrolling = false;
  };

  private _release() {
    this._hideThumb();
    this._setAnimationTimeScale(this._origTimeScale);
  }

  private _showThumb() {
    const thumb = this._thumbEl;
    const controlBar = this._controlBar;
    const className = {
      ...controlBar.className,
      ...ControlBar.DEFAULT_CLASS
    };

    thumb.classList.add(className.VISIBLE);
  }

  private _hideThumb() {
    const thumb = this._thumbEl;
    const controlBar = this._controlBar;
    const className = {
      ...controlBar.className,
      ...ControlBar.DEFAULT_CLASS
    };

    thumb.classList.remove(className.VISIBLE);
  }

  private _updateAnimationProgress = (x: number) => {
    const view3D = this._view3D;
    const rootBbox = this._rootBbox;
    const thumb = this._thumbEl;

    const animator = view3D.animator;
    const activeAnimationIdx = animator.activeAnimationIndex;
    const activeAnimationClip = animator.activeAnimation;
    const activeAnimationAction = animator.actions[activeAnimationIdx];

    if (!activeAnimationClip || !activeAnimationAction) return;

    const progress = ((x - rootBbox.x) / rootBbox.width);
    const newTime = clamp(progress, 0, 1) * activeAnimationClip.duration;
    activeAnimationAction.time = newTime;

    const newTimeSeconds = Math.floor(newTime);
    const newTimeFractions = Math.floor(100 * (newTime - newTimeSeconds));
    const padNumber = (val: number) => `${"0".repeat(Math.max(2 - val.toString().length, 0))}${val}`;

    thumb.setAttribute("data-time", `${padNumber(newTimeSeconds)}:${padNumber(newTimeFractions)}`);

    view3D.renderer.renderSingleFrame();
  };

  private _setAnimationTimeScale(timeScale: number) {
    const view3D = this._view3D;
    const animator = view3D.animator;
    const activeAnimationIdx = animator.activeAnimationIndex;
    const activeAnimationClip = animator.activeAnimation;
    const activeAnimationAction = animator.actions[activeAnimationIdx];

    if (!activeAnimationClip || !activeAnimationAction) return;

    activeAnimationAction.setEffectiveTimeScale(timeScale);
  }
}

export default AnimationProgressBar;
