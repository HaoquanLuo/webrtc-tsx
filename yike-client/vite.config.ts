import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// unocss
import Unocss from 'unocss/vite'
import presetUno from '@unocss/preset-uno'
import presetAttributify from '@unocss/preset-attributify'
import presetIcons from 'unocss/preset-icons'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'

// path resolve
function resolve(dir: string): string {
  return path.resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Unocss({
      presets: [
        presetAttributify(),
        presetUno(),
        presetIcons({
          extraProperties: {
            display: 'inline-block',
            'vertical-align': 'middle',
            margin: '5px',
          },
        }),
      ],
      transformers: [transformerAttributifyJsx()],
      rules: [
        [
          /**
           * match: [ 'w-half', 'w', index: 0, input: 'w-half', groups: undefined ]
           */
          /^(\w)-half$/,
          (match) => {
            switch (match[1]) {
              case 'w': {
                console.log('match', match)
                return {
                  width: '50%',
                }
              }
              case 'h': {
                return {
                  height: '50%',
                }
              }

              default:
                break
            }
          },
        ],
      ],
      shortcuts: {
        'screen-full':
          'absolute w-full h-full bg-black bg-op-30 top-0 left-0 z-99',
      },
    }),
    react(),
  ],
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
        target: 'http://localhost:9000',
        ws: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
  },
})
