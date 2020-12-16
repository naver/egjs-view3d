import * as THREE from "three";
import * as sinon from "sinon";
import View3D from "~/View3D";
import Model from "~/core/Model";
import ARSwipeControl from "~/controls/ar/common/ARSwipeControl";
import { createXRRenderingContext } from "test/test-utils";
import { GESTURE } from "~/consts/touch";

describe("ARSwipeControl", () => {
  describe("Initial properties", () => {
    it("is enabled by default", () => {
      expect(new ARSwipeControl().enabled).to.be.true;
    });

    it("has default scale of 1", () => {
      expect(new ARSwipeControl().scale).to.equal(1);
    });

    it("has horizontal axis as an empty vector", () => {
      expect(new ARSwipeControl().horizontalAxis).to.deep.equal(new THREE.Vector3());
    });

    it("has vertical axis as an empty vector", () => {
      expect(new ARSwipeControl().verticalAxis).to.deep.equal(new THREE.Vector3());
    });

    it("has default rotation as unrotated quaternion", () => {
      expect(new ARSwipeControl().rotation).to.deep.equal(new THREE.Quaternion());
    });
  });

  describe("Options", () => {
    it("can set scale at initialization", () => {
      expect(new ARSwipeControl({ scale: 2 }).scale).to.equal(2);
    });

    it("can change scale at any time", () => {
      // Given
      const control = new ARSwipeControl({ scale: 1 });

      // When
      control.scale = 5;

      // Then
      expect(control.scale).to.equal(5);
    });
  });

  it("can be disabled by calling disable", () => {
    // Given
    const control = new ARSwipeControl();
    const wanEnabled = control.enabled === true;

    // When
    control.disable();

    // Then
    expect(wanEnabled).to.be.true;
    expect(control.enabled).to.be.false;
  });

  it("can be re-enabled by calling enable", () => {
    // Given
    const control = new ARSwipeControl();
    control.disable();
    const wasDisabled = control.enabled === false;

    // When
    control.enable();

    // Then
    expect(wasDisabled).to.be.true;
    expect(control.enabled).to.be.true;
  });

  it("can update rotation value", () => {
    // Given
    const control = new ARSwipeControl();

    // When
    control.updateRotation(new THREE.Quaternion(0, 1, 0, 0));

    // Then
    expect(control.rotation).to.deep.equal(new THREE.Quaternion(0, 1, 0, 0));
  });

  it("should update rotation to model scene's quaternion", () => {
    // Given
    const control = new ARSwipeControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    model.scene.quaternion.set(0, -1, 0, 0);
    view3d.display(model);

    // When
    const updateSpy = sinon.spy(control, "updateRotation");
    control.init({ view3d, delta: 0, frame: {}, referenceSpace: {}, xrCam: {} as any, size: { width: 100, height: 100 }, model, session: {} });

    // Then
    expect(updateSpy.calledOnceWith(model.scene.quaternion)).to.be.true;
    expect(control.rotation).to.deep.equal(new THREE.Quaternion(0, -1, 0, 0));
  });

  it("should add rotation indicator on initialization", () => {
    // Given
    const control = new ARSwipeControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);

    // When
    const addSpy = sinon.spy(view3d.scene, "add");
    control.init(createXRRenderingContext({ view3d, model }));

    // Then
    expect(addSpy.calledOnce).to.be.true;
  });

  it("should remove rotation indicator on destroy", () => {
    // Given
    const control = new ARSwipeControl();
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

  describe("Horizontal swipe", () => {
    it("should rotate counter-clockwise by amount of x-diff in coords (in radians)", () => {
      // Given
      const control = new ARSwipeControl();
      const view3d = new View3D(document.createElement("canvas"));
      const model = new Model({ scenes: [] });
      const cam = new THREE.PerspectiveCamera();
      cam.translateZ(-1);
      cam.updateMatrixWorld();
      cam.updateProjectionMatrix();

      view3d.display(model);

      // When
      const renderContext = createXRRenderingContext({ view3d, model, xrCam: cam });
      control.init(renderContext);
      control.updateAxis(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
      control.activate(renderContext, GESTURE.TWO_FINGER_HORIZONTAL);
      // Move from x: 0 to x: 0.5
      control.setInitialPos([new THREE.Vector2(0, 1), new THREE.Vector2(0, -1)]);
      control.process(renderContext, { coords: [new THREE.Vector2(0.5, 1), new THREE.Vector2(0.5, -1)], inputSources: [] });
      control.update(renderContext, 1000);

      // Then
      expect(new THREE.Euler().setFromQuaternion(control.rotation).y).closeTo(-0.5, 0.0001);
    });

    it("should rotate counter-clockwise by scaled amount of x-diff in coords (in radians)", () => {
      // Given
      const control = new ARSwipeControl({ scale: 2 });
      const view3d = new View3D(document.createElement("canvas"));
      const model = new Model({ scenes: [] });
      const cam = new THREE.PerspectiveCamera();
      cam.translateZ(-1);
      cam.updateMatrixWorld();
      cam.updateProjectionMatrix();

      view3d.display(model);

      // When
      const renderContext = createXRRenderingContext({ view3d, model, xrCam: cam });
      control.init(renderContext);
      control.updateAxis(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
      control.activate(renderContext, GESTURE.TWO_FINGER_HORIZONTAL);
      // Move from x: 0 to x: 0.5
      control.setInitialPos([new THREE.Vector2(0, 1), new THREE.Vector2(0, -1)]);
      control.process(renderContext, { coords: [new THREE.Vector2(0.5, 1), new THREE.Vector2(0.5, -1)], inputSources: [] });
      control.update(renderContext, 1000);

      // Then
      expect(new THREE.Euler().setFromQuaternion(control.rotation).y).closeTo(-1, 0.0001);
    });
  });

  describe("Vertical swipe", () => {
    it("should rotate clockwise by amount of y-diff in coords (in radians)", () => {
      // Given
      const control = new ARSwipeControl();
      const view3d = new View3D(document.createElement("canvas"));
      const model = new Model({ scenes: [] });
      const cam = new THREE.PerspectiveCamera();
      cam.translateZ(-1);
      cam.updateMatrixWorld();
      cam.updateProjectionMatrix();

      view3d.display(model);

      // When
      const renderContext = createXRRenderingContext({ view3d, model, xrCam: cam });
      control.init(renderContext);
      control.updateAxis(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
      control.activate(renderContext, GESTURE.TWO_FINGER_VERTICAL);
      // Move from y: 0 to y: 0.5
      control.setInitialPos([new THREE.Vector2(1, 0), new THREE.Vector2(-1, 0)]);
      control.process(renderContext, { coords: [new THREE.Vector2(1, 0.5), new THREE.Vector2(-1, 0.5)], inputSources: [] });
      control.update(renderContext, 1000);

      // Then
      expect(new THREE.Euler().setFromQuaternion(control.rotation).x).closeTo(0.5, 0.0001);
    });

    it("should rotate clockwise by scaled amount of y-diff in coords (in radians)", () => {
      // Given
      const control = new ARSwipeControl({ scale: 2 });
      const view3d = new View3D(document.createElement("canvas"));
      const model = new Model({ scenes: [] });
      const cam = new THREE.PerspectiveCamera();
      cam.translateZ(-1);
      cam.updateMatrixWorld();
      cam.updateProjectionMatrix();

      view3d.display(model);

      // When
      const renderContext = createXRRenderingContext({ view3d, model, xrCam: cam });
      control.init(renderContext);
      control.updateAxis(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
      control.activate(renderContext, GESTURE.TWO_FINGER_VERTICAL);
      // Move from y: 0 to y: 0.5
      control.setInitialPos([new THREE.Vector2(1, 0), new THREE.Vector2(-1, 0)]);
      control.process(renderContext, { coords: [new THREE.Vector2(1, 0.5), new THREE.Vector2(-1, 0.5)], inputSources: [] });
      control.update(renderContext, 1000);

      // Then
      expect(new THREE.Euler().setFromQuaternion(control.rotation).x).closeTo(1, 0.0001);
    });
  });
});
