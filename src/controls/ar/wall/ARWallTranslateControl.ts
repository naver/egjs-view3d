/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import ARControl from "../common/ARControl";
import ArrowIndicator, { ArrowIndicatorOption } from "../ui/ArrowIndicator";
import * as TOUCH from "~/consts/touch";
import { XRRenderContext, XRContext, XRInputs } from "~/types/internal";
/**
 * Options for {@link ARTranslateControl}
 * @category Controls-AR
 * @interface
 * @property {ArrowIndicatorOption} arrow Options for {@link ArrowIndicator}
 */
export interface ARWallTranslateControlOption {
  arrow: ArrowIndicatorOption;
}

/**
 * Model's translation(position) control for {@link ARWallControl}
 * @category Controls-AR
 */
class ARWallTranslateControl implements ARControl {
  public readonly position = new THREE.Vector3();
  public readonly wallPosition = new THREE.Vector3();
  public readonly hitRotation = new THREE.Quaternion();
  // Global Y guaranteed rotation matrix
  public readonly wallRotation = new THREE.Quaternion();
  private _arrowIndicator: ArrowIndicator;

  // Options

  // Internal states
  private _dragPlane = new THREE.Plane();
  private _enabled = true;
  private _active = false;
  private _initialPos = new THREE.Vector2();

  /**
   * Whether this control is enabled or not
   * @readonly
   */
  public get enabled() { return this._enabled; }

  /**
   * Create new instance of ARTranslateControl
   * @param {ARWallTranslateControlOption} [options={}] Options
   */
  constructor(options: Partial<ARWallTranslateControlOption> = {}) {
    this._arrowIndicator = new ArrowIndicator(options.arrow);
  }

  public initWallTransform({ hitPosition, hitRotation, modelPosition, wallRotation }: {
    hitPosition: THREE.Vector3,
    hitRotation: THREE.Quaternion,
    modelPosition: THREE.Vector3,
    wallRotation: THREE.Quaternion,
  }) {
    this.position.copy(modelPosition);
    this.hitRotation.copy(hitRotation);
    this.wallPosition.copy(hitPosition);
    this.wallRotation.copy(wallRotation);

    const wallNormal = new THREE.Vector3(0, 1, 0).applyQuaternion(wallRotation);

    this._dragPlane.set(wallNormal, -wallNormal.dot(modelPosition));
  }

  public init({ view3d }: XRRenderContext) {
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

  public activate({ model }: XRRenderContext, gesture: TOUCH.GESTURE) {
    if (!this._enabled) return;

    this._active = true;

    // Update arrows
    const arrowIndicator = this._arrowIndicator;
    const modelBbox = model.initialBbox;
    modelBbox.min.multiply(model.scene.scale);
    modelBbox.max.multiply(model.scene.scale);
    modelBbox.translate(model.scene.position);

    arrowIndicator.show();
    arrowIndicator.updatePosition(modelBbox.getCenter(new THREE.Vector3()));
    arrowIndicator.updateScale(model.size / 16);

    const arrowPlaneRotation = model.scene.quaternion.clone();

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

  public process({ view3d, model, frame, referenceSpace, xrCam }: XRRenderContext, { hitResults }: XRInputs) {
    if (!hitResults || hitResults.length !== 1 || !this._active) return;

    const dragPlane = this._dragPlane;

    const modelRoot = model.scene;
    const modelZOffset = -model.initialBbox.min.z * modelRoot.scale.z;

    const camPos = new THREE.Vector3().setFromMatrixPosition(xrCam.matrixWorld);
    const hitResult = hitResults[0];
    const hitPose = hitResult.results[0] && hitResult.results[0].getPose(referenceSpace);

    const isWallHit = hitPose && hitPose.transform.matrix[5] < 0.25;

    if (!hitPose || !isWallHit) {
      // Use previous drag plane if no hit plane is found
      const targetRayPose = frame.getPose(hitResult.inputSource.targetRaySpace, view3d.renderer.threeRenderer.xr.getReferenceSpace());
      const fingerDir = new THREE.Vector3().copy(targetRayPose.transform.position).sub(camPos).normalize();

      const fingerRay = new THREE.Ray(camPos, fingerDir);
      const intersection = fingerRay.intersectPlane(dragPlane, new THREE.Vector3());

      if (intersection) {
        this.wallPosition.copy(intersection.clone().sub(dragPlane.normal.clone().multiplyScalar(modelZOffset)));
        this.position.copy(intersection);
      }
      return;
    }

    const hitMatrix = new THREE.Matrix4().fromArray(hitPose.transform.matrix);
    const hitOrientation = new THREE.Quaternion().copy(hitPose.transform.orientation);
    const hitPosition = new THREE.Vector3().setFromMatrixPosition(hitMatrix);
    const worldYAxis = new THREE.Vector3(0, 1, 0);
    /*
     * ^ wallU
     * |
     * ⨀---> wallV
     * wallNormal
     */
    const wallNormal = new THREE.Vector3(0, 1, 0).applyQuaternion(hitOrientation).normalize();
    const wallU = new THREE.Vector3().crossVectors(worldYAxis, wallNormal);
    const wallV = wallNormal.clone().applyAxisAngle(wallU, -Math.PI / 2);

    // Reconstruct wall matrix with prev Y(normal) direction as Z axis
    const wallMatrix = new THREE.Matrix4().makeBasis(wallU, wallV, wallNormal);
    const modelPosition = hitPosition.clone().add(wallNormal.clone().multiplyScalar(modelZOffset));

    // Update position
    this.position.copy(modelPosition);
    this.wallPosition.copy(hitPosition);

    // Update rotation if it differs more than 10deg
    const prevWallNormal = new THREE.Vector3(0, 1, 0).applyQuaternion(this.hitRotation).normalize();
    if (Math.acos(Math.abs(prevWallNormal.dot(wallNormal))) >= Math.PI / 18) {
      const prevWallRotation = this.wallRotation.clone();
      const wallRotation = new THREE.Quaternion().setFromRotationMatrix(wallMatrix);
      const rotationDiff = prevWallRotation.inverse().premultiply(wallRotation);

      modelRoot.quaternion.premultiply(rotationDiff);
      this.wallRotation.copy(wallRotation);
      this.hitRotation.copy(hitOrientation);

      this._arrowIndicator.updateRotation(modelRoot.quaternion);

      // Update drag plane
      dragPlane.set(wallNormal, -modelPosition.dot(wallNormal));
    }
  }

  public update({ model }: XRRenderContext, delta: number) {
    model.scene.position.copy(this.position);
    this._arrowIndicator.updatePosition(this.position);
    model.scene.updateMatrix();
  }
}

export default ARWallTranslateControl;
