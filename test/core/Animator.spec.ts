import * as THREE from "three";
import ModelAnimator from "~/core/ModelAnimator";

describe("ModelAnimator", () => {
  describe("Initial state", () => {
    it("should have mixer on it", () => {
      // Given & When
      const animator = new ModelAnimator(new THREE.Scene());

      // Then
      expect(animator.mixer).not.toBeUndefined();
      expect(animator.mixer).not.toBeNull();
    });
  });
});
