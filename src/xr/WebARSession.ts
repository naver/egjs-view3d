/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import Component from "@egjs/component";

import View3D from "../View3D";
import { getElement, merge } from "../utils";
import * as DEFAULT from "../consts/default";
import * as XR from "../consts/xr";
import { XRContext, XRRenderContext } from "../type/internal";

import XRSession from "./XRSession";
import DOMOverlay from "./features/DOMOverlay";

declare global {
  interface Navigator { xr: any }
}

/**
 * Options for WebARSession
 * @category XR
 * @interface
 * @property {object} [features={}] You can set additional features(see {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit XRSessionInit}) with this option.
 * @property {number} [maxModelSize=Infinity] If model's size is too big to show on AR, you can restrict it's size with this option. Model with size bigger than this value will clamped to this value.
 * @property {HTMLElement|string|null} [overlayRoot=null] If this value is set, dom-overlay feature will be automatically added for this session. And this value will be used as dom-overlay's root element. You can set either HTMLElement or query selector for that element.
 * @property {HTMLElement|string|null} [loadingEl=null] This will be used for loading indicator element, which will automatically invisible after placing 3D model by setting `visibility: hidden`. This element must be placed under `overlayRoot`. You can set either HTMLElement or query selector for that element.
 * @property {boolean} [forceOverlay=false] Whether to apply `dom-overlay` feature as required. If set to false, `dom-overlay` will be optional feature.
 */
export interface WebARSessionOption {
  features: typeof XR.EMPTY_FEATURES;
  maxModelSize: number;
  overlayRoot: HTMLElement | string | null;
  loadingEl: HTMLElement | string | null;
  forceOverlay: boolean;
}

/**
 * WebXR based abstract AR session class
 * @category XR
 * @fires WebARSession#start
 * @fires WebARSession#end
 * @fires WebARSession#canPlace
 * @fires WebARSession#modelPlaced
 */
