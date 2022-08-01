/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { VueConstructor } from "vue";

import View3D from "./View3D";

declare global {
  interface Window {
    Vue: VueConstructor;
  }
}

const version = "#__VERSION__#";
const install = (Vue: VueConstructor) => {
  Vue.component("View3D", View3D);
};

const plugin = {
  View3D,
  install,
  version
};
export default plugin;
