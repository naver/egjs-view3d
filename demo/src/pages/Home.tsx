import React from "react";
// @ts-ignore
import Link from "@docusaurus/Link";
// @ts-ignore
import CodeBlock from "@theme/CodeBlock";
import VanillaView3D from "../../../src";
// @ts-ignore
import styles from "./home.module.css";
import clsx from "clsx";

class Home extends React.Component {
  private _view3D: VanillaView3D;

  public componentDidMount() {
    const view3D = new VanillaView3D("#home-view3d", {
      src: "/model/cube.glb",
      envmap: "/texture/artist_workshop_1k.hdr",
      rotate: false,
      translate: false,
      zoom: false,
      pitch: 25,
      autoplay: { canInterrupt: false }
    });

    this._view3D = view3D;
  }

  public render() {
    return (
      <div className="container">
        <div className={styles.max400}>
          <div id="home-view3d" className="view3d-wrapper view3d-square">
            <canvas className="view3d-canvas"></canvas>
          </div>
        </div>
        <section className="py-4">
          <div className="title has-text-centered mb-6">View3D</div>
          <CodeBlock className={clsx(styles.max400, "language-shell")}>{"npm install @egjs/view3d"}</CodeBlock>
          <div className="subtitle has-text-centered">Fast & Customizable glTF 3D model viewer, packed with full of features!</div>
          <div className={clsx("level", styles.btnsWrapper)}>
            <div className="level-item">
              <Link
                className="button mr-2"
                to="/docs">
                  🚀 Get Started
              </Link>
            </div>
            <div className="level-item">
              <Link
                className="button pl-5"
                style={{ borderRadius: "4px 0 0 4px" }}
                to="https://github.com/naver/egjs-view3d">
                <span className="icon is-small mr-2">
                  <img src="https://unpkg.com/simple-icons@v6/icons/github.svg" />
                </span>
                <span>GitHub</span>
              </Link>
              <Link
                className="button mr-2"
                style={{ borderRadius: "0 4px 4px 0", borderLeft: "0" }}
                to="https://github.com/naver/egjs-view3d/stargazers">
                <img src="icon/star.svg" />
                <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/naver/egjs-view3d?color=%23ffffff&label=%20&style=for-the-badge" />
              </Link>
            </div>
            <div className="level-item">
              <Link
                className="button"
                to="https://www.npmjs.com/package/@egjs/view3d">
                <span className="icon is-small ml-0 mr-2">
                  <img src="https://unpkg.com/simple-icons@v6/icons/npm.svg" />
                </span>
                <span>npm</span>
              </Link>
            </div>
          </div>
        </section>
        <section className="hero">
          <div className="hero-body">
            <div className="title mb-6">Features</div>
          </div>
        </section>
      </div>
    );
  }
}

export default Home;
