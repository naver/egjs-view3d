import Sinon, * as sinon from "sinon";

import AutoControl from "~/controls/AutoControl";
import View3DError from "~/View3DError";
import * as ERROR from "~/consts/error";
import * as BROWSER from "~/consts/browser";

describe("AutoControl", () => {
  let clock: Sinon.SinonFakeTimers;

  before(() => {
    clock = sinon.useFakeTimers();
  });

  beforeEach(() => {
    clock.reset();
  });

  after(() => {
    clock.restore();
  });

  describe("Initial State", () => {
    it("should have target element as null", () => {
      expect(new AutoControl().element).to.be.null;
    });

    it("should have default delay as 2000", () => {
      expect(new AutoControl().delay).to.equal(2000);
    });

    it("should have default delayOnMouseLeave as 0", () => {
      expect(new AutoControl().delayOnMouseLeave).to.equal(0);
    });

    it("should have default speed as 1", () => {
      expect(new AutoControl().speed).to.equal(1);
    });

    it("should have default pauseOnHover as false", () => {
      expect(new AutoControl().pauseOnHover).to.be.false;
    });

    it("should have default canInterrupt as true", () => {
      expect(new AutoControl().canInterrupt).to.be.true;
    });

    it("should have default disableOnInterrupt as false", () => {
      expect(new AutoControl().disableOnInterrupt).to.be.false;
    });

    it("is not enabled by default", () => {
      expect(new AutoControl().enabled).to.be.false;
    });
  });

  it("should call disable on destroy", () => {
    // Given
    const autoControl = new AutoControl();
    const disableSpy = sinon.spy();
    autoControl.disable = disableSpy;

    // When
    autoControl.destroy();

    // Then
    expect(disableSpy.calledOnce).to.be.true;
  });

  describe("Enabling Control", () => {
    it("should throw an 'Add control first' error when target element not set yet", () => {
      // Given & When
      const autoControl = new AutoControl();
      autoControl.enable.bind(autoControl);

      try {
        // When
        autoControl.enable();
        expect(true).to.be.false; // Should fail if it didn't throw an error
      } catch (e) {
        // Then
        expect(autoControl.element).to.be.null;
        expect(e).to.be.instanceOf(View3DError);
        expect(e.code).to.equal(ERROR.CODES.ADD_CONTROL_FIRST);
      }
    });

    it("should add mouse/touch/wheel event listeners", () => {
      // Given
      const testElement = document.createElement("div");
      const autoControl = new AutoControl();
      autoControl.setElement(testElement);

      const addEventSpy = sinon.spy(testElement, "addEventListener");

      // When
      autoControl.enable();

      // Then
      const listenersShouldBeAdded = new Set([BROWSER.EVENTS.MOUSE_DOWN, BROWSER.EVENTS.TOUCH_START, BROWSER.EVENTS.TOUCH_END, BROWSER.EVENTS.MOUSE_ENTER, BROWSER.EVENTS.MOUSE_LEAVE, BROWSER.EVENTS.WHEEL]);
      const listenersAdded = addEventSpy.args.map(args => args[0]); // Take the first argument(event name) only

      expect(listenersAdded.length).to.greaterThan(0);
      expect(listenersAdded.every(eventName => listenersShouldBeAdded.has(eventName))).to.be.true;
    });

    it("should return enabled as true after enabling it", () => {
      // Given
      const testElement = document.createElement("div");
      const autoControl = new AutoControl();
      autoControl.setElement(testElement);

      // When
      autoControl.enable();

      // Then
      expect(autoControl.enabled).to.be.true;
    });
  });

  describe("Disabling Control", () => {
    it("should remove all relevant event listeners", () => {
      // Given
      const testElement = document.createElement("div");
      const autoControl = new AutoControl();
      autoControl.setElement(testElement);
      autoControl.enable(); // It should be enabled first

      const removeEventSpy = sinon.spy(testElement, "removeEventListener");

      // When
      autoControl.disable();

      // Then
      const listenersShouldBeRemoved = new Set([
        BROWSER.EVENTS.MOUSE_DOWN, BROWSER.EVENTS.MOUSE_UP,
        BROWSER.EVENTS.TOUCH_START, BROWSER.EVENTS.TOUCH_END,
        BROWSER.EVENTS.MOUSE_ENTER, BROWSER.EVENTS.MOUSE_LEAVE,
        BROWSER.EVENTS.WHEEL
      ]);
      const listenersRemoved = removeEventSpy.args.map(args => args[0]); // Take the first argument(event name) only
      expect(listenersRemoved.length).to.greaterThan(0);
      expect(listenersRemoved.every(eventName => listenersShouldBeRemoved.has(eventName))).to.be.true;
    });

    it("should return enabled as false after disabling it", () => {
      // Given
      const testElement = document.createElement("div");
      const autoControl = new AutoControl();
      autoControl.setElement(testElement);
      autoControl.enable();

      // When
      autoControl.disable();

      // Then
      expect(autoControl.enabled).to.be.false;
    });
  });
});
