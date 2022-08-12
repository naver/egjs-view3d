/* eslint-disable import/order */
const glslify = require("rollup-plugin-glslify");
const buildHelper = require("./config/build-helper");
const { babel } = require("@rollup/plugin-babel");
const resolve = require("@rollup/plugin-node-resolve");

export const name = "View3D";
export const fileName = "view3d";
const helperName = "View3D.Helper";

const external = {
  three: "THREE",
  "@egjs/component": "Component"
};
const tsconfig = "tsconfig.build.json";
const plugins = [
  glslify(),
  babel({
    babelHelpers: "bundled",
    include: ["src/**", "node_modules/three/**"],
    configFile: "./babel.config.js"
  })
];
const resolveThreeExamples = resolve({
  include: "node_modules/three/examples",
});

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
    output: `./dist/${fileName}.js`,
    format: "umd",
    external,
    ...common,
    plugins: [...plugins, resolveThreeExamples]
  },
  {
    name,
    input: "./src/index.umd.ts",
    output: `./dist/${fileName}.min.js`,
    format: "umd",
    external,
    uglify: true,
    ...common,
    plugins: [...plugins, resolveThreeExamples]
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
  },
  {
    name: helperName,
    input: "./src/helper/index.umd.ts",
    output: "./dist/helper.js",
    format: "umd",
    ...helperCommon
  },
  {
    name: helperName,
    input: "./src/helper/index.umd.ts",
    output: "./dist/helper.min.js",
    format: "umd",
    uglify: true,
    ...helperCommon
  },
  {
    input: "./src/helper/index.ts",
    output: "./dist/helper.esm.js",
    format: "esm",
    exports: "named",
    ...helperCommon
  }
]);
