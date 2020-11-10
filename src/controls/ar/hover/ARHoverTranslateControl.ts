/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import ARControl from "../common/ARControl";
import ArrowIndicator, { ArrowIndicatorOption } from "../ui/ArrowIndicator";
import { getPrimaryAxisIndex } from "~/utils";
import * as TOUCH from "~/consts/touch";
import { XRRenderContext, XRContext, XRInputs } from "~/types/internal";

/**
 * Options for {@link ARHoverTranslateControl}
 * @category Controls-AR
 * @interface
 * @property {ArrowIndicatorOption} arrow Options for {@link ArrowIndicator}
 */
export interface ARHoverTranslateControlOption {
  arrow: ArrowIndicatorOption;
}

/**
 * Model's translation(position) control for {@link ARHoverControl}
 * @category Controls-AR
 */
class ARHoverTranslateControl implements ARControl {
  // Internal states
  private _position = new THREE.Vector3();
  private _dragPlane = new THREE.Plane();
  private _enabled = true;
  private _active = false;
  private _initialPos = new THREE.Vector2();
  private _arrowIndicator: ArrowIndicator;

  public get enabled() { return this._enabled; }
  public get position() { return this._position.clone(); }

  /**
   * Create new instance of ARTranslateControl
   * @param {ARHoverTranslateControlOption} [options={}] Options
   */
  constructor(options: Partial<ARHoverTranslateControlOption> = {}) {
    this._arrowIndicator = new ArrowIndicator(options.arrow);
  }

  public init({ view3d }: XRRenderContext) {
    this._position.copy(view3d.model!.scene.position);
    view3d.scene.add(this._arrowIndicator.object);
  }

  public destroy({ view3d }: XRContext) {
    view3d.scene.remove(this._arrowIndicator.object);
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

  public activate({ model, xrCam }: XRRenderContext, gesture: TOUCH.GESTURE) {
    if (!this._enabled) return;

    const modelPos = model.scene.position;
    const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);

    const modelBasis = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    model.scene.matrixWorld.extractBasis(modelBasis[0], modelBasis[1], modelBasis[2]);
    modelBasis.forEach(axes => axes.normalize());

    const camToModelDir = new THREE.Vector3().subVectors(modelPos, camPos).clone().normalize();
    const primaryAxisIdx = getPrimaryAxisIndex(modelBasis, camToModelDir);
    const primaryAxis = modelBasis[primaryAxisIdx];

    // If axes is facing the opposite of camera, negate it
    if (primaryAxis.dot(camToModelDir) < 0) {
      primaryAxis.negate();
    }

    const originToDragPlane = new THREE.Plane(primaryAxis, 0).distanceToPoint(modelPos);
    this._dragPlane.set(primaryAxis, -originToDragPlane);

    this._active = true;

    // Update arrows
    const arrowIndicator = this._arrowIndicator;
    const modelBbox = model.initialBbox;
    modelBbox.min.multiply(model.scene.scale);
    modelBbox.max.multiply(model.scene.scale);
    modelBbox.translate(modelPos);

    arrowIndicator.show();
    arrowIndicator.updatePosition(modelBbox.getCenter(new THREE.Vector3()));
    arrowIndicator.updateScale(model.size / 16);

    const arrowPlaneRotation = model.scene.quaternion.clone();
    if (primaryAxisIdx === 0) {
      arrowPlaneRotation.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)));
    } else if (primaryAxisIdx === 1) {
      arrowPlaneRotation.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)));
    }

    arrowIndicator.updateRotation(arrowPlaneRotation);
    arrowIndicator.updateOffset(new THREE.Vector3().subVectors(modelBbox.max, modelBbox.min).multiplyScalar(0.5));
  }

  public deactivate() {
    this._active = false;
    this._arrowIndicator.hide();
  }

  public setInitialPos(coords: THREE.Vector2[]) {
    this._initialPos.copy(coords[0]);
  }

  public process({ view3d, frame, referenceSpace, xrCam }: XRRenderContext, { inputSources }: XRInputs) {
    if (inputSources.length !== 1 || !this._active) return;

    const inputSource = inputSources[0];
    const dragPlane = this._dragPlane;

    const targetRayPose = frame.getPose(inputSource.targetRaySpace, referenceSpace);
    const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);

    const fingerDir = new THREE.Vector3().copy(targetRayPose.transform.position).sub(camPos).normalize();
    const fingerRay = new THREE.Ray(camPos, fingerDir);
    const intersection = fingerRay.intersectPlane(dragPlane, new THREE.Vector3());

    if (intersection) {
      this._position.copy(intersection);

      // Update arrow position. As position is not a center of model, we should apply offset from it
      const model = view3d.model!;
      const centerYOffset = model.initialBbox.getCenter(new THREE.Vector3()).multiply(model.scene.scale).y;
      const modelLocalYDir = new THREE.Vector3().applyQuaternion(model.scene.quaternion);
      const newCenter = intersection.add(modelLocalYDir.multiplyScalar(centerYOffset));

      this._arrowIndicator.updatePosition(newCenter);
    }
  }

  public update({ model }: XRRenderContext, delta: number) {
    model.scene.position.copy(this._position);
  }
}

export default ARHoverTranslateControl;
