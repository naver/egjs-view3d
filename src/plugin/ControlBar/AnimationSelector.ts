/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../../View3D";
import { EVENTS } from "../../const/external";
import * as BROWSER from "../../const/browser";

import ControlBar from "./ControlBar";
import ControlBarItem from "./ControlBarItem";

/**
 * @param {string} [position="top"] Position inside the control bar
 * @param {number} [order=9999] Order within the current position, items will be sorted in ascending order
 */
export interface AnimationSelectorOptions {
  position: ControlBarItem["position"];
  order: ControlBarItem["order"];
}

/**
 * Show animation selector, use with ControlBar
 */
class AnimationSelector implements ControlBarItem {
  public position: AnimationSelectorOptions["position"];
  public order: AnimationSelectorOptions["order"];

  public get element() { return this._rootEl; }
  public get enabled() { return this._enabled; }

  private _view3D: View3D;
  private _controlBar: ControlBar;
  private _rootEl: HTMLElement;
  private _nameEl: HTMLElement;
  private _itemListEl: HTMLElement;
  private _enabled: boolean;

  /** */
  public constructor(view3D: View3D, controlBar: ControlBar, {
    position = ControlBar.POSITION.LEFT,
    order = 9999
  }: Partial<AnimationSelectorOptions> = {}) {
    this.position = position;
    this.order = order;

    this._view3D = view3D;
    this._controlBar = controlBar;
    this._createElements();
    this._enabled = false;
  }

  /**
   * Enable control item
   */
  public enable() {
    if (this._enabled) return;

    if (this._view3D.initialized) {
      this._updateAnimations();
    }

    this._view3D.on(EVENTS.MODEL_CHANGE, this._updateAnimations);
    this._nameEl.addEventListener(BROWSER.EVENTS.CLICK, this._toggleList);
    this._enabled = true;
  }

  /**
   * Disable control item
   */
  public disable() {
    if (!this._enabled) return;

    this._view3D.off(EVENTS.MODEL_CHANGE, this._updateAnimations);
    this._view3D.rootEl.removeEventListener(BROWSER.EVENTS.CLICK, this._hideList);
    this._nameEl.removeEventListener(BROWSER.EVENTS.CLICK, this._toggleList);
    this._enabled = false;
  }

  private _createElements() {
    const controlBar = this._controlBar;
    const root = document.createElement(BROWSER.EL_DIV);
    const name = document.createElement(BROWSER.EL_DIV);
    const itemList = document.createElement(BROWSER.EL_DIV);
    const className = {
      ...controlBar.className,
      ...ControlBar.DEFAULT_CLASS
    };

    root.classList.add(className.CONTROLS_ITEM);
    root.classList.add(className.DISABLED);
    name.classList.add(className.ANIMATION_NAME);
    itemList.classList.add(className.ANIMATION_LIST);

    root.appendChild(name);
    root.appendChild(itemList);

    this._rootEl = root;
    this._nameEl = name;
    this._itemListEl = itemList;
  }

  private _updateAnimations = () => {
    const view3D = this._view3D;
    const controlBar = this._controlBar;
    const animator = view3D.animator;

    const root = this._rootEl;
    const name = this._nameEl;
    const itemList = this._itemListEl;
    const animations = animator.clips;
    const className = {
      ...controlBar.className,
      ...ControlBar.DEFAULT_CLASS
    };

    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }

    if (animations.length <= 0) {
      root.classList.add(className.DISABLED);
      return;
    }

    root.classList.remove(className.DISABLED);

    const elements = animations.map(animation => {
      const el = document.createElement(BROWSER.EL_DIV);
      el.classList.add(className.ANIMATION_ITEM);
      el.innerHTML = animation.name;

      return el;
    });

    const selectAnimation = (animation: THREE.AnimationClip, idx: number) => {
      elements[idx].classList.add(className.ANIMATION_SELECTED);
      name.innerHTML = animation.name;
    };

    animations.forEach((animation, idx) => {
      const el = elements[idx];

      if (idx === animator.activeAnimationIndex) {
        selectAnimation(animation, idx);
      }

      el.addEventListener(BROWSER.EVENTS.CLICK, evt => {
        const wasPaused = animator.paused;
        animator.play(idx);
        if (wasPaused) {
          animator.pause();
        }

        elements.forEach(element => {
          element.classList.remove(className.ANIMATION_SELECTED);
        });
        selectAnimation(animation, idx);
        this._hideList();

        evt.stopPropagation();
      });

      itemList.appendChild(el);
    });
  };

  private _toggleList = (evt: MouseEvent) => {
    const controlBar = this._controlBar;
    const itemList = this._itemListEl;
    const className = {
      ...controlBar.className,
      ...ControlBar.DEFAULT_CLASS
    };

    itemList.classList.toggle(className.VISIBLE);

    if (itemList.classList.contains(className.VISIBLE)) {
      this._view3D.rootEl.addEventListener(BROWSER.EVENTS.CLICK, this._hideList);
    }

    evt.stopPropagation();
  };

  private _hideList = () => {
    const controlBar = this._controlBar;
    const itemList = this._itemListEl;
    const className = {
      ...controlBar.className,
      ...ControlBar.DEFAULT_CLASS
    };

    if (itemList.classList.contains(className.VISIBLE)) {
      itemList.classList.remove(className.VISIBLE);
    }
  };
}

export default AnimationSelector;
