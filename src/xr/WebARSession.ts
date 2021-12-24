/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import type { XRSystem } from "webxr";

import View3D from "../View3D";
import Animation from "../core/Animation";
import WebARControl, { WebARControlOptions } from "../control/ar/WebARControl";
import * as DEFAULT from "../const/default";
import * as XR from "../const/xr";
import { AR_SESSION_TYPE, AUTO, EVENTS } from "../const/external";
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
 * @property {object} [features={}] You can set additional features(see {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit XRSessionInit}) with this option. `hit-test` and `dom-overlay` will always be used.
 * @property {boolean} [vertical=false] If set to true, model will be placed at the wall instead of floor. (※ This will disable the rotate control)
 * @property {HTMLElement|string|null} [overlayRoot=null] If this value is set, that element will be used as a root element for WebXR session using the `dom-overlay` feature. If set to `null`, new element will be created and appended to `.view3d-wrapper` element and will be used as a root.
 */
export interface WebARSessionOptions extends WebARControlOptions {
  features: typeof XR.EMPTY_FEATURES;
  vertical: boolean;
  overlayRoot: HTMLElement | string | null;
}

/**
 * WebXR based abstract AR session class
 */
class WebARSession implements ARSession {
  /**
   * Return availability of this session
   * @returns {Promise<boolean>} A Promise that resolves availability of this session(boolean).
   */
  public static isAvailable() {
    if (
      !XR.WEBXR_SUPPORTED()
      || !HitTest.isAvailable()
      || !DOMOverlay.isAvailable()
    ) return Promise.resolve(false);

    return navigator.xr.isSessionSupported(XR.SESSION.AR);
  }

  public static readonly type = AR_SESSION_TYPE.WEBXR;

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

  public get arScene() { return this._arScene; }
  public get hitTest() { return this._hitTest; }
  public get domOverlay() { return this._domOverlay; }

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
    overlayRoot = null,
    rotate = true,
    translate = true,
    scale = true,
    ring = {},
    deadzone = {},
    initialScale = AUTO
  }: Partial<WebARSessionOptions> = {}) {
    this._view3D = view3D;

    // Init internal states
    this._modelPlaced = false;

    // Bind options
    this.features = features;
    this.vertical = vertical;
    this.overlayRoot = overlayRoot;

    // Create internal components
    this._arScene = new ARScene();
    this._control = new WebARControl(view3D, this._arScene, {
      rotate,
      translate,
      scale,
      ring,
      deadzone,
      initialScale
    });
    this._hitTest = new HitTest();
    this._domOverlay = new DOMOverlay();
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
    const control = this._control;
    const hitTest = this._hitTest;
    const domOverlay = this._domOverlay;
    const vertical = this.vertical;
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
    hitTest.init(session);

    const onSessionEnd = async () => {
      const overlayEl = domOverlay.root;

      control.destroy(session);
      arScene.destroy(view3D);

      if (!this.overlayRoot && overlayEl) {
        view3D.rootEl.removeChild(overlayEl);
      }
      domOverlay.destroy();

      // Restore original values
      threeRenderer.setPixelRatio(originalPixelRatio);

      // Restore render loop
      renderer.stopAnimationLoop();
      renderer.setAnimationLoop(renderer.defaultRenderLoop);

      view3D.trigger(EVENTS.AR_END, { target: view3D, session: this });
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
        session,
        delta,
        frame,
        vertical,
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

    view3D.trigger(EVENTS.AR_START, { target: view3D, session: this });
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
    const overlayRoot = getNullableElement(this.overlayRoot) ?? this._createARRootElement();

    return merge(
      {},
      this._domOverlay.getFeatures(overlayRoot),
      this._hitTest.getFeatures(),
      userFeatures
    );
  }

  private _initModelPosition(ctx: XRRenderContext) {
    const {
      frame,
      session,
      size,
      vertical,
      referenceSpace
    } = ctx;
    const view3D = this._view3D;
    const model = view3D.model;
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

    // If transformed coords space's y axis is not facing the correct direction, don't use it.
    if (
      (!vertical && hitMatrix.elements[5] < 0.75)
      || (vertical && (hitMatrix.elements[5] >= 0.25 || hitMatrix.elements[5] <= -0.25))
    ) return;

    const hitPosition = new THREE.Vector3().setFromMatrixPosition(hitMatrix);
    const hitRotation = new THREE.Quaternion();

    if (vertical) {
      const globalUp = new THREE.Vector3(0, 1, 0);
      const hitOrientation = hitPose.transform.orientation;
      const wallNormal = globalUp.clone()
        .applyQuaternion(new THREE.Quaternion(hitOrientation.x, hitOrientation.y, hitOrientation.z, hitOrientation.w))
        .normalize();
      const wallX = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), wallNormal);

      const wallMatrix = new THREE.Matrix4().makeBasis(wallX, globalUp, wallNormal);
      const wallEuler = new THREE.Euler(0, 0, 0, "YXZ").setFromRotationMatrix(wallMatrix);

      wallEuler.z = 0;
      wallEuler.x = Math.PI / 2;

      hitRotation.setFromEuler(wallEuler);
      arScene.setWallRotation(hitRotation);
    }

    // Reset rotation & update position
    arScene.updateModelRootPosition(model, vertical);
    arScene.setRootPosition(hitPosition);
    arScene.showModel();

    // Don't need hit-test anymore, as we're having new one in WebARControl
    hitTest.destroy();

    // this._domOverlay?.hideLoading();
    this._modelPlaced = true;
    view3D.trigger(EVENTS.AR_MODEL_PLACED, { target: view3D, session: this, model });

    void control.init({
      model,
      vertical,
      session,
      size,
      hitPosition,
      hitRotation
    });

    const initialScale = control.scale.scale;

    // Show scale up animation
    const scaleUpAnimation = new Animation({
      context: session,
      duration: 1000
    });

    scaleUpAnimation.on("progress", evt => {
      arScene.setModelScale(evt.easedProgress * initialScale);
    });

    scaleUpAnimation.on("finish", () => {
      arScene.setModelScale(initialScale);
      control.enable(session);
    });

    scaleUpAnimation.start();
  }

  private _createARRootElement(): HTMLElement {
    const view3D = this._view3D;
    const root = document.createElement("div");

    root.classList.add(DEFAULT.AR_OVERLAY_CLASS);
    view3D.rootEl.appendChild(root);
    view3D.once(EVENTS.AR_END, () => {
      view3D.rootEl.removeChild(root);
    });

    return root;
  }
}

export default WebARSession;
