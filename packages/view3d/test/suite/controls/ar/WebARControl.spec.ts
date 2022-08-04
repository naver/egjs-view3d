import WebARControl, { WebARControlOptions } from "~/control/ar/WebARControl";
import ARSwirlControl from "~/control/ar/ARSwirlControl";
import ARTranslateControl from "~/control/ar/ARTranslateControl";
import ARScaleControl from "~/control/ar/ARScaleControl";
import ARScene from "~/xr/ARScene";

import { createView3D } from "../../../test-utils";

describe("WebARControl", () => {
  const createWebARControl = async ({
    rotate = {},
    translate = {},
    scale = {},
    initialScale = "auto",
    ring = {},
    deadzone = {}
  }: Partial<WebARControlOptions> = {}) => {
    const view3D = await createView3D();
    const arScene = new ARScene();

    return new WebARControl(view3D, arScene, {
      rotate,
      translate,
      scale,
      initialScale,
      ring,
      deadzone
    });
  };

  describe("Default properties", () => {
    it("has ARSwirlControl in it", async () => {
      const control = await createWebARControl();
      expect(control.rotate).to.be.instanceOf(ARSwirlControl);
    });

    it("has ARFloorTranslateControl in it", async () => {
      const control = await createWebARControl();
      expect(control.translate).to.be.instanceOf(ARTranslateControl);
    });

    it("has ARScaleControl in it", async () => {
      const control = await createWebARControl();
      expect(control.scale).to.be.instanceOf(ARScaleControl);
    });
  });

  describe("Options", () => {
    it("can pass options to rotate control", async () => {
      expect((await createWebARControl({ rotate: { scale: 5 } })).rotate.scale).to.equal(5);
    });

    it("can pass options to translate control", async () => {
      expect((await createWebARControl({ translate: { hoverHeight: 10 } })).translate.hoverHeight).to.equal(10);
    });

    it("can pass options to scale control", async () => {
      expect((await createWebARControl({ scale: { max: 100 } })).scale.range.max).to.equal(100);
    });
  });
});
