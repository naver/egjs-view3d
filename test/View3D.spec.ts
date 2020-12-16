import * as sinon from "sinon";
import View3D from "~/View3D";
import { Camera, Controller, Model, ModelAnimator, Renderer, Scene, XRManager } from "~/index";

describe("View3D", () => {
  describe("Default properties", () => {
    it("should have Renderer in it", () => {
      expect(new View3D(document.createElement("canvas")).renderer).to.be.instanceOf(Renderer);
    });

    it("should have Scene in it", () => {
      expect(new View3D(document.createElement("canvas")).scene).to.be.instanceOf(Scene);
    });

    it("should have Camera in it", () => {
      expect(new View3D(document.createElement("canvas")).camera).to.be.instanceOf(Camera);
    });

    it("should have Controller in it", () => {
      expect(new View3D(document.createElement("canvas")).controller).to.be.instanceOf(Controller);
    });

    it("should have ModelAnimator in it", () => {
      expect(new View3D(document.createElement("canvas")).animator).to.be.instanceOf(ModelAnimator);
    });

    it("should have XRManager in it", () => {
      expect(new View3D(document.createElement("canvas")).xr).to.be.instanceOf(XRManager);
    });

    it("should have model as null", () => {
      expect(new View3D(document.createElement("canvas")).model).to.be.null;
    });
  });

  describe("resize", () => {
    it("should call resize on window resize", () => {
      // Given
      const view3d = new View3D(document.createElement("canvas"));
      const resizeSpy = sinon.spy();
      view3d.on("resize", resizeSpy);

      // When
      window.dispatchEvent(new Event("resize"));

      // Then
      expect(resizeSpy.calledOnce).to.be.true;
    });

    it("should not call resize on window resize after destroyed", () => {
      // Given
      const view3d = new View3D(document.createElement("canvas"));
      const resizeSpy = sinon.spy();
      view3d.on("resize", resizeSpy);

      // When
      view3d.destroy();
      window.dispatchEvent(new Event("resize"));

      // Then
      expect(resizeSpy.called).to.be.false;
    });
  });

  describe("render", () => {
    it("should emit events in order of beforeRender -> afterRender", () => {
      // Given
      const view3d = new View3D(document.createElement("canvas"));
      const beforeRenderSpy = sinon.spy();
      const afterRenderSpy = sinon.spy();
      view3d.on("beforeRender", beforeRenderSpy);
      view3d.on("afterRender", afterRenderSpy);

      // When
      view3d.renderLoop(16);

      // Then
      expect(beforeRenderSpy.calledOnce).to.be.true;
      expect(afterRenderSpy.calledOnce).to.be.true;
      expect(beforeRenderSpy.calledBefore(afterRenderSpy)).to.be.true;
    });
  });

  describe("display", () => {
    it("should set its model property after calling display", () => {
      // Given
      const view3d = new View3D(document.createElement("canvas"));
      const model = new Model({ scenes: [] });

      // When
      view3d.display(model);

      // Then
      expect(view3d.model).to.equal(model);
    });
  });
});
