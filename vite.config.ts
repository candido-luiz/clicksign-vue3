import { fileURLToPath, URL } from 'node:url'

import { ConfigEnv, defineConfig  } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }: ConfigEnv) => {
  return {
    base: mode === 'development' ? "/" : "/clicksign-vue3/",
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'legacy',
          additionalData: `@import "@/assets/scss/global.scss";`,
        }
      }
    }
  }
})
