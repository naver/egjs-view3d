/*
 * Copyright (c) 2015 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/**
 * Current context of the loading item
 * @interface
 * @property {string} src Source URL of the loading item
 * @property {number} loaded Loaded byte
 * @property {number} total Content length of the item
 * @property {boolean} lengthComputable Whether the item has the Content-Length header
 * @property {boolean} initialized Whether the item is loaded least one byte
 * @internal
 */
export interface LoadingItem {
  src: string;
  loaded: number;
  total: number;
  lengthComputable: boolean;
  initialized: boolean;
}
