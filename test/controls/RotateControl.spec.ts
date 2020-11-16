import RotateControl from "~/controls/RotateControl";
import View3DError from "~/View3DError";
import * as ERROR from "~/consts/error";
import { EVENTS } from "~/consts/event";

describe("RotateControl", () => {
  describe("Initial state", () => {
    it("should have target element as null", () => {
      // Given & When
      const rotateControl = new RotateControl();

      // Then
      expect(rotateControl.element).toBeNull();
    });

    it("should have both scale value as 1", () => {
      // Given & When
      const rotateControl = new RotateControl();

      // Then
      expect(rotateControl.scale.x).toBe(1);
      expect(rotateControl.scale.x).toBe(1);
    });

    it("is not enabled by default", () => {
      // Given & When
      const rotateControl = new RotateControl();

      // Then
      expect(rotateControl.enabled).toBeFalsy();
    });

    it("should use grab cursor by default", () => {
      // Given & When
      const rotateControl = new RotateControl();

      // Then
      expect(rotateControl.useGrabCursor).toBeTruthy();
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
      expect(beforeSetting).toBeNull();
      expect(afterSetting).not.toBeNull();
    });
  });

  describe("Destroy", () => {
    it("should call disable when destroying", () => {
      // Given
      const rotateControl = new RotateControl();
      const disableSpy = jest.spyOn(rotateControl, "disable");

      // When
      rotateControl.destroy();

      // Then
      expect(disableSpy.mock.calls.length).toBe(1);
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
        expect(true).toBeFalsy(); // Should fail if it didn't throw an error
      } catch (e) {
        // Then
        expect(rotateControl.element).toBeNull();
        expect(e).toBeInstanceOf(View3DError);
        expect(e.code).toBe(ERROR.CODES.ADD_CONTROL_FIRST);
      }
    });

    it("should add both mouse/touch event listeners", () => {
      // Given
      const testElement = document.createElement("div");
      const rotateControl = new RotateControl();
      rotateControl.setElement(testElement);

      const addEventSpy = jest.spyOn(testElement, "addEventListener");

      // When
      rotateControl.enable();

      // Then
      const listenersShouldBeAdded = new Set([EVENTS.MOUSE_DOWN, EVENTS.TOUCH_START, EVENTS.TOUCH_MOVE, EVENTS.TOUCH_END]);
      const listenersAdded = addEventSpy.mock.calls.map(call => call[0]); // Take the first argument(event name) only
      expect(listenersAdded.length).toBeGreaterThan(0);
      expect(listenersAdded.every(eventName => listenersShouldBeAdded.has(eventName))).toBeTruthy();
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
      expect(cursorBeforeEnable).toBe("");
      expect(cursorAfterEnable).toBe("grab");
    });

    it("should return enabled as true after enabling it", () => {
      // Given
      const testElement = document.createElement("div");
      const rotateControl = new RotateControl();
      rotateControl.setElement(testElement);

      // When
      rotateControl.enable();

      // Then
      expect(rotateControl.enabled).toBeTruthy();
    });
  });

  describe("Disabling Control", () => {
    it("should remove all relevant event listeners", () => {
      // Given
      const testElement = document.createElement("div");
      const rotateControl = new RotateControl();
      rotateControl.setElement(testElement);
      rotateControl.enable(); // It should be enabled first

      const removeEventSpy = jest.spyOn(testElement, "removeEventListener");

      // When
      rotateControl.disable();

      // Then
      const listenersShouldBeRemoved = new Set([
        EVENTS.MOUSE_DOWN, EVENTS.MOUSE_MOVE, EVENTS.MOUSE_UP,
        EVENTS.TOUCH_START, EVENTS.TOUCH_MOVE, EVENTS.TOUCH_END,
      ]);
      const listenersRemoved = removeEventSpy.mock.calls.map(call => call[0]); // Take the first argument(event name) only
      expect(listenersRemoved.length).toBeGreaterThan(0);
      expect(listenersRemoved.every(eventName => listenersShouldBeRemoved.has(eventName))).toBeTruthy();
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
      expect(cursorBeforeDisable).toBe("grab");
      expect(cursorAfterDisable).toBe("");
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
      expect(rotateControl.enabled).toBeFalsy();
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
      expect(cursorBeforeChange).toBe("");
      expect(cursorAfterChange).toBe("grab");
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
      expect(cursorBeforeChange).toBe("grab");
      expect(cursorAfterChange).toBe("");
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
      expect(rotateControl.scale.x).toBe(newScaleX);
      expect(rotateControl.scale.y).toBe(newScaleY);
    });

    it("should permit 0", () => {
      // Given
      const rotateControl = new RotateControl();

      // When
      rotateControl.scale.setX(0);
      rotateControl.scale.setY(0);

      // Then
      expect(rotateControl.scale.x).toBe(0);
      expect(rotateControl.scale.y).toBe(0);
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
      expect(rotateControl.scale.x).toBe(newScaleX);
      expect(rotateControl.scale.y).toBe(newScaleY);
    });
  });
});
