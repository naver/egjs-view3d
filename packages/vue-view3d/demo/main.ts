import Vue from "vue";
import VueRouter from "vue-router";

import View3D from "../src/index";

import App from "./Demo.vue";
import routerOption from "./router";
import "@egjs/view3d/css/view3d-bundle.css";

Vue.use(View3D);
Vue.use(VueRouter);

const router = new VueRouter(routerOption);

new Vue({
  render: h => h(App),
  router
}).$mount("#app");
