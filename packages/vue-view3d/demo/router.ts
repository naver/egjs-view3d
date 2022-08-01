import Basic from "./components/Basic.vue";
import EventDemo from "./components/Event.vue";
import Method from "./components/Method.vue";
import Annotation from "./components/Annotation.vue";
import PluginDemo from "./components/Plugin.vue";

export default {
  routes: [
    {
      path: "/basic",
      name: "Basic",
      component: Basic
    },
    {
      path: "/event",
      name: "Event",
      component: EventDemo
    },
    {
      path: "/method",
      name: "Method",
      component: Method
    },
    {
      path: "/annotation",
      name: "Annotation",
      component: Annotation
    },
    {
      path: "/plugin",
      name: "Plugin",
      component: PluginDemo
    }
  ]
};
