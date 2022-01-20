import { Camera, Model, OrbitControl, ModelAnimator, Renderer, Scene, ARManager, AutoPlayer } from "~/index";
import * as DEFAULT from "~/const/default";
import { createView3D } from "../test-utils";

describe("View3D", () => {
  describe("Default properties", () => {
    it("should have Renderer in it", async () => {
      expect((await createView3D()).renderer).to.be.instanceOf(Renderer);
    });

    it("should have Scene in it", async () => {
      expect((await createView3D()).scene).to.be.instanceOf(Scene);
    });

    it("should have Camera in it", async () => {
      expect((await createView3D()).camera).to.be.instanceOf(Camera);
    });

    it("should have OrbitControl in it", async () => {
      expect((await createView3D()).control).to.be.instanceOf(OrbitControl);
    });

    it("should have AutoPlayer in it", async () => {
      expect((await createView3D()).autoPlayer).to.be.instanceOf(AutoPlayer);
    });

    it("should have model as null", async () => {
      expect((await createView3D()).model).to.be.null;
    });

    it("should have ModelAnimator in it", async () => {
      expect((await createView3D()).animator).to.be.instanceOf(ModelAnimator);
    });

    it("should have XRManager in it", async () => {
      expect((await createView3D()).ar).to.be.instanceOf(ARManager);
    });

    it("should have root element in it", async () => {
      expect((await createView3D()).rootEl).to.be.instanceOf(HTMLElement);
    });

    it("should have initialized as false", async () => {
      expect((await createView3D()).initialized).to.be.false;
    });
  });

  describe("Options", () => {
    describe("src", () => {
      it("should have 'null' as a default value", async () => {
        expect((await createView3D()).src).to.be.null;
      });
    });

    describe("iosSrc", () => {
      it("should have 'null' as a default value", async () => {
        expect((await createView3D()).iosSrc).to.be.null;
      });
    });

    describe("dracoPath", () => {
      it(`should have ${DEFAULT.DRACO_DECODER_URL} as a default value`, async () => {
        expect((await createView3D()).dracoPath).to.equal(DEFAULT.DRACO_DECODER_URL);
      });
    });

    describe("ktxPath", () => {
      it(`should have ${DEFAULT.KTX_TRANSCODER_URL} as a default value`, async () => {
        expect((await createView3D()).ktxPath).to.equal(DEFAULT.KTX_TRANSCODER_URL);
      });
    });

    describe("meshoptPath", () => {
      it("should have 'null' as a default value", async () => {
        expect((await createView3D()).meshoptPath).to.be.null;
      });
    });

    describe("fixSkinnedBbox", () => {
      it("should have 'false' as a default value", async () => {
        expect((await createView3D()).fixSkinnedBbox).to.be.false;
      });
    });

    describe("skybox", () => {
      it("should have 'null' as a default value", async () => {
        expect((await createView3D()).skybox).to.be.null;
      });
    });

    describe("skyboxBlur", () => {
      it("should have 'false' as a default value", async () => {
        expect((await createView3D()).skyboxBlur).to.be.false;
      });
    });

    describe("skyboxRotation", () => {
      it("should have '0' as a default value", async () => {
        expect((await createView3D()).skyboxRotation).to.equal(0);
      });
    });

    describe("envmap", () => {
      it("should have 'null' as a default value", async () => {
        expect((await createView3D()).envmap).to.be.null;
      });
    });

    describe("background", () => {
      it("should have 'null' as a default value", async () => {
        expect((await createView3D()).background).to.be.null;
      });
    });

    describe("fov", () => {
      it("should have 'auto' as a default value", async () => {
        expect((await createView3D()).fov).to.equal("auto");
      });
    });

    describe("center", () => {
      it("should have 'auto' as a default value", async () => {
        expect((await createView3D()).center).to.equal("auto");
      });
    });

    describe("yaw", () => {
      it("should have 0 as a default value", async () => {
        expect((await createView3D()).yaw).to.equal(0);
      });
    });

    describe("pitch", () => {
      it("should have 0 as a default value", async () => {
        expect((await createView3D()).pitch).to.equal(0);
      });
    });

    describe("rotate", () => {
      it("should have true as a default value", async () => {
        expect((await createView3D()).rotate).to.be.true;
      });
    });

    describe("translate", () => {
      it("should have true as a default value", async () => {
        expect((await createView3D()).translate).to.be.true;
      });
    });

    describe("zoom", () => {
      it("should have true as a default value", async () => {
        expect((await createView3D()).zoom).to.be.true;
      });
    });

    describe("exposure", () => {
      it("should have 1 as a default value", async () => {
        expect((await createView3D()).exposure).to.equal(1);
      });
    });

    describe("shadow", () => {
      it("should have true as a default value", async () => {
        expect((await createView3D()).shadow).to.be.true;
      });
    });

    describe("autoplay", () => {
      it("should have false as a default value", async () => {
        expect((await createView3D()).autoplay).to.be.false;
      });
    });

    describe("scrollable", () => {
      it("should have true as a default value", async () => {
        expect((await createView3D()).scrollable).to.be.true;
      });
    });

    describe("wheelScrollable", () => {
      it("should have false as a default value", async () => {
        expect((await createView3D()).wheelScrollable).to.be.false;
      });
    });

    describe("useGrabCursor", () => {
      it("should have true as a default value", async () => {
        expect((await createView3D()).useGrabCursor).to.be.true;
      });
    });

    describe("webAR", () => {
      it("should have true as a default value", async () => {
        expect((await createView3D()).webAR).to.be.true;
      });
    });

    describe("sceneViewer", () => {
      it("should have true as a default value", async () => {
        expect((await createView3D()).sceneViewer).to.be.true;
      });
    });

    describe("quickLook", () => {
      it("should have true as a default value", async () => {
        expect((await createView3D()).quickLook).to.be.true;
      });
    });

    describe("arPriority", () => {
      it("should have ['webAR', 'sceneViewer', 'quickLook'] as a default value", async () => {
        expect((await createView3D()).arPriority).to.deep.equal(["webAR", "sceneViewer", "quickLook"]);
      });
    });

    describe("poster", () => {
      it("should have 'null' as a default value", async () => {
        expect((await createView3D()).poster).to.be.null;
      });

      it("should add img element as a child of root element if string is given", async () => {
        const view3D = await createView3D({ poster: "SOME_URL", autoInit: false });
        const imgEl = view3D.rootEl.querySelector("img");

        expect(imgEl).not.to.be.null;
        expect(imgEl.parentElement).to.equal(view3D.rootEl);
      });

      it("should add img element with 'src' attribute same to the given string", async () => {
        const posterURL = new URL("SOME_POSTER_URL", location.href);
        const view3D = await createView3D({ poster: posterURL.href, autoInit: false });
        const imgEl = view3D.rootEl.querySelector("img");

        expect(imgEl).not.to.be.null;
        expect(imgEl.src).to.equal(posterURL.href);
      });

      it("should add img element which have 'view3d-poster' class in it", async () => {
        const posterURL = "SOME_POSTER_URL";
        const view3D = await createView3D({ poster: posterURL, autoInit: false });
        const imgEl = view3D.rootEl.querySelector("img");

        expect(imgEl).not.to.be.null;
        expect(imgEl.classList.contains("view3d-poster")).to.be.true;
      });

      it("should add img element which should be removed after initialization", async () => {
        const posterURL = "SOME_POSTER_URL";
        const view3D = await createView3D({ poster: posterURL, autoInit: false });
        const imgEl = view3D.rootEl.querySelector("img");

        expect(imgEl).not.to.be.null;
        expect(imgEl.parentElement).not.to.be.null;

        await view3D.load("/cube.glb");

        expect(imgEl.parentElement).to.be.null;
      });
    });

    describe("canvasSelector", () => {
      it("should have 'canvas' as a default value", async () => {
        expect((await createView3D()).canvasSelector).to.equal("canvas");
      });
    });

    describe("autoInit", () => {
      it("should have true as a default value", async () => {
        expect((await createView3D()).autoInit).to.be.true;
      });
    });

    describe("autoResize", () => {
      it("should have true as a default value", async () => {
        expect((await createView3D()).autoResize).to.be.true;
      });
    });

    describe("useResizeObserver", () => {
      it("should have true as a default value", async () => {
        expect((await createView3D()).useResizeObserver).to.be.true;
      });
    });
  });

  describe("load", () => {
    it("should set its model property after calling display", async () => {
      const view3D = await createView3D();

      await view3D.load("/cube.glb");

      expect(view3D.model).not.to.be.null;
    });
  });
});
