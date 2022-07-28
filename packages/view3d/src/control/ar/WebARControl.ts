/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../../View3D";
import Model from "../../core/Model";
import ARScene from "../../xr/ARScene";
import * as XR from "../../const/xr";
import { GESTURE } from "../../const/internal";
import { AUTO } from "../../const/external";
import { getObjectOption } from "../../utils";
import { XRRenderContext, XRInputs } from "../../type/xr";

import ARSwirlControl, { ARSwirlControlOptions } from "./ARSwirlControl";
import ARTranslateControl, { ARTranslateControlOptions } from "./ARTranslateControl";
import ARScaleControl, { ARScaleControlOptions } from "./ARScaleControl";
import FloorIndicator, { FloorIndicatorOptions } from "./FloorIndicator";
import DeadzoneChecker, { DeadzoneCheckerOptions } from "./DeadzoneChecker";


/**
 * Options for the {@link WebARControl}
 * @interface
 * @property {ARSwirlControlOptions} rotate Options for {@link ARSwirlControl}
 * @property {ARTranslateControlOption} translate Options for {@link ARTranslateControl}
 * @property {ARScaleControlOption} scale Options for {@link ARScaleControl}
 * @property {FloorIndicatorOption} floorIndicator Options for {@link FloorIndicator}
 * @property {DeadzoneCheckerOption} deadzone Options for {@link DeadzoneChecker}
 * @property {"auto" | number} initialScale Initial scale of the model. If set to "auto", it will modify big overflowing 3D model's scale to fit the screen when it's initially displayed. This won't increase the 3D model's scale more than 1.
 */
export interface WebARControlOptions {
  rotate: boolean | Partial<ARSwirlControlOptions>;
  translate: boolean | Partial<ARTranslateControlOptions>;
  scale: boolean | Partial<ARScaleControlOptions>;
  ring: Partial<FloorIndicatorOptions>;
  deadzone: Partial<DeadzoneCheckerOptions>;
  initialScale: typeof AUTO | number;
}

/**
 * AR control for {@link WebARSession}
 */
class WebARControl {
  // Options
  private _rotate: WebARControlOptions["rotate"];
  private _translate: WebARControlOptions["translate"];
  private _scale: WebARControlOptions["scale"];
  private _initialScale: WebARControlOptions["initialScale"];

  private _view3D: View3D;
  private _arScene: ARScene;

  private _initialized: boolean;
  private _modelHit: boolean;
  private _vertical: boolean;
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
  public constructor(view3D: View3D, arScene: ARScene, {
    rotate,
    translate,
    scale,
    ring,
    deadzone,
    initialScale
  }: WebARControlOptions) {
    this._view3D = view3D;
    this._arScene = arScene;

    this._vertical = false;
    this._initialized = false;
    this._modelHit = false;
    this._hitTestSource = null;

    this._rotate = rotate;
    this._translate = translate;
    this._scale = scale;
    this._initialScale = initialScale;

    this._rotateControl = new ARSwirlControl(getObjectOption(rotate));
    this._translateControl = new ARTranslateControl(getObjectOption(translate));
    this._scaleControl = new ARScaleControl(getObjectOption(scale));
    this._floorIndicator = new FloorIndicator(ring);
    this._deadzoneChecker = new DeadzoneChecker(deadzone);
  }

  public async init({ model, session, size, vertical, hitPosition, hitRotation }: {
    model: Model;
    session: THREE.XRSession;
    vertical: boolean;
    size: {
      width: number;
      height: number;
    };
    hitPosition: THREE.Vector3;
    hitRotation: THREE.Quaternion;
  }) {
    const arScene = this._arScene;
    const translateControl = this._translateControl;
    const scaleControl = this._scaleControl;
    const floorIndicator = this._floorIndicator;
    const deadzoneChecker = this._deadzoneChecker;

    this._vertical = vertical;

    translateControl.init(hitPosition, hitRotation, vertical);
    deadzoneChecker.setAspect(size.height / size.width);

    arScene.add(
      floorIndicator.mesh,
      scaleControl.ui.mesh
    );

    this.syncTargetModel(model);

    const transientHitTestSource = await session.requestHitTestSourceForTransientInput({ profile: XR.INPUT_PROFILE.TOUCH });

    this._hitTestSource = transientHitTestSource;
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

    this.disable(session);

    this._floorIndicator.hide();
    this._scaleControl.ui.hide();

    session.removeEventListener(XR.EVENTS.SELECT_START, this._onSelectStart);
    session.removeEventListener(XR.EVENTS.SELECT_END, this._onSelectEnd);

    this._initialized = false;
  }

