import { Component } from "@angular/core";

@Component({
  selector: "demo-prop-change",
  templateUrl: "./prop-change.component.html",
  styleUrls: ["../app.component.css"]
})
export class PropChangeComponent {
  public options = {
    src: "https://naver.github.io/egjs-view3d/model/draco/alarm.glb",
    skybox: null as string | null
  }

  public onClick() {
    this.options = {
      ...this.options,
      skybox: this.options.skybox ? null : "https://naver.github.io/egjs-view3d/texture/venice_sunset_1k.hdr"
    }
  }
}
