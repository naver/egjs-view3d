/* eslint-disable import/order */
const glslify = require("rollup-plugin-glslify");
const buildHelper = require("./config/build-helper");
const { babel } = require("@rollup/plugin-babel");
const serve = require("rollup-plugin-serve");
const livereload = require("rollup-plugin-livereload");

export const name = "View3D";
export const fileName = "view3d";

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
