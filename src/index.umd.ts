/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import View3D from "./View3D";
import View3DError from "./View3DError";
import * as Core from "./core";
import * as Controls from "./controls";
import * as Loaders from "./loaders";
import * as Environments from "./environments";
import * as Extra from "./extra";
import * as Constants from "./consts/external";
import * as EASING from "./consts/easing";
import { CODES } from "./consts/error";
import { merge } from "./utils";

merge(View3D, Core);
merge(View3D, Environments);
merge(View3D, Controls);
merge(View3D, Loaders);
merge(View3D, Extra);
merge(View3D, Constants);
(View3D as any).View3DError = View3DError;
(View3D as any).ERROR_CODES = CODES;
(View3D as any).EASING = EASING;

export default View3D;
