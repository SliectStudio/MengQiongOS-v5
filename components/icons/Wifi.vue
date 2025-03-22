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
    <g><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M4 18.965a29.355 29.355 0 0 1 1.817-1.586C17.037 8.374 33.382 8.903 44 18.965"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M38 25.799c-7.732-7.732-20.268-7.732-28 0m22 6.515c-4.418-4.419-11.582-4.419-16 0"/><path fill="#fff" d="M24 40a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clip-rule="evenodd" fill-rule="evenodd"/></g>
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

export default class Wifi extends Vue.with(Props) {
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
