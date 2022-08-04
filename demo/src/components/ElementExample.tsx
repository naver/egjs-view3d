import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

export default ({ el }) => {
  const elFormatted = el.split("\n").map(line => `  ${line}`).join("\n");

  return <div>
    <Tabs
      groupId="framework"
      defaultValue="js"
      lazy={true}
      values={[
        { label: "Javascript", value: "js" },
        { label: "React", value: "react" },
        { label: "Angular", value: "ng" },
        { label: "Vue@2", value: "vue2" },
        { label: "Vue@3", value: "vue3" },
        { label: "Svelte", value: "svelte" }
      ]}>
      <TabItem value="js">
        <CodeBlock className="language-html">{
`<div class="view3d-wrapper">
  <div class="view3d-canvas">
${elFormatted}
</div>`
        }</CodeBlock>
      </TabItem>
      <TabItem value="react">
        <CodeBlock className="language-jsx">{
`<View3D>
${elFormatted.replace(/class=/g, "className=")}
</View3D>`
        }</CodeBlock>
      </TabItem>
      <TabItem value="ng">
        <CodeBlock className="language-html">{
`<ngx-view3d>
${elFormatted}
</ngx-view3d>`
        }</CodeBlock>
      </TabItem>
      <TabItem value="vue2">
        <CodeBlock className="language-html">{
`<View3D>
${elFormatted}
</View3D>`
        }</CodeBlock>
      </TabItem>
      <TabItem value="vue3">
      <CodeBlock className="language-html">{
`<View3D>
${elFormatted}
</View3D>`
        }</CodeBlock>
      </TabItem>
      <TabItem value="svelte">
      <CodeBlock className="language-jsx">{
`<View3D>
${elFormatted}
</View3D>`
        }</CodeBlock>
      </TabItem>
    </Tabs>
  </div>;
};
