import ZoomControl from "~/control/ZoomControl";
import * as BROWSER from "~/const/browser";
import * as DEFAULT from "~/const/default";
import { createView3D } from "../../test-utils";

describe("ZoomControl", () => {
  describe("Initial state", () => {
    it("should have 1 as default scale", async () => {
      const view3D = await createView3D();
      expect(new ZoomControl(view3D).scale).to.equal(1);
    });

    it("should have 300 as default duration", async () => {
      const view3D = await createView3D();
      expect(new ZoomControl(view3D).duration).to.equal(300);
    });

    it("should have 1 as default minimum fov", async () => {
      const view3D = await createView3D();
      expect(new ZoomControl(view3D).minFov).to.equal(1);
    });

    it("should have 'auto' as default maximum fov", async () => {
      const view3D = await createView3D();
      expect(new ZoomControl(view3D).maxFov).to.equal("auto");
    });

    it("should have 'DEFAULT.EASING' as default easing", async () => {
      const view3D = await createView3D();
      expect(new ZoomControl(view3D).easing).to.equal(DEFAULT.EASING);
    });

    it("is not enabled by default", async () => {
      const view3D = await createView3D();
      expect(new ZoomControl(view3D).enabled).to.be.false;
    });
  });

  describe("Destroy", () => {
    it("should call disable when destroying", async () => {
      const view3D = await createView3D();
      const zoomControl = new ZoomControl(view3D);
      const disableSpy = Cypress.sinon.spy(zoomControl, "disable");

      zoomControl.destroy();

      expect(disableSpy.calledOnce).to.be.true;
    });
  });

  describe("Enabling Control", () => {
    it("should add touch/wheel event listeners", async () => {
      const view3D = await createView3D();
      const zoomControl = new ZoomControl(view3D);
      const addEventSpy = Cypress.sinon.spy(view3D.renderer.canvas, "addEventListener");

      zoomControl.enable();

      const listenersShouldBeAdded = new Set([BROWSER.EVENTS.TOUCH_MOVE, BROWSER.EVENTS.TOUCH_END, BROWSER.EVENTS.WHEEL]);
      const listenersAdded = addEventSpy.args.map(args => args[0]); // Take the first argument(event name) only

      expect(listenersAdded.length).to.greaterThan(0);
      expect(listenersAdded.every(eventName => listenersShouldBeAdded.has(eventName))).to.be.true;
    });

    it("should return enabled as true after enabling it", async () => {
      const view3D = await createView3D();
      const zoomControl = new ZoomControl(view3D);

      zoomControl.enable();

      expect(zoomControl.enabled).to.be.true;
    });
  });

  describe("Disabling Control", () => {
    it("should remove all relevant event listeners", async () => {
      const view3D = await createView3D();
      const zoomControl = new ZoomControl(view3D);
      const removeEventSpy = Cypress.sinon.spy(view3D.renderer.canvas, "removeEventListener");

      zoomControl.enable(); // It should be enabled first
      zoomControl.disable();

      const listenersShouldBeRemoved = new Set([
        BROWSER.EVENTS.TOUCH_START, BROWSER.EVENTS.TOUCH_MOVE, BROWSER.EVENTS.TOUCH_END, BROWSER.EVENTS.WHEEL
      ]);
      const listenersRemoved = removeEventSpy.args.map(args => args[0]); // Take the first argument(event name) only
      expect(listenersRemoved.length).to.greaterThan(0);
      expect(listenersRemoved.every(eventName => listenersShouldBeRemoved.has(eventName))).to.be.true;
    });

    it("should return enabled as false after disabling it", async () => {
      const view3D = await createView3D();
      const zoomControl = new ZoomControl(view3D);

      zoomControl.enable();
      zoomControl.disable();

      expect(zoomControl.enabled).to.be.false;
    });
  });

  describe("Changing scale", () => {
    it("should permit positive value", async () => {
      const view3D = await createView3D();
      const zoomControl = new ZoomControl(view3D);
      const newScale = 4;

      zoomControl.scale = newScale;

      expect(zoomControl.scale).to.equal(newScale);
    });

    it("should permit 0", async () => {
      const view3D = await createView3D();
      const zoomControl = new ZoomControl(view3D);

      zoomControl.scale = 0;

      expect(zoomControl.scale).to.equal(0);
    });

    it("should permit negative value", async () => {
      const view3D = await createView3D();
      const zoomControl = new ZoomControl(view3D);
      const newScale = -4;

      zoomControl.scale = newScale;

      expect(zoomControl.scale).to.equal(newScale);
    });
  });

  describe("updateRange", () => {
    it("should update its range.max to 45 if maxFov is 'auto'", async () => {
      const view3D = await createView3D();
      const zoomControl = new ZoomControl(view3D);

      const baseFovStub = Cypress.sinon.stub(view3D.camera, "baseFov");
      baseFovStub.get(() => 45);
      zoomControl.updateRange();

      expect(zoomControl.range.max).to.equal(45);
    });

    it("should set range.max to be Math.min(baseFov + 45, 175) - baseFov when setting range.max", async () => {
      const view3D = await createView3D();
      const zoomControl = new ZoomControl(view3D);

      const baseFovStub = Cypress.sinon.stub(view3D.camera, "baseFov");
      baseFovStub.get(() => 180 - 45);
      zoomControl.updateRange();

      expect(zoomControl.range.max).to.equal(40);
    });

    it("should set range.max to maxFov - baseFov if maxFov is given", async () => {
      const view3D = await createView3D();
      const zoomControl = new ZoomControl(view3D, { maxFov: 100 });

      const baseFovStub = Cypress.sinon.stub(view3D.camera, "baseFov");
      baseFovStub.get(() => 45);
      zoomControl.updateRange();

      expect(zoomControl.range.max).to.equal(100 - 45);
    });
  });
});
