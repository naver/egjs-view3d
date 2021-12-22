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

class ARButton implements View3DPlugin {
  private _options: Partial<ARButtonOptions>;

  public constructor(options: Partial<ARButtonOptions> = {}) {
    this._options = options;
  }

  public async init(view3D: View3D) {
    if (view3D.initialized) {
      await this._addButton(view3D);
    } else {
      view3D.once(EVENTS.READY, () => {
        void this._addButton(view3D);
      });
    }
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

    if (!arAvailable) {
      button.disabled = true;
    } else {
      button.addEventListener("click", () => {
        void view3D.ar.enter();
      });
    }

    button.innerHTML = ARIcon;
    button.appendChild(tooltip);
    tooltip.appendChild(tooltipText);
    view3D.rootEl.appendChild(button);
  }
}

export default ARButton;
