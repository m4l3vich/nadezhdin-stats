<script setup lang="ts">
import { onMounted, computed } from 'vue'
import Map from '~/public/map.svg'

const { regions } = defineProps<{
  regions: {
    name: string
    count: number
  }[]
}>()

const map = ref()
const totalCount = computed(
  () => regions.reduce((acc, e) => acc + e.count, 0)
)

const completeRegionsCount = computed(
  () => regions.filter(e => e.count > 2500).length
)

const quotaCount = computed(
  () => regions.filter(e => e.count <= 2500).reduce((acc, e) => acc + e.count, 0)
)

const hoverItem = ref<{ name: string, count: number | null}>()
const hoverTop = ref<number>(0)
const hoverLeft = ref<number>(0)

function mouseMoveDefault (e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  hoverItem.value = { name: target.dataset.title as string, count: -1 }
  hoverTop.value = e.offsetY + 16
  hoverLeft.value = e.offsetX
}

onMounted(() => {
  if (!map.value) { return }

  const allRegions = map.value.$el.querySelectorAll('[data-code]')
  allRegions.forEach((e: HTMLElement) => {
    e.setAttribute('style', 'fill: red !important')
    e.setAttribute('fill-opacity', '0.2')
    e.addEventListener('mousemove', mouseMoveDefault)
  })

  map.value.$el.addEventListener('mouseleave', () => {
    hoverItem.value = undefined
  })

  for (const region of regions) {
    const regionOnMap = map.value.$el.querySelector(
      `[data-title*="${region.name}" i]`
    )

    if (!regionOnMap) {
      // eslint-disable-next-line no-console
      console.warn('No match for region: ' + region.name)
      continue
    }

    const percent = region.count / 2500
    regionOnMap.removeAttribute('style')
    regionOnMap.setAttribute('fill-opacity', percent + 0.1)

    if (percent > 1) {
      regionOnMap.setAttribute('style', 'fill: #00dc82 !important')
    } else if (percent < 0.1) {
      regionOnMap.setAttribute('style', 'stroke: rgba(59, 102, 255, 0.3) !important')
    }

    regionOnMap.removeEventListener('mousemove', mouseMoveDefault)
    regionOnMap.addEventListener('mousemove', (e: MouseEvent) => {
      hoverItem.value = region
      hoverTop.value = e.offsetY + 16
      hoverLeft.value = e.offsetX
    })
  }
})
</script>

<template>
  <Map ref="map" class="map-svg" width="100%" />

  <div v-if="hoverItem" class="map-hover" :style="{ position: 'fixed', top: hoverTop + 'px', left: hoverLeft + 'px' }">
    <span v-if="hoverItem.count && hoverItem.count > 0">
      <b>{{ hoverItem.name }}</b><br>
      {{ hoverItem.count.toLocaleString() }} / 2 500
      ({{ ((hoverItem.count / 2500) * 100).toFixed(2) }}%)
    </span>
    <span v-else>
      <b>{{ hoverItem.name }}</b><br>
      {{ hoverItem.count === null ? 'Ждем данные' : 'Нет штаба' }}
    </span>
  </div>

  <div style="display: flex; gap: 24px; align-items: center; justify-content: center;">
    <ul class="map-legend">
      <li style="--marker: rgba(255, 0, 0, 0.2)">
        Нет штаба
      </li>
      <li style="--marker: #3B66FF">
        Сбор идет (меньше 2 500 подписей)
      </li>
      <li style="--marker: #00dc82">
        Сбор завершен (2 500+)
      </li>
    </ul>

    <p class="map-stats">
      <span>
        Всего подписей: <strong>{{ totalCount.toLocaleString() }}</strong> из 100 000
      </span>
      <span>
        2 500+ подписей собрано в <strong>{{ completeRegionsCount }}</strong> регионах
      </span>
      <span>
        Подписей по квотам (2 500 макс. с региона): <strong>{{ quotaCount.toLocaleString() }}</strong>
      </span>
    </p>
  </div>
</template>

<style lang="scss">
.map-svg {
  max-height: 75vh;
  user-select: none;
  cursor: default;
}

.map-svg [data-code] {
  fill: #3B66FF;
  transition: fill 0.2s;
}

.map-svg path {
  stroke: #FFFFFF;
  stroke-width: 1;
  stroke-linejoin: round;
}

.map-stats {
  font-family: sans-serif;
  font-size: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.map-legend {
  font-family: sans-serif;
  font-size: 24px;
  display: flex;
  flex-direction: column;

  li::marker {
    color: var(--marker);
    content: '■';
    margin: -24px 0;
    font-size: 42px;
  }
}

.map-hover {
  font-family: sans-serif;
  font-size: 16px;
  background: white;
  padding: 8px;
  pointer-events: none;

  b {
    font-weight: 700;
  }
}
</style>
