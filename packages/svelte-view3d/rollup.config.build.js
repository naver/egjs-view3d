/* eslint-env node */
import svelte from "rollup-plugin-svelte";
import sveltePreprocess, { replace } from "svelte-preprocess";
import nodeResolve from "@rollup/plugin-node-resolve";

import replaces from "./replace";
const buildHelper = require("../../config/build-helper");

const defaultOptions = {
	external: {
		svelte: "svelte",
    three: "THREE",
    "@egjs/view3d": "View3D",
    "@egjs/component": "Component"
	},
	plugins: [
		svelte({
      preprocess: [
        sveltePreprocess(),
        replace(replaces)
      ]
    }),
    nodeResolve({
      browser: true
    })
	]
};

export default buildHelper([
	{
		...defaultOptions,
		input: "./src/index.umd.ts",
		output: "dist/view3d.cjs.js",
		format: "cjs",
    resolve: false
	},
	{
		...defaultOptions,
		input: "./src/index.ts",
		output: "dist/view3d.esm.js",
		format: "es",
		exports: "named",
    resolve: false
	}
]);
