import React from "react";
import CodeBlock from "@theme/CodeBlock";

export default () => <section className="py-4">
  <div className="title mb-6">Quick Start</div>
  <div className="columns">
    <div className="column is-6">
      <CodeBlock className="language-html" title="HTML">{`<div id="view3d" class="view3d-wrapper view3d-square">
  <canvas class="view3d-canvas"></canvas>
</div>`}</CodeBlock>
    </div>
    <div className="column is-6">
      <CodeBlock className="language-js" title="JS">{`import View3D from "@egjs/view3d";
import "@egjs/view3d/css/view3d-bundle.min.css";

const view3D = new View3D("#view3d", {
  src: "URL_TO_YOUR_3D_MODEL",
  envmap: "URL_TO_YOUR_HDR_IMAGE",
});`}</CodeBlock>
    </div>
  </div>
</section>;
