import TranslateControl from "~/control/TranslateControl";
import View3DError from "~/core/View3DError";
import ERROR from "~/const/error";
import * as BROWSER from "~/const/browser";
import { createView3D } from "../../test-utils";

describe("TranslateControl", () => {
  describe("Initial state", () => {
    it("should have both scale value as 1", async () => {
      const view3D = await createView3D();
      const translateControl = new TranslateControl(view3D);

      expect(translateControl.scale).to.equal(1);
    });

    it("is not enabled by default", async () => {
      const view3D = await createView3D();
      expect(new TranslateControl(view3D).enabled).to.be.false;
    });
  });

  describe("Destroy", () => {
    it("should call disable when destroying", async () => {
      const view3D = await createView3D();
      const translateControl = new TranslateControl(view3D);
      const disableSpy = Cypress.sinon.spy(translateControl, "disable");

      translateControl.destroy();

      expect(disableSpy.calledOnce).to.be.true;
    });
  });

  describe("Enabling Control", () => {
    it("should add both mouse/touch event listeners to the canvas element", async () => {
      const view3D = await createView3D();
      const translateControl = new TranslateControl(view3D);
      const addEventSpy = Cypress.sinon.spy(view3D.renderer.canvas, "addEventListener");

      translateControl.enable();

      const listenersShouldBeAdded = new Set([BROWSER.EVENTS.MOUSE_DOWN, BROWSER.EVENTS.TOUCH_START, BROWSER.EVENTS.TOUCH_MOVE, BROWSER.EVENTS.TOUCH_END, BROWSER.EVENTS.CONTEXT_MENU]);
      const listenersAdded = addEventSpy.args.map(args => args[0]); // Take the first argument(event name) only

      expect(listenersAdded.length).to.greaterThan(0);
      expect(listenersAdded.every(eventName => listenersShouldBeAdded.has(eventName))).to.be.true;
    });

    it("should return enabled as true after enabling it", async () => {
      const view3D = await createView3D();
      const translateControl = new TranslateControl(view3D);

      translateControl.enable();

      expect(translateControl.enabled).to.be.true;
    });
  });

  describe("Disabling Control", () => {
    it("should remove all relevant event listeners", async () => {
      const view3D = await createView3D();
      const translateControl = new TranslateControl(view3D);
      const removeEventSpy = Cypress.sinon.spy(view3D.renderer.canvas, "removeEventListener");

      translateControl.enable(); // It should be enabled first
      translateControl.disable();

      const listenersShouldBeRemoved = new Set([
        BROWSER.EVENTS.MOUSE_DOWN, BROWSER.EVENTS.MOUSE_MOVE, BROWSER.EVENTS.MOUSE_UP,
        BROWSER.EVENTS.TOUCH_START, BROWSER.EVENTS.TOUCH_MOVE, BROWSER.EVENTS.TOUCH_END,
        BROWSER.EVENTS.CONTEXT_MENU
      ]);
      const listenersRemoved = removeEventSpy.args.map(args => args[0]); // Take the first argument(event name) only
      expect(listenersRemoved.length).to.greaterThan(0);
      expect(listenersRemoved.every(eventName => listenersShouldBeRemoved.has(eventName))).to.be.true;
    });
    it("should return enabled as false after disabling it", async () => {
      const view3D = await createView3D();
      const translateControl = new TranslateControl(view3D);

      translateControl.enable();
      translateControl.disable();

      expect(translateControl.enabled).to.be.false;
    });
  });

  describe("Changing scale", () => {
    it("should permit positive value", async () => {
      const view3D = await createView3D();
      const translateControl = new TranslateControl(view3D, { scale: 4 });

      expect(translateControl.scale).to.equal(4);
    });

    it("should permit 0", async () => {
      const view3D = await createView3D();
      const translateControl = new TranslateControl(view3D, { scale: 0 });

      expect(translateControl.scale).to.equal(0);
    });

    it("should permit negative value", async () => {
      const view3D = await createView3D();
      const translateControl = new TranslateControl(view3D, { scale: -4 });

      expect(translateControl.scale).to.equal(-4);
    });
  });
});
