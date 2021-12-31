/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import CloseIcon from "../asset/close-icon";
import { EVENTS } from "../const/external";

import View3DPlugin from "./View3DPlugin";

/**
 * Options for the {@link ARUI}
 */
export interface ARUIOptions {

}

/**
 * An UI that will be displayed on top of {@link WebARSession}.
 * This will be automatically added on the overlayRoot of the {@link WebARSession}.
 */
class ARUI extends View3DPlugin {
  private _options: Partial<ARUIOptions>;
  private _cachedElements: {
    closeButton: HTMLElement;
  } | null;

  /**
   * Create new instance of ARUI
   * @param {object} [options={}] Options for the ARUI
   */
  public constructor(options: Partial<ARUIOptions> = {}) {
    super();

    this._options = options;
  }

  public async init(view3D: View3D) {
    view3D.on(EVENTS.AR_START, ({ session }) => {
      const overlayRoot = session.domOverlay.root;

      if (!overlayRoot) return;

      if (this._cachedElements) {
        Object.values(this._cachedElements).map(el => {
          if (!overlayRoot.contains(el)) {
            overlayRoot.appendChild(el);
          }
        });
      } else {
        const closeButton = document.createElement("div");

        closeButton.innerHTML = CloseIcon;
        closeButton.classList.add("view3d-ar-close");

        overlayRoot.appendChild(closeButton);

        this._cachedElements = {
          closeButton
        };
      }

      const {
        closeButton
      } = this._cachedElements;

      const closeButtonHandler = () => {
        void session.exit();
      };

      closeButton.addEventListener("click", closeButtonHandler);
      view3D.once(EVENTS.AR_END, () => {
        if (closeButton.parentElement) {
          closeButton.parentElement.removeChild(closeButton);
        }
        closeButton.removeEventListener("click", closeButtonHandler);
      });
    });
  }
}

export default ARUI;
