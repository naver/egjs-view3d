import * as THREE from "three";
import { createView3D } from "../../test-utils";

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
      const camera = (await createView3D()).camera;
      camera.yaw = 90;
      camera.pitch = 45;
      camera.zoom = 50;
      camera.pivot = new THREE.Vector3(2, 2, 2);

      const poseBeforeReset = camera.currentPose.clone();
      camera.reset(0);

      expect(poseBeforeReset).not.to.deep.equal(camera.defaultPose);
      expect(camera.currentPose).to.deep.equal(camera.defaultPose);
    });

    it("should set pose to default pose after given duration if duration > 0", async () => {
      const view3D = await createView3D();
      const camera = view3D.camera;
      camera.yaw = 90;
      camera.pitch = 45;
      camera.zoom = 50;
      camera.pivot = new THREE.Vector3(2, 2, 2);

      const poseBeforeReset = camera.currentPose.clone();
      view3D.renderer.setAnimationLoop(view3D.renderer.defaultRenderLoop);

      await camera.reset(500);

      expect(poseBeforeReset).not.to.deep.equal(camera.defaultPose);
      expect(camera.currentPose.pitch).to.equal(camera.defaultPose.pitch);
      expect(camera.currentPose.yaw).to.equal(camera.defaultPose.yaw);
      expect(camera.currentPose.zoom).to.equal(camera.defaultPose.zoom);
      expect(camera.currentPose.pivot).to.deep.equal(camera.defaultPose.pivot);
    });
  });

  describe("resize", () => {
    it("should set three.js camera's aspect based on given size", async () => {
      const camera = (await createView3D()).camera;
      const threeCamera = camera.threeCamera;

      camera.resize(new THREE.Vector2(1000, 500));

      expect(threeCamera.aspect).to.equal(2);
    });
  });
});
