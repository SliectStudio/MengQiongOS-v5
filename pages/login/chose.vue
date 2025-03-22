<template>
  <div class="chose-container" :class="{ 'expanded': showDropdown }">
    <h2>选择用户</h2>
    <div class="users-grid">
      <div v-for="user in accounts" 
           :key="user.id" 
           class="user-card"
           @click="handleUserSelect(user)">
        <div class="avatar">
          <img v-if="user.avatar" :src="user.avatar" :alt="user.name">
          <span v-else>{{ user.name.charAt(0) }}</span>
        </div>
        <div class="user-info">
          <div class="name">{{ user.name }}</div>
          <div class="email">{{ user.email }}</div>
        </div>
        <Right theme="outline" size="25" class="right-icon" style="margin-right: 25px;"/>
      </div>
      <div class="user-card add-user" @click="toggleDropdown">
        <div class="add-content">
          <div class="icon-circle">
            <Plus theme="outline" size="25" class="add-icon"/>
          </div>
          <div class="add-text">添加用户</div>
          <div class="flex-spacer"></div>
          <Right theme="outline" size="25" class="right-icon" :class="{ 'rotated': showDropdown }"/>
        </div>
        <div v-show="showDropdown" class="dropdown-menu" @click.stop>
          <div class="dropdown-item" @click.stop="handleLocalAccount">
            <div class="icon-circle">
              <Avatar theme="outline" size="25"/>
            </div>
            <span>本地账户</span>
          </div>
          <div class="dropdown-item" @click.stop="handleSliectAccount">
            <div class="icon-circle">
              <LinkCloud theme="outline" size="25"/>
            </div>
            <span>Sliect ID 账户</span>
          </div>
          <div class="dropdown-item" @click.stop="handleNovaAccount">
            <div class="icon-circle">
              <StarOne theme="outline" size="25"/>
            </div>
            <span>Nova Star 账户</span>
          </div>
          <div class="hint-text" @click.stop>创建 Sliect ID 与 Nova Star 账户</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Avatar, LinkCloud, StarOne, Right } from '@/components/icons'
import { useRouter } from 'vue-router'

interface User {
  id: number
  name: string
  email: string
  avatar?: string
  password: string
  role: string
}

const router = useRouter()
const accounts = ref<User[]>([])
const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleLocalAccount = () => {
  router.push('/login/create')
}

const handleSliectAccount = () => {
  console.log('选择Sliect账户')
}

const handleNovaAccount = () => {
  console.log('选择Nova账户')
}

const handleUserSelect = (user: User) => {
  router.push({
    path: '/login/verify',
    query: { id: user.id }
  })
}

onMounted(async () => {
  try {
    if (window.electronAPI) {
      const data = await window.electronAPI.readAccounts()
      accounts.value = data.accounts || []
    } else {
      const accountsData = await import('@/data/accounts.json')
      accounts.value = accountsData.accounts || []
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
    accounts.value = []
  }
})
</script>

<style scoped>
.chose-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chose-container.expanded {
  transform: translateY(-120px);
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.users-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 500px;
  max-width: 90%;
}

.user-card {
  width: 400px;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 10px;
  background: rgba(160, 159, 159, 0.103);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: transform 0.2s;
}



.user-card:hover {
  transform: scale(1.02);
  background: var(--hover-color); /*使用悬浮背景色*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: var(--primary-color); /*/修改为主题色*/
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
  margin-left: 1rem;
  overflow: hidden;  /* 添加此行确保图片不会溢出圆形区域 */
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.name {
  color: var(--text-color);
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.email {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.add-user {
  position: relative;
  height: 50px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.2);
}

.add-content {
  display: flex;
  align-items: center;
  gap: 12px;  /* 控制图标和文字间距 */
  padding: 0 10px;  /* 修改padding以匹配user-card的padding */
  width: 100%;
  height: 100%;  /* 确保高度填满父容器 */
}

.add-content .icon-circle {
  margin-left: 10px;  /* 添加左边距以匹配user-card中的布局 */
}

.flex-spacer {
  flex: 1;
}

.icon-circle {
  width: 41px;
  height: 41px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* 防止图标被压缩 */
}

.add-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-left: 4px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 8px;
  background: rgba(30, 30, 30, 0.95);
  border-radius: 12px;
  padding: 8px 0;
  backdrop-filter: blur(10px);
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  visibility: hidden;
}

.dropdown-menu[style*="display: block"],
.dropdown-menu:not([style*="display: none"]) {
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: background-color 0.2s;
  gap: 12px;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.hint-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  padding: 12px 0 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 8px;
}

.right-icon {
  color: rgba(255, 255, 255, 0.5);
  margin-right: 16px;
  transition: transform 0.3s ease;
  width: 20px;
  height: 20px;
}

.add-user .right-icon {
  transform: rotate(90deg);
}

.add-user .right-icon.rotated {
  transform: rotate(-90deg);
}
</style>