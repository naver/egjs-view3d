<script lang="ts">
  import {
    onMount,
    onDestroy,
    createEventDispatcher
  } from "svelte";
  import VanillaView3D, {
    EVENTS,
    DEFAULT_CLASS
  } from "@egjs/view3d";

  // @ts-ignore
  __DECLARE_PROPS__

  const dispatch = createEventDispatcher();
  const view3DOptionNames = Object.getOwnPropertyNames(VanillaView3D.prototype)
    .filter(name => {
      const descriptor = Object.getOwnPropertyDescriptor(VanillaView3D.prototype, name);

      if (name.startsWith("_")) return false;
      if (descriptor?.value) return false;

      return true;
    });

  const view3DSetterNames = view3DOptionNames.filter(name => {
    const descriptor = Object.getOwnPropertyDescriptor(VanillaView3D.prototype, name);

    return !!descriptor!.set;
  });

  export let canvasClass: string = "";
  export let view3D: VanillaView3D | null = null;
  let containerEl: HTMLElement;
  let prevProps = getSetterProps();

  $: wrapperClass = `${DEFAULT_CLASS.WRAPPER} ${$$props.class ?? ""}`.trim();
  $: canvasClass = `${DEFAULT_CLASS.CANVAS} ${$$props.canvasClass ?? ""}`.trim();

  // On props change
  $: {
    if (view3D) {
      view3DSetterNames.forEach(name => {
        const oldProp = prevProps[name];
        const newProp = $$props[name];

        if (newProp !== oldProp) {
          view3D![name] = newProp;
        }
      });
      prevProps = getSetterProps();
    }
  }

  onDestroy(() => {
    view3D?.destroy();
  });

  onMount(() => {
    view3D = new VanillaView3D(containerEl, $$props);

    Object.keys(EVENTS).forEach(key => {
      const eventName = EVENTS[key];

      view3D!.on(eventName, e => {
        dispatch(eventName, e);
      });
    });
  });

  export function getElement() {
    return containerEl;
  }

  function getSetterProps() {
    return view3DSetterNames.reduce((props, name) => {
      props[name] = $$props[name];

      return props;
    }, {});
  }
</script>

<svelte:options accessors={true} />
<div bind:this={containerEl} {...$$restProps} class={wrapperClass}>
  <canvas class={canvasClass}></canvas>
  <slot />
</div>
