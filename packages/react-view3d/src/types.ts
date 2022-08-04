/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import {
  View3DEvents
} from "@egjs/view3d";

export type View3DEventProps = {
  [key in keyof View3DEvents as `on${Capitalize<string & key>}`]: (evt: View3DEvents[key]) => any;
};

export type View3DProps = {
  tag: keyof JSX.IntrinsicElements;
  canvasClass: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, keyof View3DEventProps> & View3DEventProps;
