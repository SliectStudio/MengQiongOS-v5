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
    <g><path stroke-linejoin="round" stroke-width="4" stroke="#fff" d="M38 8H10a2 2 0 0 0-2 2v28a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z"/><path stroke-linejoin="round" stroke-width="4" stroke="#fff" d="M30 18H18v12h12V18Z"/><path d="M14.91 2v6-6Z" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M14.91 2v6"/><path d="M14.91 40v6-6Z" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M14.91 40v6"/><path d="M24 2v6-6Z" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M24 2v6"/><path d="M24 40v6-6Z" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M24 40v6"/><path d="M33.09 2v6-6Z" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M33.09 2v6"/><path d="M33.09 40v6-6Z" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M33.09 40v6"/><path d="M2 14.91h6-6Z" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M2 14.91h6"/><path d="M40 14.91h6-6Z" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M40 14.91h6"/><path d="M2 24h6-6Z" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M2 24h6"/><path d="M40 24h6-6Z" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M40 24h6"/><path d="M2 33.09h6-6Z" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M2 33.09h6"/><path d="M40 33.09h6-6Z" clip-rule="evenodd"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M40 33.09h6"/></g>
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

export default class Cpu extends Vue.with(Props) {
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
