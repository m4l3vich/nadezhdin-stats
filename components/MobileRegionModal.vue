<script setup lang="ts">
import { useStatsStore } from '~/store/stats'
const state = useStatsStore()

defineProps<{
  item?: { name: string, count: number | null }
}>()

const emit = defineEmits<{(e: 'close'): void}>()

const openStateOverride = ref<boolean>()

function close () {
  openStateOverride.value = false

  setTimeout(() => {
    emit('close')
    openStateOverride.value = undefined
  }, 300)
}
</script>

<template>
  <dialog class="region-modal" :open="openStateOverride ?? item !== undefined">
    <header class="region-modal__header">
      {{ item?.name }}
      <button class="region-modal__close-btn" @click="close">
        <Icon name="material-symbols:close-rounded" />
      </button>
    </header>

    <p v-if="item?.count && item?.count > 0" class="region-modal__count">
      {{ item?.count.toLocaleString() }} / 2 500
      ({{ ((item?.count / 2500) * 100).toFixed(2) }}%)
    </p>
    <p v-else class="region-modal__count">
      {{ item?.count === null ? 'Ждем данные' : 'Нет данных' }}
    </p>

    <p class="region-modal__footer">
      Все данные {{ state.showSorted ? 'об отсортированных' : 'о собранных' }} подписях берутся в реальном времени с сайта Бориса Надеждина.
    </p>
  </dialog>
</template>

<style lang="scss">
.region-modal {
  @media screen and (min-width: 640px) {
    display: none;
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

  z-index: 1;

  display: block;
  visibility: hidden;
  position: absolute;
  box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.2);

  bottom: 86px;
  left: 16px;
  right: 16px;

  width: calc(100vw - 32px);
  box-sizing: border-box;

  background: var(--modal_bg);
  color: var(--text);
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
    font-size: 18px;
  }

  &__count {
    font-size: 20px;
    margin: 0;
    margin-top: 8px;
    font-weight: 500;
  }

  &__footer {
    width: 100%;
    font-size: 12px;
    opacity: 0.75;
    margin-top: 16px;
    margin-bottom: 0;

    a:not([class]) {
      color: var(--blue);
      text-decoration: none;
    }

    @media screen and (max-width: 640px) {
      font-size: 12px;
    }
  }
}
</style>
