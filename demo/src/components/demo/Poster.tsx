import clsx from "clsx";
import React, { useRef } from "react";
import View3D from "../View3D";
import styles from "./poster.module.css";

export default () => {
  const view3D = useRef<View3D>();

  return <>
    <View3D
      ref={view3D}
      src="/egjs-view3d/model/draco/alarm.glb"
      envmap="/egjs-view3d/texture/artist_workshop_1k.hdr"
      poster="#demo-poster-sample-el"
      autoInit={false}
      clickToLoad
      showExampleCode>
      <div id="demo-poster-sample-el" className={clsx(styles.poster, "is-size-3")}>
        <span className={clsx(styles.label, "py-5")}>I am custom HTMLElement with id "#demo-poster-sample-el"</span>
      </div>
    </View3D>
  </>;
};
