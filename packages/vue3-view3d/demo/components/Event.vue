<template>
  <View3D
    src="https://naver.github.io/egjs-view3d/model/draco/alarm.glb"
    class="view3d-3by1"
    @ready="this.onReady"
  />
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    onReady: evt => {
      console.log("ready", evt);
    }
  }
})
</script>
<style>

</style>
