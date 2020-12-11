import * as THREE from "three";
import Scene from "~/core/Scene";
import AutoDirectionalLight from "~/environments/AutoDirectionalLight";

describe("Scene", () => {
  describe("default values", () => {
    it("should have root scene", () => {
      expect(new Scene().root).to.be.instanceOf(THREE.Scene);
    });

    it("should have environments as empty array", () => {
      expect(new Scene().environments).to.deep.equal([]);
    });

    it("should be visible by default", () => {
      expect(new Scene().visible).to.be.true;
    });
  });

  it("can add objects to its root", () => {
    // Given
    const testObj = new THREE.Object3D();
    const scene = new Scene();

    // When
    scene.add(testObj);

    // Then
    expect(scene.root.getObjectById(testObj.id)).to.equal(testObj);
  });

  it("can add View3D Environment as environments to its root", () => {
    // Given
    const testEnv = new AutoDirectionalLight();
    const scene = new Scene();

    // When
    scene.addEnv(testEnv);

    // Then
    expect(scene.root.getObjectById(testEnv.objects[0].id)).to.equal(testEnv.objects[0]);
    expect(scene.environments).to.deep.equal([testEnv]);
  });

  it("can add THREE.Object3D as environments to its root", () => {
    // Given
    const testObj = new THREE.Object3D();
    const scene = new Scene();

    // When
    scene.addEnv(testObj);

    // Then
    expect(scene.root.getObjectById(testObj.id)).to.equal(testObj);
    expect(scene.environments).to.deep.equal([]);
  });

  it("will remove objects on model reset", () => {
    // Given
    const testObj = new THREE.Object3D();
    const scene = new Scene();
    scene.add(testObj);

    // When
    scene.resetModel();

    // Then
    expect(scene.root.getObjectById(testObj.id)).to.be.undefined;
  });

  it("won't remove env objects on model reset", () => {
    // Given
    const testObj = new THREE.Object3D();
    const scene = new Scene();
    scene.addEnv(testObj);

    // When
    scene.resetModel();

    // Then
    expect(scene.root.getObjectById(testObj.id)).to.equal(testObj);
  });

  it("will remove env objects on env reset", () => {
    // Given
    const testObj = new THREE.Object3D();
    const scene = new Scene();
    scene.addEnv(testObj);

    // When
    scene.resetEnv();

    // Then
    expect(scene.root.getObjectById(testObj.id)).to.be.undefined;
    expect(scene.environments).to.be.empty
  });

  it("won't remove user objects on env reset", () => {
    // Given
    const testObj = new THREE.Object3D();
    const scene = new Scene();
    scene.add(testObj);

    // When
    scene.resetEnv();

    // Then
    expect(scene.root.getObjectById(testObj.id)).to.equal(testObj);
  });

  it("will remove both user & env objects on reset", () => {
    // Given
    const testObj1 = new THREE.Object3D();
    const testObj2 = new THREE.Object3D();
    const testObj3 = new AutoDirectionalLight();
    const scene = new Scene();
    scene.add(testObj1);
    scene.addEnv(testObj2);
    scene.addEnv(testObj3);

    // When
    scene.reset();

    // Then
    expect(scene.root.getObjectById(testObj1.id)).to.be.undefined;
    expect(scene.root.getObjectById(testObj2.id)).to.be.undefined;
    expect(scene.root.getObjectById(testObj3.objects[0].id)).to.be.undefined;
    expect(scene.environments).to.be.empty;
  });

  it("can remove objects from its root", () => {
    // Given
    const testObj = new THREE.Object3D();
    const scene = new Scene();
    scene.add(testObj);

    // When
    scene.remove(testObj);

    // Then
    expect(scene.root.getObjectById(testObj.id)).to.be.undefined;
  });

  it("can remove THREE.Object3D as environments from its root", () => {
    // Given
    const testObj = new THREE.Object3D();
    const scene = new Scene();
    scene.addEnv(testObj);

    // When
    scene.removeEnv(testObj);

    // Then
    expect(scene.root.getObjectById(testObj.id)).to.be.undefined;
  });

  it("can hide its visibility", () => {
    // Given
    const scene = new Scene();

    // When
    scene.hide();

    // Then
    expect(scene.visible).to.be.false;
    expect(scene.root.visible).to.be.false;
  });

  it("can show its visibility", () => {
    // Given
    const scene = new Scene();
    scene.hide();

    // When
    scene.show();

    // Then
    expect(scene.visible).to.be.true;
    expect(scene.root.visible).to.be.true;
  });
});
