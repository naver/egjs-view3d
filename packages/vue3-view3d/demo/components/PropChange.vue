<template>
  <div>
    <View3D
      ref="view3d"
      src="https://naver.github.io/egjs-view3d/model/draco/alarm.glb"
      :skybox="this.skybox"
      class="view3d-3by1"
    />
    <button @click="this.onClick">Change Skybox</button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      skybox: null
    }
  },
  methods: {
    onClick: function() {
      if (!this.skybox) {
        this.skybox = "https://naver.github.io/egjs-view3d/texture/venice_sunset_1k.hdr";
      } else {
        this.skybox = null;
      }
    }
  }
})
</script>
<style>

</style>
