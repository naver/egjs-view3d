import * as THREE from "three";
import * as sinon from "sinon";
import View3D from "~/View3D";
import Model from "~/core/Model";
import WebARSession from "~/xr/WebARSession";
import { createXRRenderingContext } from "test/test-utils";


// Minimal extend of WebARSession
class WebARSessionForTest extends WebARSession {
  public _beforeRender() {}
}

describe("WebARSession", () => {
  describe("Default properties", () => {
    it("should set isWebXRSession to true", () => {
      expect(new WebARSessionForTest().isWebXRSession).to.be.true;
    });

    it("should set session as null", () => {
      expect(new WebARSessionForTest().session).to.be.null;
    });

    it("should set features as an empty object", () => {
      expect(new WebARSessionForTest().features).to.deep.equal({});
    });
  });

  describe("Options", () => {
    it("should include dom-overlay feature if overlayRoot is given", () => {
      expect(new WebARSessionForTest({ overlayRoot: document.createElement("div") }).features.optionalFeatures).includes("dom-overlay");
    });

    it("should include dom-overlay feature if overlayRoot is given", () => {
      expect(new WebARSessionForTest({ overlayRoot: document.createElement("div") }).features.optionalFeatures).includes("dom-overlay");
    });

    it("should include any properties given in features", () => {
      // Given
      const features = { requiredFeatures: ["some-feature"], optionalFeatures: ["extra-feature"] };

      // When
      const session = new WebARSessionForTest({ features });

      // Then
      expect(session.features).to.deep.equal(features);
    });

    it("should append given features to default features dom-overlay", () => {
      // Given
      const features = { requiredFeatures: ["some-feature"], optionalFeatures: ["extra-feature"] };

      // When
      const session = new WebARSessionForTest({ features, overlayRoot: document.createElement("div") });

      // Then
      expect(session.features.optionalFeatures).includes("dom-overlay");
      expect(session.features.optionalFeatures).includes("extra-feature");
      expect(session.features.requiredFeatures).includes("some-feature");
    });
  });

  describe("entering session", () => {
    const originalRequestSession = navigator.xr.requestSession;

    afterEach(() => {
      navigator.xr.requestSession = originalRequestSession;
    });

    it("should be rejected if 3D model is not loaded yet", async () => {
      // Given
      const session = new WebARSessionForTest();

      // When
      await session.enter(new View3D(document.createElement("canvas")))
        .then(() => {
          expect("should not reach here").to.be.true;
        }).catch(() => {
          // Then
          expect(true).to.be.true;
        });
    });
  });

  describe("onStart", () => {
    it("should trigger 'start' event", () => {
      // Given
      const session = new WebARSessionForTest();
      const view3d = new View3D(document.createElement("canvas"));
      const model = new Model({ scenes: [] });
      const startSpy = sinon.spy();

      // When
      session.on("start", startSpy);
      session.onStart(createXRRenderingContext({ view3d, model }));

      // Then
      expect(startSpy.calledOnce).to.be.true;
    });
  });

  describe("onEnd", () => {
    it("should trigger 'end' event", () => {
      // Given
      const session = new WebARSessionForTest();
      const view3d = new View3D(document.createElement("canvas"));
      const model = new Model({ scenes: [] });
      const endSpy = sinon.spy();

      // When
      session.on("end", endSpy);
      session.onEnd(createXRRenderingContext({ view3d, model }));

      // Then
      expect(endSpy.calledOnce).to.be.true;
    });
  });
});
