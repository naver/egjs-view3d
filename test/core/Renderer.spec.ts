import * as THREE from "three";

import { createSandbox } from "../test-utils";

import Renderer from "~/core/Renderer";

describe("Renderer", () => {
  describe("default values", () => {
    it("should return given canvas element", () => {
      const canvas = document.createElement("canvas");
      expect(new Renderer(canvas).canvas).to.equal(canvas);
    });

    it("should return threeRenderer as THREE.WebGLRenderer", () => {
      expect(new Renderer(document.createElement("canvas")).threeRenderer).to.be.instanceOf(THREE.WebGLRenderer);
    });

    it("should enable shadow by default", () => {
      expect(new Renderer(document.createElement("canvas")).threeRenderer.shadowMap.enabled).to.be.true;
    });

    it("should create context on creation", () => {
      expect(new Renderer(document.createElement("canvas")).context).to.be.instanceOf(WebGLRenderingContext);
    });
  });

  it("should update size on resize", () => {
    // Given
    const canvas = document.createElement("canvas");
    createSandbox().appendChild(canvas);
    canvas.style.width = "200px";
    canvas.style.height = "300px";

    // When
    const renderer = new Renderer(canvas);
    renderer.resize();
    const prevSize = renderer.size.clone();

    canvas.style.width = "400px";
    canvas.style.height = "600px";
    renderer.resize();

    // Then
    expect(prevSize.x).to.equal(200);
    expect(prevSize.y).to.equal(300);
    expect(renderer.size.x).to.equal(400);
    expect(renderer.size.y).to.equal(600);
  });

  it("should disable shadow map on disabling shadow", () => {
    // Given
    const renderer = new Renderer(document.createElement("canvas"));

    // When
    renderer.disableShadow();

    // Then
    expect(renderer.threeRenderer.shadowMap.enabled).to.be.false;
  });

  it("should enable shadow map on enabling shadow", () => {
    // Given
    const renderer = new Renderer(document.createElement("canvas"));

    // When
    renderer.disableShadow();
    const prevVal = renderer.threeRenderer.shadowMap.enabled;
    renderer.enableShadow();

    // Then
    expect(prevVal).to.be.false;
    expect(renderer.threeRenderer.shadowMap.enabled).to.be.true;
  });
});
