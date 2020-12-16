import HitTest from "~/xr/features/HitTest";

describe("HitTest", () => {
  describe("Initial properties", () => {
    it("should have 'hit-test' in required features", () => {
      expect(new HitTest().features.requiredFeatures).to.include("hit-test");
    });

    it("should set ready as false", () => {
      expect(new HitTest().ready).to.be.false;
    });
  });
});
