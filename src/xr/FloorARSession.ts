/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import WebARSession, { WebARSessionOption } from "./WebARSession";
import HitTest from "./features/HitTest";
import Animation from "~/core/Animation";
import ARFloorControl, { ARFloorControlOption } from "~/controls/ar/floor/ARFloorControl";
import { merge } from "~/utils";
import * as XR from "~/consts/xr";
import { XRRenderContext, XRContext } from "~/type/internal";

/**
 * Options for {@link FloorARSession}.
 * This type is intersection of {@link WebARSessionOption} and {@link ARControlOption}
 * @interface
 * @extends WebARSessionOption
 * @extends ARFloorControlOption
 */
interface FloorARSessionOption extends WebARSessionOption, ARFloorControlOption {}

/**
 * WebXR based AR session which puts model on the detected floor.
 * @category XR
 * @fires WebARSession#start
 * @fires WebARSession#end
 * @fires WebARSession#canPlace
 * @fires WebARSession#modelPlaced
 */
class FloorARSession extends WebARSession {
  private _options: Partial<FloorARSessionOption>;
  private _control: ARFloorControl | null;
  private _renderContext: XRRenderContext | null;
  private _modelPlaced: boolean;
  private _hitTest: HitTest;

  /**
   * {@link ARControl} instance of this session
   * @type ARFloorControl | null
   */
  public get control() { return this._control; }

  /**
   * Create new instance of FloorARSession
   * @param {FloorARSessionOption} options Options
   */
  constructor(options: Partial<FloorARSessionOption> = {}) {
    super(options);

    this._control = null;
    this._renderContext = null;
    this._modelPlaced = false;

    this._hitTest = new HitTest();

    this._features = merge(this._features, this._hitTest.features);
    this._options = options;
  }

  public onStart = (ctx: XRContext) => {
    const { view3d, session } = ctx;

    super.onStart(ctx);

    this._control = new ARFloorControl(this._options);

    view3d.scene.hide();
    this._hitTest.init(session);
  }

  public onEnd = (ctx: XRContext) => {
    const { view3d, session } = ctx;

    super.onEnd(ctx);

    this._renderContext = null;
    this._modelPlaced = false;

    session.removeEventListener(XR.EVENTS.SELECT_START, this._onSelectStart);
    session.removeEventListener(XR.EVENTS.SELECT_END, this._onSelectEnd);

    this._hitTest.destroy();
    this._control!.destroy(ctx);
    this._control = null;

    view3d.scene.show();
  }

  protected _beforeRender = (ctx: XRRenderContext) => {
    this._renderContext = ctx;
    if (!this._modelPlaced) {
      this._initModelPosition(ctx);
    } else {
      this._control!.update(ctx);
    }
  }

  private _initModelPosition(ctx: XRRenderContext) {
    const {view3d, frame, session} = ctx;
    const model = view3d.model;
    const hitTest = this._hitTest;

    // Make sure the model is loaded
    if (!hitTest.ready || !model) return;

    const control = this._control!;
    const referenceSpace = view3d.renderer.threeRenderer.xr.getReferenceSpace();
    const hitTestResults = hitTest.getResults(frame);

    if (hitTestResults.length <= 0) return;

    const hit = hitTestResults[0];
    const hitMatrix = new THREE.Matrix4().fromArray(hit.getPose(referenceSpace).transform.matrix);

    // If transformed coords space's y axis is not facing up, don't use it.
    if (hitMatrix.elements[5] < 0.75) return;

    const modelRoot = model.scene;
    const hitPosition = new THREE.Vector3().setFromMatrixPosition(hitMatrix);

    // Reset rotation & update position
    modelRoot.quaternion.set(0, 0, 0, 1);
    modelRoot.position.copy(hitPosition);

    modelRoot.position.setY(modelRoot.position.y - model.bbox.min.y);
    modelRoot.updateMatrix();

    view3d.scene.update(model);
    view3d.scene.show();
    this.emit("canPlace");

    // Don't need it
    hitTest.destroy();

    session.addEventListener(XR.EVENTS.SELECT_START, this._onSelectStart);
    session.addEventListener(XR.EVENTS.SELECT_END, this._onSelectEnd);

    this._domOverlay?.hideLoading();
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
      control.init(ctx, hitPosition);
    });
    scaleUpAnimation.start();
  }

  private _onSelectStart = (e) => {
    this._control!.onSelectStart({
      ...this._renderContext!,
      frame: e.frame,
    });
  }

  private _onSelectEnd = () => {
    this._control!.onSelectEnd();
  }
}

export default FloorARSession;
