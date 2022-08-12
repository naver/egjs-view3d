<center>

<img width="400" src="https://naver.github.io/egjs-view3d/poster/cube.png">

# @egjs/ngx-view3d

<img alt="npm (scoped)" src="https://img.shields.io/npm/v/@egjs/ngx-view3d?logo=npm"></img>
<img alt="License" src="https://img.shields.io/github/license/naver/egjs-view3d" />
<img alt="Typescript" src="https://img.shields.io/static/v1.svg?label=&message=TypeScript&color=294E80&style=flat-square&logo=typescript" />
<img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/naver/egjs-view3d?style=social" />

Angular wrapper of <a href="https://github.com/naver/egjs-view3d">@egjs/view3d</a>

👉 **[Demo](https://naver.github.io/egjs-view3d)** / **[API Document](https://naver.github.io/egjs-view3d/docs/api/View3D)** / **[Tutorial](https://naver.github.io/egjs-view3d/docs/)**

</center>

## 🔹 Installation

```sh
npm i @egjs/ngx-view3d
# OR
yarn add @egjs/ngx-view3d
```

## 🔹 Quick Start
```diff
+import { NgxView3DModule } from '@egjs/ngx-view3d';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
+   /* Add in imports */
+   NgxView3DModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } /* Your app */
```

### Template & Script
```ts
import { ReadyEvent } from "@egjs/ngx-view3d";

@Component({
  selector: 'view3d-demo',
  template: `
    <ngx-view3d
      [src]="src"
      [envmap]="envmap"
      (ready)="onReady($event)"
    />
  `
})
export class View3DDemo {
  public src = "URL_TO_YOUR_3D_MODEL";
  public envmap = "URL_TO_YOUR_HDR_IMAGE";

  public onReady(evt: ReadyEvent) {
    // DO_SOMETHING
  }
}
```

### Styles
You can either add our CSS file to `styles` section of `angular.json`
```json
"options": {
  // ...
  "styles": [
    "node_modules/@egjs/ngx-view3d/css/view3d-bundle.min.css"
    // ... Other global styles
  ]
  // ...
}
```

Or import from other global style file
```css
/* Inside of styles.css */
@import "@egjs/ngx-view3d/css/view3d-bundle.min.css";
```

See detailed explanation on our [Tutorial](https://naver.github.io/egjs-view3d/docs/)

## 🔹 Browser Support
View3D is available for the last two major versions of all evergreen desktop and mobile browsers.

## 🔹 License
```
Copyright (c) 2020-present NAVER Corp.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
