import { createView3D } from "../../test-utils";

describe("PostProcessing", () => {
  describe("bloom effect", () => {
    it("should resolution be greater than or equal to canvas size", async () => {
      const view3d = await createView3D({bloom: true});

      view3d.on('load', () => {
        const resolutionSize = view3d.postProcessing.bloomComponent.resolution;
        const canvasSize = view3d.renderer.canvasSize;

        expect(resolutionSize.width >= canvasSize.width).to.be.true;
        expect(resolutionSize.height >= canvasSize.height).to.be.true;
      });
    });

    it("should first pass of the composite is renderPass.", async () => {
      const view3d = await createView3D({bloom: true});
      view3d.on('load', () => {
        expect(view3d.postProcessing.composer.passes[0].constructor.name).to.equal("RenderPass");
      });
    });

    it('BloomComponent must exist ', async () => {
      const view3d = await createView3D({bloom: true});
      view3d.on('load', () => {
        expect(view3d.postProcessing.bloomComponent).to.be.exist;
      });
    })

    it("should update resolution on resize", async () => {
      const view3d = await createView3D({bloom: true});
      const renderer = view3d.renderer;
      const bloomComp = view3d.postProcessing.bloomComponent;
      const canvas = renderer.canvas;

      view3d.on('load', () => {
        canvas.style.width = "200px";
        canvas.style.height = "300px";
        renderer.resize();
        const prevSize = {...renderer.size};

        canvas.style.width = "400px";
        canvas.style.height = "600px";
        renderer.resize();

        expect(prevSize.width).to.equal(200);
        expect(prevSize.height).to.equal(300);
        expect(bloomComp.resolution.width >= 400).to.be.true;
        expect(bloomComp.resolution.height >= 600).to.be.true;
      });
    });

    it("should applied bloom before render", async () => {
      const view3D = await createView3D({bloom: true});

      view3D.on("render", () => {
        const pass = view3D.postProcessing.composer.passes.map((pass) => {
          if (pass.constructor.name === 'UnrealBloomPass') return pass;
        }).filter((item) => !!item);

        expect(pass.length).to.equal(1);
        expect(pass[0].constructor.name).to.equal('UnrealBloomPass');
      });

    });
  });
});
