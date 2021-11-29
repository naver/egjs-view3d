const THREE = View3D.THREE;

const view3d = new View3D("#view3d-canvas");
const loader = new View3D.GLTFLoader();

view3d.scene.addEnv(new THREE.AmbientLight());
view3d.scene.addEnv(new View3D.AutoDirectionalLight(0xffffff, 1, { direction: new THREE.Vector3(0, -1, 0) }));
view3d.controller.add(new View3D.OrbitControl());
view3d.camera.setDefaultPose(new View3D.Pose(30, 15, 30))

console.time("load - simplified")
console.time("load - original")
const start = Date.now();
loader.load("../asset/lofoten/model_simplified.glb")
  .then(model => {
    document.querySelector("#result1").innerHTML = "loaded";
    view3d.display(model);
    requestAnimationFrame(() => {
      console.timeEnd("load - simplified");
      const end = Date.now();
      document.querySelector("#result1").innerHTML = `simplified - ${end - start}ms`;
    });
  });

loader.load("../asset/lofoten/model_original.glb")
  .then(model => {
    document.querySelector("#result2").innerHTML = "loaded";
    view3d.display(model, {
      resetView: false,
    });
    requestAnimationFrame(() => {
      console.timeEnd("load - original");
      const end = Date.now();
      document.querySelector("#result2").innerHTML = `original - ${end - start}ms`;
    });
  })
