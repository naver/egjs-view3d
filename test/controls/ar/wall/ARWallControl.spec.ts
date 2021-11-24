import * as THREE from "three";
import * as sinon from "sinon";

import ARWallControl from "~/controls/ar/wall/ARWallControl";
import ARSwirlControl from "~/controls/ar/common/ARSwirlControl";
import ARWallTranslateControl from "~/controls/ar/wall/ARWallTranslateControl";
import ARScaleControl from "~/controls/ar/common/ARScaleControl";
import View3D from "~/View3D";
import Model from "~/core/Model";

import { createXRRenderingContext } from "../../../test-utils";

describe("ARWallControl", () => {
  describe("Default properties", () => {
    it("is enabled by default", () => {
      expect(new ARWallControl().enabled).to.be.true;
    });

    it("has ARSwirlControl in it", () => {
      expect(new ARWallControl().rotate).to.be.instanceOf(ARSwirlControl);
    });

    it("has ARWallTranslateControl in it", () => {
      expect(new ARWallControl().translate).to.be.instanceOf(ARWallTranslateControl);
    });

    it("has ARScaleControl in it", () => {
      expect(new ARWallControl().scale).to.be.instanceOf(ARScaleControl);
    });

    it("should have rotate, translate, scale controls as 'controls'", () => {
      const control = new ARWallControl();
      expect(control.controls).to.deep.equal([control.rotate, control.translate, control.scale]);
    });
  });

  describe("Options", () => {
    it("can pass options to rotate control", () => {
      expect(new ARWallControl({ rotate: { scale: 8 } }).rotate.scale).to.equal(8);
    });

    it("can pass options to scale control", () => {
      expect(new ARWallControl({ scale: { max: 5 } }).scale.range.max).to.equal(5);
    });
  });

  it("can be disabled by calling disable", () => {
    // Given
    const control = new ARWallControl();
    const wanEnabled = control.enabled === true;

    // When
    control.disable();

    // Then
    expect(wanEnabled).to.be.true;
    expect(control.enabled).to.be.false;
  });

  it("can be re-enabled by calling enable", () => {
    // Given
    const control = new ARWallControl();
    control.disable();
    const wasDisabled = control.enabled === false;

    // When
    control.enable();

    // Then
    expect(wasDisabled).to.be.true;
    expect(control.enabled).to.be.true;
  });

  it("should call init for each controls when initializing", () => {
    // Given
    const control = new ARWallControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    const initialTransform = {
      hitPosition: new THREE.Vector3(),
      hitRotation: new THREE.Quaternion(),
      modelPosition: new THREE.Vector3(),
      wallRotation: new THREE.Quaternion()
    };
    view3d.display(model);

    const ctx = createXRRenderingContext({ view3d, model, session: { requestHitTestSourceForTransientInput: () => Promise.resolve() } });
    const initSpies = control.controls.map(ctrl => sinon.spy(ctrl, "init"));

    // When
    control.init(ctx, initialTransform);

    // Then
    expect(initSpies.every(spy => spy.calledWith(ctx))).to.be.true;
  });

  it("should call initWallTransform for translate control when initializing", () => {
    // Given
    const control = new ARWallControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    const initialTransform = {
      hitPosition: new THREE.Vector3(),
      hitRotation: new THREE.Quaternion(),
      modelPosition: new THREE.Vector3(),
      wallRotation: new THREE.Quaternion()
    };
    view3d.display(model);

    const ctx = createXRRenderingContext({ view3d, model, session: { requestHitTestSourceForTransientInput: () => Promise.resolve() } });
    const initWallSpy = sinon.spy(control.translate, "initWallTransform");

    // When
    control.init(ctx, initialTransform);

    // Then
    expect(initWallSpy.calledOnceWith(initialTransform)).to.be.true;
  });

  it("should call deactivate for each controls on deactivation", () => {
    // Given
    const control = new ARWallControl();

    // When
    const deactivateSpies = control.controls.map(ctrl => sinon.spy(ctrl, "deactivate"));
    control.deactivate();

    // Then
    expect(deactivateSpies.every(spy => spy.calledOnce)).to.be.true;
  });

  it("should call deactivate on disable", () => {
    // Given
    const control = new ARWallControl();

    // When
    const deactivateSpy = sinon.spy(control, "deactivate");
    control.disable();

    // Then
    expect(deactivateSpy.calledOnce).to.be.true;
  });

  it("should call deactivate on select end", () => {
    // Given
    const control = new ARWallControl();

    // When
    const deactivateSpy = sinon.spy(control, "deactivate");
    control.onSelectEnd();

    // Then
    expect(deactivateSpy.calledOnce).to.be.true;
  });

  it("should add rotate / translate / scale indicator on init", () => {
    // Given
    const control = new ARWallControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    const initialTransform = {
      hitPosition: new THREE.Vector3(),
      hitRotation: new THREE.Quaternion(),
      modelPosition: new THREE.Vector3(),
      wallRotation: new THREE.Quaternion()
    };
    view3d.display(model);

    // When
    const addSpy = sinon.spy(view3d.scene, "add");
    control.init(createXRRenderingContext({ view3d, model, session: { requestHitTestSourceForTransientInput: () => Promise.resolve() } }), initialTransform);

    // Then
    expect(addSpy.calledThrice).to.be.true;
  });

  it("should remove rotate / translate / scale indicator on init", () => {
    // Given
    const control = new ARWallControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    const ctx = createXRRenderingContext({ view3d, model, session: { requestHitTestSourceForTransientInput: () => Promise.resolve() } });
    const initialTransform = {
      hitPosition: new THREE.Vector3(),
      hitRotation: new THREE.Quaternion(),
      modelPosition: new THREE.Vector3(),
      wallRotation: new THREE.Quaternion()
    };
    view3d.display(model);
    control.init(ctx, initialTransform);

    // When
    const removeSpy = sinon.spy(view3d.scene, "remove");
    control.destroy(ctx);

    // Then
    expect(removeSpy.calledThrice).to.be.true;
  });
});
