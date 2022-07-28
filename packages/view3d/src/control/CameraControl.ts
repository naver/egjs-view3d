/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/**
 * @interface
 * @internal
 */
interface CameraControl {
  readonly enabled: boolean;
  readonly animating: boolean;
  destroy(): void;
  resize(size: { width: number; height: number }): void;
  sync(): void;
  update(delta: number): void;
  enable(): void;
  disable(): void;
}

export default CameraControl;
