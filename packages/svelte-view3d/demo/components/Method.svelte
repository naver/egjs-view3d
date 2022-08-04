<script lang="ts">
  import View3D from "../../src";

  let view3D: View3D;

  function onReady(evt) {
    evt.detail.target.animator.play(1);
  }

  function onClick() {
    view3D.animator.play(2);
  }
</script>

<View3D
  bind:this={view3D}
  src="https://naver.github.io/egjs-view3d/model/RobotExpressive.glb"
  class="view3d-3by1"
  on:ready={onReady}
  canvasClass="some-other-canvas"
/>
<button on:click={onClick}>Change Animation</button>
