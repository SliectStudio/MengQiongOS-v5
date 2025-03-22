<template>
  <div class="layout-container">
    <slot />
  </div>
</template>

<style>
.layout-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: var(--background-color);
}
</style>
