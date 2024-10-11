import path from 'node:path'
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import vue from '@vitejs/plugin-vue'
import FullReload from 'vite-plugin-full-reload'

const aliases = {
  '/@/': path.resolve(__dirname, './app/frontend') // Replace 'src' with your actual source directory
}

export default defineConfig({
  plugins: [
    RubyPlugin(),
    FullReload(['config/routes.rb', 'app/views/**/*']),
    vue()
  ],
  resolve: {
    alias: aliases
  }
})
