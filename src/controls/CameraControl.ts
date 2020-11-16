/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import Camera from "~/core/camera/Camera";

/**
 * @interface
 * @category Controls
 * @property element HTMLElement that this control is attatched.
 * @property enabled Whether this control is enabled or not.
 * @property setElement Set HTMLElement to attach this control.
 * @property destroy Destroy this control.
 * @property resize Resize the control. Usually, the element size is used for parameter.
 * @property sync Synchronize internal state with the given camera.
 * @property update Update internal state by delta time, and apply it to the given camera.
 * @property enable Enable this control.
 * @property disable Disable this control.
 */
interface CameraControl {
  readonly element: HTMLElement | null;
  readonly enabled: boolean;
  setElement(element: HTMLElement): void;
  destroy(): void;
  resize(size: THREE.Vector2): void;
  sync(camera: Camera): void;
  update(camera: Camera, delta: number): void;
  enable(): void;
  disable(): void;
}

export default CameraControl;
