import * as THREE from "three";
import * as sinon from "sinon";
import ARWallTranslateControl from "~/controls/ar/wall/ARWallTranslateControl";
import View3D from "~/View3D";
import Model from "~/core/Model";
import { createXRRenderingContext } from "test/test-utils";

describe("ARWallTranslateControl", () => {
  describe("Initial properties", () => {
    it("is enabled by default", () => {
      expect(new ARWallTranslateControl().enabled).to.be.true;
    });

    it("has default position at (0, 0, 0)", () => {
      expect(new ARWallTranslateControl().position).to.deep.equal(new THREE.Vector3(0, 0, 0));
    });

    it("has default wall position at (0, 0, 0)", () => {
      expect(new ARWallTranslateControl().wallPosition).to.deep.equal(new THREE.Vector3(0, 0, 0));
    });

    it("has default hit rotation of (0, 0, 0, 1)", () => {
      expect(new ARWallTranslateControl().hitRotation).to.deep.equal(new THREE.Quaternion(0, 0, 0, 1));
    });

    it("has default wall rotation of (0, 0, 0, 1)", () => {
      expect(new ARWallTranslateControl().wallRotation).to.deep.equal(new THREE.Quaternion(0, 0, 0, 1));
    });
  });

  it("can be disabled by calling disable", () => {
    // Given
    const control = new ARWallTranslateControl();
    const wanEnabled = control.enabled === true;

    // When
    control.disable();

    // Then
    expect(wanEnabled).to.be.true;
    expect(control.enabled).to.be.false;
  });

  it("can be re-enabled by calling enable", () => {
    // Given
    const control = new ARWallTranslateControl();
    control.disable();
    const wasDisabled = control.enabled === false;

    // When
    control.enable();

    // Then
    expect(wasDisabled).to.be.true;
    expect(control.enabled).to.be.true;
  });

  it("should add arrow indicator on initialization", () => {
    // Given
    const control = new ARWallTranslateControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);

    // When
    const addSpy = sinon.spy(view3d.scene, "add");
    control.init(createXRRenderingContext({ view3d, model }));

    // Then
    expect(addSpy.calledOnce).to.be.true;
  });

  it("should remove arrow indicator on destroy", () => {
    // Given
    const control = new ARWallTranslateControl();
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

  describe("initWallTransform", () => {
    it("should update position & rotation same to given values", () => {
      // Given
      const values = {
        hitPosition: new THREE.Vector3(5, 4, -23),
        hitRotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(30, -41, 72)),
        modelPosition: new THREE.Vector3(1, -1, -1),
        wallRotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -5, 1)),
      };
      const control = new ARWallTranslateControl();

      // When
      control.initWallTransform(values);

      // Then
      expect(control.position).to.deep.equal(values.modelPosition);
      expect(control.wallPosition).to.deep.equal(values.hitPosition);
      expect(control.hitRotation).to.deep.equal(values.hitRotation);
      expect(control.wallRotation).to.deep.equal(values.wallRotation);
    });
  });
});
