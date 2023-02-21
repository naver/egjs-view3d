/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import * as THREE from "three";
import View3DEffect from "./View3DEffect";
import { FullScreenQuad, Pass } from "three/examples/jsm/postprocessing/Pass";
import {
  AdditiveBlending,
  Color,
  LinearFilter, MeshBasicMaterial,
  RGBAFormat,
  ShaderMaterial,
  UniformsUtils,
  Vector2,
  Vector3,
  WebGLRenderTarget, WebGLRenderTargetOptions
} from "three";
import { LuminosityHighPassShader } from "three/examples/jsm/shaders/LuminosityHighPassShader";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";

/**
 * Options for the {@link Bloom}
 * @interface
 * @param {number} [strength=0.5] - The strength.
 * @param {number} [radius=0.5] - The size of blur radius.
 * @param {number} [threshold=0.9] - The luminance threshold. Raise this value to mask out darker elements in the scene. Range is [0, 1].
 */
export interface BloomOptions {
  strength: number;
  radius: number;
  threshold: number;
}

/**
 * The Bloom effect created based on the {@link https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html unreal bloom} post-processing of Three.js.
 */
class Bloom extends View3DEffect {

  private _bloomPass: BloomPass | null;

  private _options: {
    radius: number;
    threshold: number;
    strength: number;
  };

  constructor({ radius = 0.5, threshold = 0.5, strength = 0.5 }: Partial<BloomOptions> = {}) {
    super();

    this._bloomPass = null;
    this._options = {
      radius,
      threshold,
      strength
    };
  }

  public init(view3D: View3D) {
    const { width, height } = view3D.renderer.size;
    const { radius, threshold, strength } = this._options;
    const resolution = new THREE.Vector2(width * window.devicePixelRatio, height * window.devicePixelRatio);

    const bloomPass = new BloomPass(resolution, strength, radius, threshold);
    return this._bloomPass = bloomPass;
  }

  public getPass() {
    return this._bloomPass;
  }

  public remove() {
    this._bloomPass?.dispose();
  }
}

class BloomPass extends Pass {
  private _strength: number;
  private _radius: number;
  private _threshold: number;
  private _resolution: Vector2;
  private _clearColor: Color;
  private _renderTargetsHorizontal: WebGLRenderTarget[];
  private _renderTargetsVertical: WebGLRenderTarget[];
  private _nMips: number;
  private _renderTargetBright: WebGLRenderTarget;
  private _materialHighPassFilter: ShaderMaterial;
  private _separableBlurMaterials: any[];
  private _compositeMaterial: ShaderMaterial;
  private _bloomTintColors: Vector3[];
  private _copyMaterial: ShaderMaterial;
  private _oldClearColor: Color;
  private _oldClearAlpha: number;
  private _basic: MeshBasicMaterial;
  private _fsQuad: FullScreenQuad;

  private _resx: number;
  private _resy: number;
  private _highPassShader: typeof LuminosityHighPassShader;
  private _copyShader: typeof CopyShader;

  constructor(resolution: THREE.Vector2, strength: number, radius: number, threshold: number) {

    super();
    this._strength = strength;
    this._radius = radius;
    this._threshold = threshold;
    this._resolution = resolution;

    // create color only once here, reuse it later inside the render function
    this._clearColor = new Color(0, 0, 0);

    this._nMips = 5;
    this._resx = Math.round(this._resolution.x / 2);
    this._resy = Math.round(this._resolution.y / 2);

    this._renderTargetBright = this._setBrightTarget();

    const [ renderTargetsHorizontal, renderTargetsVertical ] = this._setBlurTarget();

    this._renderTargetsHorizontal = renderTargetsHorizontal;
    this._renderTargetsVertical = renderTargetsVertical;


    const highPassShader = this._highPassShader = this._setHighPassShader();

    this._materialHighPassFilter = this._setHighPassFilterMaterial(highPassShader);

    // Gaussian Blur Materials
    this._separableBlurMaterials = this._setGaussianBlurMaterial();

    // Composite material
    this._compositeMaterial = this._setCompositeMaterial();

    const copyShader = this._copyShader = this._setCopyShader();
    this._copyMaterial = this._setCopyMaterial(copyShader);

    this.enabled = true;
    this.needsSwap = false;

    this._oldClearColor = new Color();
    this._oldClearAlpha = 1;

    this._basic = new MeshBasicMaterial();

    this._fsQuad = new FullScreenQuad();

  }

  public dispose() {

    for (let i = 0; i < this._renderTargetsHorizontal.length; i++) {

      this._renderTargetsHorizontal[ i ].dispose();

    }

    for (let i = 0; i < this._renderTargetsVertical.length; i++) {

      this._renderTargetsVertical[ i ].dispose();

    }

    this._renderTargetBright.dispose();

  }

  public setSize(width, height) {

    let resx = Math.round(width / 2);
    let resy = Math.round(height / 2);

    this._renderTargetBright.setSize(resx, resy);

    for (let i = 0; i < this._nMips; i++) {

      this._renderTargetsHorizontal[ i ].setSize(resx, resy);
      this._renderTargetsVertical[ i ].setSize(resx, resy);

      this._separableBlurMaterials[ i ].uniforms[ "texSize" ].value = new Vector2(resx, resy);

      resx = Math.round(resx / 2);
      resy = Math.round(resy / 2);

    }

  }

