/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import ARIcon from "../asset/ar-icon";
import { EVENTS } from "../const/external";

import View3DPlugin from "./View3DPlugin";

/**
 * Options for the {@link ARButton}
 * @interface
 * @param {string} [availableText="View in AR"] A text that will be shown on mouse hover when it's available to enter the AR session.
 * @param {string} [unavailableText="AR is not available in this browser"] A text that will be shown on mouse hover when it's not available to enter the AR session.
 */
export interface ARButtonOptions {
  availableText: string;
  unavailableText: string;
}

/**
 * A button that will be shown on the right-bottom side with the AR icon.
 * It will be disabled automatically when it's not available to enter AR sessions.
 * User can enter AR sessions by clicking this.
 */
class ARButton extends View3DPlugin {
  private _options: Partial<ARButtonOptions>;

  /**
   * Create new instance of ARButton
   * @param {object} [options={}] Options for the ARButton
   * @param {string} [options.availableText="View in AR"] A text that will be shown on mouse hover when it's available to enter the AR session.
   * @param {string} [options.unavailableText="AR is not available in this browser"] A text that will be shown on mouse hover when it's not available to enter the AR session.
   */
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
