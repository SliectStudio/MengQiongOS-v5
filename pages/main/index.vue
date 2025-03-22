<template>
    <div class="main-container">
        <h1>MengQiongOS v5</h1>
        <!-- Add your main content here -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStorage } from '../../utils/storage'

const router = useRouter()
const isLoading = ref(false)

onMounted(() => {
  const { getAuth } = useStorage()
  const auth = getAuth()
  
  if (!auth || !auth.token || !auth.userId || auth.expires < Date.now()) {
    router.push('/login/chose')
    return
  }
  
  // 可以在这里添加token验证逻辑
  // ...
})
</script>

<style scoped>
.main-container {
    padding: 20px;
}
</style>