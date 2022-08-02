const View3D = require("@egjs/view3d/dist/view3d.pkgd.js");

const view3DOptionNames = Object.getOwnPropertyNames(View3D.prototype)
  .filter(name => {
    const descriptor = Object.getOwnPropertyDescriptor(View3D.prototype, name);

    if (name.startsWith("_")) return false;
    if (descriptor?.value) return false;

    return true;
  });

export default [
  ["__DECLARE_PROPS__", view3DOptionNames.map(opt => `export let ${opt} = undefined;`).join("\n")],
  ["__GET_PANO_PROPS__", `{ src: "1" }`]
];
