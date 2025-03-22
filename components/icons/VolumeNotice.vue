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
    <g><path stroke-linejoin="round" stroke-width="4" stroke="#fff" d="M24 6v36c-7 0-12.201-9.16-12.201-9.16H6a2 2 0 0 1-2-2V17.01a2 2 0 0 1 2-2h5.799S17 6 24 6Z"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M32 15h0a11.91 11.91 0 0 1 1.684 1.859A12.07 12.07 0 0 1 36 24c0 2.654-.846 5.107-2.278 7.09A11.936 11.936 0 0 1 32 33"/><path stroke-linecap="round" stroke-width="4" stroke="#fff" d="M34.236 41.186C40.084 37.696 44 31.305 44 24c0-7.192-3.796-13.496-9.493-17.02"/></g>
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

export default class VolumeNotice extends Vue.with(Props) {
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
