import Animation from "~/core/Animation";

import { wait } from "../../test-utils";

describe("Animation", () => {
  it("won't start until calling start", async () => {
    const animation = new Animation({ duration: 100 });
    const progressSpy = Cypress.sinon.spy();

    animation.on("progress", progressSpy);
    await wait(100);

    expect(progressSpy.called).to.be.false;

    animation.start();
    await wait(100);

    expect(progressSpy.called).to.be.true;
  });

  it("should trigger progress event with progress = 0 on first start", () => {
    const animation = new Animation();
    const progressSpy = Cypress.sinon.spy();

    animation.on("progress", progressSpy);
    animation.start();

    expect(progressSpy.firstCall.args[0].progress).to.equal(0);
  });

  it("should loop exact n times given in the options", async () => {
    const animation = new Animation({ duration: 50, repeat: 5 });
    const loopSpy = Cypress.sinon.spy();
    const finishSpy = Cypress.sinon.spy();

    animation.on("loop", loopSpy);
    animation.on("finish", finishSpy);
    animation.start();
    await wait(350);

    expect(loopSpy.callCount).to.equal(5);
    expect(finishSpy.calledOnce).to.be.true;
  });
});
