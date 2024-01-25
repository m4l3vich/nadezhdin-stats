<script setup lang="ts">
import { useStatsStore } from '~/store/stats'

const state = useStatsStore()
</script>

<template>
  <section class="error-screen">
    <Icon
      name="material-symbols:warning"
      size="64"
    />

    <span>Ошибка</span>

    <p class="error-screen__description">
      Что-то пошло не так при получении данных с
      <a href="https://nadezhdin2024.ru/addresses" target="_blank">сайта Бориса Надеждина.</a>
      Возможно, сайт недоступен.
    </p>

    <button
      class="error-screen__btn"
      :class="{ 'error-screen__btn_updating': state.updating }"
      @click="() => state.updateStats()"
    >
      <Icon v-if="state.updating" name="material-symbols:progress-activity" />

      <template v-if="state.updateAttempt > 3">
        Пробуем, пока не получится ({{ state.updateAttempt - 3 }})
      </template>
      <template v-else-if="state.updating">
        Пробуем снова
      </template>
      <template v-else>
        Повторить попытку
      </template>
    </button>

    <a class="error-screen__author" href="https://m4l3vich.ru/" target="_blank">
      made with 🖤 by m4l3vich
    </a>
  </section>
</template>

<style lang="scss">
.error-screen {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;

  align-items: center;
  justify-content: center;
  color: var(--red);

  font-size: 24px;
  font-weight: 500;

  &__description {
    font-size: 16px;
    color: var(--text);
    text-align: center;
    max-width: 250px;

    a {
      color: var(--blue);
      text-decoration: none;
    }
  }

  &__author {
    font-size: 12px;
    appearance: none;
    color: var(--text);
    opacity: 0.5;
  }

  &__btn {
    border: 1px solid var(--blue);
    background: none;
    cursor: pointer;

    color: var(--blue);

    font-size: 18px;
    border-radius: 999px;
    padding: 8px 16px;

    display: flex;
    align-items: center;
    gap: 8px;

    &_gray {
      background: #6d8094;
      color: white;
    }

    &_icon {
      padding: 8px;
    }

    &_updating {
      opacity: 0.5;
      pointer-events: none;

      .icon {
        animation: spinner 1s infinite linear;
      }
    }
  }
}

@keyframes spinner {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
