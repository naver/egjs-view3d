import * as THREE from "three";

import ARTranslateControl from "~/control/ar/ARTranslateControl";

describe("ARTranslateControl", () => {
  describe("Initial properties", () => {
    it("is disabled by default", () => {
      expect(new ARTranslateControl().enabled).to.be.false;
    });

    it("has default floor position at (0, 0, 0)", () => {
      expect(new ARTranslateControl().floorPosition).to.deep.equal(new THREE.Vector3(0, 0, 0));
    });

    it("has default hover height of 0.1", () => {
      expect(new ARTranslateControl().hoverHeight).to.equal(0.1);
    });
  });

  describe("Options", () => {
    it("can set hover height on initialization", () => {
      expect(new ARTranslateControl({ hoverHeight: 5 }).hoverHeight).to.equal(5);
    });

    it("can change hover height at any time", () => {
      const control = new ARTranslateControl({ hoverHeight: 1 });

      control.hoverHeight = 3;

      expect(control.hoverHeight).to.equal(3);
    });
  });

  it("can be disabled by calling disable", () => {
    const control = new ARTranslateControl();
    control.enable();

    const wasEnabled = control.enabled === true;

    control.disable();

    expect(wasEnabled).to.be.true;
    expect(control.enabled).to.be.false;
  });

  it("can be re-enabled by calling enable", () => {
    const control = new ARTranslateControl();
    control.disable();
    const wasDisabled = control.enabled === false;

    control.enable();

    expect(wasDisabled).to.be.true;
    expect(control.enabled).to.be.true;
  });
});
