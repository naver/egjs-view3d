import * as THREE from "three";
import * as sinon from "sinon";

import Camera from "~/core/camera/Camera";
import Pose from "~/core/camera/Pose";
import Controller from "~/core/camera/Controller";

describe("Camera", () => {
  describe("default properties", () => {
    it("should have perspective camera as default", () => {
      expect(new Camera(document.createElement("canvas")).threeCamera).to.be.instanceOf(THREE.PerspectiveCamera);
    });

    it("should have controller on creation", () => {
      expect(new Camera(document.createElement("canvas")).controller).to.be.instanceOf(Controller);
    });

    it("should have default pose of yaw: 0, pitch: 0, distance: 100, pivot: (0, 0, 0)", () => {
      const camera = new Camera(document.createElement("canvas"));

      expect(camera.defaultPose.yaw).to.equal(0);
      expect(camera.defaultPose.pitch).to.equal(0);
      expect(camera.defaultPose.distance).to.equal(100);
      expect(camera.defaultPose.pivot).to.deep.equal(new THREE.Vector3(0, 0, 0));
    });

    it("should have current pose of yaw: 0, pitch: 0, distance: 100, pivot: (0, 0, 0)", () => {
      const camera = new Camera(document.createElement("canvas"));

      expect(camera.currentPose.yaw).to.equal(0);
      expect(camera.currentPose.pitch).to.equal(0);
      expect(camera.currentPose.distance).to.equal(100);
      expect(camera.currentPose.pivot).to.deep.equal(new THREE.Vector3(0, 0, 0));
    });

    it("should have pose-related values of yaw: 0, pitch: 0, distance: 100, pivot: (0, 0, 0)", () => {
      const camera = new Camera(document.createElement("canvas"));

      expect(camera.yaw).to.equal(0);
      expect(camera.pitch).to.equal(0);
      expect(camera.distance).to.equal(100);
      expect(camera.pivot).to.deep.equal(new THREE.Vector3(0, 0, 0));
    });

    it("should have mininum distance as 1", () => {
      expect(new Camera(document.createElement("canvas")).minDistance).to.equal(1);
    });

    it("should have maximum distance as 500", () => {
      expect(new Camera(document.createElement("canvas")).maxDistance).to.equal(500);
    });

    it("should have default fov as 50", () => {
      expect(new Camera(document.createElement("canvas")).fov).to.equal(50);
    });
  });

  describe("reset", () => {
    it("should set pose to default pose immediately if duration = 0", () => {
      // Given
      const camera = new Camera(document.createElement("canvas"));
      camera.pose = new Pose(90, -45, 50, new THREE.Vector3(2, 2, 2));

      // When
      const poseBeforeReset = camera.currentPose.clone();
      camera.reset(0);

      // Then
      expect(poseBeforeReset).not.to.deep.equal(camera.defaultPose);
      expect(camera.currentPose).to.deep.equal(camera.defaultPose);
    });

    it("should set pose to default pose after given duration if duration > 0", async () => {
      // Given
      const camera = new Camera(document.createElement("canvas"));
      camera.pose = new Pose(90, -45, 50, new THREE.Vector3(2, 2, 2));

      // When
      const resetStart = Date.now();
      const poseBeforeReset = camera.currentPose.clone();
      camera.reset(500).then(() => {
        const resetEnd = Date.now();

        // Then
        expect(poseBeforeReset).not.to.deep.equal(camera.defaultPose);
        expect(camera.currentPose).to.deep.equal(camera.defaultPose);
        expect(resetEnd - resetStart).to.be.closeTo(500, 1);
      });
      camera.controller.update(500);
    });
  });

  describe("resize", () => {
    it("should set three.js camera's aspect based on given size", () => {
      // Given
      const camera = new Camera(document.createElement("canvas"));
      const threeCamera = camera.threeCamera;

      // When
      camera.resize(new THREE.Vector2(1000, 500));

      // Then
      expect(threeCamera.aspect).to.equal(2);
    });

    it("should resize controller with same size", () => {
      // Given
      const camera = new Camera(document.createElement("canvas"));
      const size = new THREE.Vector2(1234, 5986);
      const controllerSpy = sinon.spy(camera.controller, "resize");

      // When
      camera.resize(size);

      // Then
      expect(controllerSpy.calledOnceWith(size)).to.be.true;
    });
  });

  describe("setDefaultPose", () => {
    it("should update defaultPose", () => {
      // Given
      const camera = new Camera(document.createElement("canvas"));

      // When
      camera.setDefaultPose({ yaw: 180, pitch: 45, distance: 0, pivot: new THREE.Vector3(-1, -1, -1) });

      // Then
      expect(camera.defaultPose.yaw).to.equal(180);
      expect(camera.defaultPose.pitch).to.equal(45);
      expect(camera.defaultPose.distance).to.equal(0);
      expect(camera.defaultPose.pivot).to.deep.equal(new THREE.Vector3(-1, -1, -1));
    });

    it("can partially update defaultPose", () => {
      // Given
      const camera = new Camera(document.createElement("canvas"));

      // When
      camera.setDefaultPose({ yaw: 180 });
      camera.setDefaultPose({ pitch: 45 });
      camera.setDefaultPose({ distance: 0 });
      camera.setDefaultPose({ pivot: new THREE.Vector3(-1, -1, -1) });

      // Then
      expect(camera.defaultPose.yaw).to.equal(180);
      expect(camera.defaultPose.pitch).to.equal(45);
      expect(camera.defaultPose.distance).to.equal(0);
      expect(camera.defaultPose.pivot).to.deep.equal(new THREE.Vector3(-1, -1, -1));
    });
  });
});
