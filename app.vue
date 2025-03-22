<template>
  <div>
    <NuxtPage />
    <KeyboardButton />
  </div>
</template>

<script setup lang="ts">
// 确保在客户端渲染
if (process.client) {
  useHead({
    title: 'MengQiongOS'
  })
}
</script>
