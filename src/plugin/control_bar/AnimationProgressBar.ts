import View3D from "../../View3D";

import ControlBarItem from "./ControlBarItem";

export interface AnimationProgressBarOptions {
  position: ControlBarItem["position"];
}

class AnimationProgressBar implements ControlBarItem {
  public position: AnimationProgressBarOptions["position"];

  public constructor({
    position = "top"
  }: Partial<AnimationProgressBarOptions> = {}) {
    this.position = position;
  }

  public update(view3D: View3D) {

  }

  public createElement() {

  }
}

export default AnimationProgressBar;
