/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/**
 * Interface of the ControlBar items
 */
interface ControlBarItem {
  position?: "top" | "left" | "right";
  order?: number;
  element: HTMLElement;
  enabled: boolean;
  enable(): void;
  disable(): void;
}

export default ControlBarItem;
