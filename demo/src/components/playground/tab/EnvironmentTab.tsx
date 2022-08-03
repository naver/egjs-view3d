import React from "react";

import { Context } from "../context";
import EnvmapChange from "../item/EnvmapChange";
import ShadowControl from "../item/ShadowControl";

class EnvironmentTab extends React.Component {
  public render() {
    return <>
      <EnvmapChange />
      <ShadowControl />
    </>;
  }
}

EnvironmentTab.contextType = Context;

export default EnvironmentTab;
