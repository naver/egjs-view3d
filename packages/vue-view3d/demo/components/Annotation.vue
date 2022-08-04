<template>
  <View3D
    ref="view3d"
    src="https://naver.github.io/egjs-view3d/model/draco/payphone.glb"
    class="view3d-3by1"
  >
    <div class="view3d-annotation-wrapper">
      <div class="view3d-annotation default" data-position="0.13 0.5 -0.05" data-focus="-90 0 30"></div>
      <div class="view3d-annotation default" data-position="-0.22 0.5 0.05" data-focus="90 0 30" data-duration="500"></div>
      <div class="view3d-annotation default" data-position="-0.05 0.4 0.18" data-focus="0 20 35" data-duration="0"></div>
    </div>
  </View3D>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
})
</script>
<style>

</style>
