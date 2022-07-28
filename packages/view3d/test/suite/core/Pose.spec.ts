import Pose from "~/core/Pose";

describe("Pose", () => {
  describe("clone", () => {
    it("should create new instance of Pose", () => {
      const pose = new Pose(0, 0, 100);
      const cloned = pose.clone();

      expect(cloned).not.to.be.equal(pose);
      expect(cloned).to.be.deep.equal(pose);
    });
  });
});
