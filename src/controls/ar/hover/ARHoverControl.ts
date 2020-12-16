/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import ARHoverRotateControl, { ARHoverRotateControlOption } from "./ARHoverRotateControl";
import ARHoverTranslateControl, { ARHoverTranslateControlOption } from "./ARHoverTranslateControl";
import ARScaleControl, { ARScaleControlOption } from "../common/ARScaleControl";
import DeadzoneChecker from "../common/DeadzoneChecker";
import * as TOUCH from "~/consts/touch";
import { XRRenderContext, XRContext } from "~/types/internal";

/**
 * Options for the {@link ARHoverControl}
 * @category Controls-AR
 * @interface
 * @property {ARHoverRotateControlOption} rotate Options for {@link ARHoverRotateControl}
 * @property {ARHoverTranslateControlOption} translate Options for {@link ARHoverTranslateControl}
 * @property {ARScaleControlOption} scale Options for {@link ARScaleControl}
 * @property {DeadzoneCheckerOption} deadzone Options for {@link DeadzoneChecker}
 */
export interface ARHoverControlOption {
  rotate: Partial<ARHoverRotateControlOption>;
  translate: Partial<ARHoverTranslateControlOption>;
  scale: Partial<ARScaleControlOption>;
}

/**
 * AR control for {@link HoverARSession}
 * @category Controls-AR
 */
class ARHoverControl {
  private _enabled = true;
  private _initialized = false;
  private _modelHit = false;
  private _deadzoneChecker: DeadzoneChecker;
  private _rotateControl: ARHoverRotateControl;
  private _translateControl: ARHoverTranslateControl;
  private _scaleControl: ARScaleControl;

  /**
   * Return whether this control is enabled or not
   */
  public get enabled() { return this._enabled; }
  /**
   * {@link ARHoverRotateControlOption} in this control
   */
  public get rotate() { return this._rotateControl; }
  /**
   * {@link ARHoverTranslateControlOption} in this control
   */
  public get translate() { return this._translateControl; }
  /**
   * {@link ARScaleControl} in this control
   */
  public get scale() { return this._scaleControl; }
  public get controls() {
    return [this._rotateControl, this._translateControl, this._scaleControl];
  }

  /**
   * Create new instance of ARHoverControl
   * @param {ARHoverControlOption} options Options
   */
  constructor(options: Partial<ARHoverControlOption> = {}) {
    this._rotateControl = new ARHoverRotateControl(options.rotate);
    this._translateControl = new ARHoverTranslateControl(options.translate);
    this._scaleControl = new ARScaleControl(options.scale);
    this._deadzoneChecker = new DeadzoneChecker();
  }

  public init(ctx: XRRenderContext) {
    const { size } = ctx;

    this.controls.forEach(control => control.init(ctx));
    this._deadzoneChecker.setAspect(size.height / size.width);

    this._initialized = true;
  }

  /**
   * Destroy this control and deactivate it
   * @param view3d Instance of the {@link View3D}
   */
  public destroy(ctx: XRContext) {
    if (!this._initialized) return;

    this.deactivate();
    this.controls.forEach(control => control.destroy(ctx));

    this._initialized = false;
  }

  public deactivate() {
    this._modelHit = false;
    this._deadzoneChecker.cleanup();
    this.controls.forEach(control => control.deactivate());
  }

  /**
   * Enable this control
   */
  public enable() {
    this._enabled = true;
  }

  /**
   * Disable this control
   */
  public disable() {
    this._enabled = false;
    this.deactivate();
  }

  public update(ctx: XRRenderContext) {
    const { session } = ctx;

    if (!this._initialized) return;

    const deadzoneChecker = this._deadzoneChecker;
    const inputSources = session.inputSources;

    if (deadzoneChecker.inDeadzone) {
      this._checkDeadzone(ctx, inputSources);
    } else {
      this._processInput(ctx, inputSources);
    }
    this._updateControls(ctx);
  }

