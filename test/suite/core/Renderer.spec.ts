import * as THREE from "three";

import { createView3D } from "../../test-utils";

describe("Renderer", () => {
  describe("default values", () => {
    it("should return threeRenderer as THREE.WebGLRenderer", async () => {
      expect((await createView3D()).renderer.threeRenderer).to.be.instanceOf(THREE.WebGLRenderer);
    });

    it("should enable shadow by default", async () => {
      expect((await createView3D()).renderer.threeRenderer.shadowMap.enabled).to.be.true;
    });

    it("should create context on creation", async () => {
      expect((await createView3D()).renderer.context).to.be.instanceOf(WebGL2RenderingContext);
    });
  });

  it("should update size on resize", async () => {
    const view3D = await createView3D();
    const renderer = view3D.renderer;
    const canvas = renderer.canvas;

    canvas.style.width = "200px";
    canvas.style.height = "300px";
    renderer.resize();
    const prevSize = { ...renderer.size };

    canvas.style.width = "400px";
    canvas.style.height = "600px";
    renderer.resize();

    expect(prevSize.width).to.equal(200);
    expect(prevSize.height).to.equal(300);
    expect(renderer.size.width).to.equal(400);
    expect(renderer.size.height).to.equal(600);
  });

  it("should disable shadow map on disabling shadow", async () => {
    const renderer = (await createView3D()).renderer;
    renderer.disableShadow();

    expect(renderer.threeRenderer.shadowMap.enabled).to.be.false;
  });

  it("should enable shadow map on enabling shadow", async () => {
    const renderer = (await createView3D()).renderer;

    renderer.disableShadow();
    const prevVal = renderer.threeRenderer.shadowMap.enabled;
    renderer.enableShadow();

    expect(prevVal).to.be.false;
    expect(renderer.threeRenderer.shadowMap.enabled).to.be.true;
  });

  describe("render", () => {
    it("should emit events in order of beforeRender -> render", async () => {
      const view3D = await createView3D();
      const beforeRenderSpy = Cypress.sinon.spy();
      const renderSpy = Cypress.sinon.spy();
      view3D.on("beforeRender", beforeRenderSpy);
      view3D.on("render", renderSpy);

      view3D.renderer.defaultRenderLoop(16);

      expect(beforeRenderSpy.calledOnce).to.be.true;
      expect(renderSpy.calledOnce).to.be.true;
      expect(beforeRenderSpy.calledBefore(renderSpy)).to.be.true;
    });
  });
});
