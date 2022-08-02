<script lang="ts">
  import View3D from "../../src";

  let skybox: string | null = null;

  function onClick() {
    if (!skybox) {
        skybox = "https://naver.github.io/egjs-view3d/texture/venice_sunset_1k.hdr";
      } else {
        skybox = null;
      }
  }
</script>

<View3D
  src="https://naver.github.io/egjs-view3d/model/draco/alarm.glb"
  class="view3d-3by1"
  skybox={skybox}
/>
<button on:click={onClick}>Change Skybox</button>
