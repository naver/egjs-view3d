import * as THREE from "three";

import ARSwirlControl from "~/control/ar/ARSwirlControl";
import { createView3D } from "test-utils";
import ARScene from "~/xr/ARScene";

describe("ARSwirlControl", () => {
  describe("Initial properties", () => {
    it("should have unrotated quaternion as rotation", () => {
      expect(new ARSwirlControl().rotation).to.deep.equal(new THREE.Quaternion());
    });

    it("is disabled by default", () => {
      expect(new ARSwirlControl().enabled).to.be.false;
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
      const control = new ARSwirlControl({ scale: 1 });

      control.scale = 5;

      expect(control.scale).to.equal(5);
    });
  });

  it("can be disabled by calling disable", () => {
    const control = new ARSwirlControl();
    control.enable();

    const wasEnabled = control.enabled === true;
    control.disable();

    expect(wasEnabled).to.be.true;
    expect(control.enabled).to.be.false;
  });

  it("can be re-enabled by calling enable", () => {
    const control = new ARSwirlControl();
    control.disable();

    const wasDisabled = control.enabled === false;
    control.enable();

    expect(wasDisabled).to.be.true;
    expect(control.enabled).to.be.true;
  });

  it("can update rotation value", () => {
    const control = new ARSwirlControl();

    control.updateRotation(new THREE.Quaternion(0, 1, 0, 0));

    expect(control.rotation).to.deep.equal(new THREE.Quaternion(0, 1, 0, 0));
  });

  describe("Rotating Clockwise", () => {
    const cases = [
      { from: new THREE.Vector2(0, 1), to: new THREE.Vector2(1, 1) },
      { from: new THREE.Vector2(1, 0), to: new THREE.Vector2(1, -1) },
      { from: new THREE.Vector2(0, -1), to: new THREE.Vector2(-1, -1) },
      { from: new THREE.Vector2(-1, 0), to: new THREE.Vector2(-1, 1) }
    ];

    cases.forEach(suite => {
      it(`should rotate yaw by -45 degree when input was from (${suite.from.x}, ${suite.from.y}) to (${suite.to.x}, ${suite.to.y}) and looked from above`, async () => {
        const control = new ARSwirlControl();
        const view3D = await createView3D();
        const cam = new THREE.PerspectiveCamera();
        cam.translateY(1);
        cam.rotateX(-Math.PI / 2);
        cam.updateMatrixWorld();
        cam.updateProjectionMatrix();

        await view3D.load("/cube.glb");

        const ctx = {
          scene: new ARScene(),
          xrCam: cam
        } as any;
        control.enable();
        control.activate();
        control.setInitialPos([suite.from]);
        control.process(ctx, { coords: [suite.to], inputSources: [] });
        control.update(ctx, 1000);

        expect(new THREE.Euler().setFromQuaternion(control.rotation).y).closeTo(-Math.PI / 4, 0.0001);
      });

      it(`should rotate yaw by -90 degree when scale is 2 and input was from (${suite.from.x}, ${suite.from.y}) to (${suite.to.x}, ${suite.to.y}) and looked from above`, async () => {
        const control = new ARSwirlControl({ scale: 2 });
        const view3D = await createView3D();
        const cam = new THREE.PerspectiveCamera();
        cam.translateY(1);
        cam.rotateX(-Math.PI / 2);
        cam.updateMatrixWorld();
        cam.updateProjectionMatrix();

        await view3D.load("/cube.glb");

        const ctx = {
          scene: new ARScene(),
          xrCam: cam
        } as any;
        control.enable();
        control.activate();
        control.setInitialPos([suite.from]);
        control.process(ctx, { coords: [suite.to], inputSources: [] });
        control.update(ctx, 1000);

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
      it(`should rotate yaw by 45 degree when input was from (${suite.from.x}, ${suite.from.y}) to (${suite.to.x}, ${suite.to.y}) and looked from above`, async () => {
        const control = new ARSwirlControl();
        const view3D = await createView3D();
        const cam = new THREE.PerspectiveCamera();
        cam.translateY(1);
        cam.rotateX(-Math.PI / 2);
        cam.updateMatrixWorld();
        cam.updateProjectionMatrix();

        await view3D.load("/cube.glb");

        const ctx = {
          scene: new ARScene(),
          xrCam: cam
        } as any;
        control.enable();
        control.activate();
        control.setInitialPos([suite.from]);
        control.process(ctx, { coords: [suite.to], inputSources: [] });
        control.update(ctx, 1000);

        expect(new THREE.Euler().setFromQuaternion(control.rotation).y).closeTo(Math.PI / 4, 0.0001);
      });

      it(`should rotate yaw by 180 degree when scale is 2 and input was from (${suite.from.x}, ${suite.from.y}) to (${suite.to.x}, ${suite.to.y}) and looked from above`, async () => {
        const control = new ARSwirlControl({ scale: 2 });
        const view3D = await createView3D();
        const cam = new THREE.PerspectiveCamera();
        cam.translateY(1);
        cam.rotateX(-Math.PI / 2);
        cam.updateMatrixWorld();
        cam.updateProjectionMatrix();

        await view3D.load("/cube.glb");

        const ctx = {
          scene: new ARScene(),
          xrCam: cam
        } as any;
        control.enable();
        control.activate();
        control.setInitialPos([suite.from]);
        control.process(ctx, { coords: [suite.to], inputSources: [] });
        control.update(ctx, 1000);

        expect(new THREE.Euler().setFromQuaternion(control.rotation).y).closeTo(Math.PI / 2, 0.0001);
      });
    });
  });
});
