import * as THREE from "three";
import * as sinon from "sinon";
import View3D from "~/View3D";
import Model from "~/core/Model";
import ARScaleControl from "~/controls/ar/common/ARScaleControl";
import { createXRRenderingContext } from "test/test-utils";
import { GESTURE } from "~/consts/touch";

describe("ARScaleControl", () => {
  describe("Initial properties", () => {
    it("is enabled by default", () => {
      expect(new ARScaleControl().enabled).to.be.true;
    });

    it("has default scale of (0, 0, 0)", () => {
      expect(new ARScaleControl().scale).to.deep.equal(new THREE.Vector3(0, 0, 0));
    });

    it("has default scale multiplier of 1", () => {
      expect(new ARScaleControl().scaleMultiplier).to.equal(1);
    });

    it("has default range from 0.05 to 2", () => {
      expect(new ARScaleControl().range).to.deep.equal({ min: 0.05, max: 2 });
    });
  });

  it("can set range at initialization", () => {
    expect(new ARScaleControl({ min: 5, max: 6 }).range).to.deep.equal({ min: 5, max: 6 });
  });

  it("can update range by calling setRange", () => {
    // Given
    const control = new ARScaleControl({ min: 1, max: 2 });

    // When
    control.setRange(3, 4);

    // Then
    expect(control.range).to.deep.equal({ min: 3, max: 4 });
  });

  it("can be disabled by calling disable", () => {
    // Given
    const control = new ARScaleControl();
    const wanEnabled = control.enabled === true;

    // When
    control.disable();

    // Then
    expect(wanEnabled).to.be.true;
    expect(control.enabled).to.be.false;
  });

  it("can be re-enabled by calling enable", () => {
    // Given
    const control = new ARScaleControl();
    control.disable();
    const wasDisabled = control.enabled === false;

    // When
    control.enable();

    // Then
    expect(wasDisabled).to.be.true;
    expect(control.enabled).to.be.true;
  });

  it("should add scale indicator on initialization when showIndicator = true", () => {
    // Given
    const control = new ARScaleControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);

    // When
    const addSpy = sinon.spy(view3d.scene, "add");
    control.init(createXRRenderingContext({ view3d, model }));

    // Then
    expect(addSpy.calledOnce).to.be.true;
  });

  it("should remove scale indicator on destroy when showIndicator = true", () => {
    // Given
    const control = new ARScaleControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);
    control.init(createXRRenderingContext({ view3d, model }));

    // When
    const removeSpy = sinon.spy(view3d.scene, "remove");
    control.destroy(createXRRenderingContext({ view3d, model }));

    // Then
    expect(removeSpy.calledOnce).to.be.true;
  });

  describe("Scale change", () => {
    it("should increase scale value by amount of distance change in coords", () => {
      // Given
      const control = new ARScaleControl({ max: 10 });
      const view3d = new View3D(document.createElement("canvas"));
      const model = new Model({ scenes: [] });
      const cam = new THREE.PerspectiveCamera();

      view3d.display(model, { applySize: false });

      // When
      const renderContext = createXRRenderingContext({ view3d, model, xrCam: cam });
      control.init(renderContext);
      control.activate(renderContext, GESTURE.PINCH);
      control.setInitialPos([new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)]); // distance = 0
      control.process(renderContext, { coords: [new THREE.Vector2(0, 0), new THREE.Vector2(1, 1)], inputSources: [] }); // distance = sqrt(2)
      control.update(renderContext, 1000);

      // Then
      expect(control.scale.x).closeTo(1 + Math.SQRT2, 0.0001);
      expect(control.scale.y).closeTo(1 + Math.SQRT2, 0.0001);
      expect(control.scale.z).closeTo(1 + Math.SQRT2, 0.0001);
    });

    it("should increase scale value by clamped amount of distance change in coords", () => {
      // Given
      const control = new ARScaleControl({ max: 2 });
      const view3d = new View3D(document.createElement("canvas"));
      const model = new Model({ scenes: [] });
      const cam = new THREE.PerspectiveCamera();

      view3d.display(model, { applySize: false });

      // When
      const renderContext = createXRRenderingContext({ view3d, model, xrCam: cam });
      control.init(renderContext);
      control.activate(renderContext, GESTURE.PINCH);
      control.setInitialPos([new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)]); // distance = 0
      control.process(renderContext, { coords: [new THREE.Vector2(0, 0), new THREE.Vector2(1, 1)], inputSources: [] }); // distance = sqrt(2)
      control.update(renderContext, 1000);

      // Then
      expect(control.scale.x).to.equal(2);
      expect(control.scale.y).to.equal(2);
      expect(control.scale.z).to.equal(2);
    });

    it("should decrease scale value by amount of distance change in coords", () => {
      // Given
      const control = new ARScaleControl({ min: 0 });
      const view3d = new View3D(document.createElement("canvas"));
      const model = new Model({ scenes: [] });
      const cam = new THREE.PerspectiveCamera();

      view3d.display(model, { applySize: false });

      // When
      const renderContext = createXRRenderingContext({ view3d, model, xrCam: cam });
      control.init(renderContext);
      control.activate(renderContext, GESTURE.PINCH);
      control.setInitialPos([new THREE.Vector2(1, 0), new THREE.Vector2(0, 0)]); // distance = 1
      control.process(renderContext, { coords: [new THREE.Vector2(0.5, 0), new THREE.Vector2(0, 0)], inputSources: [] }); // distance = 0.5
      control.update(renderContext, 1000);

      // Then
      expect(control.scale.x).closeTo(0.5, 0.0001);
      expect(control.scale.y).closeTo(0.5, 0.0001);
      expect(control.scale.z).closeTo(0.5, 0.0001);
    });

    it("should decrease scale value by clamped amount of distance change in coords", () => {
      // Given
      const control = new ARScaleControl({ min: 0.05 });
      const view3d = new View3D(document.createElement("canvas"));
      const model = new Model({ scenes: [] });
      const cam = new THREE.PerspectiveCamera();

      view3d.display(model, { applySize: false });

      // When
      const renderContext = createXRRenderingContext({ view3d, model, xrCam: cam });
      control.init(renderContext);
      control.activate(renderContext, GESTURE.PINCH);
      control.setInitialPos([new THREE.Vector2(2, 2), new THREE.Vector2(0, 0)]); // distance = 2 * sqrt(2)
      control.process(renderContext, { coords: [new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)], inputSources: [] }); // distance = 0
      control.update(renderContext, 1000);

      // Then
      expect(control.scale.x).to.equal(0.05);
      expect(control.scale.y).to.equal(0.05);
      expect(control.scale.z).to.equal(0.05);
    });
  });
});