  public enable(session: THREE.XRSession) {
    const rotate = this._rotate;
    const translate = this._translate;
    const scale = this._scale;

    const rotateControl = this._rotateControl;
    const translateControl = this._translateControl;
    const scaleControl = this._scaleControl;

    const vertical = this._vertical;

    session.addEventListener(XR.EVENTS.SELECT_START, this._onSelectStart);
    session.addEventListener(XR.EVENTS.SELECT_END, this._onSelectEnd);

    if (rotate && !vertical) {
      rotateControl.enable();
    }
    if (translate) {
      translateControl.enable();
    }
    if (scale) {
      scaleControl.enable();
    }
  }

  public disable(session: THREE.XRSession) {
    const rotateControl = this._rotateControl;
    const translateControl = this._translateControl;
    const scaleControl = this._scaleControl;

    session.removeEventListener(XR.EVENTS.SELECT_START, this._onSelectStart);
    session.removeEventListener(XR.EVENTS.SELECT_END, this._onSelectEnd);

    this._deactivate();

    rotateControl.disable();
    translateControl.disable();
    scaleControl.disable();
  }

  public update(ctx: XRRenderContext) {
    const { view3D, session, frame } = ctx;
    const hitTestSource = this._hitTestSource;

    if (!hitTestSource || !view3D.model) return;

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

  public syncTargetModel(model: Model) {
    const initialScale = this._initialScale;
    const floorPosition = this._translateControl.floorPosition;
    const xrCam = (this._view3D.renderer.threeRenderer.xr.getCamera(new THREE.PerspectiveCamera()) as THREE.ArrayCamera).cameras[0];

    this._floorIndicator.updateSize(model);
    this._scaleControl.setInitialScale({
      scene: this._arScene,
      model,
      floorPosition,
      xrCam,
      initialScale
    });
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
    const arScene = this._arScene;
    const hitTestSource = this._hitTestSource;
    const deadzoneChecker = this._deadzoneChecker;
    const rotateControl = this._rotateControl;
    const translateControl = this._translateControl;
    const scaleControl = this._scaleControl;

    const threeRenderer = view3D.renderer.threeRenderer;
    const xrCamArray = (threeRenderer.xr.getCamera(new THREE.PerspectiveCamera()) as THREE.ArrayCamera);
    const referenceSpace = threeRenderer.xr.getReferenceSpace()!;

    if (!hitTestSource || xrCamArray.cameras.length <= 0) return;

    const xrCam = xrCamArray.cameras[0];
    const model = view3D.model!;

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
      const targetRayPose = frame.getPose(hitResults[0].inputSource.targetRaySpace, referenceSpace);

      if (targetRayPose) {
        const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);
        const rayPose = targetRayPose.transform.position;

        const fingerDir = new THREE.Vector3(rayPose.x, rayPose.y, rayPose.z).sub(camPos).normalize();
        const fingerRay = new THREE.Ray(camPos, fingerDir);

        const modelBoundingSphere = model.bbox.getBoundingSphere(new THREE.Sphere());
        modelBoundingSphere.applyMatrix4(arScene.modelMovable.matrixWorld);

        const intersection = fingerRay.intersectSphere(modelBoundingSphere, new THREE.Vector3());

        if (intersection) {
          // Touch point intersected with model
          this._modelHit = true;
        }
      }
    }

    if (!this._vertical || this._modelHit) {
      this._floorIndicator.show();
    }
  };

  private _onSelectEnd = () => {
    this._deactivate();
    this._floorIndicator.fadeout();
  };

  private _checkDeadzone(ctx: XRRenderContext, { coords }: XRInputs) {
    const arScene = this._arScene;
    const rotateControl = this._rotateControl;
    const translateControl = this._translateControl;
    const scaleControl = this._scaleControl;
    const gesture = this._deadzoneChecker.check(coords.map(coord => coord.clone()));

    if (gesture === GESTURE.NONE) return;

    switch (gesture) {
      case GESTURE.ONE_FINGER_HORIZONTAL:
      case GESTURE.ONE_FINGER_VERTICAL:
        if (this._modelHit) {
          translateControl.activate();
          translateControl.setInitialPos(coords);
        } else {
          rotateControl.activate();
          rotateControl.updateRotation(arScene.modelMovable.quaternion);
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
    const { delta } = ctx;
    const arScene = this._arScene;
    const rotateControl = this._rotateControl;
    const translateControl = this._translateControl;
    const scaleControl = this._scaleControl;
    const floorIndicator = this._floorIndicator;
    const deltaMilisec = delta * 1000;

    rotateControl.update(ctx, deltaMilisec);
    translateControl.update(ctx, deltaMilisec);
    scaleControl.update(ctx, deltaMilisec);

    const modelRotation = rotateControl.rotation;
    const floorPosition = translateControl.floorPosition;

    arScene.setRootPosition(floorPosition);

    floorIndicator.update({
      delta: deltaMilisec,
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

export default WebARControl;
