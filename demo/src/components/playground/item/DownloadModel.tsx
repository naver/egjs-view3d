import React from "react";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import Swal from "sweetalert2";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ReactTooltip from "react-tooltip";

import Collapse from "../Collapse";
import { Context } from "../context";
import { clamp } from "../../../../../src/utils";
import { ANNOTATION_EXTRA, TEXTURE_LOD_EXTRA } from "../../../../../src/const/internal";

import HelpIcon from "@site/static/icon/help.svg";
import DownloadIcon from "@site/static/icon/file_download_black.svg";

export default () => {
  const { state, dispatch } = React.useContext(Context);

  const view3D = state.view3D;
  const isLoading = state.isLoading;

  if (!view3D) return <></>;

  return <Collapse title="Download 3D Model">
    <div className="is-flex is-flex-direction-row is-align-items-center">
      <input id="model-webp" className="checkbox mr-2" type="checkbox" defaultChecked={true} disabled={isLoading}></input>
      <span className="my-0 menu-label">Include WebP Textures</span>
      <span className="icon is-small ml-1" style={{ verticalAlign: "top" }} data-for="download-tip" data-tip="WebP images are smaller than jpeg/png images, but have lesser browser coverage. png/jpeg images will be used as fallback."><HelpIcon style={{ fill: "#7a7a7a" }} /></span>
    </div>
    <div className="is-flex is-flex-direction-row is-align-items-center">
      <input id="model-tlod" className="checkbox mr-2" type="checkbox" defaultChecked={true} disabled={isLoading}></input>
      <span className="my-0 menu-label">Include Multiple Levels of Textures</span>
      <span className="icon is-small ml-1" style={{ verticalAlign: "top" }} data-for="download-tip" data-tip="Include multiple levels(sizes) of textures. Low-res textures will be loaded first, and will be replaced with highres textures after they're loaded."><HelpIcon style={{ fill: "#7a7a7a" }} /></span>
    </div>
    <div className="is-flex is-flex-direction-row is-align-items-center">
      <input id="model-annotations" className="checkbox mr-2" type="checkbox" defaultChecked={true} disabled={isLoading}></input>
      <span className="my-0 menu-label">Include Annotations</span>
    </div>
    <div className="mt-2">
      <span className="menu-label my-0 mr-2">Minimum Texture Size</span>
      <input id="model-tlod-0" className="input is-small" type="number" defaultValue={256} min={1} disabled={isLoading}></input>
    </div>
    <div className="mt-2">
      <span className="menu-label my-0 mr-2">Maximum Texture Size</span>
      <input id="model-tlod-1" className="input is-small" type="number" defaultValue={8192} min={1} disabled={isLoading}></input>
    </div>
    <button className="button is-small mt-2" disabled={state.isLoading} onClick={() => downloadModel(state, dispatch)}>
      <DownloadIcon className="icon mr-2" />
      <span>Download 3D Model (.zip)</span>
    </button>
    <ReactTooltip id="download-tip" effect="solid" place="right" />
  </Collapse>;
};

