const babel = require("rollup-plugin-babel");

const buildHelper = require("./config/build-helper");

export const name = "View3D";
export const fileName = "view3d";
const external = {
  three: "THREE"
};
const tsconfig = "tsconfig.build.json";

const plugins = [
];

export default buildHelper([
  {
    name,
    input: "./src/index.umd.ts",
    output: `./dist/${fileName}.js`,
    format: "umd",
    tsconfig,
    external,
    plugins
  },
  {
    name,
    input: "./src/index.umd.ts",
    output: `./dist/${fileName}.min.js`,
    format: "umd",
    tsconfig,
    external,
    uglify: true,
    plugins
  },
  {
    name,
    input: "./src/index.umd.ts",
    output: `./dist/${fileName}.pkgd.js`,
    format: "umd",
    tsconfig,
    resolve: true,
    plugins
  },
  {
    name,
    input: "./src/index.umd.ts",
    output: `./dist/${fileName}.pkgd.min.js`,
    format: "umd",
    tsconfig,
    resolve: true,
    uglify: true,
    plugins
  },
  {
    input: "./src/index.ts",
    output: `./dist/${fileName}.esm.js`,
    format: "esm",
    tsconfig,
    external,
    exports: "named",
    plugins
  }
]);
