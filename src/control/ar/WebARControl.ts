/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../../View3D";
import ARScene from "../../xr/ARScene";
import * as XR from "../../const/xr";
import { GESTURE } from "../../const/internal";
import { XRRenderContext, XRInputs } from "../../type/xr";

import ARSwirlControl, { ARSwirlControlOptions } from "./ARSwirlControl";
import ARTranslateControl, { ARTranslateControlOptions } from "./ARTranslateControl";
import ARScaleControl, { ARScaleControlOptions } from "./ARScaleControl";
import FloorIndicator, { FloorIndicatorOptions } from "./ui/FloorIndicator";
import DeadzoneChecker, { DeadzoneCheckerOptions } from "./common/DeadzoneChecker";


/**
 * Options for the {@link WebARControl}
 * @interface
 * @property {ARSwirlControlOptions} rotate Options for {@link ARSwirlControl}
 * @property {ARTranslateControlOption} translate Options for {@link ARTranslateControl}
 * @property {ARScaleControlOption} scale Options for {@link ARScaleControl}
 * @property {FloorIndicatorOption} floorIndicator Options for {@link FloorIndicator}
 * @property {DeadzoneCheckerOption} deadzone Options for {@link DeadzoneChecker}
 */
export interface WebARControlOptions {
  rotate: Partial<ARSwirlControlOptions>;
  translate: Partial<ARTranslateControlOptions>;
  scale: Partial<ARScaleControlOptions>;
  floorIndicator: Partial<FloorIndicatorOptions>;
  deadzone: Partial<DeadzoneCheckerOptions>;
}

/**
 * AR control for {@link FloorARSession}
 */
class WebARControl {
  private _view3D: View3D;
  private _initialized: boolean;
  private _modelHit: boolean;
  private _hitTestSource: THREE.XRTransientInputHitTestSource | null;
  private _deadzoneChecker: DeadzoneChecker;
  private _rotateControl: ARSwirlControl;
  private _translateControl: ARTranslateControl;
  private _scaleControl: ARScaleControl;
  private _floorIndicator: FloorIndicator;

  /**
   * {@link ARSwirlControl} in this control
   */
  public get rotate() { return this._rotateControl; }
  /**
   * {@link ARTranslateControl} in this control
   */
  public get translate() { return this._translateControl; }
  /**
   * {@link ARScaleControl} in this control
   */
  public get scale() { return this._scaleControl; }

  /**
   * Create new instance of ARControl
   * @param {WebARControlOptions} options Options
   */
  public constructor(view3D: View3D, options: Partial<WebARControlOptions> = {}) {
    this._view3D = view3D;
    this._initialized = false;
    this._modelHit = false;
    this._hitTestSource = null;

    this._rotateControl = new ARSwirlControl(options.rotate);
    this._translateControl = new ARTranslateControl(options.translate);
    this._scaleControl = new ARScaleControl(options.scale);
    this._floorIndicator = new FloorIndicator(options.floorIndicator);
    this._deadzoneChecker = new DeadzoneChecker(options.deadzone);
  }

  public async init(ctx: {
    scene: ARScene;
    session: THREE.XRSession;
    size: {
      width: number;
      height: number;
    };
    initialFloorPos: THREE.Vector3;
  }) {
    const { session, scene, size, initialFloorPos } = ctx;

    this._translateControl.initFloorPosition(initialFloorPos);
    this._deadzoneChecker.setAspect(size.height / size.width);

    // FIXME:
    // scene.add(this._floorIndicator.mesh);

    const transientHitTestSource = await session.requestHitTestSourceForTransientInput({ profile: XR.INPUT_PROFILE.TOUCH });

    this._hitTestSource = transientHitTestSource;

    session.addEventListener(XR.EVENTS.SELECT_START, this._onSelectStart);
    session.addEventListener(XR.EVENTS.SELECT_END, this._onSelectEnd);

    this._initialized = true;
  }

  /**
   * Destroy this control and deactivate it
   */
  public destroy(session: THREE.XRSession) {
    if (!this._initialized) return;

    if (this._hitTestSource) {
      this._hitTestSource.cancel();
      this._hitTestSource = null;
    }

    this._deactivate();

    session.removeEventListener(XR.EVENTS.SELECT_START, this._onSelectStart);
    session.removeEventListener(XR.EVENTS.SELECT_END, this._onSelectEnd);

    this._initialized = false;
  }

