import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

import View3D from "../src";

import App from "./App.vue";
import routes from "./router";
import "@egjs/view3d/css/view3d-bundle.css";

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes
});

const app = createApp(App);

app.use(router);
app.use(View3D);
app.mount("#app");
