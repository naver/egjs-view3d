import ControlBar, { PlayButton } from "~/plugin/ControlBar";

import { createView3D } from "../../../test-utils";

describe("PlayButton", () => {
  describe("default options", () => {
    it("should have position 'left' by default", async () => {
      const view3D = await createView3D();
      const controlBar = new ControlBar();
      const component = new PlayButton(view3D, controlBar);

      expect(component.position).to.equal("left");
    });

    it("should have order 9999 by default", async () => {
      const view3D = await createView3D();
      const controlBar = new ControlBar();
      const component = new PlayButton(view3D, controlBar);

      expect(component.order).to.equal(9999);
    });
  });
});
