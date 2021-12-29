import * as sinon from "sinon";

import TranslateControl from "~/controls/TranslateControl";
import View3DError from "~/View3DError";
import ERROR from "~/consts/error";
import * as BROWSER from "~/consts/browser";

describe("TranslateControl", () => {
  describe("Initial state", () => {
    it("should have target element as null", () => {
      expect(new TranslateControl().element).to.be.null;
    });

    it("should have both scale value as 1", () => {
      // Given & When
      const translateControl = new TranslateControl();

      // Then
      expect(translateControl.scale.x).to.equal(1);
      expect(translateControl.scale.x).to.equal(1);
    });

    it("should use grab cursor by default", () => {
      expect(new TranslateControl().useGrabCursor).to.be.true;
    });

    it("should set scaleToElement to true by default", () => {
      expect(new TranslateControl().scaleToElement).to.true;
    });

    it("is not enabled by default", () => {
      expect(new TranslateControl().enabled).to.be.false;
    });
  });

  describe("Setting an element", () => {
    it("can return non-null element after setting an element", () => {
      // Given
      const translateControl = new TranslateControl();

      // When
      const beforeSetting = translateControl.element;
      translateControl.setElement(document.createElement("div"));
      const afterSetting = translateControl.element;

      // Then
      expect(beforeSetting).to.be.null;
      expect(afterSetting).not.to.be.null;
    });
  });

  describe("Destroy", () => {
    it("should call disable when destroying", () => {
      // Given
      const translateControl = new TranslateControl();
      const disableSpy = sinon.spy(translateControl, "disable");

      // When
      translateControl.destroy();

      // Then
      expect(disableSpy.calledOnce).to.be.true;
    });
  });

  describe("Enabling Control", () => {
    it("should throw an 'Add control first' error when target element not set yet", () => {
      // Given & When
      const translateControl = new TranslateControl();
      translateControl.enable.bind(translateControl);

      try {
        // When
        translateControl.enable();
        expect(true).to.be.false; // Should fail if it didn't throw an error
      } catch (e) {
        // Then
        expect(translateControl.element).to.be.null;
        expect(e).to.be.instanceOf(View3DError);
        expect(e.code).to.equal(ERROR.CODES.ADD_CONTROL_FIRST);
      }
    });

    it("should add both mouse/touch event listeners", () => {
      // Given
      const testElement = document.createElement("div");
      const translateControl = new TranslateControl();
      translateControl.setElement(testElement);

      const addEventSpy = sinon.spy(testElement, "addEventListener");

      // When
      translateControl.enable();

      // Then
      const listenersShouldBeAdded = new Set([BROWSER.EVENTS.MOUSE_DOWN, BROWSER.EVENTS.TOUCH_START, BROWSER.EVENTS.TOUCH_MOVE, BROWSER.EVENTS.TOUCH_END, BROWSER.EVENTS.CONTEXT_MENU]);
      const listenersAdded = addEventSpy.args.map(args => args[0]); // Take the first argument(event name) only

      expect(listenersAdded.length).to.greaterThan(0);
      expect(listenersAdded.every(eventName => listenersShouldBeAdded.has(eventName))).to.be.true;
    });

    it("should set CSS cursor to 'grab' when useGrabCursor is true", () => {
      // Given
      const testElement = document.createElement("div");
      const translateControl = new TranslateControl();
      translateControl.setElement(testElement);
      translateControl.useGrabCursor = true;

      // When
      const cursorBeforeEnable = testElement.style.cursor;
      translateControl.enable();
      const cursorAfterEnable = testElement.style.cursor;

      // Then
      expect(cursorBeforeEnable).to.equal("");
      expect(cursorAfterEnable).to.equal("grab");
    });

    it("should return enabled as true after enabling it", () => {
      // Given
      const testElement = document.createElement("div");
      const translateControl = new TranslateControl();
      translateControl.setElement(testElement);

      // When
      translateControl.enable();

      // Then
      expect(translateControl.enabled).to.be.true;
    });
  });

  describe("Disabling Control", () => {
    it("should remove all relevant event listeners", () => {
      // Given
      const testElement = document.createElement("div");
      const translateControl = new TranslateControl();
      translateControl.setElement(testElement);
      translateControl.enable(); // It should be enabled first

      const removeEventSpy = sinon.spy(testElement, "removeEventListener");

      // When
      translateControl.disable();

      // Then
      const listenersShouldBeRemoved = new Set([
        BROWSER.EVENTS.MOUSE_DOWN, BROWSER.EVENTS.MOUSE_MOVE, BROWSER.EVENTS.MOUSE_UP,
        BROWSER.EVENTS.TOUCH_START, BROWSER.EVENTS.TOUCH_MOVE, BROWSER.EVENTS.TOUCH_END,
        BROWSER.EVENTS.CONTEXT_MENU
      ]);
      const listenersRemoved = removeEventSpy.args.map(args => args[0]); // Take the first argument(event name) only
      expect(listenersRemoved.length).to.greaterThan(0);
      expect(listenersRemoved.every(eventName => listenersShouldBeRemoved.has(eventName))).to.be.true;
    });

    it("should set CSS cursor to '' when useGrabCursor is true", () => {
      // Given
      const testElement = document.createElement("div");
      const translateControl = new TranslateControl();
      translateControl.setElement(testElement);
      translateControl.useGrabCursor = true;
      translateControl.enable();

      // When
      const cursorBeforeDisable = testElement.style.cursor;
      translateControl.disable();
      const cursorAfterDisable = testElement.style.cursor;

      // Then
      expect(cursorBeforeDisable).to.equal("grab");
      expect(cursorAfterDisable).to.equal("");
    });

    it("should return enabled as false after disabling it", () => {
      // Given
      const testElement = document.createElement("div");
      const translateControl = new TranslateControl();
      translateControl.setElement(testElement);
      translateControl.enable();

      // When
      translateControl.disable();

      // Then
      expect(translateControl.enabled).to.be.false;
    });
  });

  describe("Using grab cursor", () => {
    it("should change cursor to grab immediately after setting value to true", () => {
      // Given
      const testElement = document.createElement("div");
      const translateControl = new TranslateControl();
      translateControl.setElement(testElement);
      translateControl.useGrabCursor = false;
      translateControl.enable();

      // When
      const cursorBeforeChange = testElement.style.cursor;
      translateControl.useGrabCursor = true;
      const cursorAfterChange = testElement.style.cursor;

      // Then
      expect(cursorBeforeChange).to.equal("");
      expect(cursorAfterChange).to.equal("grab");
    });

    it("should change cursor to '' immediately after setting value to false", () => {
      // Given
      const testElement = document.createElement("div");
      const translateControl = new TranslateControl();
      translateControl.setElement(testElement);
      translateControl.useGrabCursor = true;
      translateControl.enable();

      // When
      const cursorBeforeChange = testElement.style.cursor;
      translateControl.useGrabCursor = false;
      const cursorAfterChange = testElement.style.cursor;

      // Then
      expect(cursorBeforeChange).to.equal("grab");
      expect(cursorAfterChange).to.equal("");
    });
  });

  describe("Changing scale", () => {
    it("should permit positive value", () => {
      // Given
      const translateControl = new TranslateControl();
      const newScaleX = 4;
      const newScaleY = 2;

      // When
      translateControl.scale.setX(newScaleX);
      translateControl.scale.setY(newScaleY);

      // Then
      expect(translateControl.scale.x).to.equal(newScaleX);
      expect(translateControl.scale.y).to.equal(newScaleY);
    });

    it("should permit 0", () => {
      // Given
      const translateControl = new TranslateControl();

      // When
      translateControl.scale.setX(0);
      translateControl.scale.setY(0);

      // Then
      expect(translateControl.scale.x).to.equal(0);
      expect(translateControl.scale.y).to.equal(0);
    });

    it("should permit negative value", () => {
      // Given
      const translateControl = new TranslateControl();
      const newScaleX = -4;
      const newScaleY = -2;

      // When
      translateControl.scale.setX(newScaleX);
      translateControl.scale.setY(newScaleY);

      // Then
      expect(translateControl.scale.x).to.equal(newScaleX);
      expect(translateControl.scale.y).to.equal(newScaleY);
    });
  });
});
