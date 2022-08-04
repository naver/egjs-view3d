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
    <transition name="component-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<style>
.header * {
  margin-right: 0.75rem;
}
</style>
