import * as sinon from "sinon";

import RotateControl from "~/controls/RotateControl";
import View3DError from "~/View3DError";
import * as ERROR from "~/consts/error";
import * as BROWSER from "~/consts/browser";

describe("RotateControl", () => {
  describe("Initial state", () => {
    it("should have target element as null", () => {
      expect(new RotateControl().element).to.be.null;
    });

    it("should have both scale value as 1", () => {
      // Given & When
      const rotateControl = new RotateControl();

      // Then
      expect(rotateControl.scale.x).to.equal(1);
      expect(rotateControl.scale.x).to.equal(1);
    });

    it("should use grab cursor by default", () => {
      expect(new RotateControl().useGrabCursor).to.be.true;
    });

    it("should set scaleToElement to true by default", () => {
      expect(new RotateControl().scaleToElement).to.true;
    });

    it("is not enabled by default", () => {
      expect(new RotateControl().enabled).to.be.false;
    });
  });

  describe("Setting an element", () => {
    it("can return non-null element after setting an element", () => {
      // Given
      const rotateControl = new RotateControl();

      // When
      const beforeSetting = rotateControl.element;
      rotateControl.setElement(document.createElement("div"));
      const afterSetting = rotateControl.element;

      // Then
      expect(beforeSetting).to.be.null;
      expect(afterSetting).not.to.be.null;
    });
  });

  describe("Destroy", () => {
    it("should call disable when destroying", () => {
      // Given
      const rotateControl = new RotateControl();
      const disableSpy = sinon.spy(rotateControl, "disable");

      // When
      rotateControl.destroy();

      // Then
      expect(disableSpy.calledOnce).to.be.true;
    });
  });

  describe("Enabling Control", () => {
    it("should throw an 'Add control first' error when target element not set yet", () => {
      // Given & When
      const rotateControl = new RotateControl();
      rotateControl.enable.bind(rotateControl);

      try {
        // When
        rotateControl.enable();
        expect(true).to.be.false; // Should fail if it didn't throw an error
      } catch (e) {
        // Then
        expect(rotateControl.element).to.be.null;
        expect(e).to.be.instanceOf(View3DError);
        expect(e.code).to.equal(ERROR.CODES.ADD_CONTROL_FIRST);
      }
    });

    it("should add both mouse/touch event listeners", () => {
      // Given
      const testElement = document.createElement("div");
      const rotateControl = new RotateControl();
      rotateControl.setElement(testElement);

      const addEventSpy = sinon.spy(testElement, "addEventListener");

      // When
      rotateControl.enable();

      // Then
      const listenersShouldBeAdded = new Set([BROWSER.EVENTS.MOUSE_DOWN, BROWSER.EVENTS.TOUCH_START, BROWSER.EVENTS.TOUCH_MOVE, BROWSER.EVENTS.TOUCH_END]);
      const listenersAdded = addEventSpy.args.map(args => args[0]); // Take the first argument(event name) only

      expect(listenersAdded.length).to.greaterThan(0);
      expect(listenersAdded.every(eventName => listenersShouldBeAdded.has(eventName))).to.be.true;
    });

    it("should set CSS cursor to 'grab' when useGrabCursor is true", () => {
      // Given
      const testElement = document.createElement("div");
      const rotateControl = new RotateControl();
      rotateControl.setElement(testElement);
      rotateControl.useGrabCursor = true;

      // When
      const cursorBeforeEnable = testElement.style.cursor;
      rotateControl.enable();
      const cursorAfterEnable = testElement.style.cursor;

      // Then
      expect(cursorBeforeEnable).to.equal("");
      expect(cursorAfterEnable).to.equal("grab");
    });

    it("should return enabled as true after enabling it", () => {
      // Given
      const testElement = document.createElement("div");
      const rotateControl = new RotateControl();
      rotateControl.setElement(testElement);

      // When
      rotateControl.enable();

      // Then
      expect(rotateControl.enabled).to.be.true;
    });
  });

  describe("Disabling Control", () => {
    it("should remove all relevant event listeners", () => {
      // Given
      const testElement = document.createElement("div");
      const rotateControl = new RotateControl();
      rotateControl.setElement(testElement);
      rotateControl.enable(); // It should be enabled first

      const removeEventSpy = sinon.spy(testElement, "removeEventListener");

      // When
      rotateControl.disable();

      // Then
      const listenersShouldBeRemoved = new Set([
        BROWSER.EVENTS.MOUSE_DOWN, BROWSER.EVENTS.MOUSE_MOVE, BROWSER.EVENTS.MOUSE_UP,
        BROWSER.EVENTS.TOUCH_START, BROWSER.EVENTS.TOUCH_MOVE, BROWSER.EVENTS.TOUCH_END
      ]);
      const listenersRemoved = removeEventSpy.args.map(args => args[0]); // Take the first argument(event name) only
      expect(listenersRemoved.length).to.greaterThan(0);
      expect(listenersRemoved.every(eventName => listenersShouldBeRemoved.has(eventName))).to.be.true;
    });

    it("should set CSS cursor to '' when useGrabCursor is true", () => {
      // Given
      const testElement = document.createElement("div");
      const rotateControl = new RotateControl();
      rotateControl.setElement(testElement);
      rotateControl.useGrabCursor = true;
      rotateControl.enable();

      // When
      const cursorBeforeDisable = testElement.style.cursor;
      rotateControl.disable();
      const cursorAfterDisable = testElement.style.cursor;

      // Then
      expect(cursorBeforeDisable).to.equal("grab");
      expect(cursorAfterDisable).to.equal("");
    });

    it("should return enabled as false after disabling it", () => {
      // Given
      const testElement = document.createElement("div");
      const rotateControl = new RotateControl();
      rotateControl.setElement(testElement);
      rotateControl.enable();

      // When
      rotateControl.disable();

      // Then
      expect(rotateControl.enabled).to.be.false;
    });
  });

  describe("Using grab cursor", () => {
    it("should change cursor to grab immediately after setting value to true", () => {
      // Given
      const testElement = document.createElement("div");
      const rotateControl = new RotateControl();
      rotateControl.setElement(testElement);
      rotateControl.useGrabCursor = false;
      rotateControl.enable();

      // When
      const cursorBeforeChange = testElement.style.cursor;
      rotateControl.useGrabCursor = true;
      const cursorAfterChange = testElement.style.cursor;

      // Then
      expect(cursorBeforeChange).to.equal("");
      expect(cursorAfterChange).to.equal("grab");
    });

    it("should change cursor to '' immediately after setting value to false", () => {
      // Given
      const testElement = document.createElement("div");
      const rotateControl = new RotateControl();
      rotateControl.setElement(testElement);
      rotateControl.useGrabCursor = true;
      rotateControl.enable();

      // When
      const cursorBeforeChange = testElement.style.cursor;
      rotateControl.useGrabCursor = false;
      const cursorAfterChange = testElement.style.cursor;

      // Then
      expect(cursorBeforeChange).to.equal("grab");
      expect(cursorAfterChange).to.equal("");
    });
  });

  describe("Changing scale", () => {
    it("should permit positive value", () => {
      // Given
      const rotateControl = new RotateControl();
      const newScaleX = 4;
      const newScaleY = 2;

      // When
      rotateControl.scale.setX(newScaleX);
      rotateControl.scale.setY(newScaleY);

      // Then
      expect(rotateControl.scale.x).to.equal(newScaleX);
      expect(rotateControl.scale.y).to.equal(newScaleY);
    });

    it("should permit 0", () => {
      // Given
      const rotateControl = new RotateControl();

      // When
      rotateControl.scale.setX(0);
      rotateControl.scale.setY(0);

      // Then
      expect(rotateControl.scale.x).to.equal(0);
      expect(rotateControl.scale.y).to.equal(0);
    });

    it("should permit negative value", () => {
      // Given
      const rotateControl = new RotateControl();
      const newScaleX = -4;
      const newScaleY = -2;

      // When
      rotateControl.scale.setX(newScaleX);
      rotateControl.scale.setY(newScaleY);

      // Then
      expect(rotateControl.scale.x).to.equal(newScaleX);
      expect(rotateControl.scale.y).to.equal(newScaleY);
    });
  });
});
