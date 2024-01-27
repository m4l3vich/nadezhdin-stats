<script setup lang="ts">
import { useStatsStore } from '~/store/stats'

const state = useStatsStore()
state.updateStats()

const themeColor = ref('#000000')

if (window && window.matchMedia) {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  themeColor.value = media.matches ? '#000000' : '#ffffff'
  media.addEventListener('change', () => {
    themeColor.value = media.matches ? '#000000' : '#ffffff'
  })
}

useHead({
  meta: [{ name: 'theme-color', content: themeColor }]
})

useSeoMeta({
  title: 'Статистика Надеждина',
  ogTitle: 'Статистика Надеждина',
  description: 'Статистика собранных/отсортированных подписей Бориса Надеждина по регионам',
  ogDescription: 'Статистика собранных/отсортированных подписей Бориса Надеждина по регионам'
})
</script>

<template>
  <main>
    <NuxtPwaManifest />

    <ErrorPage v-if="state.errored && state.regions === null" />
    <PreloaderPage v-else-if="state.regions === null" />

    <template v-else>
      <NuxtPage />
      <AppNavigation />
    </template>
  </main>
</template>

<style lang="scss">
body {
  margin: 0;
  overflow-y: hidden;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  position: fixed;

  font-family: Inter, sans-serif;
  background: var(--background);

  --blue: #3B66FF;
  --green: #00dc82;
  --red: rgba(223, 82, 82, 1);
  --red_translucent: rgba(255, 0, 0, 0.2);
  --text: black;
  --background: white;
  --modal_bg: #cdddee;

  @media screen and (prefers-color-scheme: dark) {
    --background: black;
    --modal_bg: #35393d;

    --blue: #7291ff;
    --green: #07d07c;
    --text: white;
    --red_translucent: rgba(255, 108, 108, 0.4)
  }
}

main {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow-y: hidden;

  display: flex;
  flex-direction: column;
}

button:focus {
  outline: none;
}
</style>
