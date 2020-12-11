import * as sinon from "sinon";
import Animation from "~/core/Animation";

describe("Animation", () => {
  let clock: sinon.SinonFakeTimers;

  before(() => {
    clock = sinon.useFakeTimers();
  });

  beforeEach(() => {
    clock.reset();
  });

  after(() => {
    clock.restore();
  });

  it("won't start until calling start", () => {
    // Given
    const animation = new Animation();
    const progressSpy = sinon.spy();

    // When
    animation.on("progress", progressSpy);
    clock.tick(10000);

    expect(progressSpy.called).to.be.false;

    animation.start();
    clock.tick(10000);

    // Then
    expect(progressSpy.called).to.be.true;
  });

  it("should trigger progress event with progress = 0 on first start", () => {
    // Given
    const animation = new Animation();
    const progressSpy = sinon.spy();

    // When
    animation.on("progress", progressSpy);
    animation.start();

    // Then
    expect(progressSpy.firstCall.args[0].progress).to.equal(0);
  });

  it("should loop exact n times given in the options", () => {
    // Given
    const animation = new Animation({ duration: 500, repeat: 5 });
    const loopSpy = sinon.spy();
    const finishSpy = sinon.spy();

    // When
    animation.on("loop", loopSpy);
    animation.on("finish", finishSpy);
    animation.start();
    clock.tick(10000);

    // Then
    expect(loopSpy.callCount).to.equal(5);
    expect(finishSpy.calledOnce).to.be.true;
  });

  it("can stop animation and reset its values to the start", () => {
    // Given
    const animation = new Animation({ duration: 500, repeat: 5 });
    const loopSpy = sinon.spy();
    const finishSpy = sinon.spy();

    // When
    animation.on("loop", loopSpy);
    animation.on("finish", finishSpy);
    animation.start();
    clock.tick(1250); // 2 loops

    // Stop then restart
    animation.stop();
    clock.tick(10000);

    animation.start();
    clock.tick(10000);

    // Then
    expect(loopSpy.callCount).to.equal(7);
    expect(finishSpy.calledOnce).to.be.true;
  });

  it("can pause animation and restart again", () => {
    // Given
    const animation = new Animation({ duration: 500, repeat: 5 });
    const loopSpy = sinon.spy();
    const finishSpy = sinon.spy();

    // When
    animation.on("loop", loopSpy);
    animation.on("finish", finishSpy);
    animation.start();
    clock.tick(1250); // 2 loops

    // Stop then restart
    animation.pause();
    clock.tick(10000);

    animation.start();
    clock.tick(10000);

    // Then
    expect(loopSpy.callCount).to.equal(5);
    expect(finishSpy.calledOnce).to.be.true;
  });
});
