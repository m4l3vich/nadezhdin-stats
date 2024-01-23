// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/eslint-module', ['@nuxtjs/google-fonts', {
    families: { Inter: { wght: [400, 500, 600, 700] } },
    subsets: ['cyrillic']
  }], ['nuxt-svgo', {
    defaultImport: 'component'
  }], 'nuxt-icon']
})
