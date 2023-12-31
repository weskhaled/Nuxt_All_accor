import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'
import { presetExtra } from 'unocss-preset-extra'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetScrollbar(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetExtra(),
    presetWebFonts({
      // provider: 'google',
      fonts: {
        // these will extend the default theme
        sans: [
          {
            // name: 'Figtree',
            // name: 'Montserrat',
            name: 'Plus Jakarta Sans',
            // name: 'DM Sans',
            // name: 'Work Sans',
            italic: true,
            weights: ['300', '400', '600', '700', '800'],
          },
        ],
        // custom ones
        script: [
          {
            name: 'Kaushan Script',
            italic: false,
            weights: ['400'],
          },
        ],
        mono: [
          {
            name: 'Space Grotesk',
            italic: false,
            weights: ['300', '400', '500'],
          },
        ],
        general: [
          {
            name: 'General Sans',
            italic: false,
            weights: ['300', '400', '500', '600', '700', '800'],
            provider: 'fontshare',
          },
        ],
        chillax: [
          {
            name: 'chillax',
            italic: false,
            weights: ['200', '300', '400', '600', '700'],
            provider: 'fontshare',
          },
        ],
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
