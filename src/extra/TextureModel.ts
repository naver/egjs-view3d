/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import Model from "~/core/Model";
import View3DError from "~/View3DError";
import * as ERR from "~/consts/error";

/**
 * Texture(image) model
 * @category Extra
 */
class TextureModel extends Model {
  private _texture: THREE.Texture;
  private _mesh: THREE.Mesh;

  /**
   * Texture that used for this model
   * @see https://threejs.org/docs/index.html#api/en/textures/Texture
   * @type THREE.Texture
   */
  public get texture() { return this._texture; }
  /**
   * Model's mesh object
   * @see https://threejs.org/docs/index.html#api/en/objects/Mesh
   * @type THREE.Mesh
   */
  public get mesh() { return this._mesh; }

  /**
   * Create new TextureModel
   * @param {object} options Options
   * @param {number} [options.width] Width of the model.
   * @param {number} [options.height] Height of the model.
   * @param {boolean} [options.billboard=false] When set to true, model will keep rotate to show its front face to camera. Only Y-axis rotation is considered.
   * @throws {View3DError} `CODES.PROVIDE_WIDTH_OR_HEIGHT` When both width and height are not given.
   */
  constructor({
    image,
    width,
    height,
    billboard = false,
  }: {
    image: THREE.Texture | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
    width?: number;
    height?: number;
    billboard?: boolean;
  }) {
    const texture = (image as THREE.Texture).isTexture
      ? image as THREE.Texture
      : new THREE.Texture(image as HTMLImageElement);
    const aspect = texture.image.width / texture.image.height;
    if (width == null && height == null) {
      throw new View3DError(ERR.MESSAGES.PROVIDE_WIDTH_OR_HEIGHT, ERR.CODES.PROVIDE_WIDTH_OR_HEIGHT);
    }
    if (width == null) {
      width = height! * aspect;
    } else if (height == null) {
      height = width! / aspect;
    }
    texture.encoding = THREE.sRGBEncoding;
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);

    super({ scenes: [mesh] });

    this._texture = texture;
    this._mesh = mesh;

    if (billboard) {
      const root = mesh;
      root.onBeforeRender = (renderer, scene, camera) => {
        const pos = root.getWorldPosition(new THREE.Vector3());
        const camPos = new THREE.Vector3().setFromMatrixPosition(camera.matrixWorld);

        root.lookAt(camPos.setY(pos.y));
        mesh.updateMatrix();
      };
    }
  }
}

export default TextureModel;
