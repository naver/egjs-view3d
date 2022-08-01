<template>
  <View3D
    src="https://naver.github.io/egjs-view3d/model/RobotExpressive.glb"
    class="view3d-3by1"
    :plugins="this.plugins"
  />
</template>
<script lang="ts">
import Vue from "vue";
import { ControlBar, LoadingBar } from "../../src";

export default Vue.extend({
  data() {
    return {
      plugins: [new LoadingBar(), new ControlBar()]
    }
  }
})
</script>
<style>

</style>
