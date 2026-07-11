<template>
  <div class="layout-wrapper">
    <AppHeader />

    <main class="main-content">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
</script>

<style>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
  background: transparent;
}

.header.scrolled {
  background: rgba(10, 20, 30, 0.95);
}

</style>
