import { ControlBar, FullscreenButton } from "~/plugin/ControlBar";

import { createView3D } from "../../../test-utils";

describe("FullscreenButton", () => {
  describe("default options", () => {
    it("should have position 'right' by default", async () => {
      const view3D = await createView3D();
      const controlBar = new ControlBar();
      const component = new FullscreenButton(view3D, controlBar);

      expect(component.position).to.equal("right");
    });

    it("should have order 9999 by default", async () => {
      const view3D = await createView3D();
      const controlBar = new ControlBar();
      const component = new FullscreenButton(view3D, controlBar);

      expect(component.order).to.equal(9999);
    });
  });
});
