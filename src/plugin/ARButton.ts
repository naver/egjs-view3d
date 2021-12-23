/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import ARIcon from "../asset/ar-icon";
import { EVENTS } from "../const/external";

import View3DPlugin from "./View3DPlugin";

export interface ARButtonOptions {
  availableText: string;
  unavailableText: string;
}

class ARButton extends View3DPlugin {
  private _options: Partial<ARButtonOptions>;

  public constructor(options: Partial<ARButtonOptions> = {}) {
    super();

    this._options = options;
  }

  public async init(view3D: View3D) {
    await this._addButton(view3D);
  }

  private async _addButton(view3D: View3D) {
    const {
      availableText = "View in AR",
      unavailableText = "AR is not available in this browser"
    } = this._options;
    const arAvailable = await view3D.ar.isAvailable();

    const button = document.createElement("button");
    const tooltip = document.createElement("div");
    const tooltipText = document.createTextNode(arAvailable ? availableText : unavailableText);

    button.classList.add("view3d-ar-button");
    tooltip.classList.add("view3d-tooltip");

    button.disabled = true;
    button.innerHTML = ARIcon;
    button.appendChild(tooltip);
    tooltip.appendChild(tooltipText);
    view3D.rootEl.appendChild(button);

    if (view3D.initialized) {
      await this._setAvailable(view3D, button, arAvailable);
    } else {
      view3D.once(EVENTS.MODEL_CHANGE, () => {
        void this._setAvailable(view3D, button, arAvailable);
      });
    }
  }

  private async _setAvailable(view3D: View3D, button: HTMLButtonElement, arAvailable: boolean) {
    if (!arAvailable) {
      button.disabled = true;
    } else {
      button.disabled = false;

      button.addEventListener("click", () => {
        void view3D.ar.enter();
      });
    }
  }
}

export default ARButton;
