import * as THREE from "three";
import RotationIndicator from "~/controls/ar/ui/RotationIndicator";

describe("RotationIndicator", () => {
  it("should be invisible at initialization", () => {
    expect(new RotationIndicator().object.visible).to.be.false;
  });

  it("should be visible after calling show", () => {
    // Given
    const indicator = new RotationIndicator();

    // When
    indicator.show();

    // Then
    expect(indicator.object.visible).to.be.true;
  });

  it("should be invisible after calling hide", () => {
    // Given
    const indicator = new RotationIndicator();
    indicator.show();

    // When
    indicator.hide();

    // Then
    expect(indicator.object.visible).to.be.false;
  });

  describe("updatePosition", () => {
    it("can change its object position", () => {
      // Given
      const indicator = new RotationIndicator();

      // When
      indicator.updatePosition(new THREE.Vector3(10, 50, -30));

      // Then
      expect(indicator.object.position).to.deep.equal(new THREE.Vector3(10, 50, -30));
    });

    it("will use the last position when called multiple times", () => {
      // Given
      const indicator = new RotationIndicator();

      // When
      indicator.updatePosition(new THREE.Vector3(10, 50, -30));
      indicator.updatePosition(new THREE.Vector3(-12, 24, 17));

      // Then
      expect(indicator.object.position).to.deep.equal(new THREE.Vector3(-12, 24, 17));
    });
  });

  describe("updateRotation", () => {
    it("can change its object rotation", () => {
      // Given
      const indicator = new RotationIndicator();
      const expected = new THREE.Quaternion().setFromEuler(new THREE.Euler(-30, 12, 27));

      // When
      indicator.updateRotation(expected);

      // Then
      expect(indicator.object.quaternion.toArray()).to.deep.equal(expected.toArray());
    });

    it("will use the last quaternion when called multiple times", () => {
      // Given
      const indicator = new RotationIndicator();
      const expected = new THREE.Quaternion().setFromEuler(new THREE.Euler(-30, 12, 27));

      // When
      indicator.updateRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler(14, -20, 5)));
      indicator.updateRotation(expected);

      // Then
      expect(indicator.object.quaternion.toArray()).to.deep.equal(expected.toArray());
    });
  });
});
