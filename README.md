<img src="./demo/image/view3d.png" />

[![Version](https://img.shields.io/npm/v/@egjs/view3d?color=A8C256&label=&style=flat-square&logo=npm)](https://www.npmjs.com/package/@egjs/view3d) ![typescript](https://img.shields.io/static/v1.svg?label=&message=TypeScript&color=294E80&style=flat-square&logo=typescript) ![supports](https://img.shields.io/static/v1.svg?label=&message=%F0%9F%93%B1%F0%9F%92%BB%F0%9F%96%A5%EF%B8%8F&color=EEEEEE&style=flat-square)

Fast & customizable 3D model viewer for everyone

[Demo](https://naver.github.io/egjs-view3d/demo) / [API Document](https://naver.github.io/egjs-view3d) / [Tutorial](https://naver.github.io/egjs-view3d/tutorial-Adding%20Controls.html)

## Install

```sh
npm i @egjs/view3d
# OR
yarn add @egjs/view3d
```

## Getting Started
@egjs/view3d requires one canvas element to be initialized.

```html
<!-- Wrapper element -->
<div id="some-wrapper">
  <!-- View3D needs one canvas element to render a 3d model -->
  <!-- You don't have to set width / height attribute of it, as View3D will manage that for you. -->
  <!-- Just set its size with CSS, then View3D will use it -->
  <canvas id="my-canvas"></canvas>
  <!-- Other UI elements of your choice here -->
</div>

<!-- Here's some sample CSS style for the reference -->
<style>
#some-wrapper {
  width: 100vw;
  height: 100vh;
}
#my-canvas {
  width: 100%;
  height: 100%;
}
</style>
```

Then you can use it like

```js
import View3D from "@egjs/view3d";

const canvasEl = document.querySelector("#my-canvas");
const view3d = new View3D(canvasEl);
// or just
const view3d = new View3D("#my-canvas");
```

See more examples on our [Demo](https://naver.github.io/egjs-view3d/demo) / [Tutorial](https://naver.github.io/egjs-view3d/tutorial-Adding%20Controls.html)

## Browser Coverage
View3D is available for browsers support webgl.

|<img width="20" src="https://simpleicons.org/icons/internetexplorer.svg" alt="IE" />|<img width="20" src="https://simpleicons.org/icons/googlechrome.svg" alt="Chrome" />|<img width="20" src="https://simpleicons.org/icons/firefoxbrowser.svg" alt="Firefox" />|<img width="20" src="https://simpleicons.org/icons/safari.svg" alt="Safari" />|<img width="20" src="https://simpleicons.org/icons/apple.svg" alt="iOS" />|<img width="20" src="https://simpleicons.org/icons/android.svg" alt="Android">|
|:---:|:---:|:---:|:---:|:---:|:---:|
|11+|Latest|Latest|Latest|8+|5+|

See more details at https://caniuse.com/webgl

## Argumented Reality Coverage
<img width="20" src="https://simpleicons.org/icons/android.svg" alt="Android"><br/>(WebXR)|<img width="20" src="https://simpleicons.org/icons/android.svg" alt="Android"><br/>(Google SceneViewer)|<img width="20" src="https://simpleicons.org/icons/apple.svg" alt="iOS" /><br/>(AR QuickLook)|
|:---:|:---:|:---:|
|<img width="15" src="https://simpleicons.org/icons/googlechrome.svg" alt="Chrome" />|All browsers|<img width="15" src="https://simpleicons.org/icons/safari.svg" alt="Safari" /> <img width="15" src="https://simpleicons.org/icons/googlechrome.svg" alt="Chrome" />|
|Android 7.0+, Chromium 81+|Android 7.0+|iOS 11+|
- We also support AR session based on Google's [SceneViewer](https://developers.google.com/ar/develop/java/scene-viewer)
- For Android device coverage, see https://developers.google.com/ar/discover/supported-devices

## License
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

