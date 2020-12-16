import * as sinon from "sinon";
import WallARSession from "~/xr/WallARSession";
import ARWallControl from "~/controls/ar/wall/ARWallControl"
import { createXRRenderingContext } from "test/test-utils";


describe("WallARSession", () => {
  it("is webxr session", () => {
    expect(new WallARSession().isWebXRSession).to.be.true;
  });

  it("shouldn't have control on initialization", () => {
    expect(new WallARSession().control).to.be.null;
  });

  it("should set ARWallControl as control on entering session", () => {
    // Given
    const session = new WallARSession();

    // When
    session.onStart(createXRRenderingContext());

    // Then
    expect(session.control).to.be.instanceOf(ARWallControl);
  });

  it("should hide view3d scene on entering session", () => {
    // Given
    const session = new WallARSession();
    const ctx = createXRRenderingContext();

    // When
    const hideSpy = sinon.spy(ctx.view3d.scene, "hide");
    session.onStart(ctx);

    // Then
    expect(hideSpy.calledOnce).to.be.true;
  });

  it("should show view3d scene on exiting session", () => {
    // Given
    const session = new WallARSession();
    const ctx = createXRRenderingContext();
    session.onStart(ctx);

    // When
    const showSpy = sinon.spy(ctx.view3d.scene, "show");
    session.onEnd(ctx);

    // Then
    expect(showSpy.calledOnce).to.be.true;
  });
});