  public render(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
    renderer.getClearColor(this._oldClearColor);
    this._oldClearAlpha = renderer.getClearAlpha();
    const oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;

    renderer.setClearColor(this._clearColor, 0);

    if (maskActive) renderer.state.buffers.stencil.setTest(false);

    // Render input to screen

    if (this.renderToScreen) {
      this._fsQuad.material = this._basic;
      this._basic.map = readBuffer.texture;

      renderer.setRenderTarget(null);
      renderer.clear();
      this._fsQuad.render(renderer);

    }

    // 1. Extract Bright Areas

    // this._materialHighPassFilter.uniforms[ "tDiffuse" ].value = this._threshold;
    // this._materialHighPassFilter.uniforms[ "luminosityThreshold" ].value = this._threshold;
    this._highPassShader.uniforms.tDiffuse.value = readBuffer.texture;
    this._highPassShader.uniforms.luminosityThreshold.value = this._threshold;
    this._fsQuad.material = this._materialHighPassFilter;

    renderer.setRenderTarget(this._renderTargetBright);
    renderer.clear();
    this._fsQuad.render(renderer);

    // 2. Blur All the mips progressively

    let inputRenderTarget = this._renderTargetBright;


    for (let i = 0; i < this._nMips; i++) {

      this._fsQuad.material = this._separableBlurMaterials[ i ];

      this._separableBlurMaterials[ i ].uniforms[ "colorTexture" ].value = inputRenderTarget.texture;
      this._separableBlurMaterials[ i ].uniforms[ "direction" ].value = new Vector2(1.0, 0.0);
      renderer.setRenderTarget(this._renderTargetsHorizontal[ i ]);
      renderer.clear();
      this._fsQuad.render(renderer);

      this._separableBlurMaterials[ i ].uniforms[ "colorTexture" ].value = this._renderTargetsHorizontal[ i ].texture;
      this._separableBlurMaterials[ i ].uniforms[ "direction" ].value = new Vector2(0.0, 1.0);
      renderer.setRenderTarget(this._renderTargetsVertical[ i ]);
      renderer.clear();
      this._fsQuad.render(renderer);

      inputRenderTarget = this._renderTargetsVertical[ i ];

    }

    // Composite All the mips

    this._fsQuad.material = this._compositeMaterial;
    this._compositeMaterial.uniforms[ "bloomStrength" ].value = this._strength;
    this._compositeMaterial.uniforms[ "bloomRadius" ].value = this._radius;
    this._compositeMaterial.uniforms[ "bloomTintColors" ].value = this._bloomTintColors;
    renderer.setRenderTarget(this._renderTargetsHorizontal[ 0 ]);
    renderer.clear();
    this._fsQuad.render(renderer);

    // Blend it additively over the input texture

    this._fsQuad.material = this._copyMaterial;
    this._copyMaterial.uniforms[ "tDiffuse" ].value = this._renderTargetsHorizontal[ 0 ].texture;

    if (maskActive) renderer.state.buffers.stencil.setTest(true);

    if (this.renderToScreen) {

      renderer.setRenderTarget(null);
      this._fsQuad.render(renderer);

    } else {

      renderer.setRenderTarget(readBuffer);
      this._fsQuad.render(renderer);
    }

    // Restore renderer settings

    renderer.setClearColor(this._oldClearColor, this._oldClearAlpha);
    renderer.autoClear = oldAutoClear;
  }

  private _getSeperableBlurMaterial(kernelRadius) {

    return new ShaderMaterial({

      defines: {
        "KERNEL_RADIUS": kernelRadius,
        "SIGMA": kernelRadius
      },

      uniforms: {
        "colorTexture": { value: null },
        "texSize": { value: new Vector2(0.5, 0.5) },
        "direction": { value: new Vector2(0.5, 0.5) }
      },

      vertexShader:
        `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,

      fragmentShader:
        `#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 texSize;
				uniform vec2 direction;

				float gaussianPdf(in float x, in float sigma) {
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
				}
				void main() {
					vec2 invSize = 1.0 / texSize;
					float fSigma = float(SIGMA);
					float weightSum = gaussianPdf(0.0, fSigma);
					vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;
					float alphaSum = 0.0;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianPdf(x, fSigma);
						vec2 uvOffset = direction * invSize * x;
						vec4 sample1 = texture2D( colorTexture, vUv + uvOffset).rgba;
						vec4 sample2 = texture2D( colorTexture, vUv - uvOffset).rgba;
						diffuseSum += (sample1.rgb + sample2.rgb) * w;
						alphaSum += (sample1.a + sample2.a) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, alphaSum/weightSum);
				}`
    });

  }

  private _setCompositeMaterial() {
    const nMips = this._nMips;

    const compositeMaterial = new ShaderMaterial({

      defines: {
        "NUM_MIPS": nMips
      },

      uniforms: {
        "blurTexture1": { value: null },
        "blurTexture2": { value: null },
        "blurTexture3": { value: null },
        "blurTexture4": { value: null },
        "blurTexture5": { value: null },
        "dirtTexture": { value: null },
        "bloomStrength": { value: 1.0 },
        "bloomFactors": { value: null },
        "bloomTintColors": { value: null },
        "bloomRadius": { value: 0.0 }
      },

      vertexShader:
        `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,

      fragmentShader:
        `varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform sampler2D dirtTexture;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`
    });

