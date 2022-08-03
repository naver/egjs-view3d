import View3D from "@egjs/view3d";

export const optionNames = Object.getOwnPropertyNames(View3D.prototype)
  .filter(name => {
    const descriptor = Object.getOwnPropertyDescriptor(View3D.prototype, name);

    if (name.startsWith("_")) return false;
    if (name === "constructor") return false;
    if (descriptor?.value) return false;

    return true;
  });

export const optionInputs = optionNames.map(name => `opt-${name}: ${name}`);

export const setterNames = optionNames
  .filter(name => {
    const descriptor = Object.getOwnPropertyDescriptor(View3D.prototype, name);

    return !!descriptor!.set;
  });
