/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import ARHoverControl, { ARHoverControlOption } from "../controls/ar/hover/ARHoverControl";
import Animation from "../core/Animation";
import { clamp } from "../utils";
import * as XR from "../consts/xr";
import { XRRenderContext, XRContext } from "../type/internal";

import WebARSession, { WebARSessionOption } from "./WebARSession";

/**
 * Options for {@link HoverARSession}.
 * This type is intersection of {@link WebARSessionOption} and {@link ARHoverControlOption}
 * @category XR
 * @interface
 * @extends WebARSessionOption
 * @extends ARHoverControlOption
 */
interface HoverARSessionOption extends WebARSessionOption, ARHoverControlOption {
  initialDistance: number;
}

/**
 * WebXR based AR session which puts model at the space front of camera.
 * @category XR
 * @fires WebARSession#start
 * @fires WebARSession#end
 * @fires WebARSession#canPlace
 * @fires WebARSession#modelPlaced
 */
class HoverARSession extends WebARSession {
  private _options: Partial<HoverARSessionOption>;
  private _control: ARHoverControl | null;
  private _renderContext: XRRenderContext | null;
  private _modelPlaced: boolean;

  /**
   * {@link ARControl} instance of this session
   * @type ARHoverControl | null
   */
  public get control() { return this._control; }

  /**
   * Create new instance of HoverARSession
   * @param {HoverARSessionOption} options Options
   */
  public constructor(options: Partial<HoverARSessionOption> = {}) {
    super(options);

    this._control = null;
    this._renderContext = null;
    this._modelPlaced = false;
    this._options = options;
  }

  /**
   * Place model on the current position
   */
  public placeModel() {
    const ctx = this._renderContext;

    // Not ready to place model yet
    if (!ctx || !ctx.view3d.scene.visible || this._modelPlaced) return;

    const { session, view3d } = ctx;
    const modelRoot = view3d.model!.scene;
    const control = this._control;

    session.addEventListener(XR.EVENTS.SELECT_START, this._onSelectStart);
    session.addEventListener(XR.EVENTS.SELECT_END, this._onSelectEnd);

    this._modelPlaced = true;
    this.emit("modelPlaced");

    // Show scale up animation
    const originalModelScale = modelRoot.scale.clone();
    const scaleUpAnimation = new Animation({ context: session });

    scaleUpAnimation.on("progress", evt => {
      const newScale = originalModelScale.clone().multiplyScalar(evt.easedProgress);
      modelRoot.scale.copy(newScale);
    });
    scaleUpAnimation.on("finish", () => {
      modelRoot.scale.copy(originalModelScale);
      control!.init(ctx);
    });
    scaleUpAnimation.start();
  }

  public onStart = (ctx: XRContext) => {
    const { view3d } = ctx;

    super.onStart(ctx);

    this._control = new ARHoverControl(this._options);

    view3d.scene.hide();
  };

  public onEnd = (ctx: XRContext) => {
    const { view3d, session } = ctx;

    super.onEnd(ctx);

    this._renderContext = null;
    this._modelPlaced = false;

    session.removeEventListener(XR.EVENTS.SELECT_START, this._onSelectStart);
    session.removeEventListener(XR.EVENTS.SELECT_END, this._onSelectEnd);

    this._control!.destroy(ctx);
    this._control = null;

    view3d.scene.show();
  };

  protected _beforeRender = (ctx: XRRenderContext) => {
    this._renderContext = ctx;

    if (!this._modelPlaced) {
      this._initModelPosition(ctx);
    } else {
      this._control!.update(ctx);
    }
  };

  private _initModelPosition(ctx: XRRenderContext) {
    const {view3d, xrCam} = ctx;
    const model = view3d.model;

    // Make sure the model exist
    if (!model) return;

    const modelRoot = model.scene;
    const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);
    const camQuat = new THREE.Quaternion().setFromRotationMatrix(xrCam.matrixWorld);
    const viewDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camQuat);

    const modelBbox = model.bbox;
    const bboxDiff = new THREE.Vector3().subVectors(modelBbox.max, modelBbox.min);
    const maxComponent = Math.max(bboxDiff.x, bboxDiff.y, bboxDiff.z);

    // Reset rotation & update position
    modelRoot.position.copy(camPos);
    modelRoot.position.add(viewDir.multiplyScalar(clamp(maxComponent, 0.5, 3))); // Place at 1m from camera
    modelRoot.lookAt(camPos.setY(modelRoot.position.y));
    modelRoot.updateMatrix();

    view3d.scene.update(model);

    if (!view3d.scene.visible) {
      view3d.scene.show();
      this.emit("canPlace");
    }
  }

  private _onSelectStart = (e) => {
    this._control!.onSelectStart({
      ...this._renderContext!,
      frame: e.frame
    });
  };

  private _onSelectEnd = () => {
    this._control!.onSelectEnd();
  };
}

export default HoverARSession;
