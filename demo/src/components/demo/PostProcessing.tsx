import clsx from "clsx";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import View3D, { SSR, SAO, Bloom, View3DOptions, Gamma } from "../View3D";
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
import * as THREE from "three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";

type EffectType = "false" | "basic" | "three" | "postProcessing-library" | "hybrid";

interface Params extends Partial<View3DOptions> {
  effectType: EffectType
}

const PostProcessing = ({
  effectType,
  ...options
}: Params) => {

  const ref = useRef<View3D>(null);


  useLayoutEffect(() => {
    const view3D = ref.current.view3D;

    view3D.on("ready", () => {
      view3D.scene.fixedObjects.children[ 0 ].position.y = view3D.model.scene.position.y;
    });

  }, []);

  useEffect(() => {
    if (effectType !== "basic") return;

    const view3D = ref.current.view3D;

    view3D.loadEffects(
      new Bloom({ strength: 1, radius: 1, threshold: 0.3 }),
      // ({ canvasSize }) => new UnrealBloomPass(canvasSize, 1, 1.5, 0.3),
    );

    view3D.on("loadError", (e) => {
      console.log(e);
    })


  }, [ effectType ]);

  useEffect(() => {
    if (effectType !== "three") return;

    const view3D = ref.current.view3D;


    (async () => {
      view3D.loadEffects(
        ({ model, camera, renderer, canvasSize, scene }) => {
          console.log(model.meshes[ 0 ]);
          return new SSRPass({ renderer, scene, camera, selects: [ model.meshes[ 0 ] ], groundReflector: null });
        },

        // new ShaderPass(FXAAShader),
        new Bloom({ strength: 1 }),
      );


    })();
  }, [ effectType ])

  useEffect(() => {
    if (effectType !== "postProcessing-library") return;

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


      console.log(effectComposer, "111");
      return effectComposer;
    });


    // setTimeout(() => {
    //   view3D.load("/egjs-view3d/model/draco/alarm.glb");
    // },3000)

  }, [ effectType ]);

  return (
    <>
      <div className={clsx("view3d-wrapper", "mb-2")}>
        <View3D
          { ...options }
          ref={ ref }
          meshoptPath={ "/egjs-view3d/lib/meshopt_decoder.js" }
          translate={ "no" }
        />
      </div>
    </>
  );
};

export default PostProcessing;
