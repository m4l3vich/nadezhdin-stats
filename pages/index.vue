<script setup lang="ts">
type Regions = { name: string, count: number }[]

const regions = ref<Regions>()
const updating = ref<boolean>(true)
const errored = ref<boolean>(false)

async function update () {
  updating.value = true
  const { data, error } = await useFetch('/api/stats')
  updating.value = false

  if (error.value) {
    errored.value = true
    // eslint-disable-next-line no-console
    console.error(error.value)
    return
  } else {
    errored.value = false
  }

  regions.value = data.value as Regions
}

update()
</script>

<template>
  <ErrorScreen v-if="errored" @update="update" />
  <PreloaderScreen v-else-if="!regions" />
  <RussiaMap v-else :regions="regions" :updating="updating" @update="update" />
</template>

<style>
body {
  margin: 0;
  overflow-y: hidden;

  font-family: Inter, sans-serif;

  --blue: #3B66FF;
  --green: #00dc82;
  --red: rgba(223, 82, 82, 1);
  --red_translucent: rgba(255, 0, 0, 0.2);
}
</style>
