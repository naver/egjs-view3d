import RotateControl from "~/control/RotateControl";
import * as BROWSER from "~/const/browser";
import { createView3D, simulate } from "../../test-utils";

describe("RotateControl", () => {
  describe("Initial state", () => {
    it("should have 1 as the default scale value", async () => {
      const view3D = await createView3D();
      const rotateControl = new RotateControl(view3D);

      expect(rotateControl.scale).to.equal(1);
    });

    it("is not enabled by default", async () => {
      const view3D = await createView3D();

      expect(new RotateControl(view3D).enabled).to.be.false;
    });
  });

  describe("Options", () => {
    describe("disablePitch", () => {
      it("should disable x-axis rotation", async () => {
        const view3D = await createView3D({ rotate: { disablePitch: true } });
        view3D.control.rotate.enable();
        view3D.renderer.setAnimationLoop(view3D.renderer.defaultRenderLoop);

        await simulate(view3D.renderer.canvas, { deltaY: 50 });

        expect(view3D.camera.pitch, "Camera pitch").to.equal(0);
      });
    });
  });

  describe("Destroy", () => {
    it("should call disable when destroying", async () => {
      const view3D = await createView3D();
      const rotateControl = new RotateControl(view3D);
      const disableSpy = Cypress.sinon.spy(rotateControl, "disable");

      rotateControl.destroy();

      expect(disableSpy.calledOnce).to.be.true;
    });
  });

  describe("Enabling Control", () => {
    it("should add both mouse/touch event listeners to the canvas element", async () => {
      const view3D = await createView3D();
      const rotateControl = new RotateControl(view3D);

      const addEventSpy = Cypress.sinon.spy(view3D.renderer.canvas, "addEventListener");

      rotateControl.enable();

      const listenersShouldBeAdded = new Set([BROWSER.EVENTS.MOUSE_DOWN, BROWSER.EVENTS.TOUCH_START, BROWSER.EVENTS.TOUCH_MOVE, BROWSER.EVENTS.TOUCH_END]);
      const listenersAdded = addEventSpy.args.map(args => args[0]); // Take the first argument(event name) only

      expect(listenersAdded.length).to.greaterThan(0);
      expect(listenersAdded.every(eventName => listenersShouldBeAdded.has(eventName))).to.be.true;
    });

    it("should return enabled as true after enabling it", async () => {
      const view3D = await createView3D();
      const rotateControl = new RotateControl(view3D);

      rotateControl.enable();

      expect(rotateControl.enabled).to.be.true;
    });
  });

  describe("Disabling Control", () => {
    it("should remove all relevant event listeners", async () => {
      const view3D = await createView3D();
      const rotateControl = new RotateControl(view3D);
      rotateControl.enable(); // It should be enabled first

      const removeEventSpy = Cypress.sinon.spy(view3D.renderer.canvas, "removeEventListener");

      rotateControl.disable();

      const listenersShouldBeRemoved = new Set([
        BROWSER.EVENTS.MOUSE_DOWN, BROWSER.EVENTS.MOUSE_MOVE, BROWSER.EVENTS.MOUSE_UP,
        BROWSER.EVENTS.TOUCH_START, BROWSER.EVENTS.TOUCH_MOVE, BROWSER.EVENTS.TOUCH_END
      ]);
      const listenersRemoved = removeEventSpy.args.map(args => args[0]); // Take the first argument(event name) only
      expect(listenersRemoved.length).to.greaterThan(0);
      expect(listenersRemoved.every(eventName => listenersShouldBeRemoved.has(eventName))).to.be.true;
    });

    it("should return enabled as false after disabling it", async () => {
      const view3D = await createView3D();
      const rotateControl = new RotateControl(view3D);

      rotateControl.enable();
      rotateControl.disable();

      expect(rotateControl.enabled).to.be.false;
    });
  });

  describe("Changing scale", () => {
    it("should permit positive value", async () => {
      const view3D = await createView3D();
      const rotateControl = new RotateControl(view3D, { scale: 10 });

      expect(rotateControl.scale).to.equal(10);
    });

    it("should permit 0", async () => {
      const view3D = await createView3D();
      const rotateControl = new RotateControl(view3D, { scale: 0 });

      expect(rotateControl.scale).to.equal(0);
    });

    it("should permit negative value", async () => {
      const view3D = await createView3D();
      const rotateControl = new RotateControl(view3D, { scale: -5 });

      expect(rotateControl.scale).to.equal(-5);
    });
  });
});
