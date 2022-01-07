import GLTFLoader from "~/loader/GLTFLoader";
import Model from "~/core/Model";
import { createView3D } from "../../test-utils";

describe("GLTFLoader", () => {
  it("can load a GLB model with URL", async () => {
    const view3D = await createView3D();
    const loader = new GLTFLoader(view3D);
    const model = await loader.load("/cube.glb");

    expect(model).to.be.instanceOf(Model);
  });

  it("should be rejected when no model is found with given URL", async () => {
    const view3D = await createView3D();
    const loader = new GLTFLoader(view3D);

    try {
      await loader.load("URL_THAT_DEFINITELY_NOT_POINTING_GLTF_MODEL");
      expect(false).to.be.true;
    } catch (err) {
      expect(true).to.be.true;
    }
  });
});
