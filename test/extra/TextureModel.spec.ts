import * as THREE from "three";

import TextureModel from "~/extra/TextureModel";
import Model from "~/core/Model";
import View3DError from "~/View3DError";

describe("TextureModel", () => {
  it("should be an instance of Model", () => {
    expect(new TextureModel({ image: document.createElement("img"), width: 1, height: 1 })).to.be.instanceOf(Model);
  });

  it("should have mesh as a typeof THREE.Mesh in it", () => {
    expect(new TextureModel({ image: document.createElement("img"), width: 1, height: 1 }).mesh).to.be.instanceOf(THREE.Mesh);
  });

  it("should have texture as a typeof THREE.Texture in it", () => {
    expect(new TextureModel({ image: document.createElement("img"), width: 1, height: 1 }).texture).to.be.instanceOf(THREE.Texture);
  });

  it("should throw an View3DError when image's size is not available and width / height is not provided", () => {
    expect(() => new TextureModel({ image: document.createElement("img") })).to.throw(View3DError);
  });
});
