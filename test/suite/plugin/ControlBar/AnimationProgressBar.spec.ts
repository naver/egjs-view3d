import { ControlBar, AnimationProgressBar } from "~/plugin/ControlBar";

import { createView3D } from "../../../test-utils";

describe("AnimationProgressBar", () => {
  describe("default options", () => {
    it("should have position 'top' by default", async () => {
      const view3D = await createView3D();
      const controlBar = new ControlBar();
      const component = new AnimationProgressBar(view3D, controlBar);

      expect(component.position).to.equal("top");
    });

    it("should have order 9999 by default", async () => {
      const view3D = await createView3D();
      const controlBar = new ControlBar();
      const component = new AnimationProgressBar(view3D, controlBar);

      expect(component.order).to.equal(9999);
    });
  });
});
