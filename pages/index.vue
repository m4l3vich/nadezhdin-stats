<script setup lang="ts">
import Map from '~/assets/map.svg'
import { regionsMap } from '~/regionMappings'
import { useStatsStore } from '~/store/stats'

const state = useStatsStore()
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
  if (state.regions === null) { return }

  const allRegions = map.value.$el.querySelectorAll('[data-code]')
  allRegions.forEach((e: HTMLElement) => {
    e.removeAttribute('fill-opacity')
    e.setAttribute('style', 'fill: var(--red_translucent)')
    e.addEventListener('mousemove', mouseMoveDefault)
    e.addEventListener('mouseout', () => { hoverItem.value = undefined })
  })

  map.value.$el.addEventListener('mouseleave', () => {
    hoverItem.value = undefined
  })

  for (const region of state.regions) {
    const regionCode = regionsMap[region.name]
    const regionOnMap = map.value.$el.querySelector(`[data-code="${regionCode}"]`)

    if (!regionOnMap) {
      // eslint-disable-next-line no-console
      console.warn('No match for region: ' + region.name)
      continue
    }

    const percent = (region.count ?? 0) / 2500
    regionOnMap.removeAttribute('style')
    regionOnMap.setAttribute('fill-opacity', percent + 0.1)

    if (percent > 1) {
      regionOnMap.setAttribute('style', 'fill: var(--green) !important')
    } else if (percent < 0.1) {
      regionOnMap.setAttribute('style', 'stroke: var(--blue) !important')
    }

    regionOnMap.removeEventListener('mousemove', mouseMoveDefault)
    regionOnMap.addEventListener('mousemove', (e: MouseEvent) => {
      hoverItem.value = region
      hoverTop.value = e.offsetY + 16
      hoverLeft.value = e.offsetX
    })
  }
}

watch(() => state.regions, () => renderMap(), { deep: true })
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
        {{ hoverItem.count === null ? 'Ждем данные' : 'Нет данных' }}
      </span>
    </div>

    <div class="map__legend">
      <ul>
        <li>
          <span class="map__legend-marker map__legend-marker_red" />
          Нет данных
        </li>
        <li>
          <span class="map__legend-marker map__legend-marker_blue" />
          Меньше 2 500 подписей
        </li>
        <li>
          <span class="map__legend-marker map__legend-marker_green" />
          Больше 2 500 подписей
        </li>
        <li>
          <span class="map__legend-marker map__legend-marker_grey" />
          Нет штаба
        </li>
      </ul>
    </div>

    <MapStats v-if="state.regions !== null" />

    <MobileRegionModal
      :item="hoverItem"
      @close="() => { hoverItem = undefined }"
    />

    <ErrorModal v-model:open="state.errored" />
  </section>
</template>

<style lang="scss">
.map {
  flex: 1 0 auto;
  position: relative;
  overflow: hidden;

  &__svg {
    user-select: none;
    cursor: default;

    [data-code] {
      fill: var(--blue);
      transition: fill 0.2s;
    }

    [data-code="RU-HR"],
    [data-code="RU-ZP"],
    [data-code="RU-DON"],
    [data-code="RU-LUG"],
    [data-code="RU-CR"] {
      pointer-events: none;
      fill: var(--background) !important;
      stroke: rgba(0, 0, 0, 0.3) !important;
      stroke-dasharray: 10, 1;

      @media screen and (prefers-color-scheme: dark) {
        stroke: rgba(255, 255, 255, 0.3) !important;
      }
    }

    path {
      stroke: #FFFFFF;
      stroke-width: 1;
      stroke-linejoin: round;

      @media screen and (prefers-color-scheme: dark) {
        stroke: rgba(255, 255, 255, 0.5)
      }
    }
  }

  &__container {
    width: 100%;
    height: 100%;

    // some hack
    .svg-pan-zoom__default {
      height: 100%;
    }
  }

  &__hover {
    position: fixed;
    font-size: 16px;
    background: var(--background);
    color: var(--text);
    padding: 8px;
    pointer-events: none;

    border-radius: 4px;
    box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.3);

    b {
      font-weight: 600;
    }

    @media screen and (max-width: 640px) {
      display: none;
    }

    @media screen and (prefers-color-scheme: dark) {
      background: var(--modal_bg);
    }
  }

  &__author {
    position: absolute;
    bottom: 24px;
    left: 24px;

    font-size: 12px;
    appearance: none;
    color: var(--text);
    opacity: 0.5;
    text-align: center;
    display: block;

    @media screen and (max-width: 640px) {
      display: none;
    }
  }

  &__legend {
    color: var(--text);
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
    &_grey {
      background: rgba(0, 0, 0, 0.2) !important;

      @media screen and (prefers-color-scheme: dark) {
        border: 1px solid #FFFFFF;
        background: rgba(255, 255, 255, 0.1) !important;
      }
    }

    @media screen and (max-width: 640px) {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
