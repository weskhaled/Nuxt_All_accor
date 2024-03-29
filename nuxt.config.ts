import process from 'node:process'
import { vitePluginForArco } from '@arco-plugins/vite-vue'
import { appDescription } from './constants/index'

// import { createResolver } from 'nuxt/kit'
import { pwa } from './config/pwa'

// const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
    '@nuxt/devtools',
  ],

  runtimeConfig: {
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    public: {
      BASE_URL: process.env.BASE_URL,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      API_ACCOR_MAPS_URL: process.env.API_ACCOR_MAPS_URL,
      API_ACCOR_URL: process.env.API_ACCOR_URL,
      API_ACCOR_API_KEY: process.env.API_ACCOR_API_KEY,
      DATABASE_URL: process.env.DATABASE_URL,
    },
  },

  vue: {
    defineModel: true,
    propsDestructure: true,
  },

  supabase: {
    redirectOptions: {
      login: '/auth',
      callback: '/auth/confirm',
      exclude: ['/auth/confirm', '/', '/search'],
    },
  },
  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/styles/main.less',
  ],

  colorMode: {
    classSuffix: '',
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true,
          },
        },
      },
    },

    // prerender: {
    //   crawlLinks: false,
    //   routes: ['/', '/auth', '/calendar'],
    //   ignore: ['/search'],
    // },
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },

  pwa,

  devtools: {
    enabled: true,
  },

  vite: {
    plugins: [
      // https://github.com/arco-design/arco-plugins/blob/main/packages/plugin-vite-vue/README.md
      vitePluginForArco({
        style: true,
        modifyVars: {
          'arcoblue-6': '#00aaff',
        },
      }),
    ],
    optimizeDeps: {
      include: [
        '@arco-design/web-vue',
        '@googlemaps/markerclusterer',
        'fast-deep-equal',
      ],
    },
  },

  devServer: {
    port: 3333,
    https: false,
  },

  build: {
    transpile: ['@arco-design/web-vue', '@googlemaps/js-api-loader', '@googlemaps/markerclusterer'],
  },
})
