import Swal from "sweetalert2";

import { PlaygroundAction } from "./context";
import View3D, { GLTFLoader } from "../../../../packages/view3d/src";

export const onFileChange = async (view3D: View3D, dispatch: (action: PlaygroundAction) => null, fileMap: Map<string, any>) => {
  dispatch({
    type: "set_loading",
    val: true
  });

  try {
    const files = Array.from(fileMap) as Array<[string, File]>;
    const loader = new GLTFLoader(view3D);
    const model = await loader.loadFromFiles(files.map(([name, file]) => file));

    (view3D as any)._src = model.src;

    view3D.display(model);
    view3D.autoPlayer.disable();

    dispatch({
      type: "set_initialized",
      val: true
    });
    dispatch({
      type: "set_loading",
      val: false
    });
    dispatch({
      type: "set_orig_model",
      val: model
    });
  } catch (err) {
    void Swal.fire({
      title: "Error!",
      text: err.message,
      icon: "error"
    });
    dispatch({
      type: "set_loading",
      val: false
    });
  }
};

export const onEnvmapChange = async (view3D: View3D, dispatch: (action: PlaygroundAction) => null, url: string) => {
  try {
    const wasSkyboxEnabled = (document.querySelector("#enable-skybox") as HTMLInputElement).checked;

    dispatch({
      type: "set_loading",
      val: true
    });

    if (url) {
      await view3D.scene.setSkybox(url);
      (view3D as any)._skybox = url;
    } else {
      view3D.skybox = null;
    }

    if (!wasSkyboxEnabled || !url) {
      view3D.scene.root.background = null;
    }
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
    URL.revokeObjectURL(url);
  }
};
