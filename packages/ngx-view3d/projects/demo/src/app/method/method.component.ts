import { Component, ViewChild } from "@angular/core";
import { NgxView3DComponent } from "../../../../ngx-view3d/src/lib/ngx-view3d.component";

@Component({
  selector: "demo-method",
  templateUrl: "./method.component.html",
  styleUrls: ["../app.component.css"]
})
export class MethodComponent {
  @ViewChild("viewer") public view3D: NgxView3DComponent;

  public onReady(evt) {
    evt.target.animator.play(1);
  }

  public onClick() {
    this.view3D.animator.play(2);
  }
}
