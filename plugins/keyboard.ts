import { defineNuxtPlugin } from '#app'
import KeyboardButton from '~/components/KeyboardButton.vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('KeyboardButton', KeyboardButton)
})
