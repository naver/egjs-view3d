import { withMethods } from "@egjs/view3d";

import View3D from "./View3D.svelte";

withMethods(View3D.prototype, "view3D");

export default View3D;

