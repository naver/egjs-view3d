import * as THREE from "three";

import Model from "~/core/Model";

describe("Model", () => {
  describe("scene structure", () => {
    it("should have type THREE.GROUP", () => {
      expect(new Model({ src: "", scenes: [], animations: [] }).scene).to.be.instanceOf(THREE.Group);
    });

    it("should have given scene objects in the root scene", () => {
      const scene = new THREE.Object3D();
      const model = new Model({ src: "", scenes: [scene] });

      expect(model.scene.getObjectById(scene.id)).not.to.be.undefined;
      expect(model.scene.getObjectById(scene.id)).to.equal(scene);
    });
  });

  describe("properties", () => {
    it("should have given animations in it", () => {
      const animation = new THREE.AnimationClip("", 0, []);
      const model = new Model({ src: "", scenes: [], animations: [animation] });

      expect(model.animations).to.deep.equal([animation]);
    });

    it("can return meshes in scenes", () => {
      const obj = new THREE.Object3D();
      const mesh = new THREE.Mesh();
      obj.add(mesh);

      const model = new Model({ src: "", scenes: [obj], animations: [] });

      expect(model.meshes).to.deep.equal([mesh]);
    });

    it("can return initial bbox of combined meshes", () => {
      const obj = new THREE.Object3D();
      const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(-1).translateY(-1).translateZ(-1);
      const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(1).translateY(1).translateZ(1);
      obj.add(mesh1);
      obj.add(mesh2);

      const model = new Model({ src: "", scenes: [obj], animations: [] });

      expect(model.bbox.min).to.deep.equal(new THREE.Vector3(-2, 0, -2));
      expect(model.bbox.max).to.deep.equal(new THREE.Vector3(2, 4, 2));
    });
  });

  describe("changing properties", () => {
    it("can change castShadow value in all meshes inside", () => {
      const obj = new THREE.Object3D();
      const mesh1 = new THREE.Mesh();
      const mesh2 = new THREE.Mesh();
      obj.add(mesh1);
      obj.add(mesh2);

      const model = new Model({ src: "", scenes: [obj], animations: [], castShadow: false });
      expect(mesh1.castShadow).to.be.false;
      expect(mesh2.castShadow).to.be.false;

      model.castShadow = true;

      expect(mesh1.castShadow).to.be.true;
      expect(mesh2.castShadow).to.be.true;
    });

    it("can change receiveShadow value in all meshes inside", () => {
      const obj = new THREE.Object3D();
      const mesh1 = new THREE.Mesh();
      const mesh2 = new THREE.Mesh();
      obj.add(mesh1);
      obj.add(mesh2);

      const model = new Model({ src: "", scenes: [obj], animations: [], receiveShadow: false });
      expect(mesh1.receiveShadow).to.be.false;
      expect(mesh2.receiveShadow).to.be.false;

      model.receiveShadow = true;

      expect(mesh1.receiveShadow).to.be.true;
      expect(mesh2.receiveShadow).to.be.true;
    });
  });
});
