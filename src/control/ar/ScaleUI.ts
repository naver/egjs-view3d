/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import { toPowerOfTwo } from "../../utils";

/**
 * Options for {@link ScaleUI}
 * @interface
 * @property {number} [width=0.1] UI width, in meter.
 * @property {number} [padding=20] UI's padding value, in px.
 * @property {number} [offset=0.05] UI's Y-axis offset from model's bbox max y, in meter.
 * @property {number} [font="64px sans-serif"] UI's font. See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font CanvasRenderingContext2D#font}
 * @property {number} [color="white"] UI's font color. See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle CanvasRenderingContext2D#fillStyle}
 */
export interface ScaleUIOptions {
  width: number;
  padding: number;
  offset: number;
  font: CanvasRenderingContext2D["font"];
  color: CanvasRenderingContext2D["fillStyle"];
}

/**
 * UI element displaying model's scale percentage info when user chaning model's scale.
 */
class ScaleUI {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _mesh: THREE.Mesh;
  private _texture: THREE.CanvasTexture;
  private _font: CanvasRenderingContext2D["font"];
  private _color: CanvasRenderingContext2D["fillStyle"];
  private _padding: number;
  private _offset: number;
  private _height: number;

  /**
   * Scale UI's plane mesh
   * @readonly
   */
  public get mesh() { return this._mesh; }
  /**
   * Scale UI's height value
   * @readonly
   */
  public get height() { return this._height; }
  /**
   * Whether UI is visible or not.
   * @readonly
   */
  public get visible() { return this._mesh.visible; }

  /**
   * Create new instance of ScaleUI
   * @param {ScaleUIOptions} [options={}] Options
   */
  public constructor({
    width = 0.1,
    padding = 20,
    offset = 0.05,
    font = "64px sans-serif",
    color = "white"
  }: Partial<ScaleUIOptions> = {}) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    ctx.font = font;

    // Maximum canvas width should be equal to this
    const maxText = ctx.measureText("100%");

    // Following APIs won't work on IE, but it's WebXR so I think it's okay
    const maxWidth = maxText.actualBoundingBoxLeft + maxText.actualBoundingBoxRight;
    const maxHeight = maxText.actualBoundingBoxAscent + maxText.actualBoundingBoxDescent;
    const widthPowerOfTwo = toPowerOfTwo(maxWidth);

    canvas.width = widthPowerOfTwo;
    canvas.height = widthPowerOfTwo;

    // This considers increased amount by making width to power of two
    const planeWidth = width * (widthPowerOfTwo / maxWidth);

    this._ctx = ctx;
    this._canvas = canvas;
    this._height = planeWidth * maxHeight / maxWidth; // Text height inside plane
    this._texture = new THREE.CanvasTexture(canvas);

    // Plane is square
    const uiGeometry = new THREE.PlaneGeometry(planeWidth, planeWidth);
    const mesh = new THREE.Mesh(
      uiGeometry,
      new THREE.MeshBasicMaterial({
        map: this._texture,
        transparent: true,
        depthTest: false
      }),
    );

    this._mesh = mesh;
    this._font = font;
    this._color = color;
    this._padding = padding;
    this._offset = offset;

    this.hide();
  }

  public updatePosition(worldRotation: THREE.Quaternion, focus: THREE.Vector3, modelHeight: number) {
    const mesh = this._mesh;
    const offset = this._height / 2 + this._offset + modelHeight;
    const offsetVec = new THREE.Vector3(0, offset, 0)
      .applyQuaternion(worldRotation.clone().invert());

    // Update mesh
    mesh.position.copy(offsetVec);
    mesh.lookAt(focus);
  }

  public updateScale(scale: number) {
    const ctx = this._ctx;
    const canvas = this._canvas;
    const padding = this._padding;
    const scalePercentage = (scale * 100).toFixed(0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw round rect
    const textSize = ctx.measureText(`${scalePercentage}%`);
    const halfWidth = (textSize.actualBoundingBoxLeft + textSize.actualBoundingBoxRight) / 2;
    const halfHeight = (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) / 2;

    ctx.beginPath();

    ctx.moveTo(centerX - halfWidth, centerY - halfHeight - padding);
    ctx.lineTo(centerX + halfWidth, centerY - halfHeight - padding);
    ctx.quadraticCurveTo(centerX + halfWidth + padding, centerY - halfHeight - padding, centerX + halfWidth + padding, centerY - halfHeight);
    ctx.lineTo(centerX + halfWidth + padding, centerY + halfHeight);
    ctx.quadraticCurveTo(centerX + halfWidth + padding, centerY + halfHeight + padding, centerX + halfWidth, centerY + halfHeight + padding);
    ctx.lineTo(centerX - halfWidth, centerY + halfHeight + padding);
    ctx.quadraticCurveTo(centerX - halfWidth - padding, centerY + halfHeight + padding, centerX - halfWidth - padding, centerY + halfHeight);
    ctx.lineTo(centerX - halfWidth - padding, centerY - halfHeight);
    ctx.quadraticCurveTo(centerX - halfWidth - padding, centerY - halfHeight - padding, centerX - halfWidth, centerY - halfHeight - padding);

    ctx.closePath();

    ctx.lineWidth = 5;
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fill();
    ctx.stroke();

    // Draw text
    ctx.font = this._font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = this._color;
    ctx.fillStyle = this._color;

    ctx.fillText(`${scalePercentage}%`, centerX, centerY);

    this._texture.needsUpdate = true;

    this._mesh.scale.setScalar(1 / scale);
  }

  /**
   * Show UI
   */
  public show() {
    this._mesh.visible = true;
  }

  /**
   * Hide UI
   */
  public hide() {
    this._mesh.visible = false;
  }
}

export default ScaleUI;
