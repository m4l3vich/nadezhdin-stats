<script setup lang="ts">
import { useStatsStore } from '~/store/stats'
const state = useStatsStore()
const statsModalOpen = ref<boolean>(false)
</script>

<template>
  <section class="stats">
    <div class="stats__btns" :class="{ 'stats__btns_hidden': statsModalOpen }">
      <VButton
        icon="material-symbols:insert-chart-outline-rounded"
        label="Статистика"
        @click="() => { statsModalOpen = true }"
      />

      <VButton
        color="grey"
        icon="material-symbols:refresh-rounded"
        :progress="state.updating"
        @click="() => state.updateStats()"
      />
    </div>

    <StatsModal v-model:open="statsModalOpen" />
  </section>
</template>

<style lang="scss">
.stats {
  &__btns {
    position: absolute;
    bottom: 24px;
    right: 24px;

    display: flex;
    gap: 12px;

    transition: transform 0.3s ease, visibility 0.3s ease;
    visibility: visible;
    transform: translateY(0%);

    & > * {
      box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.3);
    }

    &_hidden {
      visibility: hidden;
      transform: translateY(200%);
    }

    @media screen and (max-width: 640px) {
      right: 50%;
      transform: translateY(0%) translateX(50%);

      &_hidden {
        transform: translateY(200%) translateX(50%);
      }
    }
  }
}
</style>
