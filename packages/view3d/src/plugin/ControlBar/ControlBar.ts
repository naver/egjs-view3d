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
import AnimationSelector, { AnimationSelectorOptions } from "./AnimationSelector";
import FullscreenButton, { FullscreenButtonOptions } from "./FullscreenButton";
import NavigationGizmo, { NavigationGizmoOptions } from "./NavigationGizmo";
import CameraResetButton, { CameraResetButtonOptions } from "./CameraResetButton";

/**
 * @param {number} [initialDelay=3000] Intiial delay before the control bar hides (ms)
 * @param {number} [delay=0] Delay time before hiding the control bar after mouse leave (ms)
 */
interface AutoHideOptions {
  initialDelay: number;
  delay: number;
}

/**
 * @param {boolean | AutoHideOptions} [autoHide=true] Show control bar only on mouse over
 * @param {ControlBar.DEFAULT_CLASS} [className={}] Override default class names
 * @param {boolean | AnimationProgressBarOptions} [progressBar=true] Show animation progress ba
 * @param {boolean | PlayButtonOptions} [playButton=true] Show animation play / pause button
 * @param {boolean | AnimationSelectorOptions} [animationSelector=true] Show animation selector
 * @param {boolean | FullscreenButtonOptions} [fullscreenButton=true] Show fullscreen button
 * @param {boolean | NavigationGizmoOptions} [navigationGizmo=true] Show navigation gizmo
 * @param {boolean | CameraResetButtonOptions} [cameraResetButton=true] Show camera reset button
 */
export interface ControlBarOptions {
  autoHide: boolean | AutoHideOptions;
  className: Partial<{ -readonly [key in keyof typeof ControlBar.DEFAULT_CLASS]: string }>;
  progressBar: boolean | Partial<AnimationProgressBarOptions>;
  playButton: boolean | Partial<PlayButtonOptions>;
  animationSelector: boolean | Partial<AnimationSelectorOptions>;
  fullscreenButton: boolean | Partial<FullscreenButtonOptions>;
  navigationGizmo: boolean | Partial<NavigationGizmoOptions>;
  cameraResetButton: boolean | Partial<CameraResetButtonOptions>;
}

/**
 * Add a bar at the bottom of the canvas that can control animation and other things
 */
class ControlBar implements View3DPlugin {
  /**
   * Default class names that ControlBar uses
   * @type {object}
   * @property {"view3d-control-bar"} ROOT A class name for wrapper element
   * @property {"visible"} VISIBLE A class name for visible elements
   * @property {"disabled"} DISABLED A class name for disabled elements
   * @property {"view3d-controls-background"} CONTROLS_BG A class name for background element
   * @property {"view3d-side-controls"} CONTROLS_SIDE A class name for controls wrapper element that includes both left & right controls
   * @property {"view3d-top-controls"} CONTROLS_TOP A class name for controls wrapper element that is placed on the top inside the control bar
   * @property {"view3d-left-controls"} CONTROLS_LEFT A class name for controls wrapper element that is placed on the left inside the control bar
   * @property {"view3d-right-controls"} CONTROLS_RIGHT A class name for controls wrapper element that is placed on the right inside the control bar
   * @property {"view3d-control-item"} CONTROLS_ITEM A class name for control item elements
   * @property {"view3d-progress-bar"} PROGRESS_ROOT A class name for root element of the progress bar
   * @property {"view3d-progress-track"} PROGRESS_TRACK A class name for progress track element of the progress bar
   * @property {"view3d-progress-thumb"} PROGRESS_THUMB A class name for thumb element of the progress bar
   * @property {"view3d-progress-filler"} PROGRESS_FILLER A class name for progress filler element of the progress bar
   * @property {"view3d-animation-name"} ANIMATION_NAME A class name for animation name element of the animation selector
   * @property {"view3d-animation-list"} ANIMATION_LIST A class name for animation list element of the animation selector
   * @property {"view3d-animation-item"} ANIMATION_ITEM A class name for animation list item element of the animation selector
   * @property {"selected"} ANIMATION_SELECTED A class name for selected animation list item element of the animation selector
   * @property {"view3d-gizmo"} GIZMO_ROOT A class name for root element of the navigation gizmo
   * @property {"view3d-gizmo-axis"} GIZMO_AXIS A class name for axis button element of the navigation gizmo
   */
  public static readonly DEFAULT_CLASS = {
    ROOT: "view3d-control-bar",
    VISIBLE: "visible",
    DISABLED: "disabled",
    CONTROLS_BG: "view3d-controls-background",
    CONTROLS_SIDE: "view3d-side-controls",
    CONTROLS_TOP: "view3d-top-controls",
    CONTROLS_LEFT: "view3d-left-controls",
    CONTROLS_RIGHT: "view3d-right-controls",
    CONTROLS_ITEM: "view3d-control-item",
    PROGRESS_ROOT: "view3d-progress-bar",
    PROGRESS_TRACK: "view3d-progress-track",
    PROGRESS_THUMB: "view3d-progress-thumb",
    PROGRESS_FILLER: "view3d-progress-filler",
    ANIMATION_NAME: "view3d-animation-name",
    ANIMATION_LIST: "view3d-animation-list",
    ANIMATION_ITEM: "view3d-animation-item",
    ANIMATION_SELECTED: "selected",
    GIZMO_ROOT: "view3d-gizmo",
    GIZMO_AXIS: "view3d-gizmo-axis"
  } as const;

