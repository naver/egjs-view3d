/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../../View3D";
import { EVENTS } from "../../const/external";
import * as BROWSER from "../../const/browser";
import PlayIcon from "../../asset/play-icon";
import PauseIcon from "../../asset/pause-icon";

import ControlBar from "./ControlBar";
import ControlBarItem from "./ControlBarItem";

/**
 * @param {string} [position="left"] Position inside the control bar
 * @param {number} [order=9999] Order within the current position, items will be sorted in ascending order
 */
export interface PlayButtonOptions {
  position: ControlBarItem["position"];
  order: ControlBarItem["order"];
}

/**
 * Show animation play/ pause button, use with ControlBar
 */
class PlayButton implements ControlBarItem {
  public position: PlayButtonOptions["position"];
  public order: PlayButtonOptions["order"];

  public get element() { return this._element; }
  public get enabled() { return this._enabled; }

  private _view3D: View3D;
  private _element: HTMLElement;
  private _enabled: boolean;
  private _paused: boolean;

  /** */
  public constructor(view3D: View3D, controlBar: ControlBar, {
    position = ControlBar.POSITION.LEFT,
    order = 9999
  }: Partial<PlayButtonOptions> = {}) {
    this.position = position;
    this.order = order;

    this._view3D = view3D;
    this._element = this._createButton(controlBar);
    this._enabled = false;
    this._paused = true;
  }

  /**
   * Enable control item
   */
  public enable() {
    if (this._enabled) return;

    this._view3D.on(EVENTS.RENDER, this._updateIcon);
    this._element.addEventListener(BROWSER.EVENTS.CLICK, this._onClick);
    this._enabled = true;
  }

  /**
   * Disable control item
   */
  public disable() {
    if (!this._enabled) return;

    this._view3D.off(EVENTS.RENDER, this._updateIcon);
    this._element.removeEventListener(BROWSER.EVENTS.CLICK, this._onClick);
    this._enabled = false;
  }

  private _updateIcon = () => {
    const view3D = this._view3D;

    if (view3D.animator.paused !== this._paused) {
      this._paused = view3D.animator.paused;

      this._element.innerHTML = this._paused
        ? PlayIcon
        : PauseIcon;
    }
  };

  private _onClick = () => {
    const animator = this._view3D.animator;

    if (animator.paused) {
      animator.resume();
    } else {
      animator.pause();
    }

    this._updateIcon();
  };

  private _createButton(controlBar: ControlBar) {
    const root = document.createElement(BROWSER.EL_BUTTON);
    const className = {
      ...controlBar.className,
      ...ControlBar.DEFAULT_CLASS
    };

    root.classList.add(className.CONTROLS_ITEM);
    root.innerHTML = PlayIcon;

    return root;
  }
}

export default PlayButton;
