/* eslint-disable import/order */
const glslify = require("rollup-plugin-glslify");
const buildHelper = require("./config/build-helper");
const { babel } = require("@rollup/plugin-babel");
const serve = require("rollup-plugin-serve");
const livereload = require("rollup-plugin-livereload");

export const name = "View3D";
export const fileName = "view3d";
const helperName = "View3D.Helper"

const external = {
  three: "THREE",
  "@egjs/component": "Component",
  "three/examples/jsm/loaders/GLTFLoader": "GLTFLoader",
  "three/examples/jsm/loaders/RGBELoader": "RGBELoader",
  "three/examples/jsm/loaders/DRACOLoader": "DRACOLoader",
  "three/examples/jsm/loaders/KTX2Loader": "KTX2Loader",
  "three/examples/jsm/lights/LightProbeGenerator": "LightProbeGenerator",
  "three/examples/jsm/shaders/HorizontalBlurShader": "HorizontalBlurShader",
  "three/examples/jsm/shaders/VerticalBlurShader": "VerticalBlurShader",
  "three/examples/jsm/webxr/XREstimatedLight": "XREstimatedLight"
};
const tsconfig = "tsconfig.build.json";
const plugins = [
  glslify(),
  babel({
    babelHelpers: "bundled",
    include: ["src/**", "node_modules/three/**"],
    configFile: "./babel.config.js"
  }),
  serve({
    open: true,
    contentBase: "."
  }),
  livereload(".")
];

const common = {
  sourcemap: false,
  tsconfig,
  plugins
};
const helperCommon = {
  sourcemap: false,
  tsconfig: "tsconfig.build-es5.json"
};

export default buildHelper([
  {
    name,
    input: "./src/index.umd.ts",
    output: `./test/manual/dist/${fileName}.pkgd.js`,
    format: "umd",
    commonjs: true,
    resolve: true,
    ...common
  }
]);
