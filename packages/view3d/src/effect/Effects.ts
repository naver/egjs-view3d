import { Pass } from "three/examples/jsm/postprocessing/EffectComposer";

export interface Effects extends Pass {
  on(): void;
  off(): void;
  setOptions(val: unknown): void;
}

