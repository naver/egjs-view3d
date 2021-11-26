/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import ARSwirlControl, { ARSwirlControlOption } from "../common/ARSwirlControl";
import ARScaleControl, { ARScaleControlOption } from "../common/ARScaleControl";
import FloorIndicator, { FloorIndicatorOption } from "../ui/FloorIndicator";
import DeadzoneChecker, { DeadzoneCheckerOption } from "../common/DeadzoneChecker";
import * as XR from "../../../consts/xr";
import * as TOUCH from "../../../consts/touch";
import { XRRenderContext, XRContext, XRInputs } from "../../../type/internal";

import ARFloorTranslateControl, { ARFloorTranslateControlOption } from "./ARFloorTranslateControl";


/**
 * Options for the {@link ARFloorControl}
 * @interface
 * @property {ARSwirlControlOptions} rotate Options for {@link ARSwirlControl}
 * @property {ARFloorTranslateControlOption} translate Options for {@link ARFloorTranslateControl}
 * @property {ARScaleControlOption} scale Options for {@link ARScaleControl}
 * @property {FloorIndicatorOption} floorIndicator Options for {@link FloorIndicator}
 * @property {DeadzoneCheckerOption} deadzone Options for {@link DeadzoneChecker}
 */
export interface ARFloorControlOption {
  rotate: Partial<ARSwirlControlOption>;
  translate: Partial<ARFloorTranslateControlOption>;
  scale: Partial<ARScaleControlOption>;
  floorIndicator: Partial<FloorIndicatorOption>;
  deadzone: Partial<DeadzoneCheckerOption>;
}

/**
 * AR control for {@link FloorARSession}
 */
class ARFloorControl {
  private _enabled = true;
  private _initialized = false;
  private _modelHit = false;
  private _hitTestSource: any = null;
  private _deadzoneChecker: DeadzoneChecker;
  private _rotateControl: ARSwirlControl;
  private _translateControl: ARFloorTranslateControl;
  private _scaleControl: ARScaleControl;
  private _floorIndicator: FloorIndicator;

  /**
   * Return whether this control is enabled or not
   */
  public get enabled() { return this._enabled; }
  /**
   * {@link ARSwirlControl} in this control
   */
  public get rotate() { return this._rotateControl; }
  /**
   * {@link ARFloorTranslateControl} in this control
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
   * Create new instance of ARFloorControl
   * @param {ARFloorControlOption} options Options
   */
  public constructor(options: Partial<ARFloorControlOption> = {}) {
    this._rotateControl = new ARSwirlControl({
      showIndicator: false,
      ...options.rotate
    });
    this._translateControl = new ARFloorTranslateControl(options.translate);
    this._scaleControl = new ARScaleControl(options.scale);
    this._floorIndicator = new FloorIndicator(options.floorIndicator);
    this._deadzoneChecker = new DeadzoneChecker(options.deadzone);
  }

  public init(ctx: XRRenderContext, initialFloorPos: THREE.Vector3) {
    const { session, view3d, size } = ctx;

    this.controls.forEach(control => control.init(ctx));
    this._translateControl.initFloorPosition(initialFloorPos);
    this._deadzoneChecker.setAspect(size.height / size.width);

    view3d.scene.add(this._floorIndicator.mesh);

    this._initialized = true;

    session.requestHitTestSourceForTransientInput({ profile: XR.INPUT_PROFILE.TOUCH })
      .then((transientHitTestSource: any) => {
        this._hitTestSource = transientHitTestSource;
      });
  }

  /**
   * Destroy this control and deactivate it
   * @param view3d Instance of the {@link View3D}
   */
  public destroy(ctx: XRContext) {
    if (!this._initialized) return;

    if (this._hitTestSource) {
      this._hitTestSource.cancel();
      this._hitTestSource = null;
    }

    ctx.view3d.scene.remove(this._floorIndicator.mesh);

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
    const { view3d, session, frame } = ctx;
    const hitTestSource = this._hitTestSource;

    if (!hitTestSource || !view3d.model) return;

    const deadzoneChecker = this._deadzoneChecker;
    const inputSources = session.inputSources;
    const hitResults = frame.getHitTestResultsForTransientInput(hitTestSource);
    const coords = this._hitResultToVector(hitResults);
    const xrInputs = {
      coords,
      inputSources,
      hitResults
    };

    if (deadzoneChecker.inDeadzone) {
      this._checkDeadzone(ctx, xrInputs);
    } else {
      this._processInput(ctx, xrInputs);
    }
    this._updateControls(ctx);
  }

