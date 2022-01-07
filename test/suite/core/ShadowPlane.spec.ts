import * as THREE from "three";

import ShadowPlane from "~/core/ShadowPlane";
import Model from "~/core/Model";
import { createView3D } from "test-utils";

describe("ShadowPlane", () => {
  describe("default properties", () => {
    it("should have plane mesh on it", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D).mesh).to.be.instanceOf(THREE.Mesh);
    });

    it("should have light on it", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D).light).to.be.instanceOf(THREE.Light);
    });

    it("has 0.3 as default opacity", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D).opacity).to.equal(0.3);
    });

    it("has 6 as default hardness", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D).hardness).to.equal(6);
    });

    it("has 0 as default light yaw", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D).yaw).to.equal(0);
    });

    it("has 0 as default light pitch", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D).pitch).to.equal(0);
    });
  });

  describe("options", () => {
    it("can change opacity", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D, { opacity: 0.5 }).opacity).to.equal(0.5);
    });

    it("can change hardness", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D, { hardness: 12 }).hardness).to.equal(12);
    });

    it("can change yaw", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D, { yaw: 180 }).yaw).to.equal(180);
    });

    it("can change pitch", async () => {
      const view3D = await createView3D();
      expect(new ShadowPlane(view3D, { pitch: 45 }).pitch).to.equal(45);
    });
  });

  describe("fitting to a model", () => {
    it("should be placed near at model's min-y", async () => {
      const view3D = await createView3D();
      const plane = new ShadowPlane(view3D);
      const obj = new THREE.Object3D()
        .add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(-1).translateY(-1).translateZ(-1))
        .add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(1).translateY(1).translateZ(1))
        .translateY(1);
      const model = new Model({ src: "", scenes: [obj], animations: [] });

      plane.update(model);

      expect(plane.mesh.position.y).closeTo(model.bbox.min.y, 0.0001);
    });
  });
});
