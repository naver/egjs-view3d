/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import Component from "@egjs/component";
import type { XRSystem } from "webxr";

import View3D from "../View3D";
import Animation from "../core/Animation";
import WebARControl from "../control/ar/WebARControl";
import { ARSwirlControlOptions } from "../control/ar/ARSwirlControl";
import { ARTranslateControlOptions } from "../control/ar/ARTranslateControl";
import { ARScaleControlOptions } from "../control/ar/ARScaleControl";
import { FloorIndicatorOptions } from "../control/ar/ui/FloorIndicator";
import { DeadzoneCheckerOptions } from "../control/ar/common/DeadzoneChecker";
import * as DEFAULT from "../const/default";
import * as XR from "../const/xr";
import { EVENTS } from "../const/external";
import { getNullableElement, merge } from "../utils";
import { XRRenderContext } from "../type/xr";

import ARSession from "./ARSession";
import ARScene from "./ARScene";
import DOMOverlay from "./features/DOMOverlay";
import HitTest from "./features/HitTest";

declare global {
  interface Navigator { xr: XRSystem }
}

/**
 * Options for WebARSession
 * @interface
 * @property {object} [features={}] You can set additional features(see {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit XRSessionInit}) with this option. "hit-test" and "dom-overlay" will always be used.
 * @property {HTMLElement|string|null} [overlayRoot=null] If this value is set, dom-overlay feature will be automatically added for this session. And this value will be used as dom-overlay's root element. You can set either HTMLElement or query selector for that element.
 * @property {HTMLElement|string|null} [loadingEl=null] This will be used for loading indicator element, which will automatically invisible after placing 3D model by setting `visibility: hidden`. This element must be placed under `overlayRoot`. You can set either HTMLElement or query selector for that element.
 */
export interface WebARSessionOptions {
  features: typeof XR.EMPTY_FEATURES;
  vertical: boolean;
  overlayRoot: HTMLElement | string | null;
  loadingEl: HTMLElement | string | null;
  rotate: Partial<ARSwirlControlOptions>;
  translate: Partial<ARTranslateControlOptions>;
  scale: Partial<ARScaleControlOptions>;
  floorIndicator: Partial<FloorIndicatorOptions>;
  deadzone: Partial<DeadzoneCheckerOptions>;
}

/**
 * @interface
 */
export interface WebARSessionEvents {
  /**
   * Emitted when session is started.
   * @event WebARSession#start
   * @type {void}
   */
  start: void;
  /**
   * Emitted when session is ended.
   * @event WebARSession#end
   * @type {void}
   */
  end: void;
  /**
   * Emitted when model is placed.
   * @event WebARSession#modelPlaced
   * @type {void}
   */
  modelPlaced: void;
}

/**
 * WebXR based abstract AR session class
 * @fires WebARSession#start
 * @fires WebARSession#end
 * @fires WebARSession#modelPlaced
 */
