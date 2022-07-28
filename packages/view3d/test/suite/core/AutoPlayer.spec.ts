import AutoPlayer from "~/core/AutoPlayer";
import View3DError from "~/core/View3DError";
import ERROR from "~/const/error";
import * as BROWSER from "~/const/browser";
import { createView3D } from "../../test-utils";

describe("AutoPlayer", () => {
  describe("Initial State", () => {
    it("should have default delay as 2000", async () => {
      const view3D = await createView3D();
      expect(new AutoPlayer(view3D).delay).to.equal(2000);
    });

    it("should have default delayOnMouseLeave as 0", async () => {
      const view3D = await createView3D();
      expect(new AutoPlayer(view3D).delayOnMouseLeave).to.equal(0);
    });

    it("should have default speed as 1", async () => {
      const view3D = await createView3D();
      expect(new AutoPlayer(view3D).speed).to.equal(1);
    });

    it("should have default pauseOnHover as false", async () => {
      const view3D = await createView3D();
      expect(new AutoPlayer(view3D).pauseOnHover).to.be.false;
    });

    it("should have default canInterrupt as true", async () => {
      const view3D = await createView3D();
      expect(new AutoPlayer(view3D).canInterrupt).to.be.true;
    });

    it("should have default disableOnInterrupt as false", async () => {
      const view3D = await createView3D();
      expect(new AutoPlayer(view3D).disableOnInterrupt).to.be.false;
    });

    it("is not enabled by default", async () => {
      const view3D = await createView3D();
      expect(new AutoPlayer(view3D).enabled).to.be.false;
    });
  });

  it("should call disable on destroy", async () => {
    const view3D = await createView3D();
    const autoControl = new AutoPlayer(view3D);
    const disableSpy = Cypress.sinon.spy();
    autoControl.disable = disableSpy;

    autoControl.destroy();

    expect(disableSpy.calledOnce).to.be.true;
  });

  describe("Enabling", () => {
    it("should add mouse/touch/wheel event listeners to canvas", async () => {
      const view3D = await createView3D();
      const autoControl = new AutoPlayer(view3D);
      const addEventSpy = Cypress.sinon.spy(view3D.renderer.canvas, "addEventListener");

      autoControl.enable();

      const listenersShouldBeAdded = new Set([BROWSER.EVENTS.MOUSE_DOWN, BROWSER.EVENTS.TOUCH_START, BROWSER.EVENTS.TOUCH_END, BROWSER.EVENTS.MOUSE_ENTER, BROWSER.EVENTS.MOUSE_LEAVE, BROWSER.EVENTS.WHEEL]);
      const listenersAdded = addEventSpy.args.map(args => args[0]); // Take the first argument(event name) only

      expect(listenersAdded.length).to.greaterThan(0);
      expect(listenersAdded.every(eventName => listenersShouldBeAdded.has(eventName))).to.be.true;
    });

    it("should return enabled as true after enabling it", async () => {
      const view3D = await createView3D();
      const autoControl = new AutoPlayer(view3D);

      autoControl.enable();

      expect(autoControl.enabled).to.be.true;
    });
  });

  describe("Disabling Control", () => {
    it("should remove all relevant event listeners from the canvas element", async () => {
      const view3D = await createView3D();
      const autoControl = new AutoPlayer(view3D);
      autoControl.enable(); // It should be enabled first

      const removeEventSpy = Cypress.sinon.spy(view3D.renderer.canvas, "removeEventListener");

      autoControl.disable();

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

    it("should return enabled as false after disabling it", async () => {
      const view3D = await createView3D();
      const autoControl = new AutoPlayer(view3D);
      autoControl.enable();

      autoControl.disable();

      expect(autoControl.enabled).to.be.false;
    });
  });
});
