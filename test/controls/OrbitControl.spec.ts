import * as sinon from "sinon";

import OrbitControl from "~/controls/OrbitControl";
import RotateControl from "~/controls/RotateControl";
import TranslateControl from "~/controls/TranslateControl";
import DistanceControl from "~/controls/DistanceControl";
import View3DError from "~/View3DError";
import Camera from "~/core/camera/Camera";
import * as ERROR from "~/consts/error";

describe("OrbitControl", () => {
  describe("Initial states", () => {
    it("should have rotate control in it", () => {
      expect(new OrbitControl().rotate).to.be.instanceOf(RotateControl);
    });

    it("should have translate control in it", () => {
      expect(new OrbitControl().translate).to.be.instanceOf(TranslateControl);
    });

    it("should have distance control in it", () => {
      expect(new OrbitControl().distance).to.be.instanceOf(DistanceControl);
    });

    it("is not enabled by default", () => {
      expect(new RotateControl().enabled).to.be.false;
    });

    it("should have target element as null", () => {
      expect(new RotateControl().element).to.be.null;
    });
  });

  describe("setElement", () => {
    it("can return non-null element after setting an element", () => {
      // Given
      const orbitControl = new OrbitControl();

      // When
      const beforeSetting = orbitControl.element;
      orbitControl.setElement(document.createElement("div"));
      const afterSetting = orbitControl.element;

      // Then
      expect(beforeSetting).to.be.null;
      expect(afterSetting).not.to.be.null;
    });

    it("should call all child control's setElement", () => {
      // Given
      const orbitControl = new OrbitControl();
      const element = document.createElement("div");

      // When
      const rotateSpy = sinon.spy(orbitControl.rotate, "setElement");
      const translateSpy = sinon.spy(orbitControl.translate, "setElement");
      const distanceSpy = sinon.spy(orbitControl.distance, "setElement");
      orbitControl.setElement(element);

      // Then
      expect(rotateSpy.calledOnceWith(element)).to.be.true;
      expect(translateSpy.calledOnceWith(element)).to.be.true;
      expect(distanceSpy.calledOnceWith(element)).to.be.true;
    });
  });

  describe("destroy", () => {
    it("should call all child control's destroy", () => {
      // Given
      const orbitControl = new OrbitControl();

      // When
      const rotateSpy = sinon.spy(orbitControl.rotate, "destroy");
      const translateSpy = sinon.spy(orbitControl.translate, "destroy");
      const distanceSpy = sinon.spy(orbitControl.distance, "destroy");
      orbitControl.destroy();

      // Then
      expect(rotateSpy.calledOnce).to.be.true;
      expect(translateSpy.calledOnce).to.be.true;
      expect(distanceSpy.calledOnce).to.be.true;
    });
  });

  describe("enable", () => {
    it("should throw an 'Add control first' error when target element not set yet", () => {
      // Given & When
      const orbitControl = new OrbitControl();
      orbitControl.enable.bind(orbitControl);

      try {
        // When
        orbitControl.enable();
        expect(true).to.be.false; // Should fail if it didn't throw an error
      } catch (e) {
        // Then
        expect(orbitControl.element).to.be.null;
        expect(e).to.be.instanceOf(View3DError);
        expect(e.code).to.equal(ERROR.CODES.ADD_CONTROL_FIRST);
      }
    });

    it("should call all child control's enable", () => {
      // Given
      const orbitControl = new OrbitControl();
      const element = document.createElement("div");

      // When
      const rotateSpy = sinon.spy(orbitControl.rotate, "enable");
      const translateSpy = sinon.spy(orbitControl.translate, "enable");
      const distanceSpy = sinon.spy(orbitControl.distance, "enable");
      orbitControl.setElement(element);
      orbitControl.enable();

      // Then
      expect(rotateSpy.calledOnce).to.be.true;
      expect(translateSpy.calledOnce).to.be.true;
      expect(distanceSpy.calledOnce).to.be.true;
    });
  });

  describe("disable", () => {
    it("should return enabled as false after disabling it", () => {
      // Given
      const testElement = document.createElement("div");
      const orbitControl = new OrbitControl();
      orbitControl.setElement(testElement);
      orbitControl.enable();

      // When
      orbitControl.disable();

      // Then
      expect(orbitControl.enabled).to.be.false;
    });

    it("should call all child control's disable", () => {
      // Given
      const orbitControl = new OrbitControl();
      const element = document.createElement("div");
      const rotateSpy = sinon.spy(orbitControl.rotate, "disable");
      const translateSpy = sinon.spy(orbitControl.translate, "disable");
      const distanceSpy = sinon.spy(orbitControl.distance, "disable");
      orbitControl.setElement(element);
      orbitControl.enable();

      // When
      orbitControl.disable();

      // Then
      expect(rotateSpy.calledOnce).to.be.true;
      expect(translateSpy.calledOnce).to.be.true;
      expect(distanceSpy.calledOnce).to.be.true;
    });
  });

  describe("sync", () => {
    it("should call all child control's sync", () => {
      // Given
      const orbitControl = new OrbitControl();
      const element = document.createElement("div");
      const camera = new Camera(document.createElement("canvas"));

      const rotateSpy = sinon.spy(orbitControl.rotate, "sync");
      const translateSpy = sinon.spy(orbitControl.translate, "sync");
      const distanceSpy = sinon.spy(orbitControl.distance, "sync");
      orbitControl.setElement(element);
      orbitControl.enable();

      // When
      orbitControl.sync(camera);

      // Then
      expect(rotateSpy.calledOnceWith(camera)).to.be.true;
      expect(translateSpy.calledOnceWith(camera)).to.be.true;
      expect(distanceSpy.calledOnceWith(camera)).to.be.true;
    });
  });
});
