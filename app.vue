<script setup lang="ts">
import { useStatsStore } from '~/store/stats'

const state = useStatsStore()
state.updateStats()
</script>

<template>
  <main>
    <NuxtPwaManifest />

    <ErrorPage v-if="state.errored && state.regions === null" />
    <PreloaderPage v-else-if="state.regions === null" />
    <NuxtPage v-else />
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

button:focus {
  outline: none;
}
</style>