abstract class WebARSession extends Component<{
  start: void;
  end: void;
  canPlace: void;
  modelPlaced: void;
}> implements XRSession {
  /**
   * Whether it's webxr-based session or not
   * @type true
   */
  public readonly isWebXRSession = true;

  protected _session: any = null;
  protected _domOverlay: DOMOverlay | null = null;
  // As "dom-overlay" is an optional feature by default,
  // user can choose whether to show XR only when this feature is available
  protected _forceOverlay: boolean;
  protected _features: typeof XR.EMPTY_FEATURES;
  protected _maxModelSize: number;

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSession XRSession} of this session
   * This value is only available after calling enter
   */
  public get session() { return this._session; }
  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit XRSessionInit} object for this session.
   */
  public get features() { return this._features; }

  /**
   * Emitted when session is started.
   * @event start
   * @category XR
   * @memberof WebARSession
   * @type void
   */
  /**
   * Emitted when session is ended.
   * @event end
   * @category XR
   * @memberof WebARSession
   * @type void
   */
  /**
   * Emitted when model can be placed on the space.
   * @event canPlace
   * @category XR
   * @memberof WebARSession
   * @type void
   */
  /**
   * Emitted when model is placed.
   * @event modelPlaced
   * @category XR
   * @memberof WebARSession
   * @type void
   */

  /**
   * Create new instance of WebARSession
   * @param {object} [options={}] Options
   * @param {object} [options.features={}] You can set additional features(see {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit XRSessionInit}) with this option.
   * @param {number} [options.maxModelSize=Infinity] If model's size is too big to show on AR, you can restrict it's size with this option. Model with size bigger than this value will clamped to this value.
   * @param {HTMLElement|string|null} [options.overlayRoot=null] If this value is set, dom-overlay feature will be automatically added for this session. And this value will be used as dom-overlay's root element. You can set either HTMLElement or query selector for that element.
   * @param {HTMLElement|string|null} [options.loadingEl=null] This will be used for loading indicator element, which will automatically invisible after placing 3D model by setting `visibility: hidden`. This element must be placed under `overlayRoot`. You can set either HTMLElement or query selector for that element.
   * @param {boolean} [options.forceOverlay=false] Whether to apply `dom-overlay` feature as required. If set to false, `dom-overlay` will be optional feature.
   */
  public constructor({
    features: userFeatures = XR.EMPTY_FEATURES, // https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit
    maxModelSize = Infinity,
    overlayRoot = DEFAULT.NULL_ELEMENT,
    loadingEl = DEFAULT.NULL_ELEMENT,
    forceOverlay = false
  }: Partial<WebARSessionOption> = {}) {
    super();
    const overlayEl = getElement(overlayRoot);

    const features: Array<typeof XR.EMPTY_FEATURES> = [];
    if (overlayEl) {
      this._domOverlay = new DOMOverlay({
        root: overlayEl,
        loadingEl: getElement(loadingEl, overlayEl)
      });
      features.push(this._domOverlay.features);
    }

    this._features = merge({}, ...features, userFeatures);
    this._maxModelSize = maxModelSize;
    this._forceOverlay = forceOverlay;
  }

  protected abstract _beforeRender(ctx: XRRenderContext): void;

  /**
   * Return availability of this session
   * @returns {Promise} A Promise that resolves availability of this session(boolean).
   */
  public isAvailable() {
    const domOverlay = this._domOverlay;

    if (!XR.WEBXR_SUPPORTED || !XR.HIT_TEST_SUPPORTED) return Promise.resolve(false);
    if (this._forceOverlay) {
      if (domOverlay && !domOverlay.isAvailable()) return Promise.resolve(false);
    }

    return navigator.xr.isSessionSupported(XR.SESSION.AR);
  }

  /**
   * Enter session
   * @param view3d Instance of the View3D
   * @returns {Promise}
   */
  public enter(view3d: View3D) {
    // Model not loaded yet
    if (!view3d.model) return Promise.reject("3D Model is not loaded");

    const model = view3d.model;

    return navigator.xr.requestSession(XR.SESSION.AR, this._features)
      .then(session => {
        const renderer = view3d.renderer;
        const threeRenderer = renderer.threeRenderer;
        const xrContext = {
          view3d,
          model,
          session
        };

        // Cache original values
        const originalMatrix = model.scene.matrix.clone();
        const originalModelSize = model.size;
        const originalBackground = view3d.scene.root.background;

        const arModelSize = Math.min(model.originalSize, this._maxModelSize);
        model.size = arModelSize;
        model.moveToOrigin();
        view3d.scene.setBackground(null);

        // Cache original model rotation
        threeRenderer.xr.setReferenceSpaceType(XR.REFERENCE_SPACE.LOCAL);
        threeRenderer.xr.setSession(session);
        threeRenderer.setPixelRatio(1);

        this.onStart(xrContext);
        session.addEventListener("end", () => {
          this.onEnd(xrContext);

          // Restore original values
          model.scene.matrix.copy(originalMatrix);
          model.scene.matrix.decompose(model.scene.position, model.scene.quaternion, model.scene.scale);
          model.size = originalModelSize;
          model.moveToOrigin();

          view3d.scene.update(model);
          view3d.scene.setBackground(originalBackground);

          // Restore renderer values
          threeRenderer.xr.setSession(null);
          threeRenderer.setPixelRatio(window.devicePixelRatio);

          // Restore render loop
          renderer.stopAnimationLoop();
          renderer.setAnimationLoop(view3d.renderLoop);
        }, { once: true });

        // Set XR session render loop
        renderer.stopAnimationLoop();
        renderer.setAnimationLoop((delta, frame) => {
          const xrCam = threeRenderer.xr.getCamera(new THREE.PerspectiveCamera()) as THREE.PerspectiveCamera;
          const referenceSpace = threeRenderer.xr.getReferenceSpace();
          const glLayer = session.renderState.baseLayer;
          const size = {
            width: glLayer.framebufferWidth,
            height: glLayer.framebufferHeight
          };
          const renderContext: XRRenderContext = {
            ...xrContext,
            delta,
            frame,
            referenceSpace,
            xrCam,
            size
          };

          this._beforeRender(renderContext);
          view3d.renderLoop(delta);
        });
      });
  }

  /**
   * Exit this session
   * @param view3d Instance of the View3D
   */
  public exit(view3d: View3D) {
    const session = view3d.renderer.threeRenderer.xr.getSession();
    session.end();
  }

  public onStart(ctx: XRContext) {
    this._session = ctx.session;
    this._domOverlay?.showLoading();
    this.trigger("start");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onEnd(ctx: XRContext) {
    this._session = null;
    this._domOverlay?.hideLoading();
    this.trigger("end");
  }
}

export default WebARSession;
