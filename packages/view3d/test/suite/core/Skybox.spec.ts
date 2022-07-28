import * as THREE from "three";
import Skybox from "~/core/Skybox";
import { createView3D } from "../../test-utils";

describe("Skybox", () => {
  describe("createDefaultEnv", () => {
    it("should return an instance of THREE.Texture", async () => {
      const view3D = await createView3D();
      const texture = Skybox.createDefaultEnv(view3D.renderer.threeRenderer);

      expect((texture as THREE.Texture).isTexture).to.be.true;
      expect(texture).to.be.an.instanceOf(THREE.Texture);
    });
  });
});
