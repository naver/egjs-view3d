import View3D from "../../View3D";
import * as BROWSER from "../../const/browser";
import FullscreenIcon from "../../asset/fullscreeen-icon";

import ControlBar from "./ControlBar";
import ControlBarItem from "./ControlBarItem";

export interface FullscreenButtonOptions {
  position: ControlBarItem["position"];
  order: ControlBarItem["order"];
}

class FullscreenButton implements ControlBarItem {
  public position: FullscreenButtonOptions["position"];
  public order: FullscreenButtonOptions["order"];

  public get element() { return this._element; }
  public get enabled() { return this._enabled; }

  private _view3D: View3D;
  private _element: HTMLElement;
  private _enabled: boolean;

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

  public enable() {
    if (this._enabled) return;

    this._element.addEventListener(BROWSER.EVENTS.CLICK, this._onClick);
    this._enabled = true;
  }

  public disable() {
    if (!this._enabled) return;

    this._element.removeEventListener(BROWSER.EVENTS.CLICK, this._onClick);
    this._enabled = false;
  }

  private _onClick = () => {
    const root = this._view3D.rootEl;

    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void root.requestFullscreen();
    }
  };

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
