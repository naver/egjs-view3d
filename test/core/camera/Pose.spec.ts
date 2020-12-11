import Pose from "~/core/camera/Pose";

describe("Pose", () => {
  describe("clone", () => {
    it("should create new instance of Pose", () => {
      // Given
      const pose = new Pose(0, 0, 100);

      // When
      const cloned = pose.clone();

      // Then
      expect(cloned).not.to.be.equal(pose);
      expect(cloned).to.be.deep.equal(pose);
    });
  });
});
