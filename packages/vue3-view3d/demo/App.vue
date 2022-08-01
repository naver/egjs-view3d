<template>
  <div>
    <header class="header">
      <router-link to="/basic">Basic</router-link>
      <router-link to="/event">Event</router-link>
      <router-link to="/method">Method</router-link>
      <router-link to="/annotation">Annotation</router-link>
      <router-link to="/plugin">Plugin</router-link>
      <router-link to="/prop">PropChange</router-link>
    </header>
    <router-view></router-view>
  </div>
</template>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.header * {
  margin-right: 0.75rem;
}
</style>
