import * as THREE from "three";

import ShadowPlane from "~/environments/ShadowPlane";
import Model from "~/core/Model";

describe("ShadowPlane", () => {
  describe("default properties", () => {
    it("should have plane geometry on it", () => {
      expect(new ShadowPlane().geometry).to.be.instanceOf(THREE.PlaneGeometry);
    });

    it("should have material on it", () => {
      expect(new ShadowPlane().material).to.be.instanceOf(THREE.Material);
    });

    it("should have plane mesh on it", () => {
      expect(new ShadowPlane().mesh).to.be.instanceOf(THREE.Mesh);
      expect(new ShadowPlane().objects[0]).to.be.instanceOf(THREE.Mesh);
    });

    it("has default opacity of 0.3", () => {
      expect(new ShadowPlane().opacity).to.equal(0.3);
    });

    it("has default size of 10000", () => {
      const bbox = new THREE.Box3().setFromObject(new ShadowPlane().mesh);
      expect(new THREE.Vector3().subVectors(bbox.max, bbox.min).x).to.equal(10000);
      expect(new THREE.Vector3().subVectors(bbox.max, bbox.min).z).to.equal(10000);
    });

    it("should have shadow enabled by default", () => {
      expect(new ShadowPlane().mesh.receiveShadow).to.be.true;
    });
  });

  describe("options", () => {
    it("can change opacity", () => {
      expect(new ShadowPlane({ opacity: 0.5 }).opacity).to.equal(0.5);
    });

    it("can change size", () => {
      const bbox = new THREE.Box3().setFromObject(new ShadowPlane({ size: 1000 }).mesh);
      expect(new THREE.Vector3().subVectors(bbox.max, bbox.min).x).to.equal(1000);
      expect(new THREE.Vector3().subVectors(bbox.max, bbox.min).z).to.equal(1000);
    });
  });

  describe("fitting to a model", () => {
    it("should be placed near at model's min-y", () => {
      // Given
      const plane = new ShadowPlane();
      const obj = new THREE.Object3D()
        .add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(-1).translateY(-1).translateZ(-1))
        .add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(1).translateY(1).translateZ(1))
        .translateY(1);
      const model = new Model({ scenes: [obj], animations: [] });

      // When
      plane.fit(model);

      // Then
      expect(plane.mesh.position.y).closeTo(model.bbox.min.y, 0.0001);
    });

    it("should use floor position if it's given", () => {
      // Given
      const plane = new ShadowPlane();
      const obj = new THREE.Object3D()
        .add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(-1).translateY(-1).translateZ(-1))
        .add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(1).translateY(1).translateZ(1))
        .translateY(1);
      const model = new Model({ scenes: [obj], animations: [] });
      const floorPosition = new THREE.Vector3(0, -9999, 0);

      // When
      plane.fit(model, { floorPosition });

      // Then
      expect(plane.mesh.position.y).not.closeTo(model.bbox.min.y, 0.01);
      expect(plane.mesh.position.y).closeTo(floorPosition.y, 0.01);
    });
  });
});
