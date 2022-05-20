/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../../View3D";
import * as BROWSER from "../../const/browser";
import { DEFAULT_CLASS } from "../../const/external";
import { toDegree, toRadian } from "../../utils";

/**
 * Common options for {@link Annotation}s
 */
export interface AnnotationOptions {
  element: HTMLElement | null;
  focus: number[];
  focusDuration: number;
  baseFov: number;
  baseDistance: number | null;
  aspect: number;
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
  protected _baseFov: number;
  protected _baseDistance: number | null;
  protected _aspect: number;
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
   * Base aspect value that annotation is referencing
   * @type {number}
   */
  public get aspect() { return this._aspect; }

  public set baseFov(val: number) { this._baseFov = val; }
  public set baseDistance(val: number | null) { this._baseDistance = val; }
  public set aspect(val: number) { this._aspect = val; }

  /** */
  public constructor(view3D: View3D, {
    element = null,
    focus = [],
    focusDuration = 1000,
    baseFov = 45,
    baseDistance = null,
    aspect = 1
  }: Partial<AnnotationOptions> = {}) {
    this._view3D = view3D;
    this._element = element;
    this._focus = focus;
    this._focusDuration = focusDuration;
    this._baseFov = baseFov;
    this._baseDistance = baseDistance;
    this._aspect = aspect;
    this._enabled = false;
    this._tooltipSize = new THREE.Vector2();

    if (element) {
      element.draggable = false;
      this.resize();
    }
  }

  public abstract focus(): Promise<void>;
  public abstract unfocus(): void;
  public abstract toJSON(): Record<string, any>;

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

  protected _getFocus(): THREE.Vector3 {
    const view3D = this._view3D;
    const focusVector = new THREE.Vector3().fromArray(this._focus);

    const currentDistance = view3D.camera.baseDistance;
    const currentSize = view3D.renderer.size;
    const currentAspect = Math.max(currentSize.height / currentSize.width, 1);

    const aspect = this._aspect;
    const baseFov = this._baseFov;
    const baseDistance = this._baseDistance ?? currentDistance;

    const aspectRatio = currentAspect / aspect;
    const targetRenderHeight = aspectRatio * baseDistance * Math.tan(toRadian((baseFov - focusVector.z) / 2));
    const targetFov = 2 * toDegree(Math.atan(targetRenderHeight / currentDistance));

    // zoom value
    focusVector.z = view3D.camera.baseFov - targetFov;

    return focusVector;
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
