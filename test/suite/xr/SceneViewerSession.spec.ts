import SceneViewerSession from "~/xr/SceneViewerSession";
import { createView3D } from "../../test-utils";

describe("SceneViewerSession", () => {
  describe("Options", () => {
    describe("file", () => {
      it("should have 'null' as default", async () => {
        const view3D = await createView3D();
        expect(new SceneViewerSession(view3D).file).to.be.null;
      });
    });

    describe("mode", () => {
      it("should use 'ar_only' as default", async () => {
        const view3D = await createView3D();
        expect(new SceneViewerSession(view3D).mode).to.equal("ar_only");
      });

      it("can receive other mode types", async () => {
        const view3D = await createView3D();
        expect(new SceneViewerSession(view3D, { mode: "3d_only" }).mode).to.equal("3d_only");
      });
    });

    describe("file", () => {
      it("should have 'null' as default", async () => {
        const view3D = await createView3D();
        expect(new SceneViewerSession(view3D).file).to.be.null;
      });
    });

    describe("fallbackURL", () => {
      it("should have 'null' as default", async () => {
        const view3D = await createView3D();
        expect(new SceneViewerSession(view3D).fallbackURL).to.be.null;
      });
    });

    describe("title", () => {
      it("should have 'null' as default", async () => {
        const view3D = await createView3D();
        expect(new SceneViewerSession(view3D).title).to.be.null;
      });
    });

    describe("link", () => {
      it("should have 'null' as default", async () => {
        const view3D = await createView3D();
        expect(new SceneViewerSession(view3D).link).to.be.null;
      });
    });

    describe("sound", () => {
      it("should have 'null' as default", async () => {
        const view3D = await createView3D();
        expect(new SceneViewerSession(view3D).sound).to.be.null;
      });
    });

    describe("resizable", () => {
      it("should have 'true' as default", async () => {
        const view3D = await createView3D();
        expect(new SceneViewerSession(view3D).resizable).to.be.true;
      });
    });

    describe("vertical", () => {
      it("should have 'false' as default", async () => {
        const view3D = await createView3D();
        expect(new SceneViewerSession(view3D).vertical).to.be.false;
      });
    });

    describe("disableOcclusion", () => {
      it("should have 'false' as default", async () => {
        const view3D = await createView3D();
        expect(new SceneViewerSession(view3D).disableOcclusion).to.be.false;
      });
    });

    describe("initialScale", () => {
      it("should have 'auto' as default", async () => {
        const view3D = await createView3D();
        expect(new SceneViewerSession(view3D).initialScale).to.equal("auto");
      });
    });

    describe("shareText", () => {
      it("should have 'null' as default", async () => {
        const view3D = await createView3D();
        expect(new SceneViewerSession(view3D).shareText).to.be.null;
      });
    });
  });
});
