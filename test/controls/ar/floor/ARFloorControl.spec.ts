import * as THREE from "three";
import * as sinon from "sinon";
import ARFloorControl from "~/controls/ar/floor/ARFloorControl";
import ARSwirlControl from "~/controls/ar/common/ARSwirlControl";
import ARFloorTranslateControl from "~/controls/ar/floor/ARFloorTranslateControl";
import ARScaleControl from "~/controls/ar/common/ARScaleControl";
import View3D from "~/View3D";
import Model from "~/core/Model";
import { createXRRenderingContext } from "test/test-utils";

describe("ARFloorControl", () => {
  describe("Default properties", () => {
    it("is enabled by default", () => {
      expect(new ARFloorControl().enabled).to.be.true;
    });

    it("has ARSwirlControl in it", () => {
      expect(new ARFloorControl().rotate).to.be.instanceOf(ARSwirlControl);
    });

    it("has ARFloorTranslateControl in it", () => {
      expect(new ARFloorControl().translate).to.be.instanceOf(ARFloorTranslateControl);
    });

    it("has ARScaleControl in it", () => {
      expect(new ARFloorControl().scale).to.be.instanceOf(ARScaleControl);
    });

    it("should have rotate, translate, scale controls as 'controls'", () => {
      const control = new ARFloorControl();
      expect(control.controls).to.deep.equal([control.rotate, control.translate, control.scale]);
    });
  });

  describe("Options", () => {
    it("can pass options to rotate control", () => {
      expect(new ARFloorControl({ rotate: { scale: 5 } }).rotate.scale).to.equal(5);
    });

    it("can pass options to translate control", () => {
      expect(new ARFloorControl({ translate: { hoverAmplitude: 10 } }).translate.hoverAmplitude).to.equal(10);
    });

    it("can pass options to scale control", () => {
      expect(new ARFloorControl({ scale: { max: 100 } }).scale.range.max).to.equal(100);
    });
  });

  it("can be disabled by calling disable", () => {
    // Given
    const control = new ARFloorControl();
    const wanEnabled = control.enabled === true;

    // When
    control.disable();

    // Then
    expect(wanEnabled).to.be.true;
    expect(control.enabled).to.be.false;
  });

  it("can be re-enabled by calling enable", () => {
    // Given
    const control = new ARFloorControl();
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
    const control = new ARFloorControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);

    const ctx = createXRRenderingContext({ view3d, model, session: { requestHitTestSourceForTransientInput: () => Promise.resolve() } });
    const initSpies = control.controls.map(control => sinon.spy(control, "init"));

    // When
    control.init(ctx, new THREE.Vector3(0, 0, 0));

    // Then
    expect(initSpies.every(spy => spy.calledWith(ctx))).to.be.true;
  });

  it("should call deactivate for each controls on deactivation", () => {
    // Given
    const control = new ARFloorControl();

    // When
    const deactivateSpies = control.controls.map(control => sinon.spy(control, "deactivate"));
    control.deactivate();

    // Then
    expect(deactivateSpies.every(spy => spy.calledOnce)).to.be.true;
  });

  it("should call deactivate on disable", () => {
    // Given
    const control = new ARFloorControl();

    // When
    const deactivateSpy = sinon.spy(control, "deactivate");
    control.disable();

    // Then
    expect(deactivateSpy.calledOnce).to.be.true;
  });

  it("should call deactivate on select end", () => {
    // Given
    const control = new ARFloorControl();

    // When
    const deactivateSpy = sinon.spy(control, "deactivate");
    control.onSelectEnd();

    // Then
    expect(deactivateSpy.calledOnce).to.be.true;
  });

  it("should add floor / scale indicator on init", () => {
    // Given
    const control = new ARFloorControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);

    // When
    const addSpy = sinon.spy(view3d.scene, "add");
    control.init(createXRRenderingContext({ view3d, model, session: { requestHitTestSourceForTransientInput: () => Promise.resolve() } }), new THREE.Vector3());

    // Then
    expect(addSpy.calledTwice).to.be.true;
  });

  it("should remove floor / scale indicator on init", () => {
    // Given
    const control = new ARFloorControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    const ctx = createXRRenderingContext({ view3d, model, session: { requestHitTestSourceForTransientInput: () => Promise.resolve() } });
    view3d.display(model);
    control.init(ctx, new THREE.Vector3());

    // When
    const removeSpy = sinon.spy(view3d.scene, "remove");
    control.destroy(ctx);

    // Then
    expect(removeSpy.calledTwice).to.be.true;
  });
});
