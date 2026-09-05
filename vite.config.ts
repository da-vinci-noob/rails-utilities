import path from 'node:path'
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import vue from '@vitejs/plugin-vue'
import FullReload from 'vite-plugin-full-reload'

const aliases = {
  '/@/': path.resolve(import.meta.dirname, './app/frontend') // Replace 'src' with your actual source directory
}

export default defineConfig({
  plugins: [
    RubyPlugin(),
    FullReload(['config/routes.rb', 'app/views/**/*']),
    vue()
  ],
  resolve: {
    alias: aliases
  },
  build: {
    rollupOptions: {
      output: {
        // Split vendor code so utility chunks stay small.
        // rolldown (Vite 8) requires the function form.
        manualChunks(id) {
          if (id.includes('/app/frontend/components/ui/')) return 'ui'
          if (!id.includes('/node_modules/')) return undefined
          if (/\/node_modules\/(vue|vue-router|@vue)\//.test(id)) return 'vendor-vue'
          return 'vendor'
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
