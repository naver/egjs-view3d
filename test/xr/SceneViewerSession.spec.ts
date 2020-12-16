import SceneViewerSession from "~/xr/SceneViewerSession";

describe("SceneViewerSession", () => {
  it("is not webxr session", () => {
    expect(new SceneViewerSession({ file: "" }).isWebXRSession).to.be.false;
  });

  it("should use 'ar_only' mode when no mode is given", () => {
    expect(new SceneViewerSession({ file: "" }).params.mode).to.equal("ar_only");
  });

  it("can receive other mode types", () => {
    expect(new SceneViewerSession({ file: "", mode: "3d_only" }).params.mode).to.equal("3d_only");
  });
});
