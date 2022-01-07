import QuickLookSession from "~/xr/QuickLookSession";
import { createView3D } from "../../test-utils";

describe("QuickLookSession", () => {
  describe("Options", () => {
    describe("allowsContentScaling", () => {
      it("should have 'true' as the default value", async () => {
        const view3D = await createView3D();
        expect(new QuickLookSession(view3D).allowsContentScaling).to.be.true;
      });
    });

    describe("canonicalWebPageURL", () => {
      it("should have 'null' as the default value", async () => {
        const view3D = await createView3D();
        expect(new QuickLookSession(view3D).canonicalWebPageURL).to.be.null;
      });
    });

    describe("applePayButtonType", () => {
      it("should have 'null' as the default value", async () => {
        const view3D = await createView3D();
        expect(new QuickLookSession(view3D).applePayButtonType).to.be.null;
      });
    });

    describe("callToAction", () => {
      it("should have 'null' as the default value", async () => {
        const view3D = await createView3D();
        expect(new QuickLookSession(view3D).callToAction).to.be.null;
      });
    });

    describe("checkoutTitle", () => {
      it("should have 'null' as the default value", async () => {
        const view3D = await createView3D();
        expect(new QuickLookSession(view3D).checkoutTitle).to.be.null;
      });
    });

    describe("checkoutSubtitle", () => {
      it("should have 'null' as the default value", async () => {
        const view3D = await createView3D();
        expect(new QuickLookSession(view3D).checkoutSubtitle).to.be.null;
      });
    });

    describe("price", () => {
      it("should have 'null' as the default value", async () => {
        const view3D = await createView3D();
        expect(new QuickLookSession(view3D).price).to.be.null;
      });
    });

    describe("custom", () => {
      it("should have 'null' as the default value", async () => {
        const view3D = await createView3D();
        expect(new QuickLookSession(view3D).custom).to.be.null;
      });
    });

    describe("customHeight", () => {
      it("should have 'null' as the default value", async () => {
        const view3D = await createView3D();
        expect(new QuickLookSession(view3D).customHeight).to.be.null;
      });
    });
  });
});
