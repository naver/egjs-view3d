import DracoLoader from "~/loaders/DracoLoader";
import Model from "~/core/Model";
import { PointsMaterial } from "three";

describe("GLTFLoader", () => {
  it("can load a DRC model with URL", async () => {
    // Given
    const loader = new DracoLoader();

    // When
    const model = await loader.load("./assets/bunny.drc");

    // Then
    expect(model).to.be.instanceOf(Model);
  });

  it("should be rejected when no model is found with given URL", async () => {
    // Given
    const loader = new DracoLoader();

    // When
    await loader.load("URL_THAT_DEFINITELY_NOT_POINTING_DRC_MODEL")
      .then(() => {
        // Should not access here
        expect("Success").to.be.false;
      })
      .catch(() => {
        expect(true).to.be.true;
      });
  });

  it("should use a PointsMaterial if point: true is given", async () => {
    // Given
    const loader = new DracoLoader();

    // When
    const model = await loader.load("./assets/bunny.drc", { point: true });

    // Then
    expect((model.scene.children[0].children[0] as THREE.Points).material).to.be.an.instanceOf(PointsMaterial);
  });
});