  public update(ctx: XRRenderContext) {
    const { view3D: view3d, session, frame } = ctx;
    const hitTestSource = this._hitTestSource;

    if (!hitTestSource || !view3d.model) return;

    const deadzoneChecker = this._deadzoneChecker;
    const inputSources = session.inputSources;
    const hitResults = frame?.getHitTestResultsForTransientInput(hitTestSource) ?? [];
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

  private _deactivate() {
    this._modelHit = false;
    this._deadzoneChecker.cleanup();

    this._rotateControl.deactivate();
    this._translateControl.deactivate();
    this._scaleControl.deactivate();
  }

  private _onSelectStart = (evt: THREE.XRInputSourceEvent) => {
    const frame = evt.frame;
    const view3D = this._view3D;
    const hitTestSource = this._hitTestSource;
    const threeRenderer = view3D.renderer.threeRenderer;
    const xrCam = threeRenderer.xr.getCamera(new THREE.PerspectiveCamera()) as THREE.PerspectiveCamera;
    const referenceSpace = threeRenderer.xr.getReferenceSpace()!;

    if (!hitTestSource) return;

    const deadzoneChecker = this._deadzoneChecker;
    const rotateControl = this._rotateControl;
    const translateControl = this._translateControl;
    const scaleControl = this._scaleControl;

    // Update deadzone testing gestures
    if (rotateControl.enabled) {
      deadzoneChecker.addTestingGestures(GESTURE.ONE_FINGER);
    }
    if (translateControl.enabled) {
      deadzoneChecker.addTestingGestures(GESTURE.ONE_FINGER);
    }
    if (scaleControl.enabled) {
      deadzoneChecker.addTestingGestures(GESTURE.PINCH);
    }

    const hitResults = frame.getHitTestResultsForTransientInput(hitTestSource);
    const coords = this._hitResultToVector(hitResults);
    deadzoneChecker.applyScreenAspect(coords);
    deadzoneChecker.setFirstInput(coords);

    if (coords.length === 1) {
      // Check finger is on the model
      const modelBbox = view3D.model!.bbox;

      const targetRayPose = frame.getPose(hitResults[0].inputSource.targetRaySpace, referenceSpace);

      if (targetRayPose) {
        const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);
        const rayPose = targetRayPose.transform.position;

        const fingerDir = new THREE.Vector3(rayPose.x, rayPose.y, rayPose.z).sub(camPos).normalize();
        const fingerRay = new THREE.Ray(camPos, fingerDir);
        const intersection = fingerRay.intersectBox(modelBbox, new THREE.Vector3());

        if (intersection) {
          // Touch point intersected with model
          this._modelHit = true;
        }
      }
    }

    this._floorIndicator.show();
  };

  private _onSelectEnd = () => {
    this._deactivate();
    this._floorIndicator.fadeout();
  };

  private _checkDeadzone(ctx: XRRenderContext, { coords }: XRInputs) {
    const gesture = this._deadzoneChecker.check(coords.map(coord => coord.clone()));
    const rotateControl = this._rotateControl;
    const translateControl = this._translateControl;
    const scaleControl = this._scaleControl;

    if (gesture === GESTURE.NONE) return;

    switch (gesture) {
      case GESTURE.ONE_FINGER_HORIZONTAL:
      case GESTURE.ONE_FINGER_VERTICAL:
        if (this._modelHit) {
          translateControl.activate(ctx);
          translateControl.setInitialPos(coords);
        } else {
          rotateControl.activate();
          rotateControl.setInitialPos(coords);
        }
        break;
      case GESTURE.PINCH:
        scaleControl.activate(ctx);
        scaleControl.setInitialPos(coords);
        break;
    }
  }

  private _processInput(ctx: XRRenderContext, inputs: XRInputs) {
    this._rotateControl.process(ctx, inputs);
    this._translateControl.process(ctx, inputs);
    this._scaleControl.process(ctx, inputs);
  }

  private _updateControls(ctx: XRRenderContext) {
    const { scene, delta } = ctx;
    const deltaMilisec = delta * 1000;

    this._rotateControl.update(ctx, deltaMilisec);
    this._translateControl.update(ctx, deltaMilisec);
    this._scaleControl.update(ctx, deltaMilisec);

    scene.root.updateMatrix();

    const modelRotation = this._rotateControl.rotation;
    const floorPosition = this._translateControl.floorPosition;

    scene.setFloorLevel(floorPosition.y);

    // Get a scaled bbox, which only has scale applied on it.
    // TODO: apply scale to floor indicator
    // const scaleControl = this._scaleControl;
    // const scaledBbox = model.bbox;

    // scaledBbox.min.multiply(scaleControl.scale);
    // scaledBbox.max.multiply(scaleControl.scale);

    // const floorIndicator = this._floorIndicator;
    // const boundingSphere = scaledBbox.getBoundingSphere(new THREE.Sphere());

    // floorIndicator.update({
    //   delta: deltaMilisec,
    //   scale: boundingSphere.radius,
    //   position: floorPosition,
    //   rotation: modelRotation
    // });
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

export default WebARControl;
