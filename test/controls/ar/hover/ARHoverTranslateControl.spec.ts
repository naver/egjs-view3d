import * as THREE from "three";
import * as sinon from "sinon";
import { createXRRenderingContext } from "test/test-utils";

import ARHoverTranslateControl from "~/controls/ar/hover/ARHoverTranslateControl";
import View3D from "~/View3D";
import Model from "~/core/Model";

describe("ARFloorTranslateControl", () => {
  describe("Initial properties", () => {
    it("is enabled by default", () => {
      expect(new ARHoverTranslateControl().enabled).to.be.true;
    });

    it("has default position at (0, 0, 0)", () => {
      expect(new ARHoverTranslateControl().position).to.deep.equal(new THREE.Vector3(0, 0, 0));
    });
  });

  it("can be disabled by calling disable", () => {
    // Given
    const control = new ARHoverTranslateControl();
    const wanEnabled = control.enabled === true;

    // When
    control.disable();

    // Then
    expect(wanEnabled).to.be.true;
    expect(control.enabled).to.be.false;
  });

  it("can be re-enabled by calling enable", () => {
    // Given
    const control = new ARHoverTranslateControl();
    control.disable();
    const wasDisabled = control.enabled === false;

    // When
    control.enable();

    // Then
    expect(wasDisabled).to.be.true;
    expect(control.enabled).to.be.true;
  });

  it("should add arrow indicator on initialization", () => {
    // Given
    const control = new ARHoverTranslateControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);

    // When
    const addSpy = sinon.spy(view3d.scene, "add");
    control.init(createXRRenderingContext({ view3d, model }));

    // Then
    expect(addSpy.calledOnce).to.be.true;
  });

  it("should remove arrow indicator on destroy", () => {
    // Given
    const control = new ARHoverTranslateControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);
    control.init(createXRRenderingContext({ view3d, model }));

    // When
    const removeSpy = sinon.spy(view3d.scene, "remove");
    control.destroy(createXRRenderingContext({ view3d, model }));

    // Then
    expect(removeSpy.calledOnce).to.be.true;
  });
});
