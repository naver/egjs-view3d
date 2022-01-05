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
  });

  it("can add clips by calling setClips", () => {
    const animator = new ModelAnimator(new THREE.Scene());
    const clip = new THREE.AnimationClip("", 0, []);

    animator.setClips([clip]);

    expect(animator.clips).to.deep.equal([clip]);
  });

  it("can reset clips by calling reset", () => {
    const animator = new ModelAnimator(new THREE.Scene());
    const clip = new THREE.AnimationClip("", 0, []);
    animator.setClips([clip]);

    animator.reset();

    expect(animator.clips).to.be.empty;
  });
});
