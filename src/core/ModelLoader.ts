/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import { View3DOptions } from "../View3D";
import { MODEL_FORMAT, MODEL_MIME } from "../const/external";
import * as BROWSER from "../const/browser";
import * as ERROR from "../const/error";
import { ValueOf } from "../type/internal";
import GLTFLoader from "../loaders/GLTFLoader";
import DracoLoader from "../loaders/DracoLoader";

import View3DError from "./View3DError";

class ModelLoader {
  public async load(url: string, format: View3DOptions["format"]) {
    const fileFormat = format === "auto"
      ? await this._detectFileFormat(url)
      : format as string;

    const loader = this._createLoaderByFormat(fileFormat, url, format as string);

    return await loader.load(url);
  }

  private _createLoaderByFormat(format: string | null, url: string, givenFormat: string) {
    if (format === MODEL_FORMAT.GLTF || format === MODEL_FORMAT.GLB) {
      return new GLTFLoader();
    } else if (format === MODEL_FORMAT.DRC) {
      return new DracoLoader();
    }

    // File format not found
    const expectedFormat = givenFormat === "auto"
      ? this._getFileExtension(url)
      : givenFormat;
    throw new View3DError(ERROR.MESSAGES.FORMAT_NOT_SUPPORTED(expectedFormat), ERROR.CODES.FORMAT_NOT_SUPPORTED);
  }

  private async _detectFileFormat(url: string): Promise<ValueOf<typeof MODEL_FORMAT> | null> {
    const formatByName = this._detectFileFormatByName(url);
    if (formatByName) {
      return formatByName;
    }

    const formatByMIME = await this._detectFileFormatByMIME(url);
    if (formatByMIME) {
      return formatByMIME;
    }

    // Not found
    return null;
  }

  private _detectFileFormatByName(url: string): ValueOf<typeof MODEL_FORMAT> | null {
    const format = this._getFileExtension(url).toUpperCase();

    if (format in MODEL_FORMAT) {
      return MODEL_FORMAT[format];
    }

    return null;
  }

  private async _detectFileFormatByMIME(url: string): Promise<ValueOf<typeof MODEL_FORMAT> | null> {
    const fetchMIME = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      fetchMIME.addEventListener(BROWSER.EVENTS.LOAD, () => {
        const mimeType = fetchMIME.getResponseHeader("Content-Type");

        if (mimeType && mimeType in MODEL_MIME) {
          return resolve(MODEL_MIME[mimeType]);
        }

        resolve(null);
      });

      fetchMIME.addEventListener(BROWSER.EVENTS.ERROR, err => {
        reject(err);
      });

      fetchMIME.open("HEAD", url);
      fetchMIME.send();
    });
  }

  private _getFileExtension(url: string): string {
    return url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2);
  }
}

export default ModelLoader;
