import * as THREE from "three";

import ScaleUI from "~/controls/ar/ui/ScaleUI";

describe("ScaleUI", () => {
  it("has mesh with type THREE.Mesh on it", () => {
    expect(new ScaleUI().mesh).to.be.instanceOf(THREE.Mesh);
  });

  it("should set its object visibility to true after calling show", () => {
    // Given
    const ui = new ScaleUI();
    ui.hide();

    // When
    ui.show();

    // Then
    expect(ui.visible).to.be.true;
  });

  it("should set its object visibility to false after calling hide", () => {
    // Given
    const ui = new ScaleUI();
    ui.show();

    // When
    ui.hide();

    // Then
    expect(ui.visible).to.be.false;
  });
});
