<template>
  <div class="verify-container">
    <div class="verify-card">
      <div class="user-info">
        <div class="avatar">
          <img v-if="currentUser?.avatar" :src="currentUser.avatar" :alt="currentUser?.name">
          <span v-else>{{ currentUser?.name?.charAt(0) }}</span>
        </div>
        <h2>{{ currentUser?.name }}</h2>
        <div class="email">{{ currentUser?.email }}</div>
      </div>
      <div class="form">
        <input 
          v-if="!hasValidToken"
          type="password" 
          v-model="password" 
          placeholder="请输入密码"
          @keyup.enter="handleVerify"
        />
        <button @click="hasValidToken ? handleLogin() : handleVerify()">登入</button>
        <div class="back-link" @click="router.push('/login/chose')">返回选择用户</div>
      </div>
    </div>
    <!-- 添加错误提示弹窗 -->
    <Transition name="fade">
      <div class="error-popup" v-if="showError" @click="showError = false">
        <div class="error-content" @click.stop>
          <div class="error-icon">!</div>
          <div class="error-message">密码错误</div>
          <div class="error-hint">请重新输入</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStorage } from '../../utils/storage'

interface User {
  id: number
  name: string
  email: string
  avatar?: string
  password: string
  role: string
}

const router = useRouter()
const route = useRoute()
const password = ref('')
const currentUser = ref<User | null>(null)
const showError = ref(false)
const hasValidToken = ref(false)

const handleVerify = async () => {
  try {
    let userData
    if (window.electronAPI) {
      userData = await window.electronAPI.readAccounts()
    } else {
      const accountsData = await import('@/data/accounts.json')
      userData = accountsData
    }
    
    const userId = route.query.id
    const user = userData.accounts.find((acc: User) => acc.id.toString() === userId)
    
    if (user && user.password === password.value) {
      const token = btoa(`${userId}-${Date.now()}`)
      const { setAuth } = useStorage()
      setAuth({
        userId: userId as string,
        token,
        expires: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30天过期
      })
      router.push('/main')
    } else {
      showError.value = true
      password.value = ''
      setTimeout(() => {
        showError.value = false
      }, 1500)
    }
  } catch (error) {
    console.error('验证失败:', error)
    showError.value = true
  }
}

const handleLogin = async () => {
  try {
    if (currentUser.value) {
      const { setAuth } = useStorage()
      // 生成新token
      const token = btoa(`${currentUser.value.id}-${Date.now()}`)
      
      setAuth({
        userId: currentUser.value.id.toString(),
        token, 
        expires: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30天过期
      })

      router.push('/main')
    }
  } catch (error) {
    console.error('登录失败:', error)
    showError.value = true 
  }
}

const checkToken = async (userId: string) => {
  try {
    // 从storage获取auth信息,包含token
    const { getAuth } = useStorage()
    const auth = getAuth()
    
    if (!auth || !auth.token) return false

    // 验证token是否匹配当前用户
    if (auth.userId !== userId) return false

    // 检查是否过期  
    if (auth.expires < Date.now()) {
      const { clearAuth } = useStorage() 
      clearAuth()
      return false
    }

    return true
  } catch (error) {
    console.error('Token验证失败:', error)
    return false
  }
}

onMounted(async () => {
  try {
    let userData
    if (window.electronAPI) {
      userData = await window.electronAPI.readAccounts()
    } else {
      const accountsData = await import('@/data/accounts.json')
      userData = accountsData
    }
    const userId = route.query.id
    currentUser.value = userData.accounts.find((acc: User) => acc.id.toString() === userId) || null
    
    // 检查token是否有效
    if(currentUser.value) {
      hasValidToken.value = await checkToken(currentUser.value.id.toString())
    }

  } catch (error) {
    console.error('加载用户数据失败:', error)
  }
})
</script>

<style scoped>
.verify-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.verify-card {
  width: 400px;
  padding: 30px;
  background: rgba(160, 159, 159, 0.103);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  animation: fadeIn 0.3s ease-out;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #6200ea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h2 {
  color: var(--text-color);
  margin: 0;
  font-size: 1.5rem;
}

.email {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 20px;  /* 添加水平内边距 */
  box-sizing: border-box;
}

input {
  box-sizing: border-box;  /* 确保padding不会影响总宽度 */
  padding: 12px 15px;  /* 调整内边距 */
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: var(--text-color);
  font-size: 1rem;
  transition: background-color 0.2s;
}

input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

button {
  width: 100%;
  box-sizing: border-box;  /* 确保padding不会影响总宽度 */
  padding: 12px 15px;  /* 调整内边距与输入框一致 */
  background: #6200ea;
  border: none;
  border-radius: 8px;
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

button:hover {
  background: #7722FF;
  transform: translateY(-1px);
}

.back-link {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.2s;
}

.back-link:hover {
  color: white;
}

.error-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.error-content {
  background: rgba(255, 59, 48, 0.95);
  padding: 20px 40px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.error-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.error-message {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.error-hint {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* 动画效果 */
.fade-enter-active {
  animation: modalIn 0.3s ease-out forwards;
}

.fade-leave-active {
  animation: modalOut 0.3s ease-in forwards;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modalOut {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
}
</style>
