import * as sinon from "sinon";
import ARHoverControl from "~/controls/ar/hover/ARHoverControl";
import ARHoverRotateControl from "~/controls/ar/hover/ARHoverRotateControl";
import ARHoverTranslateControl from "~/controls/ar/hover/ARHoverTranslateControl";
import ARScaleControl from "~/controls/ar/common/ARScaleControl";
import View3D from "~/View3D";
import Model from "~/core/Model";
import { createXRRenderingContext } from "test/test-utils";

describe("ARHoverControl", () => {
  describe("Default properties", () => {
    it("is enabled by default", () => {
      expect(new ARHoverControl().enabled).to.be.true;
    });

    it("has ARHoverRotateControl in it", () => {
      expect(new ARHoverControl().rotate).to.be.instanceOf(ARHoverRotateControl);
    });

    it("has ARHoverTranslateControl in it", () => {
      expect(new ARHoverControl().translate).to.be.instanceOf(ARHoverTranslateControl);
    });

    it("has ARScaleControl in it", () => {
      expect(new ARHoverControl().scale).to.be.instanceOf(ARScaleControl);
    });

    it("should have rotate, translate, scale controls as 'controls'", () => {
      const control = new ARHoverControl();
      expect(control.controls).to.deep.equal([control.rotate, control.translate, control.scale]);
    });
  });

  describe("Options", () => {
    it("can pass options to rotate control", () => {
      expect(new ARHoverControl({ rotate: { swirl: { scale: 10 } } }).rotate.swirl.scale).to.equal(10);
    });

    it("can pass options to scale control", () => {
      expect(new ARHoverControl({ scale: { max: 100 } }).scale.range.max).to.equal(100);
    });
  });

  it("can be disabled by calling disable", () => {
    // Given
    const control = new ARHoverControl();
    const wanEnabled = control.enabled === true;

    // When
    control.disable();

    // Then
    expect(wanEnabled).to.be.true;
    expect(control.enabled).to.be.false;
  });

  it("can be re-enabled by calling enable", () => {
    // Given
    const control = new ARHoverControl();
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
    const control = new ARHoverControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);

    const ctx = createXRRenderingContext({ view3d, model });
    const initSpies = control.controls.map(control => sinon.spy(control, "init"));

    // When
    control.init(ctx);

    // Then
    expect(initSpies.every(spy => spy.calledWith(ctx))).to.be.true;
  });

  it("should call deactivate for each controls on deactivation", () => {
    // Given
    const control = new ARHoverControl();

    // When
    const deactivateSpies = control.controls.map(control => sinon.spy(control, "deactivate"));
    control.deactivate();

    // Then
    expect(deactivateSpies.every(spy => spy.calledOnce)).to.be.true;
  });

  it("should call deactivate on disable", () => {
    // Given
    const control = new ARHoverControl();

    // When
    const deactivateSpy = sinon.spy(control, "deactivate");
    control.disable();

    // Then
    expect(deactivateSpy.calledOnce).to.be.true;
  });

  it("should call deactivate on select end", () => {
    // Given
    const control = new ARHoverControl();

    // When
    const deactivateSpy = sinon.spy(control, "deactivate");
    control.onSelectEnd();

    // Then
    expect(deactivateSpy.calledOnce).to.be.true;
  });

  it("should add rotate(2) / translate / scale indicator on init", () => {
    // Given
    const control = new ARHoverControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);

    // When
    const addSpy = sinon.spy(view3d.scene, "add");
    control.init(createXRRenderingContext({ view3d, model }));

    // Then
    expect(addSpy.callCount).to.equal(4);
  });

  it("should remove rotate(2) / translate / scale indicator on init", () => {
    // Given
    const control = new ARHoverControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    const ctx = createXRRenderingContext({ view3d, model });
    view3d.display(model);
    control.init(ctx);

    // When
    const removeSpy = sinon.spy(view3d.scene, "remove");
    control.destroy(ctx);

    // Then
    expect(removeSpy.callCount).to.equal(4);
  });
});
