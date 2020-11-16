const THREE = View3D.THREE;

const view3d = new View3D("#view3d-canvas");
const loader = new View3D.GLTFLoader();

view3d.controller.add(new View3D.OrbitControl());
view3d.controller.add(new View3D.AutoControl({ speed: -1 }));
view3d.camera.setDefaultPose(new View3D.Pose(45, 30, 8));

const vs = document.querySelector("#vs").innerHTML;
const fs = document.querySelector("#fs").innerHTML;
const vs2 = document.querySelector("#vs2").innerHTML;
const fs2 = document.querySelector("#fs2").innerHTML;

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.RawShaderMaterial({
    vertexShader: vs,
    fragmentShader: fs,
  }),
);

view3d.scene.add(cube);
view3d.camera.reset();

const fullScene = new THREE.Scene();
const cam = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 100);
const renderTarget = new THREE.WebGLRenderTarget(
  view3d.renderer.size.width,
  view3d.renderer.size.height,
);
console.log(renderTarget.width, renderTarget.height);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.RawShaderMaterial({
    vertexShader: vs2,
    fragmentShader: fs2,
    uniforms: {
      uTex: new THREE.Uniform(renderTarget.texture),
      uInvTexSize: new THREE.Uniform(new THREE.Vector2(
        1 / renderTarget.width,
        1 / renderTarget.height,
      )),
    }
  }),
);

fullScene.add(plane);

view3d.renderer.threeRenderer.antialias = true;
view3d.renderer.setAnimationLoop(delta => {
  const renderer = view3d.renderer;
  const scene = view3d.scene;
  const camera = view3d.camera;
  const controller = view3d.controller;

  controller.update(delta);

  renderer.threeRenderer.setRenderTarget(renderTarget);
  renderer.render(scene, camera);
  renderer.threeRenderer.setRenderTarget(null);

  renderer.threeRenderer.render(fullScene, cam);
});
