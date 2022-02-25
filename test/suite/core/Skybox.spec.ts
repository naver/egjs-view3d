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

  describe("enable", () => {
    it("should set enabled to true", async () => {
      const view3D = await createView3D();
      const skybox = new Skybox(view3D);

      skybox.disable();
      skybox.enable();

      expect(skybox.enabled).to.be.true;
    });
  });

  describe("enable", () => {
    it("should set disabled to true", async () => {
      const view3D = await createView3D();
      const skybox = new Skybox(view3D);

      skybox.enable();
      skybox.disable();

      expect(skybox.enabled).to.be.true;
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
