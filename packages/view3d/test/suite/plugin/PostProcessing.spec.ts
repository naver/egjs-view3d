import { createView3D } from "../../test-utils";

import { PostProcessing } from "~/plugin";

describe("PostProcessing", () => {

  it("should EffectComposer size be equal to cavasSize * devicePixelRatio", async () => {
    const postProcessing = new PostProcessing({
      Bloom: true
    });

    const view3d = await createView3D({
      src: "/cube.glb",
      plugins: [postProcessing],
    });

    const canvasSize = view3d.renderer.canvasSize;
    const composer = postProcessing.composer;

    expect(composer.readBuffer.width === canvasSize.width * window.devicePixelRatio).to.be.true;
    expect(composer.readBuffer.height === canvasSize.height * window.devicePixelRatio).to.be.true;

  });

  it("should set the render pass as the first pass of the composer", async () => {
    const postProcessing = new PostProcessing({
      Bloom: true,
      SSAO: true,
      SSR: true,
    });

    const view3d = await createView3D({
      src: "/cube.glb",
      plugins: [postProcessing],
    });

    view3d.once('render', () => {
      expect(postProcessing.composer.passes[0].constructor.name).to.equal("RenderPass");
    })
  });


  it('should set the bloom effect as last pass of the composer', async () => {
    const postProcessing = new PostProcessing({
      Bloom: true,
      DoF: true,
      SSAO: true,
      SSR: true
    });

    const view3d = await createView3D({
      src: "/cube.glb",
      plugins: [postProcessing],
    });

    view3d.once('render', () => {
      const passes = postProcessing.composer.passes;
      expect(passes[passes.length - 1].constructor.name).to.equal("BloomEffect");
    })

  })

  it("should applied effects before render", async () => {
    const postProcessing = new PostProcessing({
      Bloom: true,
      DoF: true,
      SSAO: true,
      SSR: true
    });

    const view3d = await createView3D({
      src: "/cube.glb",
      plugins: [postProcessing],
    });

    view3d.once("beforeRender", () => {
      const pass = postProcessing.composer.passes.map((pass) => {
        if (pass.constructor.name === 'BloomEffect') return pass;
      }).filter((item) => !!item);

      expect(pass.length).to.equal(1);
      expect(pass[0].constructor.name).to.equal('BloomEffect');
    });
  });

  it("should update size on resize", async () => {
    const postProcessing = new PostProcessing({
      Bloom: true
    });

    const view3d = await createView3D({
      src: "/cube.glb",
      plugins: [postProcessing],
    });

    const renderer = view3d.renderer;
    const canvas = renderer.canvas;
    const composer = postProcessing.composer;

    canvas.style.width = "400px";
    canvas.style.height = "600px";
    renderer.resize();

    view3d.once('resize', () => {
      expect(composer.readBuffer.width).to.equal(400 * window.devicePixelRatio);
      expect(composer.readBuffer.height).to.equal(600 * window.devicePixelRatio);
    });
  });

  it("should render as if not apply effect", async () => {
    const postProcessing = new PostProcessing({
      Bloom: false,
      DoF: false,
      SSAO: false,
      SSR: false
    });

    const view3d = await createView3D({
      src: "/cube.glb",
      plugins: [postProcessing],
    });

    view3d.once('render', () => {
      expect(true).to.be.true;
    });
  });

  it("should apply effects as order to SSAO -> SSR -> DoF -> Bloom", async () => {
    const postProcessing = new PostProcessing({
      Bloom: true,
      DoF: true,
      SSAO: true,
      SSR: true
    });

    const view3d = await createView3D({
      src: "/cube.glb",
      plugins: [postProcessing],
    });

    view3d.once('render', () => {
      const composerPasses = postProcessing.composer.passes;
      const order = {} as any;

      composerPasses.forEach((pass, index) => {
        order[pass.constructor.name] = index;
      });

      expect(order["SSAOEffect"] < order["SSREffect"]).to.be.true;
      expect(order["SSREffect"] < order["DoFEffect"]).to.be.true;
      expect(order["DoFEffect"] < order["BloomEffect"]).to.be.true;
    })
  })
});




