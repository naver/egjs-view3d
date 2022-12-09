/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/**
 * Interface of the Post-processing effects
 */
interface Effects {
  on(): void;
  off(): void;
  setOptions(val: unknown): void;
}

export default Effects;
