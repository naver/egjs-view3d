import WebARSession from "~/xr/WebARSession";
import ARScene from "~/xr/ARScene";
import HitTest from "~/xr/features/HitTest";
import DOMOverlay from "~/xr/features/DOMOverlay";
import WebARControl from "~/control/ar/WebARControl";
import { createView3D } from "../../test-utils";

describe("WebARSession", () => {
  it("should have control on initialization", async () => {
    const view3D = await createView3D();
    expect(new WebARSession(view3D).control).to.be.instanceOf(WebARControl);
  });

  it("should have arScene on initializationn", async () => {
    const view3D = await createView3D();
    expect(new WebARSession(view3D).arScene).to.be.instanceOf(ARScene);
  });

  it("should have hitTest on initializationn", async () => {
    const view3D = await createView3D();
    expect(new WebARSession(view3D).hitTest).to.be.instanceOf(HitTest);
  });

  it("should have domOverlay on initializationn", async () => {
    const view3D = await createView3D();
    expect(new WebARSession(view3D).domOverlay).to.be.instanceOf(DOMOverlay);
  });
});
