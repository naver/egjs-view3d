import QuickLookSession from "~/xr/QuickLookSession";

describe("SceneViewerSession", () => {
  it("is not webxr session", () => {
    expect(new QuickLookSession({ file: "" }).isWebXRSession).to.be.false;
  });
});
