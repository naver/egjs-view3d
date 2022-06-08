import React from "react";

import { Context } from "../context";
import Collapse from "../Collapse";

export default () => {
  const { state } = React.useContext(Context);

  const view3D = state.view3D;
  const isLoading = state.isLoading;

  if (!view3D) return <></>;

  return <Collapse title="Download Poster (Preview Image)">
    <div>
      <span className="my-0 mr-2 menu-label">width</span>
      <input id="poster-width" className="input is-small" type="number" defaultValue={1024} min={1} disabled={isLoading}></input>
    </div>
    <div className="mt-2">
      <span className="my-0 mr-2 menu-label">height</span>
      <input id="poster-height" className="input is-small" type="number" defaultValue={1024} min={1} disabled={isLoading}></input>
    </div>
    <button className="button is-small mt-2" disabled={isLoading} onClick={() => downloadPoster(state)}>
      <img className="mr-2" src="/egjs-view3d/icon/image.svg" />
      <span>Download Poster (.png)</span>
    </button>
  </Collapse>;
};

const downloadPoster = (state) => {
  const view3D = state.view3D!;
  const canvas = view3D.renderer.canvas;
  const origSize = view3D.renderer.size;
  const posterWidth = parseFloat((document.querySelector("#poster-width") as HTMLInputElement).value);
  const posterHeight = parseFloat((document.querySelector("#poster-height") as HTMLInputElement).value);

  view3D.renderer.threeRenderer.setSize(posterWidth, posterHeight, true);

  view3D.once("resize", () => {
    view3D.screenshot("poster");

    view3D.renderer.threeRenderer.setSize(origSize.width, origSize.height, false);

    canvas.style.width = "";
    canvas.style.height = "";
  });
};
