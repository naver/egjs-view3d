import { Component } from "@angular/core";
import { ControlBar, LoadingBar } from "../../../../ngx-view3d/src/public-api";

@Component({
  selector: "demo-plugin",
  templateUrl: "./plugin.component.html",
  styleUrls: ["../app.component.css"]
})
export class PluginComponent {
  public src = "https://naver.github.io/egjs-view3d/model/RobotExpressive.glb";
  public plugins = [new LoadingBar(), new ControlBar()];
}
