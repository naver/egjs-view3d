import * as THREE from "three";

import FloorIndicator from "~/control/ar/FloorIndicator";

describe("FloorIndicator", () => {
  it("has mesh with type THREE.Group on it", () => {
    expect(new FloorIndicator().mesh).to.be.instanceOf(THREE.Group);
  });

  describe("fadeout", () => {
    it("should make mesh invisible if time passed more than fadeout duration", () => {
      const floor = new FloorIndicator({ fadeoutDuration: 2000 });
      floor.show();

      floor.fadeout();
      const wasVisible = floor.mesh.visible;
      floor.update({ delta: 2000, rotation: new THREE.Quaternion() });

      expect(wasVisible).to.be.true;
      expect(floor.mesh.visible).to.be.false;
    });
  });
});
