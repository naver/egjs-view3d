import { GLTFLoader as ThreeGLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import GLTFLoader from "~/loaders/GLTFLoader";
import Model from "~/core/Model";
import View3D from "~/View3D";

describe("GLTFLoader", () => {
  it("should have THREE.js GLTFLoader as loader in it", () => {
    expect(new GLTFLoader().loader).to.be.instanceOf(ThreeGLTFLoader);
  });

  it("should have THREE.js DRACOLoader as dracoLoader in it", () => {
    expect(new GLTFLoader().dracoLoader).to.be.instanceOf(DRACOLoader);
  });

  it("can load a GLB model with URL", async () => {
    // Given
    const loader = new GLTFLoader();

    // When
    const model = await loader.load("./assets/cube.glb");

    // Then
    expect(model).to.be.instanceOf(Model);
  });

  it("should be rejected when no model is found with given URL", async () => {
    // Given
    const loader = new GLTFLoader();

    // When
    await loader.load("URL_THAT_DEFINITELY_NOT_POINTING_GLTF_MODEL")
      .then(() => {
        // Should not access here
        expect("Success").to.be.false;
      })
      .catch(() => {
        expect(true).to.be.true;
      });
  });

  it("can load a View3D preset", async () => {
    // Given
    const view3d = new View3D(document.createElement("canvas"));
    const loader = new GLTFLoader();

    // When
    await loader.loadPreset(view3d, "./assets/dodo_draco/model.json");

    // Then
    expect(view3d.model).to.be.instanceOf(Model);
  });
});