const downloadModel = async (state, dispatch) => {
  const view3D = state.view3D;

  if (!view3D) return;

  const includeWebP = (document.querySelector("#model-webp") as HTMLInputElement).checked;
  const includeTextureLOD = (document.querySelector("#model-tlod") as HTMLInputElement).checked;
  const includeAnnotations = (document.querySelector("#model-annotations") as HTMLInputElement).checked;
  const minimumTextureSize = parseFloat((document.querySelector("#model-tlod-0") as HTMLInputElement).value);
  const maximumTextureSize = parseFloat((document.querySelector("#model-tlod-1") as HTMLInputElement).value);

  dispatch({
    type: "set_loading",
    val: true
  });

  try {
    const origModel = view3D.model!;

    const materials = origModel.meshes.reduce((mats, mesh) => {
      if (Array.isArray(mesh.material)) {
        return [...mats, ...mesh.material];
      } else {
        return [...mats, mesh.material];
      }
    }, [] as THREE.Material[]);
    const textures = new Map<string, THREE.Texture>();

    materials.forEach(mat => {
      for (const key in mat) {
        if (mat[key] && key.toLowerCase().endsWith("map") && (mat[key] as THREE.Texture).isTexture) {
          const texture = mat[key] as THREE.Texture;
          texture.image.src = texture.uuid;

          textures.set(texture.uuid, texture);
        }
      }
    });

    new GLTFExporter().parse(origModel.scene, async data => {
      const gltf = data as {
        images?: Array<{
          mimeType: string;
          uri: string;
          [key: string]: any;
        }>;
        textures?: Array<{
          source: number;
          [key: string]: any;
        }>;
        extensionsUsed?: string[];
        [key: string]: any;
      };

      if (includeAnnotations) {
        if (!gltf.extras) gltf.extras = {};

        gltf.extras[ANNOTATION_EXTRA] = view3D.annotation.toJSON();
      }

      const nameGuessRegex = /(\w+)\.\w+$/i;
      const regexRes = nameGuessRegex.exec(origModel.src);
      const modelName = (!regexRes || !regexRes[1])
        ? "model"
        : regexRes[1];

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      const zip = new JSZip();

      if (!gltf.images) {
        gltf.images = [];
      }
      if (!gltf.textures) {
        gltf.textures = [];
      }

      const origImages = [...gltf.images];
      const gltfTextures = [...gltf.textures];

      const webpExtension = "EXT_texture_webp";

      if (!gltf.extensionsUsed) {
        gltf.extensionsUsed = [];
      }

      gltfTextures.forEach(texture => {
        if (!texture.extensions) {
          texture.extensions = {};
        }
      });

      if (includeWebP) {
        if (!gltf.extensionsUsed.includes(webpExtension)) {
          gltf.extensionsUsed.push(webpExtension);
        }

        gltfTextures.forEach(texture => {
          const origImgSource = texture.source;

          // eslint-disable-next-line @typescript-eslint/dot-notation
          texture.extensions[webpExtension] = {
            source: origImgSource + origImages.length
          };
        });

        origImages.map((gltfImage, idx) => {
          const imgFileName = `${modelName}${idx}`;

          // Add webp version of textures
          gltf.images!.push({
            mimeType: "image/webp",
            uri: `${imgFileName}.webp`
          });
        });
      }

      const toImageFiles = origImages.map(async (gltfImage, idx) => {
        const imageURI = gltfImage.uri.split("/");
        const texture = gltfTextures.find(tex => tex.source === idx)!;
        const threeTexture = textures.get(imageURI[imageURI.length - 1])!;

        const mimeType = gltfImage.mimeType ?? "image/png";
        const type = mimeType.split("/")[1];
        const imgFileName = `${modelName}${idx}`;
        const { image } = threeTexture;

        const origTexSize = clamp(image.width, minimumTextureSize, maximumTextureSize);

        if (includeTextureLOD && origTexSize > minimumTextureSize) {
          const textureLODLevels: Array<{ original: string; size: number; webp?: string }> = [];
          const pushLODLevel = (fileName: string, size: number) => {
            const imageSourceIndex = gltf.images!.length;
            const lodTextureIndex = gltf.textures!.length;

            const imageData = {
              mimeType,
              uri: `${fileName}.${type}`
            };
            const textureData = {
              sampler: texture.sampler,
              source: imageSourceIndex,
              extensions: {}
            };
            const level: any = {
              size,
              index: lodTextureIndex
            };

            gltf.images!.push(imageData);

            if (includeWebP) {
              const webpSourceIndex = gltf.images!.length;

              gltf.images!.push({
                mimeType: "image/webp",
                uri: `${fileName}.webp`
              });

              textureData.extensions[webpExtension] = {
                source: webpSourceIndex
              };
            }

            gltf.textures!.push(textureData);
            textureLODLevels.push(level);
          };

          // Save minimum image
          drawTextureImage(threeTexture, canvas, ctx, minimumTextureSize, minimumTextureSize);
          await saveImage(zip, canvas, mimeType, includeWebP, imgFileName, type);

          const commonMaxTexSize = 2048;
          if (origTexSize > commonMaxTexSize) {
            // Save common MAX_TEXTURE_SIZE image
            drawTextureImage(threeTexture, canvas, ctx, commonMaxTexSize, commonMaxTexSize);
            await saveImage(zip, canvas, mimeType, includeWebP, `${imgFileName}_${commonMaxTexSize}`, type);
            pushLODLevel(`${imgFileName}_${commonMaxTexSize}`, commonMaxTexSize);
          }

          // Save original(maximum) image
          if (origTexSize > minimumTextureSize) {
            drawTextureImage(threeTexture, canvas, ctx, origTexSize, origTexSize);
            await saveImage(zip, canvas, mimeType, includeWebP, `${imgFileName}_${origTexSize}`, type);
            pushLODLevel(`${imgFileName}_${origTexSize}`, origTexSize);
          }

          // Use smallest image
          gltfImage.uri = `${imgFileName}.${type}`;

          if (!texture.extras) texture.extras = {};
          texture.extras[TEXTURE_LOD_EXTRA] = {
            levels: textureLODLevels
          };
        } else {
          drawTextureImage(threeTexture, canvas, ctx, origTexSize, origTexSize);
          await saveImage(zip, canvas, mimeType, includeWebP, imgFileName, type);

          gltfImage.uri = `${imgFileName}.${type}`;
        }
      });

      await Promise.all(toImageFiles);

      await Promise.all(gltf.buffers.map(async (buffer, idx) => {
        const name = gltf.buffers.length > 1 ? `${modelName}-${idx}.bin` : `${modelName}.bin`;
        const buf = await fetch(buffer.uri).then(res => res.arrayBuffer());

        zip.file(name, buf);
        buffer.uri = name;
      }));

      zip.file(`${modelName}.gltf`, JSON.stringify(gltf, null, 2));

      const zipContent = await zip.generateAsync({ type: "blob" });
      saveAs(zipContent, `${modelName}.zip`);
    }, { binary: false, animations: origModel.animations, includeCustomExtensions: true, embedImages: false });
  } catch (err) {
    void Swal.fire({
      title: "Error!",
      text: err.message,
      icon: "error"
    });
  } finally {
    dispatch({
      type: "set_loading",
      val: false
    });
  }
};

