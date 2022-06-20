/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../../View3D";
import View3DPlugin from "../View3DPlugin";
import { EVENTS, DEFAULT_CLASS } from "../../const/external";

import ControlBarItem from "./ControlBarItem";
import AnimationProgressBar from "./AnimationProgressBar";

export interface ControlBarOptions {
  autoHide: boolean | {
    delay: number;
    opacity: number;
  };
  items: ControlBarItem[] | null;
}

class ControlBar implements View3DPlugin {
  public autoHide: ControlBarOptions["autoHide"];
  public items: ControlBarItem[];

  private _wrapperEl: HTMLElement | null;

  public constructor({
    autoHide = false,
    items = null
  }: Partial<ControlBarOptions> = {}) {
    this.autoHide = autoHide;

    if (items) {
      this.items = items;
    } else {
      this.items = this._createDefaultItems();
    }

    this._wrapperEl = null;
  }

  public async init(view3D: View3D) {
    this._createElements(view3D);

    if (view3D.model) {
      this._updateModelParams({ target: view3D });
    }

    view3D.on(EVENTS.MODEL_CHANGE, this._updateModelParams);
  }

  public teardown(view3D: View3D) {
    this._removeElements(view3D);
    view3D.off(EVENTS.MODEL_CHANGE, this._updateModelParams);
  }

  private _createElements(view3D: View3D) {
    if (this._wrapperEl) return;

    const wrapperEl = document.createElement("div");
    wrapperEl.classList.add(DEFAULT_CLASS.CONTROL_BAR_WRAPPER);

    const controlClasses = [
      DEFAULT_CLASS.CONTROL_BAR_TOP,
      DEFAULT_CLASS.CONTROL_BAR_LEFT,
      DEFAULT_CLASS.CONTROL_BAR_RIGHT
    ];
    const positionMap = {
      top: 0,
      left: 1,
      right: 2
    };

    const controlEls = controlClasses.map(className => {
      const control = document.createElement("div");
      control.classList.add(className);
      wrapperEl.appendChild(control);

      return control;
    });

    this.items.forEach(item => {
      const controlEl = controlEls[positionMap[item.position]];
      controlEl.appendChild(item.createElement());
    });

    view3D.rootEl.appendChild(wrapperEl);
  }

  private _removeElements(view3D: View3D) {
    const wrapper = this._wrapperEl;
    if (!wrapper) return;

    if (wrapper.parentElement === view3D.rootEl) {
      view3D.rootEl.removeChild(wrapper);
    }
  }

  private _updateModelParams = ({ target: view3D }: { target: View3D }) => {
    this.items.forEach(item => item.update(view3D));
  };

  private _createDefaultItems(): ControlBarItem[] {
    return [
      new AnimationProgressBar(),
    ];
  }
}

export default ControlBar;
