/**
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { App } from "vue";

import View3D from "./View3D";

export default {
  install: (app: App) => {
    app.component("View3D", View3D);

  },
  View3D
};
