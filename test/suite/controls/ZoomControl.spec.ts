import ZoomControl from "~/control/ZoomControl";
import * as BROWSER from "~/const/browser";
import * as DEFAULT from "~/const/default";
import { createView3D, wait } from "../../test-utils";

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

    it("should have true as default doubleTap", async () => {
      const view3D = await createView3D();
      expect(new ZoomControl(view3D).doubleTap).to.be.true;
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

      const listenersShouldBeAdded = [BROWSER.EVENTS.TOUCH_MOVE, BROWSER.EVENTS.TOUCH_END, BROWSER.EVENTS.WHEEL, BROWSER.EVENTS.DOUBLE_CLICK];
      const listenersAdded = addEventSpy.args.map(args => args[0]); // Take the first argument(event name) only

      expect(listenersAdded.length).to.greaterThan(0);
      expect(listenersShouldBeAdded.every(eventName => listenersAdded.findIndex(listener => listener === eventName) >= 0)).to.be.true;
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

      const listenersShouldBeRemoved = [
        BROWSER.EVENTS.TOUCH_MOVE, BROWSER.EVENTS.TOUCH_END, BROWSER.EVENTS.WHEEL, BROWSER.EVENTS.DOUBLE_CLICK
      ];
      const listenersRemoved = removeEventSpy.args.map(args => args[0]); // Take the first argument(event name) only

      expect(listenersRemoved.length).to.greaterThan(0);
      expect(listenersShouldBeRemoved.every(eventName => listenersRemoved.findIndex(listener => listener === eventName) >= 0)).to.be.true;
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

  describe("Double tap to zoom", () => {
    it("should zoom in on double tap", async () => {
      const view3D = await createView3D({ src: "/alarm.glb", zoom: { doubleTap: { duration: 0 } } });
      const canvas = view3D.renderer.canvas;

      const prevZoom = view3D.camera.zoom;
      const doubleTapEvt = new MouseEvent("dblclick", {
        offsetX: canvas.clientWidth / 2,
        offsetY: canvas.clientWidth / 2
      } as any);
      view3D.renderer.canvas.dispatchEvent(doubleTapEvt);

      const newZoom = view3D.camera.zoom;

      expect(newZoom).not.to.equal(prevZoom);
      expect(newZoom).to.equal(-view3D.control.zoom.range.min * 0.8);
    });

    it("should not zoom in on double tap if doubleTap is false", async () => {
      const view3D = await createView3D({ src: "/alarm.glb", zoom: { doubleTap: false } });
      const canvas = view3D.renderer.canvas;

      const prevZoom = view3D.camera.zoom;
      const doubleTapEvt = new MouseEvent("dblclick", {
        offsetX: canvas.clientWidth / 2,
        offsetY: canvas.clientWidth / 2
      } as any);
      view3D.renderer.canvas.dispatchEvent(doubleTapEvt);
      await wait(1000);

      const newZoom = view3D.camera.zoom;

      expect(newZoom).to.equal(prevZoom);
    });

    it("should zoom out on second double tap", async () => {
      const view3D = await createView3D({ src: "/alarm.glb", zoom: { doubleTap: { duration: 0 } } });
      const canvas = view3D.renderer.canvas;

      const prevZoom = view3D.camera.zoom;
      const doubleTapEvt = new MouseEvent("dblclick", {
        offsetX: canvas.clientWidth / 2,
        offsetY: canvas.clientWidth / 2
      } as any);
      view3D.renderer.canvas.dispatchEvent(doubleTapEvt);
      view3D.renderer.canvas.dispatchEvent(doubleTapEvt);

      const newZoom = view3D.camera.zoom;

      expect(newZoom).to.equal(0);
    });

    it("should not zoom out on second double tap when useZoomOut is false", async () => {
      const view3D = await createView3D({ src: "/alarm.glb", zoom: { doubleTap: { duration: 0, useZoomOut: false } } });
      const canvas = view3D.renderer.canvas;

      const prevZoom = view3D.camera.zoom;
      const doubleTapEvt = new MouseEvent("dblclick", {
        offsetX: canvas.clientWidth / 2,
        offsetY: canvas.clientWidth / 2
      } as any);
      view3D.renderer.canvas.dispatchEvent(doubleTapEvt);
      view3D.renderer.canvas.dispatchEvent(doubleTapEvt);

      const newZoom = view3D.camera.zoom;

      expect(newZoom).not.to.equal(prevZoom);
      expect(newZoom).to.equal(-view3D.control.zoom.range.min * 0.8);
    });
  });
});
