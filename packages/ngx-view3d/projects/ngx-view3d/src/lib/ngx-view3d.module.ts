/**
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NgxView3DComponent } from "./ngx-view3d.component";

@NgModule({
  declarations: [NgxView3DComponent],
  imports: [
    CommonModule
  ],
  exports: [NgxView3DComponent]
})
export class NgxView3DModule { }
