import DOMOverlay from "~/xr/features/DOMOverlay";

describe("DOMOverlay", () => {
  describe("Initial properties", () => {
    it("should have root to be 'null' as default", () => {
      expect(new DOMOverlay().root).to.be.null;
    });
  });

  describe("getFeatures", () => {
    it("should return 'dom-overlay' in required features", () => {
      const domOverlay = new DOMOverlay();

      expect(domOverlay.getFeatures(document.createElement("div")).requiredFeatures).to.include("dom-overlay");
    });

    it("should set the given root element as 'root'", () => {
      const el = document.createElement("div");
      const domOverlay = new DOMOverlay();

      domOverlay.getFeatures(el);

      expect(domOverlay.root).to.equal(el);
    });
  });
});
