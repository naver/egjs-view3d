import ZoomControl from "~/control/ZoomControl";
import View3DError from "~/core/View3DError";
import ERROR from "~/const/error";
import * as BROWSER from "~/const/browser";
import { createView3D } from "../../test-utils";

describe("ZoomControl", () => {
  describe("Initial state", () => {
    it("should have scale value as 1", async () => {
      const view3D = await createView3D();
      expect(new ZoomControl(view3D).scale).to.equal(1);
    });

    it("is not enabled by default", async () => {
      const view3D = await createView3D();
      expect(new ZoomControl(view3D).enabled).to.be.false;
    });
  });

  describe("Destroy", () => {
    it("should call disable when destroying", async () => {
      const view3D = await createView3D();
      const distanceControl = new ZoomControl(view3D);
      const disableSpy = Cypress.sinon.spy(distanceControl, "disable");

      distanceControl.destroy();

      expect(disableSpy.calledOnce).to.be.true;
    });
  });

  describe("Enabling Control", () => {
    it("should add touch/wheel event listeners", async () => {
      const view3D = await createView3D();
      const distanceControl = new ZoomControl(view3D);
      const addEventSpy = Cypress.sinon.spy(view3D.renderer.canvas, "addEventListener");

      distanceControl.enable();

      const listenersShouldBeAdded = new Set([BROWSER.EVENTS.TOUCH_MOVE, BROWSER.EVENTS.TOUCH_END, BROWSER.EVENTS.WHEEL]);
      const listenersAdded = addEventSpy.args.map(args => args[0]); // Take the first argument(event name) only

      expect(listenersAdded.length).to.greaterThan(0);
      expect(listenersAdded.every(eventName => listenersShouldBeAdded.has(eventName))).to.be.true;
    });

    it("should return enabled as true after enabling it", async () => {
      const view3D = await createView3D();
      const distanceControl = new ZoomControl(view3D);

      distanceControl.enable();

      expect(distanceControl.enabled).to.be.true;
    });
  });

  describe("Disabling Control", () => {
    it("should remove all relevant event listeners", async () => {
      const view3D = await createView3D();
      const distanceControl = new ZoomControl(view3D);
      const removeEventSpy = Cypress.sinon.spy(view3D.renderer.canvas, "removeEventListener");

      distanceControl.enable(); // It should be enabled first
      distanceControl.disable();

      const listenersShouldBeRemoved = new Set([
        BROWSER.EVENTS.TOUCH_START, BROWSER.EVENTS.TOUCH_MOVE, BROWSER.EVENTS.TOUCH_END, BROWSER.EVENTS.WHEEL
      ]);
      const listenersRemoved = removeEventSpy.args.map(args => args[0]); // Take the first argument(event name) only
      expect(listenersRemoved.length).to.greaterThan(0);
      expect(listenersRemoved.every(eventName => listenersShouldBeRemoved.has(eventName))).to.be.true;
    });

    it("should return enabled as false after disabling it", async () => {
      const view3D = await createView3D();
      const distanceControl = new ZoomControl(view3D);

      distanceControl.enable();
      distanceControl.disable();

      expect(distanceControl.enabled).to.be.false;
    });
  });

  describe("Changing scale", () => {
    it("should permit positive value", async () => {
      const view3D = await createView3D();
      const distanceControl = new ZoomControl(view3D);
      const newScale = 4;

      distanceControl.scale = newScale;

      expect(distanceControl.scale).to.equal(newScale);
    });

    it("should permit 0", async () => {
      const view3D = await createView3D();
      const distanceControl = new ZoomControl(view3D);

      distanceControl.scale = 0;

      expect(distanceControl.scale).to.equal(0);
    });

    it("should permit negative value", async () => {
      const view3D = await createView3D();
      const distanceControl = new ZoomControl(view3D);
      const newScale = -4;

      distanceControl.scale = newScale;

      expect(distanceControl.scale).to.equal(newScale);
    });
  });
});
