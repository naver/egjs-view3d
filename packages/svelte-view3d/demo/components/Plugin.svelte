<script lang="ts">
  import View3D, { LoadingBar, ControlBar } from "../../src";

  const plugins = [new LoadingBar(), new ControlBar()];
</script>

<View3D
  src="https://naver.github.io/egjs-view3d/model/RobotExpressive.glb"
  class="view3d-3by1"
  plugins={plugins}
/>
