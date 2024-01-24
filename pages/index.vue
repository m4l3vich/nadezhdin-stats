<script setup lang="ts">
type Regions = { name: string, count: number }[]
type FetchError = { failed: true, error: any }

const regions = ref<Regions | null>(null)
const updating = ref<boolean>(true)
const updateAttempt = ref<number>(0)
const errored = ref<boolean>(false)

async function update () {
  updating.value = true
  const { data, error } = await useFetch('/api/stats')
  updating.value = false

  if (error.value || (data.value as FetchError).failed) {
    errored.value = true
    // eslint-disable-next-line no-console
    console.error(error.value, data.value)
    updateAttempt.value++

    if (updateAttempt.value > 2) { return update() }
    return
  } else {
    errored.value = false
  }

  updateAttempt.value = 0
  regions.value = data.value as Regions
}

update()
</script>

<template>
  <ErrorScreen
    v-if="errored"
    :updating="updating"
    :attempt-num="updateAttempt"
    @update="update"
  />
  <PreloaderScreen v-else-if="regions === null" />
  <RussiaMap v-else :regions="regions" :updating="updating" @update="update" />
</template>

<style>

body {
  margin: 0;
  overflow-y: hidden;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  position: fixed;

  font-family: Inter, sans-serif;

  --blue: #3B66FF;
  --green: #00dc82;
  --red: rgba(223, 82, 82, 1);
  --red_translucent: rgba(255, 0, 0, 0.2);
}
</style>
