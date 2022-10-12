/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../View3D";
import * as BROWSER from "../const/browser";
import { DEFAULT_CLASS, EVENTS } from "../const/external";
import { toDegree, toRadian } from "../utils";

/**
 * Common options for {@link Annotation}s
 * @interface
 */
export interface AnnotationOptions {
  element: HTMLElement | null;
  focus: number[];
  focusDuration: number;
  focusOffset: number[];
  baseFov: number;
  baseDistance: number | null;
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
  protected _focusOffset: number[];
  protected _baseFov: number;
  protected _baseDistance: number | null;
  protected _enabled: boolean;
  protected _hidden: boolean;
  protected _focusing: boolean;
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
  /**
   * Whether this annotation is focused
   * @type {boolean}
   * @readonly
   */
  public get focusing() { return this._focusing; }
  /**
   * An array of values in order of [yaw, pitch, zoom]
   * @type {number[]}
   * @readonly
   */
  public get focusPose() { return this._focus; }
  /**
   * Duration of the focus animation
   * @type {number}
   */
  public get focusDuration() { return this._focusDuration; }
  /**
   * Offset vector from the pivot when focused
   * @type {number[]}
   * @readonly
   */
  public get focusOffset() { return this._focusOffset; }
  /**
   * Base fov value that annotation is referencing
   * @type {number}
   */
  public get baseFov() { return this._baseFov; }
  /**
   * Base dsitance value that annotation is referencing
   * @type {number | null}
   */
  public get baseDistance() { return this._baseDistance; }
  /**
   * Whether the annotation is hidden and not rendered
   * @type {boolean}
   * @readonly
   */
  public get hidden() { return this._hidden; }

  public set focusDuration(val: number) { this._focusDuration = val; }
  public set baseFov(val: number) { this._baseFov = val; }
  public set baseDistance(val: number | null) { this._baseDistance = val; }

  /**
   * @param {View3D} view3D Instance of the view3D
   * @param {AnnotationOptions} [options={}] Options
   */
  public constructor(view3D: View3D, {
    element = null,
    focus = [],
    focusDuration = 1000,
    focusOffset = [],
    baseFov = 45,
    baseDistance = null
  }: Partial<AnnotationOptions> = {}) {
    this._view3D = view3D;
    this._element = element;
    this._focus = focus;
    this._focusDuration = focusDuration;
    this._focusOffset = focusOffset;
    this._baseFov = baseFov;
    this._baseDistance = baseDistance;
    this._enabled = false;
    this._hidden = false;
    this._focusing = false;
    this._tooltipSize = new THREE.Vector2();

    if (element) {
      element.draggable = false;
      this.resize();
    }
  }

  /**
   * Focus camera to this annotation
   * This will add a class `selected` to this annotation element.
   * @method Annotation#focus
   */
  public abstract focus(): Promise<void>;
  /**
   * Unfocus camera.
   * This will remove a class `selected` to this annotation element.
   * To reset camera to the original position, use {@link Camera#reset}
   * @method Annotation#unfocus
   */
  public abstract unfocus(): void;
  /**
   * Serialize anntation data to JSON format.
   * @method Annotation#toJSON
   */
  public abstract toJSON(): Record<string, any>;

  /**
   * Destroy annotation and release all resources.
   */
  public destroy() {
    const wrapper = this._view3D.annotation.wrapper;
    const element = this._element;

    this.disableEvents();

    if (element && element.parentElement === wrapper) {
      wrapper.removeChild(element);
    }
  }

  /**
   * Resize annotation to the current size
   */
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

  /**
   * Render annotation element
   * @param {object} params
   * @internal
   */
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

    if (!el || this._hidden) return;

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

  /**
   * Show annotation.
   * A class "hidden" will be removed from the annotation element.
   */
  public show() {
    const el = this._element;
    this._hidden = false;

    if (el) {
      el.classList.remove(DEFAULT_CLASS.ANNOTATION_HIDDEN);
    }
  }

  /**
   * Hide annotation and prevent it from being rendered.
   * A class "hidden" will be added to the annotation element.
   */
  public hide() {
    const el = this._element;
    this._hidden = true;

    if (el) {
      el.classList.add(DEFAULT_CLASS.ANNOTATION_HIDDEN);
    }
  }

  /**
   * Set opacity of the annotation
   * Opacity is automatically controlled with [annotationBreakpoints](/docs/options/annotation/annotationBreakpoints)
   * @param {number} opacity Opacity to apply, number between 0 and 1
   */
  public setOpacity(opacity: number) {
    const el = this._element;

    if (!el) return;

    el.style.opacity = `${opacity}`;
  }

  /**
   * Add browser event handlers
   * @internal
   */
  public enableEvents() {
    const el = this._element;

    if (!el || this._enabled) return;

    el.addEventListener(BROWSER.EVENTS.CLICK, this._onClick);
    el.addEventListener(BROWSER.EVENTS.WHEEL, this._onWheel);
    this._enabled = true;
  }

  /**
   * Remove browser event handlers
   * @internal
   */
  public disableEvents() {
    const el = this._element;

    if (!el || !this._enabled) return;

    el.removeEventListener(BROWSER.EVENTS.CLICK, this._onClick);
    el.removeEventListener(BROWSER.EVENTS.WHEEL, this._onWheel);
    this._enabled = false;
  }

  public handleUserInput() {
    if (!this._focusing) return;

    const view3D = this._view3D;

    if (view3D.annotationAutoUnfocus) {
      this.unfocus();
    }
  }

  protected _getFocus(): THREE.Vector3 {
    const view3D = this._view3D;
    const focusVector = new THREE.Vector3().fromArray(this._focus);

    const currentDistance = view3D.camera.baseDistance;
    const baseFov = this._baseFov;
    const baseDistance = this._baseDistance ?? currentDistance;

    const targetRenderHeight = baseDistance * Math.tan(toRadian((baseFov - focusVector.z) / 2));
    const targetFov = 2 * toDegree(Math.atan(targetRenderHeight / currentDistance));

    // zoom value
    focusVector.z = view3D.camera.baseFov - targetFov;

    return focusVector;
  }

  protected _getPivotOffset(): THREE.Vector3 {
    const offset = this._focusOffset;
    return new THREE.Vector3(
      offset[0] ?? 0,
      offset[1] ?? 0,
      offset[2] ?? 0
    );
  }

  protected _onClick = () => {
    void this.focus();
  };

  protected _onWheel = (evt: WheelEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  protected _onFocus() {
    const view3D = this._view3D;
    const el = this._element;

    view3D.annotation.list.forEach(annotation => {
      if (annotation._focusing) {
        annotation.unfocus();
      }
    });

    if (el) {
      el.classList.add(DEFAULT_CLASS.ANNOTATION_SELECTED);
    }
    this._focusing = true;
    view3D.trigger(EVENTS.ANNOTATION_FOCUS, {
      type: EVENTS.ANNOTATION_FOCUS,
      target: view3D,
      annotation: this
    });
  }

  protected _onUnfocus() {
    const view3D = this._view3D;
    const el = this._element;

    if (el) {
      el.classList.remove(DEFAULT_CLASS.ANNOTATION_SELECTED);
    }
    this._focusing = false;
    view3D.trigger(EVENTS.ANNOTATION_UNFOCUS, {
      type: EVENTS.ANNOTATION_UNFOCUS,
      target: view3D,
      annotation: this
    });
  }
}

export default Annotation;
