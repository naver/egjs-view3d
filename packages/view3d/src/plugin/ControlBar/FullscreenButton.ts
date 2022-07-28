/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../../View3D";
import * as BROWSER from "../../const/browser";
import FullscreenIcon from "../../asset/fullscreeen-icon";

import ControlBar from "./ControlBar";
import ControlBarItem from "./ControlBarItem";

const requestFullscreen = [
  "requestFullscreen",
  "webkitRequestFullscreen",
  "webkitRequestFullScreen",
  "webkitCancelFullScreen",
  "mozRequestFullScreen",
  "msRequestFullscreen"
];

const fullscreenElement = [
  "fullscreenElement",
  "webkitFullscreenElement",
  "webkitCurrentFullScreenElement",
  "mozFullScreenElement",
  "msFullscreenElement"
];

const exitFullscreen = [
  "exitFullscreen",
  "webkitExitFullscreen",
  "webkitCancelFullScreen",
  "mozCancelFullScreen",
  "msExitFullscreen"
];

/**
 * @param {string} [position="right"] Position inside the control bar
 * @param {number} [order=9999] Order within the current position, items will be sorted in ascending order
 */
export interface FullscreenButtonOptions {
  position: ControlBarItem["position"];
  order: ControlBarItem["order"];
}

/**
 * Show fullscreen enter / exit button, use with ControlBar
 */
class FullscreenButton implements ControlBarItem {
  public position: FullscreenButtonOptions["position"];
  public order: FullscreenButtonOptions["order"];

  public get element() { return this._element; }
  public get enabled() { return this._enabled; }

  private _view3D: View3D;
  private _element: HTMLElement;
  private _enabled: boolean;

  /** */
  public constructor(view3D: View3D, controlBar: ControlBar, {
    position = ControlBar.POSITION.RIGHT,
    order = 9999
  }: Partial<FullscreenButtonOptions> = {}) {
    this.position = position;
    this.order = order;

    this._view3D = view3D;
    this._element = this._createButton(controlBar);
    this._enabled = false;
  }

  /**
   * Enable control item
   */
  public enable() {
    if (this._enabled) return;

    this._element.addEventListener(BROWSER.EVENTS.CLICK, this._onClick);
    this._enabled = true;
  }

  /**
   * Disable control item
   */
  public disable() {
    if (!this._enabled) return;

    this._element.removeEventListener(BROWSER.EVENTS.CLICK, this._onClick);
    this._enabled = false;
  }

  private _onClick = () => {
    const root = this._view3D.rootEl;

    if (this._isFullscreen()) {
      this._exitFullscreen();
    } else {
      this._requestFullscreen(root);
    }
  };

  private _isFullscreen() {
    if (!document) return false;

    for (const key of fullscreenElement) {
      if (document[key]) return true;
    }

    return false;
  }

  private _requestFullscreen(el: HTMLElement) {
    for (const key of requestFullscreen) {
      const request = el[key];
      if (request) {
        request.call(el);
      }
    }
  }

  private _exitFullscreen() {
    for (const key of exitFullscreen) {
      const exit = document[key];

      if (exit) {
        exit.call(document);
      }
    }
  }

  private _createButton(controlBar: ControlBar) {
    const root = document.createElement(BROWSER.EL_BUTTON);
    const className = {
      ...controlBar.className,
      ...ControlBar.DEFAULT_CLASS
    };

    root.classList.add(className.CONTROLS_ITEM);
    root.innerHTML = FullscreenIcon;

    return root;
  }
}

export default FullscreenButton;
