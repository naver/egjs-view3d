import * as sinon from "sinon";
import { createXRRenderingContext } from "test/test-utils";

import HoverARSession from "~/xr/HoverARSession";
import ARHoverControl from "~/controls/ar/hover/ARHoverControl";


describe("HoverARSession", () => {
  it("is webxr session", () => {
    expect(new HoverARSession().isWebXRSession).to.be.true;
  });

  it("shouldn't have control on initialization", () => {
    expect(new HoverARSession().control).to.be.null;
  });

  it("should set ARHoverControl as control on entering session", () => {
    // Given
    const session = new HoverARSession();

    // When
    session.onStart(createXRRenderingContext());

    // Then
    expect(session.control).to.be.instanceOf(ARHoverControl);
  });

  it("should hide view3d scene on entering session", () => {
    // Given
    const session = new HoverARSession();
    const ctx = createXRRenderingContext();

    // When
    const hideSpy = sinon.spy(ctx.view3d.scene, "hide");
    session.onStart(ctx);

    // Then
    expect(hideSpy.calledOnce).to.be.true;
  });

  it("should show view3d scene on exiting session", () => {
    // Given
    const session = new HoverARSession();
    const ctx = createXRRenderingContext();
    session.onStart(ctx);

    // When
    const showSpy = sinon.spy(ctx.view3d.scene, "show");
    session.onEnd(ctx);

    // Then
    expect(showSpy.calledOnce).to.be.true;
  });
});
