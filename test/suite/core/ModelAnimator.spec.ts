import * as THREE from "three";

import ModelAnimator from "~/core/ModelAnimator";
import { createView3D } from "../../test-utils";

describe("ModelAnimator", () => {
  describe("Initial state", () => {
    it("should have mixer on it", async () => {
      const view3D = await createView3D();
      expect(new ModelAnimator(view3D).mixer).to.be.instanceOf(THREE.AnimationMixer);
    });

    it("should have clips as an empty array", async () => {
      const view3D = await createView3D();
      expect(new ModelAnimator(view3D).clips).to.deep.equal([]);
    });

    it("should have actions as an empty array", async () => {
      const view3D = await createView3D();
      expect(new ModelAnimator(view3D).actions).to.deep.equal([]);
    });

    it("should have animationCount as 0", async () => {
      const view3D = await createView3D();
      expect(new ModelAnimator(view3D).animationCount).to.equal(0);
    });

    it("should have activeAnimation as null", async () => {
      const view3D = await createView3D();
      expect(new ModelAnimator(view3D).activeAnimation).to.equal(null);
    });

    it("should have activeAnimationIndex as -1", async () => {
      const view3D = await createView3D();
      expect(new ModelAnimator(view3D).activeAnimationIndex).to.equal(-1);
    });

    it("is not paused", async () => {
      const view3D = await createView3D();
      expect(new ModelAnimator(view3D).paused).to.be.false;
    });
  });

  describe("setClips", () => {
    it("should add the given clips", async () => {
      const view3D = await createView3D();
      const animator = new ModelAnimator(view3D);
      const clip = new THREE.AnimationClip("", 0, []);

      animator.setClips([clip]);

      expect(animator.clips).to.deep.equal([clip]);
    });

    it("should set actions with the given clips", async () => {
      const view3D = await createView3D();
      const animator = new ModelAnimator(view3D);
      const clip = new THREE.AnimationClip("", 0, []);

      animator.setClips([clip]);

      expect(animator.actions.length).to.equal(1);
      expect(animator.actions[0].getClip()).to.equal(clip);
    });
  });

  describe("reset", () => {
    it("should reset clips & actions", async () => {
      const view3D = await createView3D();
      const animator = new ModelAnimator(view3D);
      const clip = new THREE.AnimationClip("", 0, []);
      animator.setClips([clip]);

      animator.reset();

      expect(animator.clips).to.be.empty;
      expect(animator.actions).to.be.empty;
    });
  });
});
