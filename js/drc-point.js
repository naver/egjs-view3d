const THREE = View3D.THREE;

const view3d = new View3D("#view3d-canvas");
const loader = new View3D.DracoLoader();

const bgColor = 0x2288aa;

view3d.scene.setBackground(new THREE.Color(bgColor));

view3d.controller.add(new View3D.OrbitControl());

loader.load("../asset/bunny.drc", { color: 0x999999, point: true, pointOptions: { size: 0.3 } })
  .then(model => {
    view3d.display(model);
  });

Prism.highlightAll();
