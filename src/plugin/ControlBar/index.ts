/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import ControlBar, { ControlBarOptions } from "./ControlBar";
import ControlBarItem from "./ControlBarItem";
import AnimationProgressBar, { AnimationProgressBarOptions } from "./AnimationProgressBar";
import AnimationSelector, { AnimationSelectorOptions } from "./AnimationSelector";
import FullscreenButton, { FullscreenButtonOptions } from "./FullscreenButton";
import PlayButton, { PlayButtonOptions } from "./PlayButton";

export default ControlBar;

export {
  AnimationProgressBar,
  AnimationSelector,
  FullscreenButton,
  PlayButton
};

export type {
  ControlBarOptions,
  ControlBarItem,
  AnimationProgressBarOptions,
  AnimationSelectorOptions,
  FullscreenButtonOptions,
  PlayButtonOptions
};
