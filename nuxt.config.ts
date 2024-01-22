// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/eslint-module',
    ['@nuxtjs/google-fonts', {
      families: { Inter: ['400', '700', '800'] },
      subsets: ['cyrillic']
    }],
    ['nuxt-svgo', {
      defaultImport: 'component'
    }]
  ]
})