    compositeMaterial.uniforms[ "blurTexture1" ].value = this._renderTargetsVertical[ 0 ].texture;
    compositeMaterial.uniforms[ "blurTexture2" ].value = this._renderTargetsVertical[ 1 ].texture;
    compositeMaterial.uniforms[ "blurTexture3" ].value = this._renderTargetsVertical[ 2 ].texture;
    compositeMaterial.uniforms[ "blurTexture4" ].value = this._renderTargetsVertical[ 3 ].texture;
    compositeMaterial.uniforms[ "blurTexture5" ].value = this._renderTargetsVertical[ 4 ].texture;
    compositeMaterial.uniforms[ "bloomStrength" ].value = this._strength;
    compositeMaterial.uniforms[ "bloomRadius" ].value = 0.1;
    compositeMaterial.needsUpdate = true;

    const bloomFactors = [ 1.0, 0.8, 0.6, 0.4, 0.2 ];
    compositeMaterial.uniforms[ "bloomFactors" ].value = bloomFactors;
    this._bloomTintColors = [ new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1) ];
    compositeMaterial.uniforms[ "bloomTintColors" ].value = this._bloomTintColors;

    return compositeMaterial;
  }

  private _setBlurTarget() {
    let resx = this._resx;
    let resy = this._resy;

    const renderTargetsHorizontal: WebGLRenderTarget[] = [];
    const renderTargetsVertical: WebGLRenderTarget[] = [];

    for (let i = 0; i < this._nMips; i++) {

      const renderTargetHorizonal = new WebGLRenderTarget(resx, resy, {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBAFormat
      });
      const renderTargetVertical = new WebGLRenderTarget(resx, resy, {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBAFormat
      });

      renderTargetHorizonal.texture.name = "UnrealBloomPass.h" + i;
      renderTargetVertical.texture.name = "UnrealBloomPass.v" + i;

      renderTargetHorizonal.texture.generateMipmaps = false;
      renderTargetVertical.texture.generateMipmaps = false;

      renderTargetsHorizontal.push(renderTargetHorizonal);
      renderTargetsVertical.push(renderTargetVertical);

      resx = Math.round(resx / 2);
      resy = Math.round(resy / 2);

    }

    return [ renderTargetsHorizontal, renderTargetsVertical ];
  }

  private _setGaussianBlurMaterial() {
    let resx = this._resx;
    let resy = this._resy;


    const kernelSizeArray = [ 3, 5, 7, 9, 11 ];

    const separableBlurMaterials: THREE.ShaderMaterial[] = [];

    for (let i = 0; i < this._nMips; i++) {

      separableBlurMaterials.push(this._getSeperableBlurMaterial(kernelSizeArray[ i ]));

      separableBlurMaterials[ i ].uniforms[ "texSize" ].value = new Vector2(resx, resy);

      resx = Math.round(resx / 2);

      resy = Math.round(resy / 2);

    }

    return separableBlurMaterials;
  }

  private _setCopyShader() {


    const copyShader: typeof CopyShader = {
      ...CopyShader,
      uniforms: UniformsUtils.clone(CopyShader.uniforms)
    };

    copyShader.uniforms[ "opacity" ].value = 1.0;

    return copyShader;

  }

  private _setCopyMaterial(copyShader) {
    const materialCopy = new ShaderMaterial({
      uniforms: copyShader.uniforms,
      vertexShader: copyShader.vertexShader,
      fragmentShader: copyShader.fragmentShader,
      blending: AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      transparent: true
    });

    return materialCopy;
  }

  private _setHighPassShader() {

    const highPassShader: typeof LuminosityHighPassShader = {
      ...LuminosityHighPassShader,
      uniforms: UniformsUtils.clone(LuminosityHighPassShader.uniforms),
    };


    highPassShader.uniforms[ "luminosityThreshold" ].value = this._threshold;
    highPassShader.uniforms[ "smoothWidth" ].value = 0.01;

    return highPassShader;
  }

  private _setHighPassFilterMaterial(highPassShader) {

    return new ShaderMaterial({
      uniforms: highPassShader.uniforms,
      vertexShader: highPassShader.vertexShader,
      fragmentShader: highPassShader.fragmentShader,
      defines: {}
    });
  }

  private _setBrightTarget() {
    const resX = this._resx;
    const resY = this._resy;

    const renderTargetBright = new WebGLRenderTarget(resX, resY, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat
    });
    renderTargetBright.texture.name = "UnrealBloomPass.bright";
    renderTargetBright.texture.generateMipmaps = false;

    return renderTargetBright;

  }


}

export default Bloom;
