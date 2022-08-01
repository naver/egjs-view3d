/**
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { defineComponent, PropType, h } from "vue";
import VanillaView3D, {
  DEFAULT_CLASS,
  EVENTS,
  getValidProps,
  withMethods
} from "@egjs/view3d";

import { View3DProps } from "./types";

type PropTypes = {
  [key in keyof View3DProps]: {
    type: PropType<View3DProps[key]>;
  }
};

const view3DOptionNames = Object.getOwnPropertyNames(VanillaView3D.prototype)
  .filter(name => {
    const descriptor = Object.getOwnPropertyDescriptor(VanillaView3D.prototype, name);

    if (name.startsWith("_")) return false;
    if (descriptor?.value) return false;

    return true;
  });

const view3DOptions = view3DOptionNames.reduce((props, name) => {
    return {
      ...props,
      [name]: null
    }
  }, {}) as PropTypes;

const view3DSetterNames = view3DOptionNames.filter(name => {
  const descriptor = Object.getOwnPropertyDescriptor(VanillaView3D.prototype, name);

  return !!descriptor!.set;
});

const View3D = defineComponent({
  props: {
    ...view3DOptions,
    tag: {
      type: String,
      required: false,
      default: "div"
    },
    canvasClass: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {} as {
      view3D: VanillaView3D;
    };
  },
  created() {
    withMethods(this, "view3D");
  },
  mounted() {
    const props = getValidProps(this.$props);

    this.view3D = new VanillaView3D(
      this.$refs.wrapper as HTMLElement,
      props
    )
    const events = Object.keys(EVENTS).map(key => (EVENTS as any)[key]);

    events.forEach(eventName => {
      this.view3D.on(eventName, (e: any) => {
        e.target = this;

        // Make events from camelCase to kebab-case
        this.$emit(eventName.replace(/([A-Z])/g, "-$1").toLowerCase(), e);
      });
    });
  },
  beforeDestroy() {
    this.view3D?.destroy();
  },
  render() {
    const canvasClass = this.canvasClass ?? "";
    const canvasClassName = `${DEFAULT_CLASS.CANVAS} ${canvasClass}`.trim();

    return h(this.tag, {
      ref: "wrapper",
      class: DEFAULT_CLASS.WRAPPER
    }, [
      h("canvas", { class: canvasClassName }),
      this.$slots.default?.()
    ]);
  },
  watch: {
    ...view3DSetterNames.reduce((setters, name) => {
      setters[`$props.${name}`] = {
        handler(newVal: any) {
          if (!this.view3D) return;
          this.view3D[name] = newVal;
        },
        deep: true
      }
      return setters;
    }, {} as Record<string, any>)
  }
});

export default View3D;
