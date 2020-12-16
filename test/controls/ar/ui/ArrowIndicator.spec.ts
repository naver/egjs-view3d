import * as THREE from "three";
import ArrowIndicator from "~/controls/ar/ui/ArrowIndicator";

describe("ArrowIndicator", () => {
  describe("Options", () => {
    it("should change all material color to given color", () => {
      // Given & When
      const arrow = new ArrowIndicator({ color: 0x123987 });

      // Then
      arrow.object.traverse(obj => {
        if ((obj as any).isMesh) {
          const material = (obj as THREE.Mesh).material as THREE.MeshBasicMaterial;
          expect(material.color).to.deep.equal(new THREE.Color(0x123987));
        }
      });
    });
  });

  it("is invisible by default", () => {
    expect(new ArrowIndicator().object.visible).to.be.false;
  });

  it("should set its object visibility to true after calling show", () => {
    // Given
    const arrow = new ArrowIndicator();

    // When
    arrow.show()

    // Then
    expect(arrow.object.visible).to.be.true;
  });

  it("should set its object visibility to false after calling hide", () => {
    // Given
    const arrow = new ArrowIndicator();
    arrow.show();

    // When
    arrow.hide();

    // Then
    expect(arrow.object.visible).to.be.false;
  });

  describe("updatePosition", () => {
    it("can change its object position", () => {
      // Given
      const arrow = new ArrowIndicator();

      // When
      arrow.updatePosition(new THREE.Vector3(10, 50, -30));

      // Then
      expect(arrow.object.position).to.deep.equal(new THREE.Vector3(10, 50, -30));
    });

    it("will use the last position when called multiple times", () => {
      // Given
      const arrow = new ArrowIndicator();

      // When
      arrow.updatePosition(new THREE.Vector3(10, 50, -30));
      arrow.updatePosition(new THREE.Vector3(-12, 24, 17));

      // Then
      expect(arrow.object.position).to.deep.equal(new THREE.Vector3(-12, 24, 17));
    });
  });

  describe("updateRotation", () => {
    it("can change its object rotation", () => {
      // Given
      const arrow = new ArrowIndicator();
      const expected = new THREE.Quaternion().setFromEuler(new THREE.Euler(-30, 12, 27));

      // When
      arrow.updateRotation(expected);

      // Then
      expect(arrow.object.quaternion.toArray()).to.deep.equal(expected.toArray());
    });

    it("will use the last quaternion when called multiple times", () => {
      // Given
      const arrow = new ArrowIndicator();
      const expected = new THREE.Quaternion().setFromEuler(new THREE.Euler(-30, 12, 27));

      // When
      arrow.updateRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler(14, -20, 5)));
      arrow.updateRotation(expected);

      // Then
      expect(arrow.object.quaternion.toArray()).to.deep.equal(expected.toArray());
    });
  });
});
