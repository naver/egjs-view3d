import * as THREE from "three";

import ModelAnimator from "~/core/ModelAnimator";

describe("ModelAnimator", () => {
  describe("Initial state", () => {
    it("should have mixer on it", () => {
      expect(new ModelAnimator(new THREE.Scene()).mixer).to.be.instanceOf(THREE.AnimationMixer);
    });

    it("should have clips as an empty array", () => {
      expect(new ModelAnimator(new THREE.Scene()).clips).to.deep.equal([]);
    });

    it("should have actions as an empty array", () => {
      expect(new ModelAnimator(new THREE.Scene()).actions).to.deep.equal([]);
    });

    it("should have animationCount as 0", () => {
      expect(new ModelAnimator(new THREE.Scene()).animationCount).to.equal(0);
    });

    it("should have activeAnimation as null", () => {
      expect(new ModelAnimator(new THREE.Scene()).activeAnimation).to.equal(null);
    });

    it("should have activeAnimationIndex as -1", () => {
      expect(new ModelAnimator(new THREE.Scene()).activeAnimationIndex).to.equal(-1);
    });

    it("is not paused", () => {
      expect(new ModelAnimator(new THREE.Scene()).paused).to.be.false;
    });
  });

  describe("setClips", () => {
    it("should add the given clips", () => {
      const animator = new ModelAnimator(new THREE.Scene());
      const clip = new THREE.AnimationClip("", 0, []);

      animator.setClips([clip]);

      expect(animator.clips).to.deep.equal([clip]);
    });

    it("should set actions with the given clips", () => {
      const animator = new ModelAnimator(new THREE.Scene());
      const clip = new THREE.AnimationClip("", 0, []);

      animator.setClips([clip]);

      expect(animator.actions.length).to.equal(1);
      expect(animator.actions[0].getClip()).to.equal(clip);
    });
  });

  describe("reset", () => {
    it("should reset clips & actions", () => {
      const animator = new ModelAnimator(new THREE.Scene());
      const clip = new THREE.AnimationClip("", 0, []);
      animator.setClips([clip]);

      animator.reset();

      expect(animator.clips).to.be.empty;
      expect(animator.actions).to.be.empty;
    });
  });
});
