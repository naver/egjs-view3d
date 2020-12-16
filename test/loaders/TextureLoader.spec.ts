import * as THREE from "three";
import Renderer from "~/core/Renderer";
import TextureLoader from "~/loaders/TextureLoader";
import { range } from "~/utils";

describe("TextureLoader", () => {
  const createRenderer = () => new Renderer(document.createElement("canvas"));

  it("should be rejected when load failed with wrong URL", async () => {
    expect(new TextureLoader(createRenderer()).load("WRONG_URL")).to.eventually.throw();
  });

  it("can load a single texture image and resolve it as THREE.Texture", async () => {
    // Given
    const loader = new TextureLoader(createRenderer());

    // When
    const texture = await loader.load("./assets/test.png");

    // Then
    expect(texture).to.be.instanceOf(THREE.Texture);
  });

  it("should be rejected when loadEquirectagularTexture failed with wrong URL", async () => {
    expect(new TextureLoader(createRenderer()).loadEquirectagularTexture("WRONG_URL")).to.eventually.throw();
  });

  it("can load an equirectangular texture image and resolve it as THREE.WebGLCubeRenderTarget", async () => {
    // Given
    const loader = new TextureLoader(createRenderer());

    // When
    const texture = await loader.loadEquirectagularTexture("./assets/test_equi.png");

    // Then
    expect(texture).to.be.instanceOf(THREE.WebGLCubeRenderTarget);
  });

  it("should be rejected when loadCubeTexture failed with wrong URL", async () => {
    expect(new TextureLoader(createRenderer()).loadCubeTexture(["WRONG_URL"])).to.eventually.throw();
  });

  it("can load a cube texture and resolve it as THREE.CubeTexture", async () => {
    // Given
    const loader = new TextureLoader(createRenderer());

    // When
    const texture = await loader.loadCubeTexture(range(6).map(() => "./assets/test.png"));

    // Then
    expect(texture).to.be.instanceOf(THREE.CubeTexture);
  });

  it("should be rejected when loadHDRTexture failed with wrong URL", async () => {
    expect(new TextureLoader(createRenderer()).loadHDRTexture("WRONG_URL", true)).to.eventually.throw();
    expect(new TextureLoader(createRenderer()).loadHDRTexture("WRONG_URL", false)).to.eventually.throw();
  });

  it("can load a hdr texture and resolve it as THREE.WebGLCubeRenderTarget", async () => {
    // Given
    const loader = new TextureLoader(createRenderer());

    // When
    const texture = await loader.loadHDRTexture("./assets/test.hdr", true);

    // Then
    expect(texture).to.be.instanceOf(THREE.WebGLCubeRenderTarget);
  });
});
