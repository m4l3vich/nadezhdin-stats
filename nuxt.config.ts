import { icons } from './icons.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Статистика Надеждина',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1'
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
      short_name: 'Статистика Надеждина',
      description: 'Статистика подписей Бориса Надеждина по регионам',
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
