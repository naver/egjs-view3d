/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../../View3D";
import * as BROWSER from "../../const/browser";
import { DEFAULT_CLASS } from "../../const/external";

/**
 * Common options for {@link Annotation}s
 */
export interface AnnotationOptions {
  element: HTMLElement | null;
  focus: number[];
  focusDuration: number;
}

/**
 * Annotation(Hotspot) base class
 */
abstract class Annotation {
  /**
   * 3D position of the annotation
   * @type {THREE.Vector3}
   * @readonly
   */
  public abstract position: THREE.Vector3;

  protected _view3D: View3D;
  protected _element: HTMLElement | null;
  protected _focus: number[];
  protected _focusDuration: number;
  protected _enabled: boolean;
  protected _tooltipSize: THREE.Vector2;

  /**
   * Element of the annotation
   * @type {HTMLElement}
   * @readonly
   */
  public get element() { return this._element; }
  /**
   * Whether this annotation is renderable in the screen
   * @type {boolean}
   * @readonly
   */
  public get renderable() { return !!this._element; }

  /** */
  public constructor(view3D: View3D, {
    element = null,
    focus = [],
    focusDuration = 1000
  }: Partial<AnnotationOptions> = {}) {
    this._view3D = view3D;
    this._element = element;
    this._focus = focus;
    this._focusDuration = focusDuration;
    this._enabled = false;
    this._tooltipSize = new THREE.Vector2();

    if (element) {
      element.draggable = false;
      this.resize();
    }
  }

  public abstract focus(): Promise<void>;
  public abstract unfocus(): void;

  public destroy() {
    const wrapper = this._view3D.annotation.wrapper;
    const element = this._element;

    this.disableEvents();

    if (element && element.parentElement === wrapper) {
      wrapper.removeChild(element);
    }
  }

  public resize() {
    const el = this._element;

    if (!el) return;

    const tooltip = el.querySelector(`.${DEFAULT_CLASS.ANNOTATION_TOOLTIP}`) as HTMLElement;
    if (tooltip) {
      this._tooltipSize.set(
        tooltip.offsetWidth,
        tooltip.offsetHeight,
      );
    }
  }

  public render({
    screenPos,
    screenSize,
    renderOrder
  }: {
    position: THREE.Vector3;
    screenPos: THREE.Vector2;
    screenSize: THREE.Vector2;
    renderOrder: number;
  }) {
    const el = this._element;
    const tooltipSize = this._tooltipSize;

    if (!el) return;

    el.style.zIndex = `${renderOrder + 1}`;
    el.style.transform = `translate(-50%, -50%) translate(${screenPos.x}px, ${screenPos.y}px)`;

    if (screenPos.y + tooltipSize.y > screenSize.y) {
      el.classList.add(DEFAULT_CLASS.ANNOTATION_FLIP_Y);
    } else {
      el.classList.remove(DEFAULT_CLASS.ANNOTATION_FLIP_Y);
    }

    if (screenPos.x + tooltipSize.x > screenSize.x) {
      el.classList.add(DEFAULT_CLASS.ANNOTATION_FLIP_X);
    } else {
      el.classList.remove(DEFAULT_CLASS.ANNOTATION_FLIP_X);
    }
  }

  public setOpacity(opacity: number) {
    const el = this._element;

    if (!el) return;

    el.style.opacity = `${opacity}`;
  }

  public enableEvents() {
    const el = this._element;

    if (!el || this._enabled) return;

    el.addEventListener(BROWSER.EVENTS.CLICK, this._onClick);
    el.addEventListener(BROWSER.EVENTS.WHEEL, this._onWheel);
    this._enabled = true;
  }

  public disableEvents() {
    const el = this._element;

    if (!el || !this._enabled) return;

    el.removeEventListener(BROWSER.EVENTS.CLICK, this._onClick);
    el.removeEventListener(BROWSER.EVENTS.WHEEL, this._onWheel);
    this._enabled = false;
  }

  protected _onClick = () => {
    void this.focus();
  };

  protected _onWheel = (evt: WheelEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
  };
}

export default Annotation;
