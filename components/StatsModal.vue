<script setup lang="ts">
import { useStatsStore } from '~/store/stats'

const open = defineModel<boolean>('open', { default: false })
const state = useStatsStore()

const totalCount = computed(() => {
  if (state.regions === null) { return 0 }
  return state.regions.reduce((acc, e) => acc + (e.count ?? 0), 0)
})

const completeRegionsCount = computed(() => {
  if (state.regions === null) { return 0 }
  return state.regions.filter(e => (e.count ?? 0) > 2500).length
})

const quotaCount = computed(() => {
  if (state.regions === null) { return 0 }
  return state.regions.reduce((acc, e) => acc + Math.min((e.count ?? 0), 2500), 0)
})

const compactView = ref<boolean>(false)
</script>

<template>
  <dialog :open="open" class="stats-modal" @close="() => { open = false }">
    <header class="stats-modal__header">
      Статистика
      <button class="stats-modal__close-btn" @click="() => { open = false }">
        <Icon name="material-symbols:close-rounded" />
      </button>
    </header>

    <div v-if="!compactView" class="stats-modal__switch">
      <label>
        <input
          v-model="state.showSorted"
          type="radio"
          name="chart-scale"
          :value="true"
          :disabled="state.updating"
        >
        Отсортированные подписи
      </label>

      <label>
        <input
          v-model="state.showSorted"
          type="radio"
          name="chart-scale"
          :value="false"
          :disabled="state.updating"
        >
        Собранные подписи
      </label>
    </div>

    <ul class="stats-modal__stats" :class="{ 'stats-modal__stats_small': compactView }">
      <li>
        <span class="stats-modal__metric-title">
          {{ compactView ? 'Всего' : 'Всего подписей' }}
        </span>
        <span
          class="stats-modal__metric"
          :class="{ 'stats-modal__metric_small': compactView }"
          v-text="totalCount.toLocaleString()"
        />
      </li>
      <li>
        <span class="stats-modal__metric-title">
          {{ compactView ? 'С квотой' : 'Подписи по квоте*' }}
        </span>
        <span
          class="stats-modal__metric"
          :class="{ 'stats-modal__metric_small': compactView }"
          v-text="quotaCount.toLocaleString()"
        />
      </li>
      <li>
        <span class="stats-modal__metric-title">
          {{ compactView ? 'Регионы 2 500+' : 'Регионы с 2 500 подписями' }}
        </span>
        <span
          class="stats-modal__metric"
          :class="{ 'stats-modal__metric_small': compactView }"
          v-text="completeRegionsCount"
        />
      </li>
    </ul>

    <div class="stats-modal__buttons">
      <VButton
        color="grey"
        :progress="state.updating"
        :small="!!compactView"
        icon="material-symbols:refresh-rounded"
        @click="() => state.updateStats()"
      >
        <template v-if="!compactView">
          Обновить
        </template>
      </VButton>

      <VButton
        color="grey"
        :icon="compactView
          ? 'material-symbols:expand-content-rounded'
          : 'material-symbols:close-fullscreen-rounded'"
        :small="!!compactView"
        @click="() => { compactView = !compactView }"
      />
    </div>

    <div v-if="!compactView" class="stats-modal__footer">
      <p>*От одного региона засчитывается не более 2 500 подписей. Это число показывает количество подписей с учетом этого ограничения.</p>
      <p>
        Все данные {{ state.showSorted ? 'об отсортированных' : 'о собранных' }} подписях берутся в реальном времени с
        <a :href="state.showSorted ? 'https://nadezhdin2024.ru/signatures' : 'https://nadezhdin2024.ru/addresses'" target="_blank" style="color: var(--blue)">
          этой&nbsp;страницы.
        </a>
      </p>
      <a class="stats-modal__author" href="https://m4l3vich.ru/" target="_blank">
        made with 🖤 by m4l3vich
      </a>
    </div>
  </dialog>
</template>

<style lang="scss">
.stats-modal {
  display: block;
  visibility: hidden;
  position: absolute;
  box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.2);
  margin: 0;

  z-index: 2;
  color: var(--text);

  @media screen and (min-width: 1200px) {
    display: flex;
    flex-wrap: wrap;
  }

  --dialog_margin: 24px;
  @media screen and (max-width: 640px) {
    --dialog_margin: 16px;
  }
  bottom: var(--dialog_margin);
  left: var(--dialog_margin);
  right: var(--dialog_margin);

  width: calc(100% - calc(var(--dialog_margin) * 2));
  box-sizing: border-box;

  background: var(--modal_bg);
  border: none;
  border-radius: 16px;

  transition: transform 0.3s ease, visibility 0.3s ease;
  transform: translateY(200%);

  &[open] {
    visibility: visible;
    transform: translateY(0%)
  }

  &__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24px;
  }

  &__close-btn {
    border: none;
    background: none;
    font-size: 28px;
    padding: 0;
    margin: 0;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    color: var(--text);
  }

  &__switch {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    flex-direction: column;

    @media screen and (min-width: 640px) and (max-width: 1200px) {
      flex-direction: row;
    }

    @media screen and (max-width: 640px) {
      font-size: 14px;
    }
  }

  &__stats {
    display: flex;
    gap: 24px;
    flex: 1 0 auto;
    align-items: flex-end;

    margin: 0;
    margin-top: 16px;
    padding: 16px 0;

    @media screen and (max-width: 640px) {
      flex-wrap: wrap;
      padding: 0;
      padding-top: 16px;
    }

    @media screen and (min-width: 1200px) {
      margin-top: 0;
    }

    li {
      flex: 1 0 120px;
      display: flex;
      list-style: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;

      @media screen and (max-width: 640px) {
        gap: 8px;
      }
    }

    &_small {
      display: flex;
      flex-wrap: nowrap;
      margin-top: 0;

      & li {
        flex-basis: auto;
        gap: 8px !important;
      }
    }
  }

  &__metric-title {
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.6;
    font-weight: 500;
    text-align: center;

    @media screen and (max-width: 640px) {
      font-size: 12px;
    }
  }

  &__metric {
    font-size: 36px;

    @media screen and (max-width: 640px) {
      font-size: 24px;
    }

    &_small {
      font-size: 16px;
      font-weight: bold;
    }
  }

  &__buttons {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;

    @media screen and (min-width: 1200px) {
      flex: 1 0 auto;
      justify-content: flex-end;
    }
  }

  &__compact-btn {
    @media screen and (min-width: 640px) {
      display: none;
    }
  }

  &__footer {
    width: 100%;
    font-size: 12px;
    opacity: 0.75;
    margin-top: 8px;

    display: flex;
    flex-direction: column;
    gap: 8px;

    p { margin: 0; }
    a:not([class]) {
      color: var(--blue);
      text-decoration: none;
    }

    @media screen and (max-width: 1200px) {
      margin-top: 16px;
    }

    @media screen and (max-width: 640px) {
      font-size: 10px;
    }
  }

  &__author {
    appearance: none;
    color: var(--text);
    text-align: center;
    display: block;

    @media screen and (min-width: 640px) {
      display: none;
    }
  }
}
</style>
