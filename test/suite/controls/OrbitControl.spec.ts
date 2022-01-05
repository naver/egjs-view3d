import OrbitControl from "~/control/OrbitControl";
import RotateControl from "~/control/RotateControl";
import TranslateControl from "~/control/TranslateControl";
import ZoomControl from "~/control/ZoomControl";
import View3DError from "~/core/View3DError";
import Camera from "~/core/Camera";
import ERROR from "~/const/error";
import { createView3D } from "../../test-utils";

describe("OrbitControl", () => {
  describe("Initial states", () => {
    it("should have rotate control in it", async () => {
      const view3D = await createView3D();
      expect(new OrbitControl(view3D).rotate).to.be.instanceOf(RotateControl);
    });

    it("should have translate control in it", async () => {
      const view3D = await createView3D();
      expect(new OrbitControl(view3D).translate).to.be.instanceOf(TranslateControl);
    });

    it("should have zoom control in it", async () => {
      const view3D = await createView3D();
      expect(new OrbitControl(view3D).zoom).to.be.instanceOf(ZoomControl);
    });

    it("is not enabled by default", async () => {
      const view3D = await createView3D();
      const control = new OrbitControl(view3D);

      expect(control.rotate.enabled).to.be.false;
      expect(control.translate.enabled).to.be.false;
      expect(control.zoom.enabled).to.be.false;
    });
  });

  describe("destroy", () => {
    it("should call all child control's destroy", async () => {
      const view3D = await createView3D();
      const orbitControl = new OrbitControl(view3D);

      const rotateSpy = Cypress.sinon.spy(orbitControl.rotate, "destroy");
      const translateSpy = Cypress.sinon.spy(orbitControl.translate, "destroy");
      const zoomSpy = Cypress.sinon.spy(orbitControl.zoom, "destroy");
      orbitControl.destroy();

      expect(rotateSpy.calledOnce).to.be.true;
      expect(translateSpy.calledOnce).to.be.true;
      expect(zoomSpy.calledOnce).to.be.true;
    });
  });

  describe("enable", () => {
    it("should call all child control's enable", async () => {
      const view3D = await createView3D();
      const orbitControl = new OrbitControl(view3D);

      const rotateSpy = Cypress.sinon.spy(orbitControl.rotate, "enable");
      const translateSpy = Cypress.sinon.spy(orbitControl.translate, "enable");
      const zoomSpy = Cypress.sinon.spy(orbitControl.zoom, "enable");

      orbitControl.enable();

      expect(rotateSpy.calledOnce).to.be.true;
      expect(translateSpy.calledOnce).to.be.true;
      expect(zoomSpy.calledOnce).to.be.true;
    });
  });

  describe("disable", () => {
    it("should return enabled as false after disabling it", async () => {
      const view3D = await createView3D();
      const orbitControl = new OrbitControl(view3D);

      orbitControl.enable();
      orbitControl.disable();

      expect(orbitControl.rotate.enabled).to.be.false;
      expect(orbitControl.translate.enabled).to.be.false;
      expect(orbitControl.zoom.enabled).to.be.false;
    });

    it("should call all child control's disable", async () => {
      const view3D = await createView3D();
      const orbitControl = new OrbitControl(view3D);
      const rotateSpy = Cypress.sinon.spy(orbitControl.rotate, "disable");
      const translateSpy = Cypress.sinon.spy(orbitControl.translate, "disable");
      const zoomSpy = Cypress.sinon.spy(orbitControl.zoom, "disable");

      orbitControl.enable();
      orbitControl.disable();

      expect(rotateSpy.calledOnce).to.be.true;
      expect(translateSpy.calledOnce).to.be.true;
      expect(zoomSpy.calledOnce).to.be.true;
    });
  });

  describe("sync", () => {
    it("should call all child control's sync", async () => {
      const view3D = await createView3D();
      const orbitControl = new OrbitControl(view3D);

      const rotateSpy = Cypress.sinon.spy(orbitControl.rotate, "sync");
      const translateSpy = Cypress.sinon.spy(orbitControl.translate, "sync");
      const zoomSpy = Cypress.sinon.spy(orbitControl.zoom, "sync");

      orbitControl.sync();

      expect(rotateSpy.calledOnce).to.be.true;
      expect(translateSpy.calledOnce).to.be.true;
      expect(zoomSpy.calledOnce).to.be.true;
    });
  });
});
