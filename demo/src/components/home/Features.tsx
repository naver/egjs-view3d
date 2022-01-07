import React from "react";
import clsx from "clsx";

import styles from "./features.module.css";

import View3D from "../View3D";
import Rotate3DIcon from "../../../static/icon/3D.svg";
import ARIcon from "../../../static/icon/ar.svg";
import ExtensionIcon from "../../../static/icon/extension.svg";
import GLTFIcon from "../../../static/icon/glTF.svg";

export default () => <section className="py-4">
  <div className="title mb-6">Features</div>
  <div className="columns">
    <div className="column">
      <div className={clsx(styles.features, "subtitle")}><Rotate3DIcon className={clsx(styles.featuresIcon, "mx-2")} />glTF Viewer</div>
      <View3D
        className="image is-square m-0"
        src="/egjs-view3d/model/draco/plant.glb"
        poster="/egjs-view3d/poster/plant.png"
        clickToLoad
        envmap="/egjs-view3d/texture/artist_workshop_1k.hdr" />
      <div className="block mt-4">View, rotate, translate and zoom your <strong>glTF 3D models</strong> in the web. Works on both <strong>🖥️ Desktop & 📱 Mobile</strong></div>
      <div className="block">Customize your viewer with <a href="docs/options/model/src">Options</a> like <strong>autoplay</strong>, <strong>skybox</strong>, and <strong>shadow</strong></div>
      <div className="block">
        <a href="docs/options/model/src"><button className="button">Options</button></a>
      </div>
    </div>
    <div className="column">
      <div className={clsx(styles.features, "subtitle")}><ARIcon className={clsx(styles.featuresIcon, "mx-2")} />Augmented Reality</div>
      <figure className="image is-square m-0">
        <video className={clsx(styles.featuresImage)} src="video/FloorARSession.mp4" muted autoPlay loop></video>
      </figure>
      <div className="block mt-4">
        View3D supports <strong>Augmented Reality</strong> based on <a href="docs/options/ar/webAR">WebXR</a>, <a href="docs/options/ar/sceneViewer">Scene Viewer</a>, and <a href="docs/options/ar/quickLook">AR Quick Look</a>
      </div>
      <div className="block">
        You can see, rotate, move, and scale the 3D model on the floor & wall in our AR sessions.
      </div>
      <div className="block">
        <a href="docs/ar"><button className="button">Demo</button></a>
      </div>
    </div>
    <div className="column">
      <div className={clsx(styles.features, "subtitle")}><ExtensionIcon className={clsx(styles.featuresIcon, "mx-2")} />Supports compressed glTF 2.0 models</div>
      <figure className="image is-square m-0">
        <GLTFIcon className={clsx(styles.featuresImage)} />
      </figure>
      <div className="block">
        <div className="block mt-4">
          View3D can display compressed glTF models with the following extensions.
        </div>
        <ul>
          <a href="docs/tutorials/Compression/Draco"><li>KHR_draco_mesh_compression</li></a>
          <a href="docs/tutorials/Compression/Meshopt"><li>EXT_meshopt_compression</li></a>
          <a href="docs/tutorials/Compression/Basisu"><li>KHR_texture_basisu</li></a>
        </ul>
        <div className="block">
          Speed up your page load with compressed glTF models. Check out how to do it in our guide page.
        </div>
        <div className="block">
          <a href="docs/tutorials/Compression/Draco"><button className="button">Guide</button></a>
        </div>
      </div>
    </div>
  </div>
</section>;
