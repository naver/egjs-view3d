import View3D from "../../View3D";

interface ControlBarItem {
  position: "top" | "left" | "right";
  update(view3D: View3D): void;
  createElement(): HTMLElement;
}

export default ControlBarItem;
