import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import vitePluginImp from 'vite-plugin-imp'

// unocss
import Unocss from 'unocss/vite'

// path resolve
function resolve(dir: string): string {
  return path.resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Unocss(), react(), vitePluginImp()],
  resolve: {
    alias: {
      '@': resolve('./src'),
      '~@': resolve('./src'),
      'simple-peer': 'simple-peer/simplepeer.min.js',
    },
  },
  server: {
    hmr: false,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9000',
        ws: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
  },
})
