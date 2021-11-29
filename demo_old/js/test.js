const THREE = View3D.THREE;

const view3d = new View3D("#view3d-canvas");
const loader = new View3D.DracoLoader();

console.log(loader);

view3d.controller.add(new View3D.OrbitControl());
view3d.camera.setDefaultPose(new View3D.Pose(30, 15, 30));

const light1 = new View3D.AutoDirectionalLight(0xffffff, 1, { direction: new THREE.Vector3(0, -0.5, -0.5) });
view3d.scene.addEnv(light1);

const start = Date.now();
console.time("load");
loader.load("../asset/draco.drc", { point: true, pointOptions: { size: 0.01, sizeAttenuation: true, vertexColors: true } })
  .then(model => {
    model.scene.rotateX(-90 * Math.PI / 180);

    view3d.display(model);
    console.timeEnd("load");
  });
