/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
/* eslint-disable @typescript-eslint/naming-convention */
import View3D from "../../View3D";
import View3DPlugin from "../View3DPlugin";
import * as BROWSER from "../../const/browser";
import { EVENTS } from "../../const/external";
import { getObjectOption } from "../../utils";

import ControlBarItem from "./ControlBarItem";
import AnimationProgressBar, { AnimationProgressBarOptions } from "./AnimationProgressBar";
import PlayButton, { PlayButtonOptions } from "./PlayButton";

export interface ControlBarOptions {
  autoHide: boolean | {
    delay: number;
    opacity: number;
  };
  className: Partial<{ -readonly [key in keyof typeof ControlBar.DEFAULT_CLASS]: string }>;
  progressBar: boolean | Partial<AnimationProgressBarOptions>;
  playButton: boolean | Partial<PlayButtonOptions>;
}

class ControlBar implements View3DPlugin {
  /**
   * Default class names that LoadingBar uses
   * @type {object}
   * @property {"view3d-control-bar"} ROOT A class name for wrapper element
   * @property {"view3d-side-controls"} CONTROLS_SIDE A class name for controls wrapper element that includes both left & right controls
   * @property {"view3d-top-controls"} CONTROLS_TOP A class name for controls wrapper element that is placed on the top inside the control bar
   * @property {"view3d-left-controls"} CONTROLS_LEFT A class name for controls wrapper element that is placed on the left inside the control bar
   * @property {"view3d-right-controls"} CONTROLS_RIGHT A class name for controls wrapper element that is placed on the right inside the control bar
   */
  public static readonly DEFAULT_CLASS = {
    ROOT: "view3d-control-bar",
    CONTROLS_SIDE: "view3d-side-controls",
    CONTROLS_TOP: "view3d-top-controls",
    CONTROLS_LEFT: "view3d-left-controls",
    CONTROLS_RIGHT: "view3d-right-controls",
    CONTROLS_BUTTON: "view3d-control-button",
    PROGRESS_ROOT: "view3d-progress-bar",
    PROGRESS_TRACK: "view3d-progress-track",
    PROGRESS_KNOB: "view3d-progress-knob",
    PROGRESS_FILLER: "view3d-progress-filler",
    PROGRESS_TIME_VISIBLE: "time-visible"
  } as const;

  public static readonly POSITION = {
    TOP: "top",
    LEFT: "left",
    RIGHT: "right"
  } as const;

  public autoHide: ControlBarOptions["autoHide"];
  public className: ControlBarOptions["className"];
  public progressBar: ControlBarOptions["progressBar"];
  public playButton: ControlBarOptions["playButton"];

  private _wrapperEl: HTMLElement;
  private _topControlsWrapper: HTMLElement;
  private _leftControlsWrapper: HTMLElement;
  private _rightControlsWrapper: HTMLElement;
  private _items: ControlBarItem[];

  public constructor({
    autoHide = true,
    className = {},
    progressBar = true,
    playButton = true
  }: Partial<ControlBarOptions> = {}) {
    this.autoHide = autoHide;
    this.className = className;
    this.progressBar = progressBar;
    this.playButton = playButton;

    this._items = [];
    this._initElements();
  }

  public async init(view3D: View3D) {
    this._attachElements(view3D);

    if (view3D.model) {
      this._updateModelParams();
    }

    this._items = this._createDefaultItems(view3D);
    this._addItemElements();

    this._items.forEach(item => {
      item.enable();
    });
    view3D.on(EVENTS.MODEL_CHANGE, this._updateModelParams);
  }

  public teardown(view3D: View3D) {
    this._removeElements(view3D);
    this._items.forEach(item => {
      item.disable();
    });
    this._items = [];

    view3D.off(EVENTS.MODEL_CHANGE, this._updateModelParams);
  }

  private _initElements() {
    const className = {
      ...this.className,
      ...ControlBar.DEFAULT_CLASS
    };
    const wrapperEl = document.createElement(BROWSER.EL_DIV);
    wrapperEl.classList.add(className.ROOT);
    this._wrapperEl = wrapperEl;

    const topControlsWrapper = document.createElement(BROWSER.EL_DIV);
    const sideControlsWrapper = document.createElement(BROWSER.EL_DIV);
    const leftControlsWrapper = document.createElement(BROWSER.EL_DIV);
    const rightControlsWrapper = document.createElement(BROWSER.EL_DIV);

    topControlsWrapper.classList.add(className.CONTROLS_TOP);
    sideControlsWrapper.classList.add(className.CONTROLS_SIDE);
    leftControlsWrapper.classList.add(className.CONTROLS_LEFT);
    rightControlsWrapper.classList.add(className.CONTROLS_RIGHT);

    wrapperEl.appendChild(topControlsWrapper);
    sideControlsWrapper.appendChild(leftControlsWrapper);
    sideControlsWrapper.appendChild(rightControlsWrapper);
    wrapperEl.appendChild(sideControlsWrapper);

    this._topControlsWrapper = topControlsWrapper;
    this._leftControlsWrapper = leftControlsWrapper;
    this._rightControlsWrapper = rightControlsWrapper;
  }

  private _addItemElements() {
    const topControlsWrapper = this._topControlsWrapper;
    const leftControlsWrapper = this._leftControlsWrapper;
    const rightControlsWrapper = this._rightControlsWrapper;

    const posMap: {
      [key: string]: {
        parentEl: HTMLElement;
        items: ControlBarItem[];
      };
    } = {
      [ControlBar.POSITION.TOP]: {
        parentEl: topControlsWrapper,
        items: []
      },
      [ControlBar.POSITION.LEFT]: {
        parentEl: leftControlsWrapper,
        items: []
      },
      [ControlBar.POSITION.RIGHT]: {
        parentEl: rightControlsWrapper,
        items: []
      }
    };

    this._items.forEach(item => {
      posMap[item.position].items.push(item);
    });

    Object.keys(posMap).forEach(posKey => {
      const position = posMap[posKey];
      const { parentEl, items } = position;

      items.sort((a, b) => a.order - b.order);
      items.forEach(item => {
        parentEl.appendChild(item.element);
      });
    });
  }

  private _attachElements(view3D: View3D) {
    view3D.rootEl.appendChild(this._wrapperEl);
  }

  private _removeElements(view3D: View3D) {
    const wrapper = this._wrapperEl;

    if (wrapper.parentElement === view3D.rootEl) {
      view3D.rootEl.removeChild(wrapper);
    }
  }

  private _updateModelParams = () => {
    this._items.forEach(item => {
      // Re-enable control items for new View3D instance
      item.disable();
      item.enable();
    });
  };

  private _createDefaultItems(view3D: View3D): ControlBarItem[] {
    const items: ControlBarItem[] = [];

    if (this.progressBar) {
      items.push(new AnimationProgressBar(view3D, this, getObjectOption(this.progressBar)));
    }

    if (this.playButton) {
      items.push(new PlayButton(view3D, this, getObjectOption(this.playButton)));
    }

    return items;
  }
}

export default ControlBar;
