import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

export default ({ options = {} }) => {
  const optionsAsString = JSON.stringify(options, undefined, 4)
    .replace(/"([^"]+)":/g, "$1:");

  return <Tabs
    groupId="options"
    defaultValue="json"
    lazy={true}
    values={[
      { label: "JSON", value: "json" },
      { label: "JavaScript", value: "js" }
    ]}>
    <TabItem value="json">
      <CodeBlock className="language-json">{ optionsAsString }</CodeBlock>
    </TabItem>
    <TabItem value="js">
      <CodeBlock className="language-js">{`new View3D("#el", ${optionsAsString});`}</CodeBlock>
    </TabItem>
  </Tabs>;
};