const drawTextureImage = (texture: THREE.Texture, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const { image } = texture;

  canvas.width = width;
  canvas.height = height;

  const widthScale = width / image.width;
  const heightScale = height / image.height;

  if (texture.flipY) {
    ctx.translate(0, canvas.height);
    ctx.scale(widthScale, -heightScale);
  } else {
    ctx.scale(widthScale, heightScale);
  }

  // Most of the codes are from GLTFExporter of THREE.js
  // https://github.com/mrdoob/three.js/blob/master/examples/jsm/exporters/GLTFExporter.js
  if ((typeof HTMLImageElement !== "undefined" && image instanceof HTMLImageElement) ||
    (typeof HTMLCanvasElement !== "undefined" && image instanceof HTMLCanvasElement) ||
    // @ts-ignore
    (typeof OffscreenCanvas !== "undefined" && image instanceof OffscreenCanvas) ||
    (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap)) {
    ctx.drawImage(image, 0, 0, image.width, image.height);
  } else {
    const imgData = new Uint8ClampedArray(image.height * image.width * 4);

    for (let i = 0; i < imgData.length; i += 4) {
      imgData[i + 0] = image.data[i + 0];
      imgData[i + 1] = image.data[i + 1];
      imgData[i + 2] = image.data[i + 2];
      imgData[i + 3] = image.data[i + 3];
    }

    ctx.putImageData(new ImageData(imgData, image.width, image.height), 0, 0);
  }
};

const saveImage = (zip: JSZip, canvas: HTMLCanvasElement, mimeType: string, includeWebP: boolean, imgFileName: string, type: string) => {
  const saveOrigImage = new Promise<void>(resolve => {
    canvas.toBlob(blob => {
      zip.file(`${imgFileName}.${type}`, blob!);
      resolve();
    }, mimeType);
  });

  const tasks = [saveOrigImage];

  if (includeWebP) {
    const saveWebpImage = new Promise<void>(resolve => {
      canvas.toBlob(blob => {
        zip.file(`${imgFileName}.webp`, blob!);
        resolve();
      }, "image/webp");
    });

    tasks.push(saveWebpImage);
  }

  return Promise.all(tasks);
};
