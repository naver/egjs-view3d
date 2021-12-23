/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as XR from "../../const/xr";

/**
 * Manager for WebXR hit-test feature
 */
class HitTest {
  /**
   * Return whether hit-test feature is available
   */
  public static isAvailable() {
    return XR.HIT_TEST_SUPPORTED();
  }

  private _source: any = null;

  /**
   * Return whether hit-test is ready
   */
  public get ready() { return this._source != null; }

  /**
   * Destroy instance
   */
  public destroy() {
    if (this._source) {
      this._source.cancel();
      this._source = null;
    }
  }

  /**
   * Initialize hit-test feature
   * @param {XRSession} session XRSession instance
   */
  public init(session: any) {
    session.requestReferenceSpace(XR.REFERENCE_SPACE.VIEWER).then(referenceSpace => {
      session.requestHitTestSource({ space: referenceSpace }).then(source => {
        this._source = source;
      });
    });
  }

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/XRSessionInit XRSessionInit} object for hit-test feature
   */
  public getFeatures() {
    return XR.FEATURES.HIT_TEST;
  }

  /**
   * Get hit-test results
   * @param {XRFrame} frame XRFrame instance
   */
  public getResults(frame?: THREE.XRFrame) {
    return frame?.getHitTestResults(this._source) ?? [];
  }
}

export default HitTest;
