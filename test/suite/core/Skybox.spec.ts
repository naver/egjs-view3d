import * as THREE from "three";
import Skybox from "~/core/Skybox";
import { createView3D } from "../../test-utils";

describe("Skybox", () => {
  describe("properties", () => {
    describe("scene", () => {
      it("should be instance of THREE.Scene", async () => {
        const view3D = await createView3D();
        expect(new Skybox(view3D).scene).to.be.an.instanceOf(THREE.Scene);
      });
    });

    describe("camera", () => {
      it("should be instance of THREE.PerspectiveCamera", async () => {
        const view3D = await createView3D();
        expect(new Skybox(view3D).camera).to.be.an.instanceOf(THREE.PerspectiveCamera);
      });
    });

    describe("enabled", () => {
      it("should be true by default", async () => {
        const view3D = await createView3D();
        expect(new Skybox(view3D).enabled).to.be.true;
      });
    });
  });

  describe("Methods", () => {
    describe("enable", () => {
      it("should set enabled to be true", async () => {
        const view3D = await createView3D();
        const skybox = new Skybox(view3D);

        skybox.disable();
        skybox.enable();

        expect(skybox.enabled).to.be.true;
      });
    });

    describe("disable", () => {
      it("should set enabled to be true", async () => {
        const view3D = await createView3D();
        const skybox = new Skybox(view3D);

        skybox.enable();
        skybox.disable();

        expect(skybox.enabled).to.be.false;
      });
    });

    describe("updateCamera", () => {
      it("should rotate camera yaw by 'skyboxRotation' compared to the main camera", async () => {
        const view3D = await createView3D({ src: "/cube.glb ", skyboxRotation: 90 });
        const skybox = new Skybox(view3D);

        const mainCam = view3D.camera.threeCamera;
        const skyboxCam = skybox.camera;

        const mainCamPos = mainCam.position.clone();

        expect(mainCamPos.applyEuler(new THREE.Euler(0, 90, 0))).to.deep.equal(skyboxCam.position);
      });
    });

    describe("useTexture", () => {
      it("should set its scene background to given texture", async () => {
        const view3D = await createView3D();
        const skybox = new Skybox(view3D);
        const texture = new THREE.Texture();

        skybox.useTexture(texture);

        expect(skybox.scene.background).to.equal(texture);
      });
    });

    describe("useColor", () => {
      it("should set given hexadecimal number as its scene background", async () => {
        const view3D = await createView3D();
        const skybox = new Skybox(view3D);
        const color = 0xff00ff; // Magenta

        skybox.useColor(color);

        expect(skybox.scene.background).to.be.an.instanceOf(THREE.Color);
        expect((skybox.scene.background as THREE.Color).r).to.equal(1);
        expect((skybox.scene.background as THREE.Color).g).to.equal(0);
        expect((skybox.scene.background as THREE.Color).b).to.equal(1);
      });

      it("should set given hexadecimal string as its scene background", async () => {
        const view3D = await createView3D();
        const skybox = new Skybox(view3D);
        const color = "#00ff00"; // green

        skybox.useColor(color);

        expect(skybox.scene.background).to.be.an.instanceOf(THREE.Color);
        expect((skybox.scene.background as THREE.Color).r).to.equal(0);
        expect((skybox.scene.background as THREE.Color).g).to.equal(1);
        expect((skybox.scene.background as THREE.Color).b).to.equal(0);
      });
    });
  });
});
