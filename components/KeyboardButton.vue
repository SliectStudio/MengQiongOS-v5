<template>
  <div v-show="visible" class="keyboard-button" @mousedown.prevent @click="showKeyboard">
    <Keyboard theme="outline" :size="30" stroke="#fff"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Keyboard } from './icons'

const visible = ref(false)
let currentInput: HTMLInputElement | null = null

const onFocus = (e: FocusEvent) => {
  console.log('Focus event:', e.target)
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    visible.value = true
    currentInput = e.target
    console.log('Keyboard button shown')
  }
}

const onBlur = (e: FocusEvent) => {
  setTimeout(() => {
    if (document.activeElement !== currentInput) {
      visible.value = false
      currentInput = null
    }
  }, 300)
}

const showKeyboard = async () => {
  try {
    console.log('Keyboard button clicked')
    if (window.electronAPI) {
      await window.electronAPI.showKeyboard()
      console.log('Keyboard show command sent')
      if (currentInput) {
        setTimeout(() => {
          currentInput?.focus()
          console.log('Input refocused')
        }, 500) // 增加延迟时间
      }
    } else {
      console.error('electronAPI not available')
    }
  } catch (err) {
    console.error('Error showing keyboard:', err)
  }
}

onMounted(() => {
  document.addEventListener('focusin', onFocus)
  document.addEventListener('focusout', onBlur)
})

onUnmounted(() => {
  document.removeEventListener('focusin', onFocus)
  document.removeEventListener('focusout', onBlur)
  currentInput = null
})
</script>

<style scoped>
.keyboard-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 45px;
  height: 45px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 0.3s;
  z-index: 9999;
}

.keyboard-button:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}
</style>
