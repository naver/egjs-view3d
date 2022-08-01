import { Component, ViewChild } from "@angular/core";

@Component({
  selector: "demo-method",
  templateUrl: "./method.component.html",
  styleUrls: ["../app.component.css"]
})
export class MethodComponent {
  @ViewChild("viewer") public view3D;

  public onReady(evt) {
    evt.target.animator.play(1);
  }

  public onClick() {
    this.view3D.animator.play(2);
  }
}
