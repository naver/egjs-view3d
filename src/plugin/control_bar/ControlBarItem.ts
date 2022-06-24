interface ControlBarItem {
  position: "top" | "left" | "right";
  element: HTMLElement;
  order: number;
  enabled: boolean;
  enable(): void;
  disable(): void;
}

export default ControlBarItem;
