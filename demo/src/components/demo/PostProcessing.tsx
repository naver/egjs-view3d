import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import View3D from "../View3D";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass";
import {
  BloomEffect,
  BrightnessContrastEffect,
  EffectComposer as EffectComposerLib,
  EffectPass,
  RenderPass as RenderPassLib,
  SMAAEffect,
  ToneMappingEffect,
  ToneMappingMode
} from "postprocessing";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

type Params = {

  src: string;
  type: "car" | "alarm" | "default"
  setPostProcessing?: boolean
  positionY?: number;
  initZoom?: number
}

const PostProcessing = ({ src, setPostProcessing = true, type = "default", initZoom = 8 }: Params) => {
  const ref = useRef<View3D>(null);

  useEffect(() => {
    const view3D = ref.current.view3D;
    view3D.on("ready", () => {
      view3D.scene.fixedObjects.children[0].position.y = view3D.model.scene.position.y;
    });
  }, []);

  useEffect(() => {
    if (!setPostProcessing || type !== "car") return;

    const view3D = ref.current.view3D;
    const camera = view3D.camera.threeCamera;
    const renderer = view3D.renderer.threeRenderer;
    const scene = view3D.scene.root;

    const effectComposer = new EffectComposerLib(renderer);

    const effectPass = new EffectPass(
      camera,
      new BloomEffect({ luminanceThreshold: 0.3, intensity: 1.5, }),
      new SMAAEffect(),
      new BrightnessContrastEffect({ contrast: 0.01, brightness: 0.03 }),
      new ToneMappingEffect({ mode: ToneMappingMode.REINHARD2_ADAPTIVE, middleGrey: 0.02, whitePoint: 1 }),
    );

    effectComposer.addPass(new RenderPassLib(scene, camera));
    effectComposer.addPass(effectPass);

    view3D.effectComposer = effectComposer;


  }, [setPostProcessing, type]);

  useEffect(() => {
    if (!setPostProcessing || type !== "alarm") return;

    const view3D = ref.current.view3D;

    const camera = view3D.camera.threeCamera;
    const renderer = view3D.renderer.threeRenderer;
    const scene = view3D.scene.root;

    const effectComposer = new EffectComposer(renderer);

    view3D.on("ready", () => {

      const ssr = new SSRPass({ renderer, scene, camera, selects: view3D.model.meshes, groundReflector: null });
      const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);

      effectComposer.addPass(new RenderPass(scene, camera));
      effectComposer.addPass(ssr);
      effectComposer.addPass(gammaCorrectionPass);

      view3D.effectComposer = effectComposer;

    });

  }, [setPostProcessing, type]);

  return (
    <>
      <div className={clsx("view3d-wrapper", "mb-2")}>
        <View3D
          ref={ref}
          src={src}
          yaw={330}
          pitch={8.14}
          initialZoom={initZoom}
          meshoptPath={"/egjs-view3d/lib/meshopt_decoder.js"}
        />
      </div>
    </>
  );
};

export default PostProcessing;