class WebARSession extends Component<{
  start: void;
  end: void;
  modelPlaced: void;
}> implements ARSession {
  // Options
  // As those values are referenced only while entering the session, so I'm leaving this values public
  public features: WebARSessionOptions["features"];
  public vertical: WebARSessionOptions["vertical"];
  public overlayRoot: WebARSessionOptions["overlayRoot"];

  // Internal Components
  private _view3D: View3D;
  private _arScene: ARScene;
  private _control: WebARControl;
  private _hitTest: HitTest;
  private _domOverlay: DOMOverlay;

  // Internal States
  private _modelPlaced: boolean;

  /**
   * {@link ARControl} instance of this session
   * @type ARFloorControl
   */
  public get control() { return this._control; }

  /**
   * Create new instance of WebARSession
   * @param {View3D} view3D Instance of the View3D
   * @param {object} [options={}] Options
   * @param {object} [options.features={}] You can set additional features(see {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit XRSessionInit}) with this option.
   * @param {HTMLElement|string|null} [options.overlayRoot=null] If this value is set, dom-overlay feature will be automatically added for this session. And this value will be used as dom-overlay's root element. You can set either HTMLElement or query selector for that element.
   * @param {HTMLElement|string|null} [options.loadingEl=null] This will be used for loading indicator element, which will automatically invisible after placing 3D model by setting `visibility: hidden`. This element must be placed under `overlayRoot`. You can set either HTMLElement or query selector for that element.
   * @param {boolean} [options.forceOverlay=false] Whether to apply `dom-overlay` feature as required. If set to false, `dom-overlay` will be optional feature.
   */
  public constructor(view3D: View3D, {
    features = XR.EMPTY_FEATURES,
    vertical = false,
    overlayRoot = DEFAULT.NULL_ELEMENT,
    loadingEl = DEFAULT.NULL_ELEMENT,
    rotate = {},
    translate = {},
    scale = {}
  }: Partial<WebARSessionOptions> = {}) {
    super();

    this._view3D = view3D;

    // Init internal states
    this._modelPlaced = false;

    // Bind options
    this.features = features;
    this.vertical = vertical;
    this.overlayRoot = overlayRoot;

    // Create internal components
    this._arScene = new ARScene();
    this._control = new WebARControl(view3D, this._arScene, { rotate, translate, scale });
    this._hitTest = new HitTest();
    this._domOverlay = new DOMOverlay();
  }

  /**
   * Return availability of this session
   * @returns {Promise<boolean>} A Promise that resolves availability of this session(boolean).
   */
  public isAvailable() {
    if (
      !XR.WEBXR_SUPPORTED()
      || !this._hitTest.isAvailable()
      || !this._domOverlay.isAvailable()
    ) return Promise.resolve(false);

    return navigator.xr.isSessionSupported(XR.SESSION.AR);
  }

  /**
   * Enter session
   * @param view3D Instance of the View3D
   * @returns {Promise}
   */
  public async enter() {
    const view3D = this._view3D;
    const arScene = this._arScene;
    const renderer = view3D.renderer;
    const threeRenderer = renderer.threeRenderer;
    const model = view3D.model!;
    const control = this._control;
    const hitTest = this._hitTest;
    const features = this._getAllXRFeatures();

    // Enable xr
    threeRenderer.xr.enabled = true;

    const session = await navigator.xr.requestSession(XR.SESSION.AR, features) as unknown as THREE.XRSession;

    // Cache original values
    const originalPixelRatio = threeRenderer.getPixelRatio();

    threeRenderer.setPixelRatio(1);
    threeRenderer.xr.setReferenceSpaceType(XR.REFERENCE_SPACE.LOCAL);
    await threeRenderer.xr.setSession(session);

    arScene.init(view3D);

    // this._domOverlay?.showLoading();
    hitTest.init(session);

    const onSessionEnd = async () => {
      // this._domOverlay?.hideLoading();
      control.destroy(session);
      arScene.destroy(view3D);

      // Restore original values
      threeRenderer.setPixelRatio(originalPixelRatio);

      // Restore render loop
      renderer.stopAnimationLoop();
      renderer.setAnimationLoop(renderer.defaultRenderLoop);

      this.trigger("end");
    };

    session.addEventListener("end", onSessionEnd, { once: true });

    // Set XR session render loop
    const arClock = new THREE.Clock();
    arClock.start();

    renderer.stopAnimationLoop();
    threeRenderer.xr.setAnimationLoop((_, frame?: THREE.XRFrame) => {
      const xrCamArray = (threeRenderer.xr.getCamera(new THREE.PerspectiveCamera()) as THREE.ArrayCamera);
      const delta = arClock.getDelta();

      if (xrCamArray.cameras.length <= 0) return;

      const xrCam = xrCamArray.cameras[0];

      const referenceSpace = threeRenderer.xr.getReferenceSpace()!;
      const glLayer = session.renderState.baseLayer;

      const size = {
        width: glLayer?.framebufferWidth ?? 1,
        height: glLayer?.framebufferHeight ?? 1
      };
      const ctx: XRRenderContext = {
        view3D,
        scene: arScene,
        model,
        session,
        delta,
        frame,
        referenceSpace,
        xrCam,
        size
      };

      view3D.trigger(EVENTS.BEFORE_RENDER, { target: view3D });

      if (!this._modelPlaced) {
        this._initModelPosition(ctx);
      } else {
        control.update(ctx);
        view3D.animator.update(delta);
        threeRenderer.render(arScene.root, xrCam);
      }
    });

    this.trigger("start");
  }

  /**
   * Exit this session
   */
  public async exit() {
    const session = this._view3D.renderer.threeRenderer.xr.getSession();

    return session?.end();
  }

  private _getAllXRFeatures() {
    const userFeatures = this.features;

    return merge(
      {},
      this._domOverlay.getFeatures(getNullableElement(this.overlayRoot)),
      this._hitTest.getFeatures(),
      userFeatures
    );
  }

  private _initModelPosition(ctx: XRRenderContext) {
    const {
      model,
      frame,
      session,
      size,
      referenceSpace
    } = ctx;
    const arScene = this._arScene;
    const hitTest = this._hitTest;

    // Make sure the model is loaded
    if (!hitTest.ready || !model) return;

    const control = this._control;
    const hitTestResults = hitTest.getResults(frame);

    if (hitTestResults.length <= 0) return;

    const hit = hitTestResults[0];
    const hitPose = hit.getPose(referenceSpace);

    if (!hitPose) return;

    const hitMatrix = new THREE.Matrix4().fromArray(hitPose.transform.matrix);

    // If transformed coords space's y axis is not facing up, don't use it.
    if (hitMatrix.elements[5] < 0.75) return;

    const hitPosition = new THREE.Vector3().setFromMatrixPosition(hitMatrix);

    // Reset rotation & update position
    arScene.setRootPosition(hitPosition);
    arScene.showModel();

    // Don't need hit-test anymore
    hitTest.destroy();

    // this._domOverlay?.hideLoading();
    this._modelPlaced = true;
    this.trigger("modelPlaced");

    // Show scale up animation
    const scaleUpAnimation = new Animation({ context: session });

    scaleUpAnimation.on("progress", evt => {
      arScene.setModelScale(evt.easedProgress);
    });
    scaleUpAnimation.on("finish", () => {
      arScene.setModelScale(1);
      void control.init({
        session,
        size,
        initialFloorPos: hitPosition
      });
    });
    scaleUpAnimation.start();
  }
}

export default WebARSession;
