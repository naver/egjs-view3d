import * as THREE from "three";
import * as sinon from "sinon";
import View3D from "~/View3D";
import Model from "~/core/Model";
import ARHoverRotateControl from "~/controls/ar/hover/ARHoverRotateControl";
import ARSwirlControl from "~/controls/ar/common/ARSwirlControl";
import ARSwipeControl from "~/controls/ar/common/ARSwipeControl";
import { createXRRenderingContext } from "test/test-utils";
import { GESTURE } from "~/consts/touch";

describe("ARHoverRotateControl", () => {
  describe("Initial properties", () => {
    it("should have unrotated quaternion as rotation", () => {
      expect(new ARHoverRotateControl().rotation).to.deep.equal(new THREE.Quaternion());
    });

    it("is enabled by default", () => {
      expect(new ARHoverRotateControl().enabled).to.be.true;
    });

    it("should have ARSwirlControl in it", () => {
      expect(new ARHoverRotateControl().swirl).to.be.instanceOf(ARSwirlControl);
    });

    it("should have ARSwipeControl in it", () => {
      expect(new ARHoverRotateControl().swipe).to.be.instanceOf(ARSwipeControl);
    });
  });

  describe("Options", () => {
    it("can pass options to swirl control", () => {
      expect(new ARHoverRotateControl({ swirl: { scale: 5 } }).swirl.scale).to.equal(5);
    });

    it("can pass options to swipe control", () => {
      expect(new ARHoverRotateControl({ swipe: { scale: 10 } }).swipe.scale).to.equal(10);
    });
  });

  it("can be disabled by calling disable", () => {
    // Given
    const control = new ARHoverRotateControl();
    const wanEnabled = control.enabled === true;

    // When
    control.disable();

    // Then
    expect(wanEnabled).to.be.true;
    expect(control.enabled).to.be.false;
  });

  it("can be re-enabled by calling enable", () => {
    // Given
    const control = new ARHoverRotateControl();
    control.disable();
    const wasDisabled = control.enabled === false;

    // When
    control.enable();

    // Then
    expect(wasDisabled).to.be.true;
    expect(control.enabled).to.be.true;
  });

  it("should copy model scene's initial quaternion to its rotation", () => {
    // Given
    const control = new ARHoverRotateControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    model.scene.rotateX(Math.PI / 2);
    model.scene.rotateY(-Math.PI / 4);
    model.scene.rotateZ(Math.PI / 6);
    view3d.display(model);

    const ctx = createXRRenderingContext({ view3d, model });

    // When
    control.init(ctx);

    // Then
    expect(model.scene.quaternion).not.to.deep.equal(new THREE.Quaternion());
    expect(control.rotation).to.deep.equal(model.scene.quaternion.clone());
  });

  it("should call init for each child controls when initializing", () => {
    // Given
    const control = new ARHoverRotateControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);

    const ctx = createXRRenderingContext({ view3d, model });
    const swirlInitSpy = sinon.spy(control.swirl, "init");
    const swipeInitSpy = sinon.spy(control.swipe, "init");

    // When
    control.init(ctx);

    // Then
    expect(swirlInitSpy.calledOnceWith(ctx)).to.be.true;
    expect(swipeInitSpy.calledOnceWith(ctx)).to.be.true;
  });

  const swirlGestures = [GESTURE.ONE_FINGER_HORIZONTAL, GESTURE.ONE_FINGER_VERTICAL];
  swirlGestures.forEach(gesture => {
    it(`should activate swirl control when gesture is ${GESTURE[gesture]}`, () => {
      // Given
      const control = new ARHoverRotateControl();
      const view3d = new View3D(document.createElement("canvas"));
      const model = new Model({ scenes: [] });
      view3d.display(model);

      const ctx = createXRRenderingContext({ view3d, model });
      const swirlSpy = sinon.spy(control.swirl, "activate");
      const swipeSpy = sinon.spy(control.swipe, "activate");

      // When
      control.activate(ctx, gesture);

      // Then
      expect(swirlSpy.calledOnceWith(ctx, gesture)).to.be.true;
      expect(swipeSpy.called).to.be.false;
    });
  });

  const swipeGestures = [GESTURE.TWO_FINGER_HORIZONTAL, GESTURE.TWO_FINGER_VERTICAL];
  swipeGestures.forEach(gesture => {
    it(`should activate swipe control when gesture is ${GESTURE[gesture]}`, () => {
      // Given
      const control = new ARHoverRotateControl();
      const view3d = new View3D(document.createElement("canvas"));
      const model = new Model({ scenes: [] });
      view3d.display(model);

      const ctx = createXRRenderingContext({ view3d, model });
      const swirlSpy = sinon.spy(control.swirl, "activate");
      const swipeSpy = sinon.spy(control.swipe, "activate");

      // When
      control.activate(ctx, gesture);

      // Then
      expect(swirlSpy.called).to.be.false;
      expect(swipeSpy.calledOnceWith(ctx, gesture)).to.be.true;
    });
  });

  it("should call deactivate for each child controls on deactivation", () => {
    // Given
    const control = new ARHoverRotateControl();
    const swirlSpy = sinon.spy(control.swirl, "deactivate");
    const swipeSpy = sinon.spy(control.swipe, "deactivate");

    // When
    control.deactivate();

    // Then
    expect(swirlSpy.calledOnce).to.be.true;
    expect(swipeSpy.calledOnce).to.be.true;
  });

  it("should call process for each child controls when process is called", () => {
    // Given
    const control = new ARHoverRotateControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);

    const ctx = createXRRenderingContext({ view3d, model });
    const inputs = { coords: [new THREE.Vector2(0, 0)], inputSources: [] };
    const swirlSpy = sinon.spy(control.swirl, "process");
    const swipeSpy = sinon.spy(control.swipe, "process");

    // When
    control.process(ctx, inputs);

    // Then
    expect(swirlSpy.calledOnceWith(ctx, inputs)).to.be.true;
    expect(swipeSpy.calledOnceWith(ctx, inputs)).to.be.true;
  });

  it("should call setInitialPos for each child controls when setInitialPos is called", () => {
    // Given
    const control = new ARHoverRotateControl();
    const coords = [new THREE.Vector2(0, 0)];
    const swirlSpy = sinon.spy(control.swirl, "setInitialPos");
    const swipeSpy = sinon.spy(control.swipe, "setInitialPos");

    // When
    control.setInitialPos(coords);

    // Then
    expect(swirlSpy.calledOnceWith(coords)).to.be.true;
    expect(swipeSpy.calledOnceWith(coords)).to.be.true;
  });

  it("should call update for swirl control if activate is called before with one finger gesture", () => {
    // Given
    const control = new ARHoverRotateControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);

    const ctx = createXRRenderingContext({ view3d, model });
    const deltaTime = 3487;
    const swirlSpy = sinon.spy(control.swirl, "update");
    const swipeSpy = sinon.spy(control.swipe, "update");

    // When
    control.activate(ctx, GESTURE.ONE_FINGER_HORIZONTAL);
    control.update(ctx, deltaTime);

    // Then
    expect(swirlSpy.calledOnceWith(ctx, deltaTime)).to.be.true;
    expect(swipeSpy.called).to.be.false;
  });

  it("should call update for swipe control if activate is called before with two finger gesture", () => {
    // Given
    const control = new ARHoverRotateControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);

    const ctx = createXRRenderingContext({ view3d, model });
    const deltaTime = 3487;
    const swirlSpy = sinon.spy(control.swirl, "update");
    const swipeSpy = sinon.spy(control.swipe, "update");

    // When
    control.activate(ctx, GESTURE.TWO_FINGER_HORIZONTAL);
    control.update(ctx, deltaTime);

    // Then
    expect(swirlSpy.called).to.be.false;
    expect(swipeSpy.calledOnceWith(ctx, deltaTime)).to.be.true;
  });

  it("should not call update for each child controls when activate is not called before", () => {
    // Given
    const control = new ARHoverRotateControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    view3d.display(model);

    const ctx = createXRRenderingContext({ view3d, model });
    const deltaTime = 3487;
    const swirlSpy = sinon.spy(control.swirl, "update");
    const swipeSpy = sinon.spy(control.swipe, "update");

    // When
    control.update(ctx, deltaTime);

    // Then
    expect(swirlSpy.called).to.be.false;
    expect(swipeSpy.called).to.be.false;
  });

  it("should use world axis on rotate axis update when camera and model is not rotated", () => {
    // Given
    const control = new ARHoverRotateControl();
    const view3d = new View3D(document.createElement("canvas"));
    const model = new Model({ scenes: [] });
    const cam = new THREE.PerspectiveCamera();
    view3d.display(model);
    cam.position.set(0, 0, 1);
    cam.lookAt(0, 0, 0);
    cam.updateMatrixWorld();
    cam.updateProjectionMatrix();

    const ctx = createXRRenderingContext({ view3d, model, xrCam: cam });
    const swirlSpy = sinon.spy(control.swirl, "updateAxis");
    const swipeSpy = sinon.spy(control.swipe, "updateAxis");

    // When
    control.updateRotateAxis(ctx);

    // Then
    expect(swirlSpy.calledOnceWithExactly(new THREE.Vector3(0, 0, 1))).to.be.true;
    // ARSwipeControl uses reversed(minus) direction
    expect(swipeSpy.calledOnceWithExactly(new THREE.Vector3(0, 1, 0).negate(), new THREE.Vector3(1, 0, 0).negate())).to.be.true;
  });
});
