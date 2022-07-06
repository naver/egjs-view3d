/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../../View3D";
import * as BROWSER from "../../const/browser";
import ResetIcon from "../../asset/reset-icon";

import ControlBar from "./ControlBar";
import ControlBarItem from "./ControlBarItem";

/**
 * @param {string} [position="right"] Position inside the control bar
 * @param {number} [order=9999] Order within the current position, items will be sorted in ascending order
 * @param {number} [duration=500] Duration of the reset animation
 */
export interface CameraResetButtonOptions {
  position: ControlBarItem["position"];
  order: ControlBarItem["order"];
  duration: number;
}

/**
 * Show camera reset button, use with ControlBar
 */
class CameraResetButton implements ControlBarItem {
  public position: CameraResetButtonOptions["position"];
  public order: CameraResetButtonOptions["order"];
  public duration: CameraResetButtonOptions["duration"];

  public get element() { return this._element; }
  public get enabled() { return this._enabled; }

  private _view3D: View3D;
  private _element: HTMLElement;
  private _enabled: boolean;

  /** */
  public constructor(view3D: View3D, controlBar: ControlBar, {
    position = ControlBar.POSITION.RIGHT,
    order = 9999,
    duration = 500
  }: Partial<CameraResetButtonOptions> = {}) {
    this.position = position;
    this.order = order;
    this.duration = duration;

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
    void this._view3D.camera.reset(this.duration);
  };

  private _createButton(controlBar: ControlBar) {
    const root = document.createElement(BROWSER.EL_BUTTON);
    const className = {
      ...controlBar.className,
      ...ControlBar.DEFAULT_CLASS
    };

    root.classList.add(className.CONTROLS_ITEM);
    root.innerHTML = ResetIcon;

    return root;
  }
}

export default CameraResetButton;
