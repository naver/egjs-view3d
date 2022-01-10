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

    animation.on("loop", loopSpy);

    return new Promise<void>(resolve => {
      animation.on("finish", () => {
        expect(loopSpy.callCount).to.equal(5);

        resolve();
      });

      animation.start();
    });
  });

  it("should set progress: 1 in the last progress event", async () => {
    const animation = new Animation({ duration: 50, repeat: 5 });
    const progressSpy = Cypress.sinon.spy();

    animation.on("progress", progressSpy);

    return new Promise<void>(resolve => {
      animation.on("finish", () => {
        expect(progressSpy.lastCall.args[0].progress, "last progress").to.equal(1);
        expect(progressSpy.lastCall.args[0].easedProgress, "last easedProgress").to.equal(1);

        resolve();
      });

      animation.start();
    });
  });
});
