/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import { EVENTS } from "../const/external";
import { ModelChangeEvent } from "../type/event";

import View3DPlugin from "./View3DPlugin";

export interface ControlBarOptions {

}

class ControlBar implements View3DPlugin {
  private _options: Partial<ControlBarOptions>;
  private _wrapperEl: HTMLElement | null;

  public constructor(options: Partial<ControlBarOptions> = {}) {
    this._options = options;
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
    this._removeElements();
    view3D.off(EVENTS.MODEL_CHANGE, this._updateModelParams);
  }

  private _createElements(view3D: View3D) {
    if (this._wrapperEl) return;

    const wrapperEl = document.createElement("div");

  }

  private _removeElements() {
    if (!this._wrapperEl) return;
  }

  private _updateModelParams = ({ target: view3D }: { target: View3D }) => {
    const model = view3D.model!;
  };
}

export default ControlBar;
