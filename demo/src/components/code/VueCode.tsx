import React from "react";
import CodeBlock from "@theme/CodeBlock";

export default ({ options }) => {
  const optionsAsProp = Object.keys(options).map(key => {
    return (typeof options[key] === "string")
      ? `${key}="${options[key]}"`
      : `:${key}="${JSON.stringify(options[key]).replace(/\"/g, "'")}"`;
  }).join("\n  ");

  return <CodeBlock className="language-html">{
    `<View3D ${optionsAsProp} />`
  }</CodeBlock>
}
