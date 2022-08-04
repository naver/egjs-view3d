/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";
import VanillaView3D, { View3DOptions, View3DEvents } from "@egjs/view3d";

interface View3DProps extends Partial<View3DOptions>, svelte.JSX.HTMLAttributes<HTMLElementTagNameMap["div"]> {
  canvasClass?: string;
}

declare class View3D extends SvelteComponentTyped<
  View3DProps,
  View3DEvents,
  { default: {}; }
> {}

interface View3D extends VanillaView3D {}

export default View3D;
