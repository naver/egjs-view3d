console.log(View3D.isAvailable())

const view3d = new View3D(".view3d-wrapper", {
  src: "../../demo/static/model/meshopt/artorias.glb",
  envmap: "../../demo/static/texture/comfy_cafe_1k.hdr",
  meshoptPath: "https://unpkg.com/meshoptimizer@0.17.0/meshopt_decoder.js"
});
