/* eslint-disable quotes */
import React from "react";
import clsx from "clsx";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

export default () => <section className="py-4">
  <div className="title mb-6">CDN Links</div>
  <div className="columns">
    <div className="column is-6">
      <div className="subtitle">JS</div>
      <Tabs
        groupId="cdn"
        defaultValue="url"
        lazy={true}
        values={[
          { label: "URL", value: "url" },
          { label: "HTML <script>", value: "html" }
        ]}>
        <TabItem value="url">
          <CodeBlock className="language-shell">https://unpkg.com/@egjs/view3d@latest/dist/view3d.pkgd.min.js</CodeBlock>
        </TabItem>
        <TabItem value="html">
          <CodeBlock className="language-html">{`<script src="https://unpkg.com/@egjs/view3d@latest/dist/view3d.pkgd.min.js"></script>`}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
    <div className="column is-6">
      <div className="subtitle">CSS</div>
      <Tabs
        groupId="cdn"
        defaultValue="url"
        lazy={true}
        values={[
          { label: "URL", value: "url" },
          { label: "HTML <link>", value: "html" },
          { label: "CSS @import", value: "css" }
        ]}>
        <TabItem value="url">
          <CodeBlock className="language-shell">https://unpkg.com/@egjs/view3d@latest/css/view3d-bundle.min.css</CodeBlock>
        </TabItem>
        <TabItem value="html">
          <CodeBlock className="language-html">{`<link rel="stylesheet" href="https://unpkg.com/@egjs/view3d@latest/css/view3d-bundle.min.css">`}</CodeBlock>
        </TabItem>
        <TabItem value="css">
          <CodeBlock className="language-css">{`@import "https://unpkg.com/@egjs/view3d@latest/css/view3d-bundle.min.css";`}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  </div>

</section>;
