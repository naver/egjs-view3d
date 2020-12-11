import * as sinon from "sinon";
import DistanceControl from "~/controls/DistanceControl";
import View3DError from "~/View3DError";
import * as ERROR from "~/consts/error";
import { EVENTS } from "~/consts/event";

describe("DistanceControl", () => {
  describe("Initial state", () => {
    it("should have target element as null", () => {
      expect(new DistanceControl().element).to.be.null;
    });

    it("should have scale value as 1", () => {
      expect(new DistanceControl().scale).to.equal(1);
    });

    it("is not enabled by default", () => {
      expect(new DistanceControl().enabled).to.be.false;
    });
  });

  describe("Setting an element", () => {
    it("can return non-null element after setting an element", () => {
      // Given
      const distanceControl = new DistanceControl();

      // When
      const beforeSetting = distanceControl.element;
      distanceControl.setElement(document.createElement("div"));
      const afterSetting = distanceControl.element;

      // Then
      expect(beforeSetting).to.be.null;
      expect(afterSetting).not.to.be.null;
    });
  });

  describe("Destroy", () => {
    it("should call disable when destroying", () => {
      // Given
      const distanceControl = new DistanceControl();
      const disableSpy = sinon.spy(distanceControl, "disable");

      // When
      distanceControl.destroy();

      // Then
      expect(disableSpy.calledOnce).to.be.true;
    });
  });

  describe("Enabling Control", () => {
    it("should throw an 'Add control first' error when target element not set yet", () => {
      // Given & When
      const distanceControl = new DistanceControl();
      distanceControl.enable.bind(distanceControl);

      try {
        // When
        distanceControl.enable();
        expect(true).to.be.false; // Should fail if it didn't throw an error
      } catch (e) {
        // Then
        expect(distanceControl.element).to.be.null;
        expect(e).to.be.instanceOf(View3DError);
        expect(e.code).to.equal(ERROR.CODES.ADD_CONTROL_FIRST);
      }
    });

    it("should add touch/wheel event listeners", () => {
      // Given
      const testElement = document.createElement("div");
      const distanceControl = new DistanceControl();
      distanceControl.setElement(testElement);

      const addEventSpy = sinon.spy(testElement, "addEventListener");

      // When
      distanceControl.enable();

      // Then
      const listenersShouldBeAdded = new Set([EVENTS.TOUCH_MOVE, EVENTS.TOUCH_END, EVENTS.WHEEL]);
      const listenersAdded = addEventSpy.args.map(args => args[0]); // Take the first argument(event name) only

      expect(listenersAdded.length).to.greaterThan(0);
      expect(listenersAdded.every(eventName => listenersShouldBeAdded.has(eventName))).to.be.true;
    });

    it("should return enabled as true after enabling it", () => {
      // Given
      const testElement = document.createElement("div");
      const distanceControl = new DistanceControl();
      distanceControl.setElement(testElement);

      // When
      distanceControl.enable();

      // Then
      expect(distanceControl.enabled).to.be.true;
    });
  });

  describe("Disabling Control", () => {
    it("should remove all relevant event listeners", () => {
      // Given
      const testElement = document.createElement("div");
      const distanceControl = new DistanceControl();
      distanceControl.setElement(testElement);
      distanceControl.enable(); // It should be enabled first

      const removeEventSpy = sinon.spy(testElement, "removeEventListener");

      // When
      distanceControl.disable();

      // Then
      const listenersShouldBeRemoved = new Set([
        EVENTS.TOUCH_START, EVENTS.TOUCH_MOVE, EVENTS.TOUCH_END, EVENTS.WHEEL,
      ]);
      const listenersRemoved = removeEventSpy.args.map(args => args[0]); // Take the first argument(event name) only
      expect(listenersRemoved.length).to.greaterThan(0);
      expect(listenersRemoved.every(eventName => listenersShouldBeRemoved.has(eventName))).to.be.true;
    });

    it("should return enabled as false after disabling it", () => {
      // Given
      const testElement = document.createElement("div");
      const distanceControl = new DistanceControl();
      distanceControl.setElement(testElement);
      distanceControl.enable();

      // When
      distanceControl.disable();

      // Then
      expect(distanceControl.enabled).to.be.false;
    });
  });

  describe("Changing scale", () => {
    it("should permit positive value", () => {
      // Given
      const distanceControl = new DistanceControl();
      const newScale = 4;

      // When
      distanceControl.scale = newScale;

      // Then
      expect(distanceControl.scale).to.equal(newScale);
    });

    it("should permit 0", () => {
      // Given
      const distanceControl = new DistanceControl();

      // When
      distanceControl.scale = 0;

      // Then
      expect(distanceControl.scale).to.equal(0);
    });

    it("should permit negative value", () => {
      // Given
      const distanceControl = new DistanceControl();
      const newScale = -4;

      // When
      distanceControl.scale = newScale;

      // Then
      expect(distanceControl.scale).to.equal(newScale);
    });
  });
});
