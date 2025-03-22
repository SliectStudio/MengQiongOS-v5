<template>
  <div class="home" ref="homeRef" @click="handleClick">
    <!--<h1>欢迎来到 MengQiongOS</h1>-->
    <div class="startup-animation" v-if="showStartup" :class="{ 'fade-out': isExiting }">
      <transition name="zoom-fade">
        <img v-if="showFirstHero" src="~/assets/images/firsthero.png" class="hero-image" alt="First Hero">
      </transition>
      <transition name="zoom-fade">
        <div v-if="showSecondStage" class="second-stage">
          <img src="~/assets/images/logo.svg" class="logo-image" alt="Logo">
          <div class="loading-section">
            <div class="loading-container">
              <img src="~/assets/images/loading.png" class="loading-image" alt="Loading">
            </div>
            <div class="loading-text">{{ currentTask }}</div>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div v-if="showFinalStage" class="final-stage">
          <div class="datetime">
            <div class="time">{{ currentTime }}</div>
            <div class="date">{{ currentDate }}</div>
          </div>
          <div class="power-status">
            {{ powerStatus }}
          </div>
          <div class="hint-text">
            轻触屏幕以进入 Portable Router 管理面板
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 状态管理
const homeRef = ref<HTMLElement | null>(null)
const showStartup = ref(true)
const showFirstHero = ref(true)
const showSecondStage = ref(false)
const showLoading = ref(false)
const showFinalStage = ref(false)
const currentTime = ref('')
const currentDate = ref('')
const powerStatus = ref('外接电源')
const currentTask = ref('')
const isExiting = ref(false)
const tasks = ref<Array<{ name: string, action: () => Promise<void> }>>([
  {
    name: '正在获取电池信息',
    action: async () => {
      try {
        const status = await window.electronAPI.getPowerStatus()
        if (status.type === 'AC') {
          powerStatus.value = '外接电源'
        } else {
          powerStatus.value = status.charging 
            ? `电池充电中 ${status.level}%`
            : `电池剩余 ${status.level}%`
        }

        // 设置定时更新
        setInterval(async () => {
          const newStatus = await window.electronAPI.getPowerStatus()
          if (newStatus.type === 'AC') {
            powerStatus.value = '外接电源'
          } else {
            powerStatus.value = newStatus.charging 
              ? `电池充电中 ${newStatus.level}%`
              : `电池剩余 ${newStatus.level}%`
          }
        }, 30000)
      } catch (error) {
        console.error('获取电源状态失败:', error)
        powerStatus.value = '外接电源'
      }
    }
  }
  // 未来可以在这里添加更多任务
])

// 更新时间日期
const updateDateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  currentDate.value = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const executeTasks = async () => {
  const startTime = Date.now()
  for (const task of tasks.value) {
    currentTask.value = task.name
    await task.action()
  }
  const timeSpent = Date.now() - startTime
  
  // 确保加载动画至少显示3秒
  if (timeSpent < 3000) {
    await new Promise(resolve => setTimeout(resolve, 3000 - timeSpent))
  }
  
  // 完成所有任务后，进入下一阶段
  showSecondStage.value = false
  setTimeout(() => {
    showFinalStage.value = true
    updateDateTime()
    setInterval(updateDateTime, 1000)
  }, 500)
}

const router = useRouter()

const handleClick = () => {
  if (showFinalStage.value && !isExiting.value) {
    isExiting.value = true
    setTimeout(() => {
      router.push('/login/chose')
    }, 800) // 调整为与全局过渡时间一致
  }
}

onMounted(() => {
  // 第一阶段：显示首个英雄图片
  setTimeout(() => {
    showFirstHero.value = false
    // 增加延迟到 500ms
    setTimeout(() => {
      showSecondStage.value = true
      showLoading.value = true
      executeTasks() // 开始执行任务
    }, 500)
  }, 1000)
})
</script>

<style scoped>
.home {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: var(--background-color);
}

.startup-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-85px); /* 整体向上移动80px */
  perspective: 1000px;
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.startup-animation.fade-out {
  opacity: 0;
}

.hero-image,
.logo-image {
  max-width: 50%;
  max-height: 50%;
  object-fit: contain;
  position: relative; /* 改为相对定位 */
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.loading-container {
  position: absolute;
  bottom: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-image {
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-fade-enter-active,
.zoom-fade-leave-active {
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);  /* 使用缓动函数并增加动画时长 */
}

.zoom-fade-enter-from {
  opacity: 0;
  transform: scale(0.85) translateZ(-200px);  /* 增加缩放和后退效果 */
}

.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(0.85) translateZ(-200px);  /* 增加缩放和后退效果 */
}

.zoom-fade-enter-to,
.zoom-fade-leave-from {
  opacity: 1;
  transform: scale(1) translateZ(0);
}

.final-stage {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.datetime {
  text-align: center;
  color: white;
}

.time {
  font-size: 4rem;
  font-weight: bold;
}

.date {
  font-size: 1.5rem;
  margin-top: 1rem;
}

.power-status {
  position: absolute;
  bottom: 120px;
  color: white;
  font-size: 1rem;
}

.hint-text {
  position: absolute;
  bottom: 80px;
  color: var(--primary-color); /*修改提示文本颜色为主题色*/
  font-size: 1rem;
  opacity: 0.9;
}

.second-stage {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 80px;
}

.loading-text {
  color: white;
  margin-top: 10px;
  font-size: 14px;
  opacity: 0.8;
}
</style>
