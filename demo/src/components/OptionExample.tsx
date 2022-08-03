import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

import ReactCode from "./code/ReactCode";
import NgxCode from "./code/NgxCode";
import VueCode from "./code/VueCode";
import SvelteCode from "./code/SvelteCode";

export default ({ options = {} }) => {
  const optionsAsString = JSON.stringify(options, undefined, 4)
    .replace(/"([^"]+)":/g, "$1:");

  return <div>
    <Tabs
      groupId="options"
      defaultValue="json"
      lazy={true}
      values={[
        { label: "JSON", value: "json" },
        { label: "JavaScript", value: "js" },
        { label: "React", value: "react" },
        { label: "Angular", value: "ng" },
        { label: "Vue@2", value: "vue2" },
        { label: "Vue@3", value: "vue3" },
        { label: "Svelte", value: "svelte" }
      ]}>
      <TabItem value="json">
        <CodeBlock className="language-json">{ optionsAsString }</CodeBlock>
      </TabItem>
      <TabItem value="js">
        <CodeBlock className="language-js">{`new View3D("#el", ${optionsAsString});`}</CodeBlock>
      </TabItem>
      <TabItem value="react">
        <ReactCode options={options} />
      </TabItem>
      <TabItem value="ng">
        <NgxCode options={options} />
      </TabItem>
      <TabItem value="vue2">
        <VueCode options={options} />
      </TabItem>
      <TabItem value="vue3">
        <VueCode options={options} />
      </TabItem>
      <TabItem value="svelte">
        <SvelteCode options={options} />
      </TabItem>
    </Tabs>
  </div>;
};
