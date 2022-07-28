import React from "react";
import { Context } from "../context";
import DownloadModel from "../item/DownloadModel";
import DownloadPoster from "../item/DownloadPoster";

class DownloadTab extends React.Component {
  public render() {
    const { state } = this.context;

    return <>
      <DownloadModel />
      <DownloadPoster />
    </>;
  }
}

DownloadTab.contextType = Context;

export default DownloadTab;
