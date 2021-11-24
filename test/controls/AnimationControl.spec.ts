import Sinon, * as sinon from "sinon";

import AnimationControl from "~/controls/AnimationControl";
import Camera from "~/core/camera/Camera";
import Pose from "~/core/camera/Pose";
import * as DEFAULT from "~/consts/default";
import { range } from "~/utils";

describe("AnimationControl", () => {
  let clock: Sinon.SinonFakeTimers;

  before(() => {
    clock = sinon.useFakeTimers();
  });

  beforeEach(() => {
    clock.reset();
  });

  after(() => {
    clock.restore();
  });

  describe("Initial State", () => {
    it("should have target element as null", () => {
      expect(new AnimationControl(new Pose(0, 0, 0), new Pose(0, 0, 100)).element).to.be.null;
    });

    it("should have default duration as 500", () => {
      expect(new AnimationControl(new Pose(0, 0, 0), new Pose(0, 0, 100)).duration).to.equal(500);
    });

    it("should have default easing function same to the one in constants", () => {
      expect(new AnimationControl(new Pose(0, 0, 0), new Pose(0, 0, 100)).easing).to.equal(DEFAULT.EASING);
    });

    it("is not enabled by default", () => {
      expect(new AnimationControl(new Pose(0, 0, 0), new Pose(0, 0, 100)).enabled).to.be.false;
    });
  });

  it("should call finish callbacks after finished", () => {
    // Given
    const animationControl = new AnimationControl(new Pose(0, 0, 0), new Pose(0, 0, 100), { duration: 500 });
    const camera = new Camera(document.createElement("canvas"));
    const spies = range(5).map(() => sinon.spy());

    spies.forEach(spy => animationControl.onFinished(spy));

    // When
    animationControl.enable();
    animationControl.update(camera, 10000);

    // Then
    expect(spies.every(spy => spy.calledOnce)).to.be.true;
  });

  it("can be disabled after enabling", () => {
    // Given
    const animationControl = new AnimationControl(new Pose(0, 0, 0), new Pose(0, 0, 100), { duration: 500 });
    const camera = new Camera(document.createElement("canvas"));
    const spies = range(5).map(() => sinon.spy());

    spies.forEach(spy => animationControl.onFinished(spy));

    // When
    animationControl.enable();
    animationControl.disable();
    animationControl.update(camera, 10000);

    // Then
    expect(spies.some(spy => spy.called)).to.be.false;
  });

  it("can clear finished callbacks", () => {
    // Given
    const animationControl = new AnimationControl(new Pose(0, 0, 0), new Pose(0, 0, 100), { duration: 500 });
    const camera = new Camera(document.createElement("canvas"));
    const spies = range(5).map(() => sinon.spy());

    spies.forEach(spy => animationControl.onFinished(spy));

    // When
    animationControl.enable();
    animationControl.clearFinished();
    animationControl.update(camera, 10000);

    // Then
    expect(spies.some(spy => spy.called)).to.be.false;
  });

  it("should call disable on destroy", () => {
    // Given
    const animationControl = new AnimationControl(new Pose(0, 0, 0), new Pose(0, 0, 100), { duration: 500 });
    const disableSpy = sinon.spy();
    animationControl.disable = disableSpy;

    // When
    animationControl.destroy();

    // Then
    expect(disableSpy.calledOnce).to.be.true;
  });
});
