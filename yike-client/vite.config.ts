import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// unocss
import Unocss from 'unocss/vite'

// path resolve
function resolve(dir: string): string {
  return path.resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      output: {
        format: 'es',
        dir: 'out',
        manualChunks: {
          antd: ['antd'],
        },
      },
    },
  },
  plugins: [Unocss(), react(), splitVendorChunkPlugin()],
  resolve: {
    alias: {
      '@': resolve('./src'),
      '~@': resolve('./src'),
      'simple-peer': 'simple-peer/simplepeer.min.js',
    },
  },
  server: {
    hmr: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
  },
})
