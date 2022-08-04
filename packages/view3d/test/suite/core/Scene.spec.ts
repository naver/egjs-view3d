import * as THREE from "three";
import { createView3D } from "../../test-utils";

describe("Scene", () => {
  describe("default values", () => {
    it("should have root scene", async () => {
      expect((await createView3D()).scene.root).to.be.instanceOf(THREE.Scene);
    });
  });

  it("can add objects to its root", async () => {
    const testObj = new THREE.Object3D();
    const scene = (await createView3D()).scene;

    scene.add(testObj);

    expect(scene.root.getObjectById(testObj.id)).to.equal(testObj);
  });

  it("can add THREE.Object3D as environments to its root", async () => {
    const testObj = new THREE.Object3D();
    const scene = (await createView3D()).scene;

    scene.add(testObj);

    expect(scene.root.getObjectById(testObj.id)).to.equal(testObj);
  });

  it("will remove volatile objects on model reset", async () => {
    const testObj = new THREE.Object3D();
    const scene = (await createView3D()).scene;
    scene.add(testObj);

    scene.reset();

    expect(scene.root.getObjectById(testObj.id)).to.be.undefined;
  });

  it("won't remove non-volatile objects on model reset", async () => {
    const testObj = new THREE.Object3D();
    const scene = (await createView3D()).scene;
    scene.add(testObj, false);

    scene.reset();

    expect(scene.root.getObjectById(testObj.id)).to.equal(testObj);
  });

  it("will remove non-volatile objects when volatileOnly: false", async () => {
    const testObj = new THREE.Object3D();
    const scene = (await createView3D()).scene;
    scene.add(testObj, false);

    scene.reset({ volatileOnly: false });

    expect(scene.root.getObjectById(testObj.id)).to.be.undefined;
  });
});
