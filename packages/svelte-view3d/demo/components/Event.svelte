<script lang="ts">
  import View3D from "../../src";

  function onReady(evt) {
    console.log("ready", evt);
  }
</script>

<View3D
  src="https://naver.github.io/egjs-view3d/model/draco/alarm.glb"
  class="view3d-3by1"
  on:ready={onReady}
  canvasClass="some-other-canvas"
/>
