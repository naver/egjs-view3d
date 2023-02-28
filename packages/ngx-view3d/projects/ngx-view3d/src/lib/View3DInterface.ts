import View3D, { withMethods } from "@egjs/view3d";

export default class View3DInterface {
  @withMethods protected _view3D!: View3D | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface View3DInterface extends View3D { }