  /**
   * Position constant
   * @type {object}
   * @property {"top"} TOP
   * @property {"left"} LEFT
   * @property {"right"} RIGHT
   */
  public static readonly POSITION = {
    TOP: "top",
    LEFT: "left",
    RIGHT: "right"
  } as const;

  public autoHide: ControlBarOptions["autoHide"];
  public className: ControlBarOptions["className"];
  public progressBar: ControlBarOptions["progressBar"];
  public playButton: ControlBarOptions["playButton"];
  public animationSelector: ControlBarOptions["animationSelector"];
  public fullscreenButton: ControlBarOptions["fullscreenButton"];
  public navigationGizmo: ControlBarOptions["navigationGizmo"];
  public cameraResetButton: ControlBarOptions["cameraResetButton"];

  public get rootEl() { return this._rootEl; }
  public get items() { return this._items; }

  private _rootEl: HTMLElement;
  private _topControlsWrapper: HTMLElement;
  private _leftControlsWrapper: HTMLElement;
  private _rightControlsWrapper: HTMLElement;
  private _items: ControlBarItem[];
  private _autoHideTimer: number;

  /** */
  public constructor({
    autoHide = true,
    className = {},
    progressBar = true,
    playButton = true,
    animationSelector = true,
    fullscreenButton = true,
    navigationGizmo = true,
    cameraResetButton = true
  }: Partial<ControlBarOptions> = {}) {
    this.autoHide = autoHide;
    this.className = className;
    this.progressBar = progressBar;
    this.playButton = playButton;
    this.animationSelector = animationSelector;
    this.fullscreenButton = fullscreenButton;
    this.navigationGizmo = navigationGizmo;
    this.cameraResetButton = cameraResetButton;

    this._items = [];
    this._initElements();
    this._autoHideTimer = -1;
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

    this.show();
    this._setupAutoHide(view3D);
  }

  public teardown(view3D: View3D) {
    const root = view3D.rootEl;
    root.removeEventListener(BROWSER.EVENTS.POINTER_ENTER, this.show);
    root.removeEventListener(BROWSER.EVENTS.POINTER_LEAVE, this._hideAfterDelay);

    this._removeElements(view3D);
    this._items.forEach(item => {
      item.disable();
    });
    this._items = [];

    view3D.off(EVENTS.MODEL_CHANGE, this._updateModelParams);
    window.clearTimeout(this._autoHideTimer);
  }

  /**
   * Show control bar
   */
  public show = () => {
    const root = this._rootEl;
    const className = {
      ...ControlBar.DEFAULT_CLASS,
      ...this.className
    };

    root.classList.add(className.VISIBLE);
  };

  /**
   * Hide control bar
   */
  public hide = () => {
    const wrapper = this._rootEl;
    const className = {
      ...ControlBar.DEFAULT_CLASS,
      ...this.className
    };

    wrapper.classList.remove(className.VISIBLE);
  };

