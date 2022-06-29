import ControlBar, { AnimationProgressBar, AnimationSelector, FullscreenButton, PlayButton } from "~/plugin/ControlBar";

import { createView3D } from "../../../test-utils";

describe("ControlBar", () => {
  describe("init", () => {
    it("should add sub-components as items", async () => {
      const view3D = await createView3D();
      const controlBar = new ControlBar();

      await controlBar.init(view3D);

      const expectedItems = [
        AnimationProgressBar,
        AnimationSelector,
        FullscreenButton,
        PlayButton
      ];

      expectedItems.forEach(expected => {
        expect(controlBar.items.findIndex(item => (item as any).constructor === expected)).to.be.gte(0);
      });
    });

    it("should show root element", async () => {
      const view3D = await createView3D();
      const controlBar = new ControlBar();

      await controlBar.init(view3D);

      expect(controlBar.rootEl.classList.contains("visible")).to.be.true;
    });

    it("should enable all items", async () => {
      const view3D = await createView3D();
      const controlBar = new ControlBar();

      await controlBar.init(view3D);

      expect(controlBar.items.every(item => item.enabled)).to.be.true;
    });

    it("should not add item if the option is false", async () => {
      const options = [
        { name: "progressBar", component: AnimationProgressBar },
        { name: "playButton", component: AnimationSelector },
        { name: "animationSelector", component: FullscreenButton },
        { name: "fullscreen", component: PlayButton }
      ];

      const view3D = await createView3D();
      const controlBar = new ControlBar(Object.keys(options).reduce((opts, key) => {
        return {
          ...opts,
          [options[key].name]: false
        };
      }, {}));

      await controlBar.init(view3D);

      options.forEach(({ component }) => {
        expect(controlBar.items.findIndex(item => (item as any).constructor === component)).to.be.lt(0);
      });
    });
  });

  describe("show", () => {
    it("should add class 'visible' to the root element", () => {
      const controlBar = new ControlBar();

      controlBar.show();

      expect(controlBar.rootEl.classList.contains("visible")).to.be.true;
    });
  });

  describe("hide", () => {
    it("should remove class 'visible' to the root element", () => {
      const controlBar = new ControlBar();

      controlBar.hide();

      expect(controlBar.rootEl.classList.contains("visible")).to.be.false;
    });
  });
});
