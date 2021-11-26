/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/**
 * @interface
 * @property enabled Whether this control is enabled or not.
 * @property destroy Destroy this control.
 * @property resize Resize the control. Usually, the element size is used for parameter.
 * @property sync Synchronize internal state with the camera.
 * @property update Update internal state by delta time, and apply it to the camera.
 * @property enable Enable this control.
 * @property disable Disable this control.
 */
interface CameraControl {
  readonly enabled: boolean;
  destroy(): void;
  resize(size: { width: number; height: number }): void;
  sync(): void;
  update(delta: number): void;
  enable(): void;
  disable(): void;
}

export default CameraControl;
