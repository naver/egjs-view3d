import * as THREE from "three";
import { createView3D, loadDefaultModel } from "../../test-utils";

describe("Camera", () => {
  describe("default properties", () => {
    it("should have perspective camera as default", async () => {
      expect((await createView3D()).camera.threeCamera).to.be.instanceOf(THREE.PerspectiveCamera);
    });

    it("should have default pose of yaw: 0, pitch: 0, zoom: 0, pivot: (0, 0, 0)", async () => {
      const camera = (await createView3D()).camera;

      expect(camera.defaultPose.yaw).to.equal(0);
      expect(camera.defaultPose.pitch).to.equal(0);
      expect(camera.defaultPose.zoom).to.equal(0);
      expect(camera.defaultPose.pivot).to.deep.equal(new THREE.Vector3(0, 0, 0));
    });

    it("should have current pose of yaw: 0, pitch: 0, zoom: 0, pivot: (0, 0, 0)", async () => {
      const camera = (await createView3D()).camera;

      expect(camera.currentPose.yaw).to.equal(0);
      expect(camera.currentPose.pitch).to.equal(0);
      expect(camera.currentPose.zoom).to.equal(0);
      expect(camera.currentPose.pivot).to.deep.equal(new THREE.Vector3(0, 0, 0));
    });

    it("should have pose-related values of yaw: 0, pitch: 0, distance: 100, pivot: (0, 0, 0)", async () => {
      const camera = (await createView3D()).camera;

      expect(camera.yaw).to.equal(0);
      expect(camera.pitch).to.equal(0);
      expect(camera.zoom).to.equal(0);
      expect(camera.pivot).to.deep.equal(new THREE.Vector3(0, 0, 0));
    });

    it("should set default pose equal to View3D's yaw, pitch, initialZoom", async () => {
      const camera = (await createView3D({
        yaw: 1,
        pitch: 2,
        initialZoom: 3
      })).camera;

      expect(camera.defaultPose.yaw).to.equal(1);
      expect(camera.defaultPose.pitch).to.equal(2);
      expect(camera.defaultPose.zoom).to.equal(3);
    });
  });

  describe("reset", () => {
    it("should set pose to default pose immediately if duration = 0", async () => {
      const view3D = await createView3D();

      await loadDefaultModel(view3D);

      const camera = view3D.camera;
      camera.newPose.yaw = 90;
      camera.newPose.pitch = 45;
      camera.newPose.zoom = 50;
      camera.newPose.pivot = new THREE.Vector3(2, 2, 2);

      camera.updatePosition();
      const poseBeforeReset = camera.currentPose.clone();
      camera.reset(0);

      expect(poseBeforeReset.equals(camera.defaultPose)).to.be.false;
      expect(camera.currentPose.equals(camera.defaultPose)).to.be.true;
    });

    it("should set pose to default pose after given duration if duration > 0", async () => {
      const view3D = await createView3D();

      await loadDefaultModel(view3D);

      const camera = view3D.camera;
      camera.newPose.yaw = 90;
      camera.newPose.pitch = 45;
      camera.newPose.zoom = 50;
      camera.newPose.pivot = new THREE.Vector3(2, 2, 2);

      camera.updatePosition();
      const poseBeforeReset = camera.currentPose.clone();
      view3D.renderer.setAnimationLoop(view3D.renderer.defaultRenderLoop);

      await camera.reset(500);

      expect(poseBeforeReset.equals(camera.defaultPose)).to.be.false;
      expect(camera.currentPose.equals(camera.defaultPose)).to.be.true;
    });
  });

  describe("resize", () => {
    it("should set three.js camera's aspect based on given size", async () => {
      const camera = (await createView3D()).camera;
      const threeCamera = camera.threeCamera;

      camera.resize(new THREE.Vector2(1000, 500));

      expect(threeCamera.aspect).to.equal(2);
    });

    it("should update renderHeight proportionally if `maintainSize` is true", async () => {
      const view3D = (await createView3D({
        maintainSize: true
      }));

      await loadDefaultModel(view3D);

      const camera = view3D.camera;
      const prevHeight = view3D.renderer.size.height;
      const prevRenderHeight = camera.renderHeight;

      // Width doesn't matter
      camera.resize(new THREE.Vector2(1000, prevHeight * 2), view3D.renderer.size);
      camera.updatePosition();
      const newRenderHeight1 = camera.renderHeight;

      camera.resize(new THREE.Vector2(400, prevHeight * 3), new THREE.Vector2(1000, prevHeight * 2));
      camera.updatePosition();
      const newRenderHeight2 = camera.renderHeight;

      camera.resize(new THREE.Vector2(600, prevHeight / 5), new THREE.Vector2(400, prevHeight * 3));
      camera.updatePosition();
      const newRenderHeight3 = camera.renderHeight;

      expect(newRenderHeight1).to.be.closeTo(prevRenderHeight * 2, 0.000001);
      expect(newRenderHeight2).to.be.closeTo(prevRenderHeight * 3, 0.000001);
      expect(newRenderHeight3).to.be.closeTo(prevRenderHeight / 5, 0.000001);
    });
  });
});
