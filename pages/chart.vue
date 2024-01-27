<script setup lang="ts">
import { regionsMap } from '~/regionMappings';
import { useStatsStore, type Region } from '~/store/stats'

const state = useStatsStore()

interface ChartRegion {
  name: string
  count: number | null
  percent: number,
  label: string
}

const showPercentFrom = ref<'target' | 'total' | 'sorted'>('target')

const totalCount = computed(() => {
  if (state.regions === null) { return 1 }
  return state.regions.reduce((acc, e) => acc + (e.count ?? 0), 0)
})

const chartData = computed<ChartRegion[]>(() => {
  if (state.regions === null) { return [] }

  const regionsWithPercent = state.regions.map((region) => {
    const { name, count } = region
    let percent: number

    if (showPercentFrom.value === 'total') {
      const biggestVotesNum = Math.max(...(state.regions as Region[]).map(e => e.count ?? 0))
      percent = (count ?? 0) / biggestVotesNum
    } else {
      percent = (count ?? 0) / 2500
    }

    let label
    if (count === null) {
      label = 'Ждем данные от штаба'
      return { name, count, percent: 0, label }
    }

    switch (showPercentFrom.value) {
      case 'total': {
        const biggestVotesNum = Math.max(...(state.regions as Region[]).map(e => e.count ?? 0))
        percent = (count ?? 0) / biggestVotesNum

        const percentFromTotal = (count ?? 0) / totalCount.value
        const percentStr = (percentFromTotal * 100).toFixed(3)
        const countStr = count.toLocaleString()
        label = `${countStr} (${percentStr}%)`
        break
      }
      case 'target': {
        percent = (count ?? 0) / 2500

        const percentStr = (percent * 100).toFixed(2)
        const countStr = count.toLocaleString()
        label = `${countStr} из 2 500 (${percentStr}%)`
        break
      }
      case 'sorted': {
        const regionCode = regionsMap[region.name]
        const collectedVotesRegion = state.regionsCollected?.find(
          e => regionsMap[e.name] === regionCode
        )

        const countStr = count.toLocaleString()

        if (collectedVotesRegion && collectedVotesRegion?.count) {
          percent = (count ?? 0) / (collectedVotesRegion?.count ?? 0)
          const percentStr = (percent * 100).toFixed(2)
          const collectedCountStr = collectedVotesRegion.count.toLocaleString()
          label = `${countStr} из ${collectedCountStr} (${percentStr}%)`
        } else {
          label = `${countStr} из (Н/Д)`
        }

        break
      }
    }
    return { name, count, percent, label }
  })

  regionsWithPercent.sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
  return regionsWithPercent
})
</script>

<template>
  <section class="chart">
    <div class="chart__settings">
      <p class="chart__setting-title">
        Показать количество:
      </p>
      <label>
        <input
          v-model="state.showSorted"
          type="radio"
          name="chart-type"
          :value="true"
          :disabled="state.updating"
        >
        Отсортированных подписей
      </label>

      <label>
        <input
          v-model="state.showSorted"
          type="radio"
          name="chart-type"
          :value="false"
          :disabled="state.updating"
        >
        Собранных подписей
      </label>

      <p class="chart__setting-title" style="margin-top: 8px;">
        Показать %:
      </p>
      <label>
        <input
          v-model="showPercentFrom"
          type="radio"
          name="chart-scale"
          value="target"
        >
        От цели (2 500 подписей)
      </label>

      <label>
        <input
          v-model="showPercentFrom"
          type="radio"
          name="chart-scale"
          value="total"
        >
        От общего количества ({{ totalCount.toLocaleString() }})
      </label>

      <label v-if="state.showSorted">
        <input
          v-model="showPercentFrom"
          type="radio"
          name="chart-scale"
          value="sorted"
        >
        От собранных по региону
      </label>

      <VButton
        class="chart__update-btn"
        color="grey"
        :progress="state.updating"
        icon="material-symbols:refresh-rounded"
        label="Обновить"
        @click="() => state.updateStats()"
      />
    </div>

    <ul class="chart__list">
      <template
        v-for="(region, index) of chartData"
        :key="region.name"
      >
        <li class="chart__region-name">
          <strong>№{{ index + 1 }}</strong>: {{ region.name }}
        </li>

        <li
          class="chart__region-bar"
          :class="{ 'chart__region-bar_complete': (region.count ?? 0) > 2500 }"
          :style="{ '--percent': `${region.percent * 100}%`, '--content': region.label }"
        >
          <span class="chart__bar-label" v-text="region.label" />
          <span class="chart__bar-track" v-text="region.label" />
        </li>
      </template>
    </ul>
  </section>
</template>

<style lang="scss">
.chart {
  flex: 1 0;
  position: relative;
  overflow-y: auto;

  @media screen and (min-width: 750px) {
    padding-bottom: 120px;
  }

  &__settings {
    border: 2px solid var(--modal_bg);
    margin: 16px 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    border-radius: 16px;
  }

  &__update-btn {
    margin-top: 8px;
  }

  &__setting-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }

  min-height: 0;
  color: var(--text);

  --max-width: 800px;
  padding: 0 calc(calc(100vw - var(--max-width)) / 2);

  ul {
    display: grid;
    gap: 16px;

    margin: 0;
    padding: 16px;
    list-style: none;

    @media screen and (min-width: 640px) {
      gap: 24px 8px;
      grid-template-columns: 250px 1fr;
      align-items: center;
    }
  }

  &__region-bar {
    --bar_color: var(--blue);

    &_complete {
      --bar_color: #00b86d;
    }

    border-radius: 999px;
    border: 2px solid var(--bar_color);
    padding: 8px 12px;
    position: relative;
    overflow: hidden;
    height: 20px;
  }

  &__bar-label {
    position: absolute;
    left: 12px;
    z-index: -1;
  }

  &__bar-track {
    display: block;
    width: var(--percent);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background: var(--bar_color);
    z-index: 0;
    padding: 8px 12px;
    padding-right: 0;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    color: var(--background);
  }
}

@keyframes spinner {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
