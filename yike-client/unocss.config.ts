import { defineConfig, presetMini } from 'unocss'
import presetUno from '@unocss/preset-uno'
import presetAttributify from '@unocss/preset-attributify'
import presetIcons from 'unocss/preset-icons'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'

export default defineConfig({
  presets: [
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
        margin: '5px',
      },
    }),
    presetMini({
      dark: 'class',
    }),
    presetUno(),
    presetAttributify(),
  ],
  transformers: [transformerAttributifyJsx()],
  rules: [
    [
      /**
       * match: [ 'w-half', 'w', index: 0, input: 'w-half', groups: undefined ]
       */
      /^([wh])-half$/,
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
    'screen-full': 'absolute w-full h-full bg-black bg-op-30 top-0 left-0 z-99',
  },
})
