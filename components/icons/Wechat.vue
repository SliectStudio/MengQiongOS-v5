<template>
  <svg xmlns="http://www.w3.org/2000/svg" 
    :width="_width" 
    :height="_height"
    :spin="spin"
    :rtl="rtl"
    viewBox="0 0 48 48"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
    role="presentation"
    ref="host"
  >
    <g><path d="M36.997 21.711C36.843 13.008 29.74 6 21 6 12.163 6 5 13.163 5 22c0 4.17 1.595 7.968 4.209 10.815l-1.199 7.21 7.115-3.055c3.135 1.042 6.093 1.303 8.875.782" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M36.997 21.711C36.843 13.008 29.74 6 21 6 12.163 6 5 13.163 5 22c0 4.17 1.595 7.968 4.209 10.815l-1.199 7.21 7.115-3.055c3.135 1.042 6.093 1.303 8.875.782"/><path fill="#fff" d="M15.125 20.467a2.258 2.258 0 0 0 2.25-2.267 2.258 2.258 0 0 0-2.25-2.267 2.258 2.258 0 0 0-2.25 2.267 2.258 2.258 0 0 0 2.25 2.267Zm9 0a2.258 2.258 0 0 0 2.25-2.267 2.258 2.258 0 0 0-2.25-2.267 2.258 2.258 0 0 0-2.25 2.267 2.258 2.258 0 0 0 2.25 2.267Z"/><path d="M38.762 39.93A10.453 10.453 0 0 1 32.5 42C26.701 42 22 37.299 22 31.5S26.701 21 32.5 21 43 25.701 43 31.5c0 1.6-.358 3.116-.998 4.473" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M38.762 39.93A10.453 10.453 0 0 1 32.5 42C26.701 42 22 37.299 22 31.5S26.701 21 32.5 21 43 25.701 43 31.5c0 1.6-.358 3.116-.998 4.473"/><path d="M42.002 35.973 43 42l-4.238-2.07" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M42.002 35.973 43 42l-4.238-2.07"/><path fill="#fff" d="M35.688 30.8A1.694 1.694 0 0 1 34 29.1c0-.939.755-1.7 1.688-1.7.931 0 1.687.761 1.687 1.7s-.755 1.7-1.688 1.7Zm-6.75 0a1.694 1.694 0 0 1-1.688-1.7c0-.939.756-1.7 1.688-1.7.931 0 1.687.761 1.687 1.7s-.756 1.7-1.688 1.7Z"/></g>
  </svg>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class Props {
    width = prop<number | string>({
      type: [Number, String],
      required: false
    })
    
    height = prop<number | string>({
      type: [Number, String],
      required: false
    })
    
    stroke = prop<string>({
      type: String,
      required: false
    })
    
    fill = prop<string>({
      type: String,
      required: false
    })
    
    color = prop<string>({
      type: String,
      required: false
    })
    
    spin = prop<boolean>({
      type: Boolean,
      required: false
    })
    
    rtl = prop<boolean>({
      type: Boolean,
      required: false
    })
    

  // optional prop with default
  size = prop<number | string>({ default: '1em' })
}

export default class Wechat extends Vue.with(Props) {
    get _fill(): string | undefined {
        return this.fill || this.color
    }
    get _stroke(): string | undefined {
        return this.stroke || this.color
    }
    get _width(): string | number {
      return this.width || this.size
    }
    get _height(): string | number {
      return this.height || this.size
    }
  mounted():void {
        if (!this._fill) {
            (this.$refs.host as HTMLElement)?.querySelectorAll('[data-follow-fill]').forEach(item => {
            item.setAttribute('fill', item.getAttribute('data-follow-fill') || '')
            })
        }
        if (!this._stroke) {
            (this.$refs.host as HTMLElement)?.querySelectorAll('[data-follow-stroke]').forEach(item => {
            item.setAttribute('stroke', item.getAttribute('data-follow-stroke') || '')
            })
        }
    }
    updated():void {
        if (!this._fill) {
            (this.$refs.host as HTMLElement)?.querySelectorAll('[data-follow-fill]').forEach(item => {
            item.setAttribute('fill', item.getAttribute('data-follow-fill') || '')
            })
        }
        if (!this._stroke) {
            (this.$refs.host as HTMLElement)?.querySelectorAll('[data-follow-stroke]').forEach(item => {
            item.setAttribute('stroke', item.getAttribute('data-follow-stroke') || '')
            })
        }
    }
}
</script>

<style scoped>
svg[spin="true"] {animation: iconpark-spin 1s infinite linear;}
svg[spin="true"][rtl="true"] {animation: iconpark-spin-rtl 1s infinite linear;}
svg[rtl="true"] {
  transform: scaleX(-1);
}
@keyframes iconpark-spin {
  0% { -webkit-transform: rotate(0); transform: rotate(0);} 100% {-webkit-transform: rotate(360deg); transform: rotate(360deg);}
}
@keyframes iconpark-spin-rtl {
  0% {-webkit-transform: scaleX(-1) rotate(0); transform: scaleX(-1) rotate(0);} 100% {-webkit-transform: scaleX(-1) rotate(360deg); transform: scaleX(-1) rotate(360deg);}
}
</style>
