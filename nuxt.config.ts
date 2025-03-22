// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-electron'],

  electron: {
    build: [
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
      },
      {
        entry: 'electron/preload.ts',
        onstart(args) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
          // instead of restarting the entire Electron App.
          args.reload()
        },
      },
    ],
    // Ployfill the Electron and Node.js API for Renderer process.
    // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
    // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
    renderer: {},
  },

  // 全局样式配置
  css: [
    '@/assets/css/main.css'
  ],

  // #43
  ssr: false,

  router: {
    options: {
      hashMode: true
    }
  },

  app: {
    baseURL: './',
    buildAssetsDir: '/',
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },

  runtimeConfig: {
    app: {
      baseURL: './',
      buildAssetsDir: '/',
      pageTransition: {
        name: 'page',
        mode: 'out-in'
      }
    },
  },

  nitro: {
    runtimeConfig: {
      app: {
        baseURL: './',
      },
      preset: 'static',
    }
  },

  experimental: {
    payloadExtraction: false,
  },

  compatibilityDate: '2025-03-20',

  // 添加插件配置
  plugins: [
    '~/plugins/keyboard.ts'
  ],
})