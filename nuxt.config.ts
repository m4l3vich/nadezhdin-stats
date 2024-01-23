// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxtjs/eslint-module', ['@nuxtjs/google-fonts', {
    families: { Inter: { wght: [400, 500, 600, 700] } },
    subsets: ['cyrillic']
  }], ['nuxt-svgo', {
    defaultImport: 'component'
  }], 'nuxt-icon', ['yandex-metrika-module-nuxt3', {
    id: 96222063
  }], '@vite-pwa/nuxt']
})
