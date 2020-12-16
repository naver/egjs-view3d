import DOMOverlay from "~/xr/features/DOMOverlay";

describe("DOMOverlay", () => {
  describe("Initial properties", () => {
    it("should return 'dom-overlay' in optional features", () => {
      const domOverlay = new DOMOverlay({ root: document.createElement("div"), loadingEl: null });

      expect(domOverlay.features.optionalFeatures).to.include("dom-overlay");
    });
  });

  describe("Options", () => {
    it("should have given root element as 'root'", () => {
      // Given
      const el = document.createElement("div");

      // When
      const domOverlay = new DOMOverlay({ root: el, loadingEl: null });

      // Then
      expect(domOverlay.root).to.equal(el);
    });

    it("should have given loading elmeent as 'loadingElement'", () => {
      // Given
      const el = document.createElement("div");

      // When
      const domOverlay = new DOMOverlay({ root: document.createElement("div"), loadingEl: el });

      // Then
      expect(domOverlay.loadingElement).to.equal(el);
    });
  });

  it("should set loading element's visibility to 'hidden' when hideLoading() is called", () => {
    // Given
    const el = document.createElement("div");
    const domOverlay = new DOMOverlay({ root: document.createElement("div"), loadingEl: el });

    // When
    domOverlay.hideLoading();

    // Then
    expect(el.style.visibility).to.equal("hidden");
  });

  it("should set loading element's visibility to 'visible' when showLoading() is called", () => {
    // Given
    const el = document.createElement("div");
    const domOverlay = new DOMOverlay({ root: document.createElement("div"), loadingEl: el });

    // When
    domOverlay.showLoading();

    // Then
    expect(el.style.visibility).to.equal("visible");
  });
});
