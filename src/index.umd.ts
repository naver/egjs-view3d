/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import View3D from "./View3D";
import View3DError from "./core/View3DError";
import * as Core from "./core";
import * as Controls from "./control";
import * as Loaders from "./loaders";
import * as Constants from "./const/external";
import { merge } from "./utils";

merge(View3D, Core);
merge(View3D, Controls);
merge(View3D, Loaders);
merge(View3D, Constants);
(View3D as any).View3DError = View3DError;

export default View3D;
