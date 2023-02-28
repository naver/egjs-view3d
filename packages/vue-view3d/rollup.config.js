/* eslint-env node */
const buildHelper = require("../../config/build-helper");
const VuePlugin = require("rollup-plugin-vue");

const external = {
  "vue": "Vue",
  "three": "THREE",
  "@egjs/view3d": "View3D",
  "@egjs/component": "Component",
};

const defaultOptions = {
  sourcemap: true,
  plugins: [VuePlugin()],
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
