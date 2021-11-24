import * as THREE from "three";

import Model from "~/core/Model";

describe("Model", () => {
  describe("scene structure", () => {
    it("should have type THREE.GROUP", () => {
      expect(new Model({ scenes: [], animations: [] }).scene).to.be.instanceOf(THREE.Group);
    });

    it("should have pivot object as only child with name 'Pivot' at the root scene", () => {
      expect(new Model({ scenes: [], animations: [] }).scene.children.length).to.equal(1);
      expect(new Model({ scenes: [], animations: [] }).scene.children[0].name).to.equal("Pivot");
    });

    it("should have given scene objects in the root scene", () => {
      // Given
      const scene = new THREE.Object3D();

      // When
      const model = new Model({ scenes: [scene] });

      // Then
      expect(model.scene.getObjectById(scene.id)).not.to.be.undefined;
      expect(model.scene.getObjectById(scene.id)).to.equal(scene);
    });
  });

  describe("properties", () => {
    it("should set fixSkinnedBbox as false by default", () => {
      expect(new Model({ scenes: [], animations: [] }).fixSkinnedBbox).to.be.false;
    });

    it("should have given animations in it", () => {
      // Given
      const animation = new THREE.AnimationClip("", 0, []);

      // When
      const model = new Model({ scenes: [], animations: [animation] });

      // Then
      expect(model.animations).to.deep.equal([animation]);
    });

    it("can return lights in scenes", () => {
      // Given
      const obj = new THREE.Object3D();
      const light = new THREE.DirectionalLight();
      obj.add(light);

      // When
      const model = new Model({ scenes: [obj], animations: [] });

      // Then
      expect(model.lights).to.deep.equal([light]);
    });

    it("can return lights in scenes", () => {
      // Given
      const obj = new THREE.Object3D();
      const light = new THREE.DirectionalLight();
      obj.add(light);

      // When
      const model = new Model({ scenes: [obj], animations: [] });

      // Then
      expect(model.lights).to.deep.equal([light]);
    });

    it("can return meshes in scenes", () => {
      // Given
      const obj = new THREE.Object3D();
      const mesh = new THREE.Mesh();
      obj.add(mesh);

      // When
      const model = new Model({ scenes: [obj], animations: [] });

      // Then
      expect(model.meshes).to.deep.equal([mesh]);
    });

    it("can return initial bbox of combined meshes", () => {
      // Given
      const obj = new THREE.Object3D();
      const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(-1).translateY(-1).translateZ(-1);
      const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(1).translateY(1).translateZ(1);
      obj.add(mesh1);
      obj.add(mesh2);

      // When
      const model = new Model({ scenes: [obj], animations: [] });

      // Then
      expect(model.initialBbox.min).to.deep.equal(new THREE.Vector3(-2, -2, -2));
      expect(model.initialBbox.max).to.deep.equal(new THREE.Vector3(2, 2, 2));
    });

    it("should return transformed bbox of combined meshes", () => {
      // Given
      const obj = new THREE.Object3D();
      const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(-1).translateY(-1).translateZ(-1);
      const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(1).translateY(1).translateZ(1);
      obj.add(mesh1);
      obj.add(mesh2);

      // When
      const model = new Model({ scenes: [obj], animations: [] });
      model.size = 80;
      model.scene.translateZ(100).translateX(-50).translateY(50);
      model.scene.updateMatrix();

      // Then
      const expectedBbox = new THREE.Box3().setFromObject(model.scene);
      expect(model.bbox).not.to.deep.equal(model.initialBbox);
      expect(model.bbox.min.distanceTo(expectedBbox.min)).to.be.closeTo(0, 0.00001);
      expect(model.bbox.max.distanceTo(expectedBbox.max)).to.be.closeTo(0, 0.00001);
    });

    it("should return original size based on initial bbox", () => {
      // Given
      const obj = new THREE.Object3D();
      const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(-1).translateY(-1).translateZ(-1);
      const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(1).translateY(1).translateZ(1);
      obj.add(mesh1);
      obj.add(mesh2);

      // When
      const model = new Model({ scenes: [obj], animations: [] });

      // Then
      expect(model.originalSize).to.be.closeTo(model.initialBbox.getSize(new THREE.Vector3()).length(), 0.00001);
    });

    it("should return size based on transformed bbox", () => {
      // Given
      const obj = new THREE.Object3D();
      const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(-1).translateY(-1).translateZ(-1);
      const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(1).translateY(1).translateZ(1);
      obj.add(mesh1);
      obj.add(mesh2);

      // When
      const model = new Model({ scenes: [obj], animations: [] });
      model.size = 80;
      model.scene.translateZ(100).translateX(-50).translateY(50);
      model.scene.updateMatrix();

      // Then
      expect(model.size).to.be.closeTo(model.bbox.getSize(new THREE.Vector3()).length(), 0.00001);
    });
  });

  describe("changing properties", () => {
    it("can change castShadow value in all meshes inside", () => {
      // Given
      const obj = new THREE.Object3D();
      const mesh1 = new THREE.Mesh();
      const mesh2 = new THREE.Mesh();
      obj.add(mesh1);
      obj.add(mesh2);

      // When
      const model = new Model({ scenes: [obj], animations: [], castShadow: false });
      expect(mesh1.castShadow).to.be.false;
      expect(mesh2.castShadow).to.be.false;

      model.castShadow = true;

      // Then
      expect(mesh1.castShadow).to.be.true;
      expect(mesh2.castShadow).to.be.true;
    });

    it("can change receiveShadow value in all meshes inside", () => {
      // Given
      const obj = new THREE.Object3D();
      const mesh1 = new THREE.Mesh();
      const mesh2 = new THREE.Mesh();
      obj.add(mesh1);
      obj.add(mesh2);

      // When
      const model = new Model({ scenes: [obj], animations: [], receiveShadow: false });
      expect(mesh1.receiveShadow).to.be.false;
      expect(mesh2.receiveShadow).to.be.false;

      model.receiveShadow = true;

      // Then
      expect(mesh1.receiveShadow).to.be.true;
      expect(mesh2.receiveShadow).to.be.true;
    });

    it("can change fixSkinnedBbox value", () => {
      // Given
      const model = new Model({ scenes: [], animations: [], fixSkinnedBbox: false });
      expect(model.fixSkinnedBbox).to.be.false;

      // When
      model.fixSkinnedBbox = true;

      // Then
      expect(model.fixSkinnedBbox).to.be.true;
    });
  });
});
