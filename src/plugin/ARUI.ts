/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import CloseIcon from "../asset/close-icon";
import { EVENTS } from "../const/external";

import View3DPlugin from "./View3DPlugin";

class ARUI implements View3DPlugin {
  public async init(view3D: View3D) {
    view3D.once(EVENTS.AR_START, ({ session }) => {
      const overlayRoot = session.domOverlay.root;

      if (!overlayRoot) return;

      const closeButton = document.createElement("div");

      closeButton.innerHTML = CloseIcon;
      closeButton.classList.add("view3d-ar-close");
      closeButton.addEventListener("click", () => {
        void session.exit();
      });

      overlayRoot.appendChild(closeButton);
    });
  }
}

export default ARUI;
