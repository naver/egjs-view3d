const THREE = View3D.THREE;

const view3d = new View3D("#view3d-canvas");
const loader = new View3D.GLTFLoader();

view3d.scene.addEnv(new THREE.AmbientLight());
view3d.scene.addEnv(new View3D.AutoDirectionalLight(0xffffff, 1, { direction: new THREE.Vector3(0, -1, 0) }));
view3d.controller.add(new View3D.OrbitControl());
view3d.camera.setDefaultPose(new View3D.Pose(30, 15, 30));

const start = Date.now();
console.time("load");
loader.load("../asset/lofoten/model_original.glb")
  .then(model => {
    view3d.display(model);
    requestAnimationFrame(() => {
      console.timeEnd("load");
      const end = Date.now();
      document.querySelector("#result").innerHTML = `${end - start}ms`;
    });
  });
