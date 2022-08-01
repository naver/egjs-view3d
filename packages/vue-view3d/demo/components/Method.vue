<template>
  <div>
    <View3D
      ref="view3d"
      src="https://naver.github.io/egjs-view3d/model/RobotExpressive.glb"
      class="view3d-3by1"
      @ready="this.onReady"
    />
    <button @click="this.onClick">Change Animation</button>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  methods: {
    onReady: evt => {
      evt.target.animator.play(1);
    },
    onClick: function() {
      this.$refs.view3d.animator.play(2);
    }
  }
})
</script>
<style>

</style>
