/* eslint-disable import/order */
const glslify = require("rollup-plugin-glslify");
const buildHelper = require("./config/build-helper");

export const name = "View3D";
export const fileName = "view3d";
const external = {
  three: "THREE",
  "@egjs/component": "Component",
  "three/examples/jsm/loaders/GLTFLoader": "GLTFLoader",
  "three/examples/jsm/loaders/RGBELoader": "RGBELoader",
  "three/examples/jsm/loaders/DRACOLoader": "DRACOLoader",
  "three/examples/jsm/loaders/KTX2Loader": "KTX2Loader"
};
const tsconfig = "tsconfig.build.json";
const plugins = [glslify()];

const common = {
  sourcemap: false,
  tsconfig,
  plugins
}

export default buildHelper([
  {
    name,
    input: "./src/index.umd.ts",
    output: `./dist/${fileName}.js`,
    format: "umd",
    external,
    ...common
  },
  {
    name,
    input: "./src/index.umd.ts",
    output: `./dist/${fileName}.min.js`,
    format: "umd",
    external,
    uglify: true,
    ...common
  },
  {
    name,
    input: "./src/index.umd.ts",
    output: `./dist/${fileName}.pkgd.js`,
    format: "umd",
    commonjs: true,
    resolve: true,
    ...common
  },
  {
    name,
    input: "./src/index.umd.ts",
    output: `./dist/${fileName}.pkgd.min.js`,
    format: "umd",
    commonjs: true,
    resolve: true,
    uglify: true,
    ...common
  },
  {
    input: "./src/index.ts",
    output: `./dist/${fileName}.esm.js`,
    format: "esm",
    exports: "named",
    external,
    ...common
  }
]);
