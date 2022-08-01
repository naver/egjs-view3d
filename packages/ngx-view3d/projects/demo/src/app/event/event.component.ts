import { Component } from "@angular/core";

@Component({
  selector: "demo-event",
  templateUrl: "./event.component.html",
  styleUrls: ["../app.component.css", "./event.component.css"]
})
export class EventComponent {
  public onReady(evt) {
    console.log("ready", evt);
  }
}
