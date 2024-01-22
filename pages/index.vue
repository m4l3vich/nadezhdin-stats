<script setup lang="ts">
const { data } = await useFetch('/api/stats')
</script>

<template>
  <Suspense>
    <RussiaMap :regions="(data as any)" />
  </Suspense>
</template>
