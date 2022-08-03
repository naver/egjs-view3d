import { Component } from "@angular/core";

@Component({
  selector: "demo-prop-change",
  templateUrl: "./prop-change.component.html",
  styleUrls: ["../app.component.css"]
})
export class PropChangeComponent {
  public src = "https://naver.github.io/egjs-view3d/model/draco/alarm.glb";
  public skybox: string | null = null;

  public onClick() {
    this.skybox = this.skybox ? null : "https://naver.github.io/egjs-view3d/texture/venice_sunset_1k.hdr"
  }
}
