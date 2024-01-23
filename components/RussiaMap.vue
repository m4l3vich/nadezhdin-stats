<script setup lang="ts">
import { onMounted } from 'vue'
import Map from '~/public/map.svg'

const { regions } = defineProps<{
  updating: boolean,
  regions: {
    name: string
    count: number
  }[]
}>()

const emit = defineEmits<{(e: 'update'): void}>()

const map = ref()

const hoverItem = ref<{ name: string, count: number | null}>()
const hoverTop = ref<number>(0)
const hoverLeft = ref<number>(0)

function mouseMoveDefault (e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  hoverItem.value = { name: target.dataset.title as string, count: -1 }
  hoverTop.value = e.offsetY + 16
  hoverLeft.value = e.offsetX
}

function renderMap () {
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
}

onMounted(() => renderMap())
</script>

<template>
  <section class="map">
    <Map
      ref="map"
      v-svg-pan-zoom
      class="map__svg"
      width="100%"
      height="100%"
    />

    <a class="map__author" href="https://m4l3vich.ru/" target="_blank">
      made with 🖤 by m4l3vich
    </a>

    <div
      v-if="hoverItem"
      class="map__hover"
      :style="{ top: hoverTop + 'px', left: hoverLeft + 'px' }"
    >
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

    <div class="map__legend">
      <ul>
        <li>
          <span class="map__legend-marker map__legend-marker_red" />
          Нет штаба
        </li>
        <li>
          <span class="map__legend-marker map__legend-marker_blue" />
          Меньше 2 500 подписей
        </li>
        <li>
          <span class="map__legend-marker map__legend-marker_green" />
          Больше 2 500 подписей
        </li>
      </ul>
    </div>

    <MapStats
      :updating="updating"
      :regions="regions"
      @update="emit('update')"
    />
  </section>
</template>

<style lang="scss">
.map {
  height: 100vh;

  &__svg {
    user-select: none;
    cursor: default;

    [data-code] {
      fill: var(--blue);
      transition: fill 0.2s;
    }

    path {
      stroke: #FFFFFF;
      stroke-width: 1;
      stroke-linejoin: round;
    }
  }

  &__container {
    width: 100%;
    height: 100vh;

    // some hack
    .svg-pan-zoom__default {
      height: 100%;
    }
  }

  &__hover {
    position: fixed;
    font-size: 16px;
    background: white;
    padding: 8px;
    pointer-events: none;

    b {
      font-weight: 700;
    }
  }

  &__author {
    position: absolute;
    bottom: 24px;
    left: 24px;

    font-size: 12px;
    appearance: none;
    color: black;
    opacity: 0.5;
    text-align: center;
    display: block;
  }

  &__legend {
    position: absolute;
    top: 24px;
    left: 24px;

    @media screen and (max-width: 640px) {
      flex-direction: column;
      bottom: unset;
    }

    ul {
      margin: 0;
      display: flex;
      list-style: none;
      gap: 12px;
      padding: 0;
      font-size: 18px;

      @media screen and (max-width: 640px) {
        flex-direction: column;
        font-size: 12px;
      }
    }

    li {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  &__legend-marker {
    width: 20px;
    height: 20px;
    display: block;
    line-height: 100%;
    border-radius: 4px;

    &_red { background: var(--red_translucent) }
    &_blue { background: linear-gradient(315deg, rgba(59,102,255,1) 0%, rgba(59,102,255,1) 50%, rgba(59,102,255,0.3) 51%) }
    &_green { background: var(--green) }

    @media screen and (max-width: 640px) {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