  public onSelectStart = (ctx: XRRenderContext) => {
    const { view3d, session, frame, referenceSpace, xrCam } = ctx;
    if (!this._enabled) return;

    const deadzoneChecker = this._deadzoneChecker;
    const rotateControl = this._rotateControl;
    const translateControl = this._translateControl;
    const scaleControl = this._scaleControl;

    // Update rotation axis
    if (rotateControl.enabled) {
      rotateControl.updateRotateAxis(ctx);
    }

    // Update deadzone testing gestures
    if (rotateControl.swirl.enabled) {
      deadzoneChecker.addTestingGestures(TOUCH.GESTURE.ONE_FINGER);
    }
    if (rotateControl.swipe.enabled) {
      deadzoneChecker.addTestingGestures(TOUCH.GESTURE.TWO_FINGER);
    }
    if (translateControl.enabled) {
      deadzoneChecker.addTestingGestures(TOUCH.GESTURE.ONE_FINGER);
    }
    if (scaleControl.enabled) {
      deadzoneChecker.addTestingGestures(TOUCH.GESTURE.PINCH);
    }

    const coords = this._inputSourceToVector(session.inputSources);
    deadzoneChecker.applyScreenAspect(coords);
    deadzoneChecker.setFirstInput(coords);

    if (coords.length === 1) {
      // Check finger is on the model
      const modelBbox = view3d.model!.bbox;

      const targetRayPose = frame.getPose(session.inputSources[0].targetRaySpace, referenceSpace);
      const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);

      const fingerDir = new THREE.Vector3().copy(targetRayPose.transform.position).sub(camPos).normalize();
      const fingerRay = new THREE.Ray(camPos, fingerDir);
      const intersection = fingerRay.intersectBox(modelBbox, new THREE.Vector3());

      if (intersection) {
        // Touch point intersected with model
        this._modelHit = true;
      }
    }
  }

  public onSelectEnd = () => {
    this.deactivate();
  }

  private _checkDeadzone(ctx: XRRenderContext, inputSources: any[]) {
    const coords = this._inputSourceToVector(inputSources);
    const gesture = this._deadzoneChecker.check(coords.map(coord => coord.clone()));
    const rotateControl = this._rotateControl;
    const translateControl = this._translateControl;
    const scaleControl = this._scaleControl;

    if (gesture === TOUCH.GESTURE.NONE) return;

    switch (gesture) {
      case TOUCH.GESTURE.ONE_FINGER_HORIZONTAL:
      case TOUCH.GESTURE.ONE_FINGER_VERTICAL:
        if (this._modelHit) {
          translateControl.activate(ctx, gesture);
          translateControl.setInitialPos(coords);
        } else {
          rotateControl.activate(ctx, gesture);
          rotateControl.setInitialPos(coords);
        }
        break;
      case TOUCH.GESTURE.TWO_FINGER_HORIZONTAL:
      case TOUCH.GESTURE.TWO_FINGER_VERTICAL:
        rotateControl.activate(ctx, gesture);
        rotateControl.setInitialPos(coords);
        break;
      case TOUCH.GESTURE.PINCH:
        scaleControl.activate(ctx, gesture);
        scaleControl.setInitialPos(coords);
        break;
    }
  }

  private _processInput(ctx: XRRenderContext, inputSources: any[]) {
    const coords = this._inputSourceToVector(inputSources);

    this.controls.forEach(control => control.process(ctx, { coords, inputSources }));
  }

  private _updateControls(ctx: XRRenderContext) {
    const { view3d, model, delta } = ctx;
    const deltaMilisec = delta * 1000;

    this.controls.forEach(control => control.update(ctx, deltaMilisec));

    model.scene.updateMatrix();
    view3d.scene.update(model);
  }

  private _inputSourceToVector(inputSources: any[]) {
    return Array.from(inputSources).map(inputSource => {
      const axes = inputSource.gamepad.axes;
      return new THREE.Vector2(axes[0], -axes[1]);
    });
  }
}

export default ARHoverControl;
