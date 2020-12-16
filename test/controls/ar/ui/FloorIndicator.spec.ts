import * as THREE from "three";
import FloorIndicator from "~/controls/ar/ui/FloorIndicator";

describe("FloorIndicator", () => {
  it("has mesh with type THREE.Mesh on it", () => {
    expect(new FloorIndicator().mesh).to.be.instanceOf(THREE.Mesh);
  });

  describe("fadeout", () => {
    it("should make mesh invisible if time passed more than fadeout duration", () => {
      // Given
      const floor = new FloorIndicator({ fadeoutDuration: 2000 });

      // When
      floor.fadeout();
      const wasVisible = floor.mesh.visible;
      floor.update({ delta: 2000, scale: 1, position: new THREE.Vector3(), rotation: new THREE.Quaternion() });

      // Then
      expect(wasVisible).to.be.true;
      expect(floor.mesh.visible).to.be.false;
    });
  });
});
