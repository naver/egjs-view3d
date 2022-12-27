const buildHelper = require("@egjs/build-helper");

const defaultOptions = {
  tsconfig: "tsconfig.build.json",
  sourcemap: true,
};
export default buildHelper([
  {
    ...defaultOptions,
    input: "./src/index.ts",
    format: "esm",
    output: "./dist/view3d.esm.js",
    exports: "named"
  },
  {
    ...defaultOptions,
    input: "./src/index.umd.ts",
    format: "cjs",
    output: "./dist/view3d.cjs.js"
  },
  {
    ...defaultOptions,
    name: "ReactView3D",
    input: "./src/index.umd.ts",
    format: "umd",
    output: "./dist/view3d.umd.js",
    external: {
      "react": "React",
      "react-dom": "ReactDOM",
      "@egjs/view3d": "View3D",
      "@egjs/component": "Component"
    }
  }
]);
