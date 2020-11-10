/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import ARSwirlControl, { ARSwirlControlOption } from "../common/ARSwirlControl";
import ARSwipeControl, { ARSwipeControlOption } from "../common/ARSwipeControl";
import { XRRenderContext, XRContext, XRInputs } from "~/types/internal";
import * as TOUCH from "~/consts/touch";
import ARControl from "../common/ARControl";

/**
 * Options for {@link ARHoverRotateControl}
 * @category Controls-AR
 * @interface
 * @property {ARSwirlControlOption} swirl Options for {@link ARSwirlControl}
 * @property {ARSwipeControlOption} swipe Options for {@link ARSwipeControl}
 */
export interface ARHoverRotateControlOption {
  swirl: ARSwirlControlOption;
  swipe: ARSwipeControlOption;
}

/**
 * Model's yaw(local y-axis rotation) controller which works on AR(WebXR) mode.
 * @category Controls-AR
 */
class ARHoverRotateControl implements ARControl {
  /**
   * Current rotation value
   */
  public readonly rotation = new THREE.Quaternion();

  // Internal States
  private _zRotationControl: ARSwirlControl;
  private _xyRotationControl: ARSwipeControl;
  private _activatedControl: ARSwirlControl | ARSwipeControl | null;

  /**
   * Whether this control is enabled or not.
   * This returns true when either one finger control or two finger control is enabled.
   * @readonly
   */
  public get enabled() { return this._zRotationControl.enabled || this._xyRotationControl.enabled; }

  /**
   * {@link ARSwirlControl} of this control.
   */
  public get swirl() { return this._zRotationControl; }
  /**
   * {@link ARSwipeControl} of this control.
   */
  public get swipe() { return this._xyRotationControl; }

  /**
   * Create new instance of ARRotateControl
   * @param {ARHoverRotateControlOption} options Options
   */
  constructor(options: Partial<ARHoverRotateControlOption> = {}) {
    this._zRotationControl = new ARSwirlControl(options.swirl);
    this._xyRotationControl = new ARSwipeControl(options.swipe);
    this._activatedControl = null;
  }

  public init(ctx: XRRenderContext) {
    const initialRotation = ctx.view3d.model!.scene.quaternion;

    this.rotation.copy(initialRotation);
    this._zRotationControl.init(ctx);
    this._xyRotationControl.init(ctx);
  }

  public destroy(ctx: XRContext) {
    this._zRotationControl.destroy(ctx);
    this._xyRotationControl.destroy(ctx);
  }

  /**
   * Enable this control
   */
  public enable() {
    this._zRotationControl.enable();
    this._xyRotationControl.enable();
  }

  /**
   * Disable this control
   */
  public disable() {
    this._zRotationControl.disable();
    this._xyRotationControl.disable();
  }

  public activate(ctx: XRRenderContext, gesture: TOUCH.GESTURE) {
    const zRotationControl = this._zRotationControl;
    const xyRotationControl = this._xyRotationControl;

    if (gesture & TOUCH.GESTURE.ONE_FINGER) {
      zRotationControl.activate(ctx, gesture);
      zRotationControl.updateRotation(this.rotation);
      this._activatedControl = zRotationControl;
    } else if (gesture & TOUCH.GESTURE.TWO_FINGER) {
      xyRotationControl.activate(ctx, gesture);
      xyRotationControl.updateRotation(this.rotation);
      this._activatedControl = xyRotationControl;
    }
  }

  public deactivate() {
    this._zRotationControl.deactivate();
    this._xyRotationControl.deactivate();
  }

  public process(ctx: XRRenderContext, inputs: XRInputs) {
    this._zRotationControl.process(ctx, inputs);
    this._xyRotationControl.process(ctx, inputs);
  }

  public setInitialPos(coords: THREE.Vector2[]) {
    this._zRotationControl.setInitialPos(coords);
    this._xyRotationControl.setInitialPos(coords);
  }

  public update(ctx: XRRenderContext, deltaTime: number) {
    if (this._activatedControl) {
      this._activatedControl.update(ctx, deltaTime);
      this.rotation.copy(this._activatedControl.rotation);
    }
  }

  public updateRotateAxis({ view3d, xrCam }: XRRenderContext) {
    const model = view3d.model!;
    const zRotateAxis = new THREE.Vector3();
    const horizontalRotateAxis = new THREE.Vector3();
    const verticalRotateAxis = new THREE.Vector3();

    const cameraRotation = new THREE.Quaternion().setFromRotationMatrix(xrCam.matrixWorld);

    const cameraBasis = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1),
    ].map(axis => axis.applyQuaternion(cameraRotation).normalize());

    const modelBasis = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1),
    ].map(axis => axis.applyQuaternion(model.scene.quaternion));

    // Always use z-rotation
    zRotateAxis.copy(modelBasis[2]);
    // Use more appropriate one between x/y axis
    horizontalRotateAxis.copy(modelBasis[1]);
    verticalRotateAxis.copy(modelBasis[0]);

    // If it's facing other direction, negate it to face correct direction
    if (zRotateAxis.dot(cameraBasis[2]) < 0) {
      zRotateAxis.negate();
    }
    if (horizontalRotateAxis.dot(cameraBasis[1]) > 0) {
      horizontalRotateAxis.negate();
    }
    if (verticalRotateAxis.dot(cameraBasis[0]) > 0) {
      verticalRotateAxis.negate();
    }

    this._zRotationControl.updateAxis(zRotateAxis);
    this._xyRotationControl.updateAxis(horizontalRotateAxis, verticalRotateAxis);
  }
}

export default ARHoverRotateControl;
