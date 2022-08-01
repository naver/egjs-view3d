const buildHelper = require("@egjs/build-helper");
const commonjs = require("rollup-plugin-commonjs");
const vue = require("rollup-plugin-vue");

const external = {
  "vue": "Vue",
  "@egjs/view3d": "View3D",
  "@egjs/component": "Component"
};

const defaultOptions = {
  sourcemap: true,
  plugins: [
    commonjs(),
    vue()
  ],
  external
};
export default buildHelper([
  {
    ...defaultOptions,
    format: "es",
    exports: "named",
    input: "./src/index.ts",
    output: "./dist/view3d.esm.js"
  },
  {
    ...defaultOptions,
    format: "cjs",
    input: "./src/index.umd.ts",
    output: "./dist/view3d.cjs.js"
  }
]);
