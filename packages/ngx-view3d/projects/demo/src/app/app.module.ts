import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NgxView3DModule } from "../../../ngx-view3d/src/lib/ngx-view3d.module";
import { AppComponent } from "./app.component";
import { BasicComponent } from "./basic/basic.component";
import { EventComponent } from "./event/event.component";
import { MethodComponent } from "./method/method.component";
import { AnnotationComponent } from "./annotation/annotation.component";
import { PluginComponent } from "./plugin/plugin.component";
import { PropChangeComponent } from "./prop-change/prop-change.component";

const appRoutes: Routes = [
  {
    path: "basic",
    component: BasicComponent
  },
  {
    path: "event",
    component: EventComponent
  },
  {
    path: "method",
    component: MethodComponent
  },
  {
    path: "annotation",
    component: AnnotationComponent
  },
  {
    path: "plugin",
    component: PluginComponent
  },
  {
    path: "prop",
    component: PropChangeComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    BasicComponent,
    EventComponent,
    MethodComponent,
    AnnotationComponent,
    PluginComponent,
    PropChangeComponent
  ],
  imports: [
    BrowserModule,
    NgxView3DModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
