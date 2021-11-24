/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import ARWallControl, { ARWallControlOption } from "../controls/ar/wall/ARWallControl";
import Animation from "../core/Animation";
import { merge } from "../utils";
import * as XR from "../consts/xr";
import { XRRenderContext, XRContext } from "../type/internal";

import WebARSession, { WebARSessionOption } from "./WebARSession";
import HitTest from "./features/HitTest";

/**
 * Options for {@link WallARSession}.
 * This type is intersection of {@link WebARSessionOption} and {@link ARWallControlOption}
 * @category XR
 * @interface
 * @extends WebARSessionOption
 * @extends ARWallControlOption
 */
interface WallARSessionOption extends WebARSessionOption, ARWallControlOption {}

/**
 * AR session which places model on the wall
 * @category XR
 * @fires WebARSession#start
 * @fires WebARSession#end
 * @fires WebARSession#canPlace
 * @fires WebARSession#modelPlaced
 */
class WallARSession extends WebARSession {
  private _options: Partial<WallARSessionOption>;
  private _control: ARWallControl | null;
  private _renderContext: XRRenderContext | null;
  private _modelPlaced: boolean;
  private _hitTest: HitTest;

  /**
   * {@link ARWallControl} instance of this session
   * @type ARWallControl | null
   */
  public get control() { return this._control; }

  /**
   * Create new instance of WallARSession
   * @param {WallARSessionOption} [options={}] Options
   */
  public constructor(options: Partial<WallARSessionOption> = {}) {
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

    this._control = new ARWallControl(this._options);

    view3d.scene.hide();
    this._hitTest.init(session);
  };

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
    const {view3d, frame, session} = ctx;
    const model = view3d.model;
    const hitTest = this._hitTest;

    // Make sure the model is loaded
    if (!hitTest.ready || !model) return;

    const control = this._control;
    const referenceSpace = view3d.renderer.threeRenderer.xr.getReferenceSpace();
    const hitTestResults = hitTest.getResults(frame);

    if (hitTestResults.length <= 0) return;

    const hit = hitTestResults[0];
    const hitPose = hit.getPose(referenceSpace);
    const hitMatrix = new THREE.Matrix4().fromArray(hitPose.transform.matrix);

    // If transformed coord space's y axis is facing up or down, don't use it.
    if (hitMatrix.elements[5] >= 0.25 || hitMatrix.elements[5] <= -0.25) return;

    const modelRoot = model.scene;
    const hitRotation = new THREE.Quaternion().copy(hitPose.transform.orientation);
    const hitPosition = new THREE.Vector3().setFromMatrixPosition(hitMatrix);
    const modelZOffset = -model.initialBbox.min.z * modelRoot.scale.z;
    const modelPosition = hitPosition.clone().setZ(hitPosition.z + modelZOffset);

    const worldYAxis = new THREE.Vector3(0, 1, 0);
    /*
     * ^ wallU
     * |
     * ⨀---> wallV
     * wallNormal
     */
    const wallNormal = new THREE.Vector3(0, 1, 0).applyQuaternion(hitRotation).normalize();
    const wallU = new THREE.Vector3().crossVectors(worldYAxis, wallNormal);
    const wallV = wallNormal.clone().applyAxisAngle(wallU, -Math.PI / 2);

    // Reconstruct wall matrix with prev Y(normal) direction as Z axis
    const wallMatrix = new THREE.Matrix4().makeBasis(wallU, wallV, wallNormal);
    const wallRotation = new THREE.Quaternion().setFromRotationMatrix(wallMatrix);
    const modelRotation = model.scene.quaternion.clone()
      .premultiply(wallRotation);

    // Update rotation & position
    modelRoot.quaternion.copy(modelRotation);
    modelRoot.position.copy(modelPosition);
    modelRoot.updateMatrix();

    view3d.scene.update(model);
    view3d.scene.show();

    // Don't need it
    hitTest.destroy();

    session.addEventListener(XR.EVENTS.SELECT_START, this._onSelectStart);
    session.addEventListener(XR.EVENTS.SELECT_END, this._onSelectEnd);

    this._domOverlay?.hideLoading();
    this._modelPlaced = true;

    // Show scale up animation
    const originalModelScale = model.scene.scale.clone();
    const scaleUpAnimation = new Animation({ context: session });

    scaleUpAnimation.on("progress", evt => {
      const newScale = originalModelScale.clone().multiplyScalar(evt.easedProgress);
      model.scene.scale.copy(newScale);
    });
    scaleUpAnimation.on("finish", () => {
      model.scene.scale.copy(originalModelScale);
      control!.init(ctx, {
        hitPosition,
        hitRotation,
        wallRotation,
        modelPosition
      });
    });
    scaleUpAnimation.start();
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

export default WallARSession;
