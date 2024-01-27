import { icons } from './icons.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Статистика Надеждина',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',

      link: [
        { rel: 'apple-touch-icon', href: 'apple-touch-icon.png' },
        { rel: 'apple-touch-icon', sizes: '57x57', href: '/apple-touch-icon-57x57.png' },
        { rel: 'apple-touch-icon', sizes: '72x72', href: '/apple-touch-icon-72x72.png' },
        { rel: 'apple-touch-icon', sizes: '76x76', href: '/apple-touch-icon-76x76.png' },
        { rel: 'apple-touch-icon', sizes: '114x114', href: '/apple-touch-icon-114x114.png' },
        { rel: 'apple-touch-icon', sizes: '120x120', href: '/apple-touch-icon-120x120.png' },
        { rel: 'apple-touch-icon', sizes: '144x144', href: '/apple-touch-icon-144x144.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/apple-touch-icon-152x152.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon-180x180.png' }
      ]
    }
  },

  modules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/google-fonts',
    'nuxt-svgo',
    'nuxt-icon',
    'yandex-metrika-module-nuxt3',
    '@vite-pwa/nuxt',
    '@pinia/nuxt'
  ],

  googleFonts: {
    families: { Inter: { wght: [400, 500, 600, 700] } },
    subsets: ['cyrillic']
  },

  svgo: {
    defaultImport: 'component'
  },

  yandexMetrika: {
    id: '96222063'
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Статистика Надеждина',
      short_name: 'Статистика',
      description: 'Статистика собранных/отсортированных подписей Бориса Надеждина по регионам',
      icons,
      screenshots: [{
        src: 'screenshots/desktop_light.jpg',
        sizes: '3024x1890',
        type: 'image/jpeg',
        form_factor: 'wide'
      }, {
        src: 'screenshots/desktop_dark.jpg',
        sizes: '3024x1890',
        type: 'image/jpeg',
        form_factor: 'wide'
      }, {
        src: 'screenshots/mobile_light.jpg',
        sizes: '1290x2796',
        type: 'image/jpeg',
        form_factor: 'narrow'
      }, {
        src: 'screenshots/mobile_dark.jpg',
        sizes: '1290x2796',
        type: 'image/jpeg',
        form_factor: 'narrow'
      }]
    }
  }
})
