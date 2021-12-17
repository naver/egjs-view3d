/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import { GESTURE } from "../../const/internal";
import { XRRenderContext, XRInputs } from "../../type/xr";

/**
 * @interface
 */
interface ARControl {
  readonly enabled: boolean;
  enable(): void;
  disable(): void;
  activate(ctx: XRRenderContext, gesture: GESTURE): void;
  deactivate(): void;
  setInitialPos(coords: THREE.Vector2[]): void;
  process(ctx: XRRenderContext, inputs: XRInputs): void;
  update(ctx: XRRenderContext, deltaMilisec: number): void;
}

export default ARControl;
