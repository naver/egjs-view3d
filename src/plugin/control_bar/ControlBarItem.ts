/**
 * Interface of the ControlBar items
 */
interface ControlBarItem {
  position: "top" | "left" | "right";
  element: HTMLElement;
  order: number;
  enabled: boolean;
  enable(): void;
  disable(): void;
}

export default ControlBarItem;
