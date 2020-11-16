/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as TOUCH from "~/consts/touch";
import { XRRenderContext, XRContext, XRInputs } from "~/types/internal";

/**
 * @category Controls-AR
 * @interface
 */
interface ARControl {
  readonly enabled: boolean;
  enable(): void;
  disable(): void;
  init(ctx: XRRenderContext): void;
  destroy(ctx: XRContext): void;
  activate(ctx: XRRenderContext, gesture: TOUCH.GESTURE): void;
  deactivate(ctx: XRContext): void;
  setInitialPos(coords: THREE.Vector2[]): void;
  process(ctx: XRRenderContext, inputs: XRInputs): void;
  update(ctx: XRRenderContext, deltaMilisec: number): void;
}

export default ARControl;