  private _initElements() {
    const className = {
      ...ControlBar.DEFAULT_CLASS,
      ...this.className
    };
    const rootEl = document.createElement(BROWSER.EL_DIV);
    rootEl.classList.add(className.ROOT);
    this._rootEl = rootEl;

    const bgEl = document.createElement(BROWSER.EL_DIV);
    bgEl.classList.add(className.CONTROLS_BG);
    rootEl.appendChild(bgEl);

    const topControlsWrapper = document.createElement(BROWSER.EL_DIV);
    const sideControlsWrapper = document.createElement(BROWSER.EL_DIV);
    const leftControlsWrapper = document.createElement(BROWSER.EL_DIV);
    const rightControlsWrapper = document.createElement(BROWSER.EL_DIV);

    topControlsWrapper.classList.add(className.CONTROLS_TOP);
    sideControlsWrapper.classList.add(className.CONTROLS_SIDE);
    leftControlsWrapper.classList.add(className.CONTROLS_LEFT);
    rightControlsWrapper.classList.add(className.CONTROLS_RIGHT);

    rootEl.appendChild(topControlsWrapper);
    sideControlsWrapper.appendChild(leftControlsWrapper);
    sideControlsWrapper.appendChild(rightControlsWrapper);
    rootEl.appendChild(sideControlsWrapper);

    this._topControlsWrapper = topControlsWrapper;
    this._leftControlsWrapper = leftControlsWrapper;
    this._rightControlsWrapper = rightControlsWrapper;
  }

  private _addItemElements() {
    const topControlsWrapper = this._topControlsWrapper;
    const leftControlsWrapper = this._leftControlsWrapper;
    const rightControlsWrapper = this._rightControlsWrapper;

    const positionedItems = this._items.filter(item => item.position && item.order != null);
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

    positionedItems.forEach(item => {
      posMap[item.position!].items.push(item);
    });

    Object.keys(posMap).forEach(posKey => {
      const position = posMap[posKey];
      const { parentEl, items } = position;

      items.sort((a, b) => a.order! - b.order!);
      items.forEach(item => {
        parentEl.appendChild(item.element);
      });
    });
  }

  private _attachElements(view3D: View3D) {
    view3D.rootEl.appendChild(this._rootEl);
  }

  private _removeElements(view3D: View3D) {
    const wrapper = this._rootEl;
    const topControlsWrapper = this._topControlsWrapper;
    const leftControlsWrapper = this._leftControlsWrapper;
    const rightControlsWrapper = this._rightControlsWrapper;

    [topControlsWrapper, leftControlsWrapper, rightControlsWrapper].forEach(itemWrapper => {
      while (itemWrapper.firstChild) {
        itemWrapper.removeChild(itemWrapper.firstChild);
      }
    });

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

  private _setupAutoHide(view3D: View3D) {
    if (!this.autoHide) return;

    const {
      initialDelay = 3000
    } = getObjectOption(this.autoHide);
    const root = view3D.rootEl;

    this._autoHideTimer = window.setTimeout(() => {
      this.hide();
    }, initialDelay);

    root.addEventListener(BROWSER.EVENTS.POINTER_ENTER, this.show);
    root.addEventListener(BROWSER.EVENTS.POINTER_LEAVE, this._hideAfterDelay);
  }

  private _hideAfterDelay = () => {
    const {
      delay = 0
    } = getObjectOption(this.autoHide);

    if (this._autoHideTimer) {
      window.clearTimeout(this._autoHideTimer);
      this._autoHideTimer = -1;
    }

    if (delay <= 0) {
      this.hide();
    } else {
      this._autoHideTimer = window.setTimeout(this.hide, delay);
    }
  };

  private _createDefaultItems(view3D: View3D): ControlBarItem[] {
    const items: ControlBarItem[] = [];

    if (this.progressBar) {
      items.push(new AnimationProgressBar(view3D, this, getObjectOption(this.progressBar)));
    }

    if (this.playButton) {
      items.push(new PlayButton(view3D, this, getObjectOption(this.playButton)));
    }

    if (this.animationSelector) {
      items.push(new AnimationSelector(view3D, this, getObjectOption(this.animationSelector)));
    }

    if (this.cameraResetButton) {
      items.push(new CameraResetButton(view3D, this, getObjectOption(this.cameraResetButton)));
    }

    if (this.fullscreenButton) {
      items.push(new FullscreenButton(view3D, this, getObjectOption(this.fullscreenButton)));
    }

    if (this.navigationGizmo) {
      items.push(new NavigationGizmo(view3D, this, getObjectOption(this.navigationGizmo)));
    }

    return items;
  }
}

export default ControlBar;
