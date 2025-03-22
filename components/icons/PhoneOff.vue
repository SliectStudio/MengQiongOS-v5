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
    <g><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fff" d="M19.444 21.5c-.427-1.067-.57-1.8-.57-1.8l2.358-4.713a2 2 0 0 0-.04-1.865l-2.447-4.407a2 2 0 0 0-1.749-1.03h-5.072c-2.584 0-4.45 2.403-3.623 4.851 1.211 3.59 3.204 8.595 6.046 12.964m12.33 3.412c1.227.521 2.097.688 2.097.688l4.713-2.356a2 2 0 0 1 1.866.04l4.42 2.458A2 2 0 0 1 40.8 31.49v5.073c0 2.584-2.404 4.449-4.852 3.623-3.747-1.265-9.035-3.381-13.533-6.424M40 8 8 40"/></g>
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

export default class PhoneOff extends Vue.with(Props) {
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