  public onSelectStart = (ctx: XRRenderContext) => {
    const { view3d, frame, xrCam, referenceSpace } = ctx;
    const hitTestSource = this._hitTestSource;

    if (!hitTestSource || !this._enabled) return;

    const deadzoneChecker = this._deadzoneChecker;
    const rotateControl = this._rotateControl;
    const translateControl = this._translateControl;
    const scaleControl = this._scaleControl;

    // Update deadzone testing gestures
    if (rotateControl.enabled) {
      deadzoneChecker.addTestingGestures(TOUCH.GESTURE.ONE_FINGER);
    }
    if (translateControl.enabled) {
      deadzoneChecker.addTestingGestures(TOUCH.GESTURE.ONE_FINGER);
    }
    if (scaleControl.enabled) {
      deadzoneChecker.addTestingGestures(TOUCH.GESTURE.PINCH);
    }

    const hitResults = frame.getHitTestResultsForTransientInput(hitTestSource);
    const coords = this._hitResultToVector(hitResults);
    deadzoneChecker.applyScreenAspect(coords);
    deadzoneChecker.setFirstInput(coords);

    if (coords.length === 1) {
      // Check finger is on the model
      const modelBbox = view3d.model!.bbox;

      const targetRayPose = frame.getPose(hitResults[0].inputSource.targetRaySpace, referenceSpace);
      const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);

      const fingerDir = new THREE.Vector3().copy(targetRayPose.transform.position).sub(camPos).normalize();
      const fingerRay = new THREE.Ray(camPos, fingerDir);
      const intersection = fingerRay.intersectBox(modelBbox, new THREE.Vector3());

      if (intersection) {
        // Touch point intersected with model
        this._modelHit = true;
      }
    }

    this._floorIndicator.show();
  };

  public onSelectEnd = () => {
    this.deactivate();
    this._floorIndicator.fadeout();
  };

  private _checkDeadzone(ctx: XRRenderContext, { coords }: XRInputs) {
    const gesture = this._deadzoneChecker.check(coords.map(coord => coord.clone()));
    const rotateControl = this._rotateControl;
    const translateControl = this._translateControl;
    const scaleControl = this._scaleControl;

    if (gesture === TOUCH.GESTURE.NONE) return;

    switch (gesture) {
      case TOUCH.GESTURE.ONE_FINGER_HORIZONTAL:
      case TOUCH.GESTURE.ONE_FINGER_VERTICAL:
        if (this._modelHit) {
          translateControl.activate(ctx);
          translateControl.setInitialPos(coords);
        } else {
          rotateControl.activate(ctx);
          rotateControl.setInitialPos(coords);
        }
        break;
      case TOUCH.GESTURE.PINCH:
        scaleControl.activate(ctx);
        scaleControl.setInitialPos(coords);
        break;
    }
  }

  private _processInput(ctx: XRRenderContext, inputs: XRInputs) {
    this.controls.forEach(control => control.process(ctx, inputs));
  }

  private _updateControls(ctx: XRRenderContext) {
    const { view3d, model, delta } = ctx;
    const deltaMilisec = delta * 1000;

    this.controls.forEach(control => control.update(ctx, deltaMilisec));

    model.scene.updateMatrix();

    const modelRotation = this._rotateControl.rotation;
    const floorPosition = this._translateControl.floorPosition;
    view3d.scene.update(model, {
      floorPosition
    });

    // Get a scaled bbox, which only has scale applied on it.
    const scaleControl = this._scaleControl;
    const scaledBbox = model.initialBbox;
    scaledBbox.min.multiply(scaleControl.scale);
    scaledBbox.max.multiply(scaleControl.scale);

    const floorIndicator = this._floorIndicator;
    const boundingSphere = scaledBbox.getBoundingSphere(new THREE.Sphere());

    floorIndicator.update({
      delta: deltaMilisec,
      scale: boundingSphere.radius,
      position: floorPosition,
      rotation: modelRotation
    });
  }

  private _hitResultToVector(hitResults: any[]) {
    return hitResults.map(input => {
      return new THREE.Vector2().set(
        input.inputSource.gamepad.axes[0],
        -input.inputSource.gamepad.axes[1],
      );
    });
  }
}

export default ARFloorControl;
