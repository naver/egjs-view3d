import * as THREE from "three";

import ARScaleControl from "~/control/ar/ARScaleControl";

describe("ARScaleControl", () => {
  describe("Initial properties", () => {
    it("is disabled by default", () => {
      expect(new ARScaleControl().enabled).to.be.false;
    });

    it("has default scale of 1", () => {
      expect(new ARScaleControl().scale).to.equal(1);
    });

    it("has default range from 0.05 to 5", () => {
      expect(new ARScaleControl().range).to.deep.equal({ min: 0.05, max: 5 });
    });
  });

  it("can set range at initialization", () => {
    expect(new ARScaleControl({ min: 5, max: 6 }).range).to.deep.equal({ min: 5, max: 6 });
  });

  it("can be disabled by calling disable", () => {
    const control = new ARScaleControl();
    control.enable();

    const wasEnabled = control.enabled === true;
    control.disable();

    expect(wasEnabled).to.be.true;
    expect(control.enabled).to.be.false;
  });

  it("can be re-enabled by calling enable", () => {
    const control = new ARScaleControl();
    control.disable();

    const wasDisabled = control.enabled === false;
    control.enable();

    expect(wasDisabled).to.be.true;
    expect(control.enabled).to.be.true;
  });
});
