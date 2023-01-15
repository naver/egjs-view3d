import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import View3D, { SSR, SAO, Bloom, DoF } from "../View3D";
import {
  BloomEffect,
  BrightnessContrastEffect,
  EffectComposer as EffectComposerLib,
  EffectPass,
  RenderPass as RenderPassLib,
  SMAAEffect,
  ToneMappingEffect,
  ToneMappingMode,
} from "postprocessing";


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
    if (!setPostProcessing || type !== "alarm") return;

    const view3D = ref.current.view3D;

    view3D.loadEffects(
      new SSR(),
      new DoF(),
      new Bloom({ radius: 0.5, threshold: 0.3, strength: 1 }),
    );

  }, [setPostProcessing, type]);

  useEffect(() => {
    if (!setPostProcessing || type !== "car") return;

    const view3D = ref.current.view3D;

    view3D.setCustomEffect((param) => {
      const { camera, renderer, canvasSize, scene, model } = param;
      const effectComposer = new EffectComposerLib(renderer);

      effectComposer.addPass(new RenderPassLib(scene, camera));
      effectComposer.addPass(new EffectPass(
          camera,
          new BloomEffect({ luminanceThreshold: 0.3, intensity: 1.5, }),
          new SMAAEffect(),
          new BrightnessContrastEffect({ contrast: 0.01, brightness: 0.03 }),
          new ToneMappingEffect({ mode: ToneMappingMode.REINHARD2_ADAPTIVE, middleGrey: 0.02, whitePoint: 1 }),
        )
      );

      return effectComposer;
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
