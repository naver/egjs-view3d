import * as sinon from "sinon";
import { createXRRenderingContext } from "test/test-utils";

import FloorARSession from "~/xr/FloorARSession";
import ARFloorControl from "~/controls/ar/floor/ARFloorControl";

describe("FloorARSession", () => {
  it("is webxr session", () => {
    expect(new FloorARSession().isWebXRSession).to.be.true;
  });

  it("shouldn't have control on initialization", () => {
    expect(new FloorARSession().control).to.be.null;
  });

  it("should set ARFloorControl as control on entering session", () => {
    // Given
    const session = new FloorARSession();

    // When
    session.onStart(createXRRenderingContext());

    // Then
    expect(session.control).to.be.instanceOf(ARFloorControl);
  });

  it("should hide view3d scene on entering session", () => {
    // Given
    const session = new FloorARSession();
    const ctx = createXRRenderingContext();

    // When
    const hideSpy = sinon.spy(ctx.view3d.scene, "hide");
    session.onStart(ctx);

    // Then
    expect(hideSpy.calledOnce).to.be.true;
  });

  it("should show view3d scene on exiting session", () => {
    // Given
    const session = new FloorARSession();
    const ctx = createXRRenderingContext();
    session.onStart(ctx);

    // When
    const showSpy = sinon.spy(ctx.view3d.scene, "show");
    session.onEnd(ctx);

    // Then
    expect(showSpy.calledOnce).to.be.true;
  });
});
