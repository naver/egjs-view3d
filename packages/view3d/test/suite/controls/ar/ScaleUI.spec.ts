import * as THREE from "three";

import ScaleUI from "~/control/ar/ScaleUI";

describe("ScaleUI", () => {
  it("has mesh with type THREE.Mesh on it", () => {
    expect(new ScaleUI().mesh).to.be.instanceOf(THREE.Mesh);
  });

  it("should set its object visibility to true after calling show", () => {
    const ui = new ScaleUI();

    ui.hide();
    ui.show();

    expect(ui.visible).to.be.true;
  });

  it("should set its object visibility to false after calling hide", () => {
    const ui = new ScaleUI();

    ui.show();
    ui.hide();

    expect(ui.visible).to.be.false;
  });
});
