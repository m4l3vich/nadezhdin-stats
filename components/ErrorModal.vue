<script setup lang="ts">
defineProps<{ open: boolean }>()
defineEmits<{(e: 'update:open', value: boolean): void}>()
</script>

<template>
  <dialog :open="open" class="error-modal">
    <header class="error-modal__header">
      <Icon name="material-symbols:error" />
      Не удалось обновить

      <span class="error-modal__spacer" />

      <button class="error-modal__close-btn" @click="$emit('update:open', false)">
        <Icon name="material-symbols:close-rounded" />
      </button>
    </header>

    <p class="error-modal__body">
      Что-то пошло не так при получении данных с
      <a href="https://nadezhdin2024.ru/addresses" target="_blank">сайта Бориса Надеждина.</a>
      Возможно, сайт недоступен.
    </p>
  </dialog>
</template>

<style lang="scss">
.error-modal {
  z-index: 0;
  display: block;
  visibility: hidden;
  position: absolute;
  box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.2);

  top: 16px;
  left: 16px;
  right: 16px;

  width: calc(100vw - 32px);
  box-sizing: border-box;

  background: var(--background);
  color: var(--text);
  border: none;
  border-radius: 16px;

  @media screen and (prefers-color-scheme: dark) {
    background: var(--modal_bg);
  }

  transition: transform 0.3s ease, visibility 0.3s ease;
  transform: translateY(-200%);

  @media screen and (min-width: 640px) {
    width: max-content;
    max-width: 400px;
    left: unset;
    top: unset;
    bottom: 86px;
    transform: translateY(200%);
  }

  &[open] {
    visibility: visible;
    transform: translateY(0%)
  }

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    margin-bottom: 12px;

    color: var(--red);

    & .icon:first-child {
      font-size: 24px;
    }

    @media screen and (max-width: 640px) {
      font-size: 14px;
      margin-bottom: 0;
      & .icon:first-child {
        font-size: 20px;
      }
    }
  }

  &__close-btn {
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    color: var(--text);
  }

  &__spacer {
    flex: 1;
  }

  &__body {
    font-size: 14px;
    margin: 8px 0 0;
    line-height: 125%;

    a {
      color: var(--blue);
      text-decoration: none;
    }
  }
}
</style>
