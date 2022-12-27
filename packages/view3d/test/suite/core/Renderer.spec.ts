import * as THREE from "three";

import { createView3D, wait } from "../../test-utils";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

describe("Renderer", () => {
  describe("default values", () => {
    it("should return threeRenderer as THREE.WebGLRenderer", async () => {
      expect((await createView3D()).renderer.threeRenderer).to.be.instanceOf(THREE.WebGLRenderer);
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

  describe("setAnimationLoop", () => {
    it("should cap maximum time delta to view3D.maxTimeDelta", async () => {
      const view3D = await createView3D();
      view3D.renderer.threeRenderer.setAnimationLoop = async (callback) => {
        callback(0);
        await wait(1000); // 1s
        callback(1000);
      };

      const loopSpy = Cypress.sinon.spy();
      view3D.renderer.setAnimationLoop(loopSpy);

      await wait(1500);

      expect(loopSpy.callCount).to.equal(2);
      expect(loopSpy.lastCall.args[0]).to.equal(1 / 30);
    });
  });

  describe("render", () => {
    it("should emit events in order of beforeRender -> render", async () => {
      const view3D = await createView3D();
      const beforeRenderSpy = Cypress.sinon.spy();
      const renderSpy = Cypress.sinon.spy();
      view3D.on("beforeRender", beforeRenderSpy);
      view3D.on("render", renderSpy);

      view3D.renderer.renderSingleFrame(true);

      expect(beforeRenderSpy.calledOnce).to.be.true;
      expect(renderSpy.calledOnce).to.be.true;
      expect(beforeRenderSpy.calledBefore(renderSpy)).to.be.true;
    });

    it("should call render method of EffectComposer, if EffectComposer is given to effectComposer of View3D property.", async () => {
      const view3D = await createView3D();
      const renderer = view3D.renderer.threeRenderer;
      const effectComposer = new EffectComposer(renderer);

      view3D.effectComposer = effectComposer;

      let count = 0;
      effectComposer.render = () => {
        ++count;
      }

      view3D.renderer.renderSingleFrame(true);

      expect(count).to.equal(1);
    })
  });
});
