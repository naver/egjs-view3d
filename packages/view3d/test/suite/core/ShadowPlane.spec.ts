import * as THREE from "three";

import ShadowPlane from "~/core/ShadowPlane";
import Model from "~/core/Model";
import { createView3D } from "test-utils";

describe("ShadowPlane", () => {
  describe("default properties", () => {
    it("should have root on it", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D).root).to.be.instanceOf(THREE.Group);
    });

    it("has 0.5 as default darkness", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D).darkness).to.equal(0.5);
    });

    it("has 9 as default mapSize", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D).mapSize).to.equal(9);
    });

    it("has 3.5 as default light blur", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D).blur).to.equal(3.5);
    });

    it("has 1 as default shadowScale", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D).shadowScale).to.equal(1);
    });

    it("has 2 as default planeScale", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D).planeScale).to.equal(2);
    });
  });

  describe("updateDimensions", () => {
    it("should be placed near at model's min-y", async () => {
      const view3D = await createView3D();
      const plane = new ShadowPlane(view3D);
      const obj = new THREE.Object3D()
        .add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(-1).translateY(-1).translateZ(-1))
        .add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(1).translateY(1).translateZ(1))
        .translateY(1);
      const model = new Model({ src: "", scenes: [obj], animations: [] });

      plane.updateDimensions(model);

      expect(plane.root.position.y).closeTo(model.bbox.min.y, 0.0001);
    });
  });
});
