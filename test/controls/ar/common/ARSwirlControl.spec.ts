import * as THREE from "three";
import * as sinon from "sinon";
import { createXRRenderingContext } from "test/test-utils";

import View3D from "~/View3D";
import Model from "~/core/Model";
import ARSwirlControl from "~/controls/ar/common/ARSwirlControl";
import { GESTURE } from "~/consts/touch";

describe("ARSwirlControl", () => {
  describe("Initial properties", () => {
    it("should have unrotated quaternion as rotation", () => {
      expect(new ARSwirlControl().rotation).to.deep.equal(new THREE.Quaternion());
    });

    it("is enabled by default", () => {
      expect(new ARSwirlControl().enabled).to.be.true;
    });

    it("has default scale of 1", () => {
      expect(new ARSwirlControl().scale).to.equal(1);
    });
  });

  describe("Options", () => {
    it("can set scale at initialization", () => {
      expect(new ARSwirlControl({ scale: 2 }).scale).to.equal(2);
    });

    it("can change scale at any time", () => {
      // Given
      const control = new ARSwirlControl({ scale: 1 });

      // When
      control.scale = 5;

      // Then
      expect(control.scale).to.equal(5);
    });
  });

  it("can be disabled by calling disable", () => {
    // Given
    const control = new ARSwirlControl();
    const wanEnabled = control.enabled === true;

    // When
    control.disable();

    // Then
    expect(wanEnabled).to.be.true;
    expect(control.enabled).to.be.false;
  });

  it("can be re-enabled by calling enable", () => {
    // Given
    const control = new ARSwirlControl();
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
    const control = new ARSwirlControl();

    // When
    control.updateRotation(new THREE.Quaternion(0, 1, 0, 0));

    // Then
    expect(control.rotation).to.deep.equal(new THREE.Quaternion(0, 1, 0, 0));
  });

  it("should update rotation to model scene's quaternion", () => {
    // Given
    const control = new ARSwirlControl({ showIndicator: true });
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

  it("should add rotation indicator on initialization when showIndicator = true", () => {
    // Given
    const control = new ARSwirlControl({ showIndicator: true });
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);

    // When
    const addSpy = sinon.spy(view3d.scene, "add");
    control.init(createXRRenderingContext({ view3d, model }));

    // Then
    expect(addSpy.calledOnce).to.be.true;
  });

  it("should remove rotation indicator on destroy when showIndicator = true", () => {
    // Given
    const control = new ARSwirlControl({ showIndicator: true });
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

  describe("Rotating Clockwise", () => {
    const cases = [
      { from: new THREE.Vector2(0, 1), to: new THREE.Vector2(1, 1) },
      { from: new THREE.Vector2(1, 0), to: new THREE.Vector2(1, -1) },
      { from: new THREE.Vector2(0, -1), to: new THREE.Vector2(-1, -1) },
      { from: new THREE.Vector2(-1, 0), to: new THREE.Vector2(-1, 1) }
    ];

    cases.forEach(suite => {
      it(`should rotate yaw by -45 degree when input was from (${suite.from.x}, ${suite.from.y}) to (${suite.to.x}, ${suite.to.y}) and looked from above`, () => {
        // Given
        const control = new ARSwirlControl({ showIndicator: true });
        const view3d = new View3D(document.createElement("canvas"));
        const model = new Model({ scenes: [] });
        const cam = new THREE.PerspectiveCamera();
        cam.translateY(1);
        cam.rotateX(-Math.PI / 2);
        cam.updateMatrixWorld();
        cam.updateProjectionMatrix();

        view3d.display(model);

        // When
        const renderContext = createXRRenderingContext({ view3d, model, xrCam: cam });
        control.init(renderContext);
        control.activate(renderContext, GESTURE.ONE_FINGER_HORIZONTAL);
        control.setInitialPos([suite.from]);
        control.process(renderContext, { coords: [suite.to], inputSources: [] });
        control.update(renderContext, 1000);

        // Then
        expect(new THREE.Euler().setFromQuaternion(control.rotation).y).closeTo(-Math.PI / 4, 0.0001);
      });

      it(`should rotate yaw by -90 degree when scale is 2 and input was from (${suite.from.x}, ${suite.from.y}) to (${suite.to.x}, ${suite.to.y}) and looked from above`, () => {
        // Given
        const control = new ARSwirlControl({ showIndicator: true, scale: 2 });
        const view3d = new View3D(document.createElement("canvas"));
        const model = new Model({ scenes: [] });
        const cam = new THREE.PerspectiveCamera();
        cam.translateY(1);
        cam.rotateX(-Math.PI / 2);
        cam.updateMatrixWorld();
        cam.updateProjectionMatrix();

        view3d.display(model);

        // When
        const renderContext = createXRRenderingContext({ view3d, model, xrCam: cam });
        control.init(renderContext);
        control.activate(renderContext, GESTURE.ONE_FINGER_HORIZONTAL);
        control.setInitialPos([suite.from]);
        control.process(renderContext, { coords: [suite.to], inputSources: [] });
        control.update(renderContext, 1000);

        // Then
        expect(new THREE.Euler().setFromQuaternion(control.rotation).y).closeTo(-Math.PI / 2, 0.0001);
      });
    });
  });

  describe("Rotating Counter-clockwise", () => {
    const cases = [
      { from: new THREE.Vector2(0, 1), to: new THREE.Vector2(-1, 1) },
      { from: new THREE.Vector2(1, 0), to: new THREE.Vector2(1, 1) },
      { from: new THREE.Vector2(0, -1), to: new THREE.Vector2(1, -1) },
      { from: new THREE.Vector2(-1, 0), to: new THREE.Vector2(-1, -1) }
    ];

    cases.forEach(suite => {
      it(`should rotate yaw by 45 degree when input was from (${suite.from.x}, ${suite.from.y}) to (${suite.to.x}, ${suite.to.y}) and looked from above`, () => {
        // Given
        const control = new ARSwirlControl({ showIndicator: true });
        const view3d = new View3D(document.createElement("canvas"));
        const model = new Model({ scenes: [] });
        const cam = new THREE.PerspectiveCamera();
        cam.translateY(1);
        cam.rotateX(-Math.PI / 2);
        cam.updateMatrixWorld();
        cam.updateProjectionMatrix();

        view3d.display(model);

        // When
        const renderContext = createXRRenderingContext({ view3d, model, xrCam: cam });
        control.init(renderContext);
        control.activate(renderContext, GESTURE.ONE_FINGER_HORIZONTAL);
        control.setInitialPos([suite.from]);
        control.process(renderContext, { coords: [suite.to], inputSources: [] });
        control.update(renderContext, 1000);

        // Then
        expect(new THREE.Euler().setFromQuaternion(control.rotation).y).closeTo(Math.PI / 4, 0.0001);
      });

      it(`should rotate yaw by 180 degree when scale is 2 and input was from (${suite.from.x}, ${suite.from.y}) to (${suite.to.x}, ${suite.to.y}) and looked from above`, () => {
        // Given
        const control = new ARSwirlControl({ showIndicator: true, scale: 2 });
        const view3d = new View3D(document.createElement("canvas"));
        const model = new Model({ scenes: [] });
        const cam = new THREE.PerspectiveCamera();
        cam.translateY(1);
        cam.rotateX(-Math.PI / 2);
        cam.updateMatrixWorld();
        cam.updateProjectionMatrix();

        view3d.display(model);

        // When
        const renderContext = createXRRenderingContext({ view3d, model, xrCam: cam });
        control.init(renderContext);
        control.activate(renderContext, GESTURE.ONE_FINGER_HORIZONTAL);
        control.setInitialPos([suite.from]);
        control.process(renderContext, { coords: [suite.to], inputSources: [] });
        control.update(renderContext, 1000);

        // Then
        expect(new THREE.Euler().setFromQuaternion(control.rotation).y).closeTo(Math.PI / 2, 0.0001);
      });
    });
  });
});
