import AnimationControl from "~/control/AnimationControl";
import Pose from "~/core/Pose";
import * as DEFAULT from "~/const/default";
import { range } from "~/utils";
import { createView3D } from "../../test-utils";

describe("AnimationControl", () => {
  describe("Initial State", () => {
    it("should have target element as null", async () => {
      const view3D = await createView3D();
      expect(new AnimationControl(view3D, new Pose(0, 0, 0), new Pose(0, 0, 100)).element).to.be.null;
    });

    it("should have 300 as default duration", async () => {
      const view3D = await createView3D();
      expect(new AnimationControl(view3D, new Pose(0, 0, 0), new Pose(0, 0, 100)).duration).to.equal(300);
    });

    it("should have default easing function same to the one in constants", async () => {
      const view3D = await createView3D();
      expect(new AnimationControl(view3D, new Pose(0, 0, 0), new Pose(0, 0, 100)).easing).to.equal(DEFAULT.EASING);
    });

    it("is not enabled by default", async () => {
      const view3D = await createView3D();
      expect(new AnimationControl(view3D, new Pose(0, 0, 0), new Pose(0, 0, 100)).enabled).to.be.false;
    });
  });

  it("should call finish callbacks after finished", async () => {
    const view3D = await createView3D();
    const animationControl = new AnimationControl(view3D, new Pose(0, 0, 0), new Pose(0, 0, 100), { duration: 500 });
    const spies = range(5).map(() => Cypress.sinon.spy());

    spies.forEach(spy => animationControl.onFinished(spy));

    animationControl.enable();
    animationControl.update(10000);

    expect(spies.every(spy => spy.calledOnce)).to.be.true;
  });

  it("can be disabled after enabling", async () => {
    const view3D = await createView3D();
    const animationControl = new AnimationControl(view3D, new Pose(0, 0, 0), new Pose(0, 0, 100), { duration: 500 });
    const spies = range(5).map(() => Cypress.sinon.spy());

    spies.forEach(spy => animationControl.onFinished(spy));

    animationControl.enable();
    animationControl.disable();
    animationControl.update(10000);

    expect(spies.some(spy => spy.called)).to.be.false;
  });

  it("can clear finished callbacks", async () => {
    const view3D = await createView3D();
    const animationControl = new AnimationControl(view3D, new Pose(0, 0, 0), new Pose(0, 0, 100), { duration: 500 });
    const spies = range(5).map(() => Cypress.sinon.spy());

    spies.forEach(spy => animationControl.onFinished(spy));

    animationControl.enable();
    animationControl.clearFinished();
    animationControl.update(10000);

    expect(spies.some(spy => spy.called)).to.be.false;
  });

  it("should call disable on destroy", async () => {
    const view3D = await createView3D();
    const animationControl = new AnimationControl(view3D, new Pose(0, 0, 0), new Pose(0, 0, 100), { duration: 500 });
    const disableSpy = Cypress.sinon.spy();

    animationControl.disable = disableSpy;
    animationControl.destroy();

    expect(disableSpy.calledOnce).to.be.true;
  });
});
