<template>
  <div class="create-container">
    <div class="create-card">
      <h2>添加本地账户</h2>
      <div class="avatar-upload" @click="triggerFileInput">
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          accept="image/*"
          @change="handleFileChange"
        />
        <div class="avatar-preview">
          <img v-if="avatarPreview" :src="avatarPreview" alt="头像预览"/>
          <Avatar v-else theme="outline" size="40"/>
        </div>
        <span class="upload-text">点击上传头像</span>
      </div>
      
      <div class="form">
        <input
          v-model="userData.name"
          type="text"
          placeholder="用户名"
          @keyup.enter="focusNext('email')"
          ref="nameInput"
        />
        <input
          v-model="userData.email"
          type="email"
          placeholder="邮箱地址"
          @keyup.enter="focusNext('password')"
          ref="emailInput"
        />
        <input
          v-model="userData.password"
          type="password"
          placeholder="密码"
          ref="passwordInput"
        />
        <div class="agreement-checkbox">
          <input
            type="checkbox"
            id="agreement"
            v-model="userData.agreementAccepted"
          />
          <label for="agreement">
            我已详细阅读并同意
            <div class="agreement-links">
              <a href="#">Sliect ID 用户使用协议</a>
              <a href="#">Sliect Studio 隐私政策</a>
              <a href="#">Sliect Studio Portable Router 管理面板最终用户使用协议</a>
            </div>
          </label>
        </div>
        <button @click="handleCreate" :disabled="!isFormValid">创建账户</button>
        <div class="back-link" @click="router.push('/login/chose')">返回选择用户</div>
      </div>
    </div>

    <!-- 错误提示弹窗 -->
    <Transition name="fade">
      <div class="error-popup" v-if="showError" @click="showError = false">
        <div class="error-content" @click.stop>
          <div class="error-icon">!</div>
          <div class="error-message">{{ errorMessage }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Avatar } from '@/components/icons'

const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)
const nameInput = ref<HTMLInputElement | null>(null)
const emailInput = ref<HTMLInputElement | null>(null)
const passwordInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string>('')
const showError = ref(false)
const errorMessage = ref('')

const userData = ref({
  name: '',
  email: '',
  password: '',
  avatar: '',
  role: 'user',
  agreementAccepted: false
})

const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    minLength: 6,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
  }
}

const validationMessages = {
  name: {
    required: '请输入用户名',
    minLength: '用户名至少2个字符',
    maxLength: '用户名不能超过20个字符',
    pattern: '用户名只能包含字母、数字、中文、下划线和横杠'
  },
  email: {
    required: '请输入邮箱地址',
    pattern: '请输入有效的邮箱地址'
  },
  password: {
    required: '请输入密码', 
    minLength: '密码至少6个字符',
    pattern: '密码必须包含大小写字母和数字'
  }
}

const validate = (field: string, value: string) => {
  const rules = validationRules[field as keyof typeof validationRules]
  
  if(rules.required && !value) {
    showErrorMessage(validationMessages[field as keyof typeof validationMessages].required)
    return false
  }

  if(rules.minLength && value.length < rules.minLength) {
    showErrorMessage(validationMessages[field as keyof typeof validationMessages].minLength)
    return false
  }
  
  if(rules.maxLength && value.length > rules.maxLength) {
    showErrorMessage(validationMessages[field as keyof typeof validationMessages].maxLength) 
    return false
  }

  if(rules.pattern && !rules.pattern.test(value)) {
    showErrorMessage(validationMessages[field as keyof typeof validationMessages].pattern)
    return false
  }

  return true
}

const isFormValid = computed(() => {
  return userData.value.name && 
         userData.value.email && 
         userData.value.password && 
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.value.email) &&
         userData.value.agreementAccepted
})

const focusNext = (next: string) => {
  const refs: Record<string, any> = {
    email: emailInput,
    password: passwordInput
  }
  refs[next]?.value?.focus()
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
      userData.value.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const showErrorMessage = (message: string) => {
  errorMessage.value = message
  showError.value = true
  setTimeout(() => {
    showError.value = false
  }, 3000)
}

const handleCreate = async () => {
  if (!validate('name', userData.value.name) ||
      !validate('email', userData.value.email) ||
      !validate('password', userData.value.password)) {
    return
  }

  // 只有数据验证通过后,才继续处理保存逻辑
  try {
    let accounts
    if (window.electronAPI) {
      accounts = await window.electronAPI.readAccounts()
    } else {
      accounts = await import('@/data/accounts.json')
    }

    // 检查邮箱是否已存在
    const existingUser = accounts.accounts.find((user: any) => 
      user.email === userData.value.email
    )
    
    if (existingUser) {
      showErrorMessage('该邮箱已被注册')
      return
    }

    const newUser = {
      id: accounts.accounts.length + 1,
      ...userData.value
    }

    accounts.accounts.push(newUser)

    if (window.electronAPI) {
      await window.electronAPI.writeAccounts(accounts)
    }

    router.push('/login/chose')
  } catch (error) {
    console.error('创建用户失败:', error)
    showErrorMessage('创建用户失败，请重试')
  }
}
</script>

<style scoped>
.create-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-card {
  width: 400px;
  padding: 30px;
  background: rgba(160, 159, 159, 0.103);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

h2 {
  color: var(--text-color);
  margin: 0;
  text-align: center;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 20px;
  box-sizing: border-box;
}

input {
  padding: 12px 15px;
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
  padding: 12px 15px;
  background: var(--primary-color); /*修改为主题色*/
  border: none;
  border-radius: 8px;
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

button:disabled {
  background: var(--disabled-state); /*使用禁用状态色*/
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background: var(--hover-state); /*使用悬浮状态色*/
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

/* 复用现有的错误弹窗样式 */
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
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes modalOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

.agreement-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 10px;
}

.agreement-checkbox input[type="checkbox"] {
  margin-top: 3px;
  width: 16px;
  height: 16px;
}

.agreement-checkbox label {
  line-height: 1.4;
  flex: 1;
}

.agreement-links {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
}

.agreement-links a {
  color: var(--primary-color); /*/修改链接颜色为主题色*/
  text-decoration: none;
  display: block;
}

.agreement-links a:hover {
  text-decoration: underline;
}
</style>