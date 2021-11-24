import * as THREE from "three";

import ARFloorTranslateControl from "~/controls/ar/floor/ARFloorTranslateControl";

describe("ARFloorTranslateControl", () => {
  describe("Initial properties", () => {
    it("is enabled by default", () => {
      expect(new ARFloorTranslateControl().enabled).to.be.true;
    });

    it("has default model position at (0, 0, 0)", () => {
      expect(new ARFloorTranslateControl().modelPosition).to.deep.equal(new THREE.Vector3(0, 0, 0));
    });

    it("has default floor position at (0, 0, 0)", () => {
      expect(new ARFloorTranslateControl().floorPosition).to.deep.equal(new THREE.Vector3(0, 0, 0));
    });

    it("has default hover amplitude of 0.01", () => {
      expect(new ARFloorTranslateControl().hoverAmplitude).to.equal(0.01);
    });

    it("has default hover height of 0.1", () => {
      expect(new ARFloorTranslateControl().hoverHeight).to.equal(0.1);
    });
  });

  describe("Options", () => {
    it("can set hover amplitude on initialization", () => {
      expect(new ARFloorTranslateControl({ hoverAmplitude: 5 }).hoverAmplitude).to.equal(5);
    });

    it("can set hover height on initialization", () => {
      expect(new ARFloorTranslateControl({ hoverHeight: 5 }).hoverHeight).to.equal(5);
    });

    it("can change hover amplitude at any time", () => {
      // Given
      const control = new ARFloorTranslateControl({ hoverAmplitude: 1 });

      // When
      control.hoverAmplitude = 3;

      // Then
      expect(control.hoverAmplitude).to.equal(3);
    });

    it("can change hover height at any time", () => {
      // Given
      const control = new ARFloorTranslateControl({ hoverHeight: 1 });

      // When
      control.hoverHeight = 3;

      // Then
      expect(control.hoverHeight).to.equal(3);
    });
  });

  it("can be disabled by calling disable", () => {
    // Given
    const control = new ARFloorTranslateControl();
    const wanEnabled = control.enabled === true;

    // When
    control.disable();

    // Then
    expect(wanEnabled).to.be.true;
    expect(control.enabled).to.be.false;
  });

  it("can be re-enabled by calling enable", () => {
    // Given
    const control = new ARFloorTranslateControl();
    control.disable();
    const wasDisabled = control.enabled === false;

    // When
    control.enable();

    // Then
    expect(wasDisabled).to.be.true;
    expect(control.enabled).to.be.true;
  });
});
