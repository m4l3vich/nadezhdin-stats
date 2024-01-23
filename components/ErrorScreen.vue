<script setup lang="ts">
const emit = defineEmits<{(e: 'update'): void}>()
</script>

<template>
  <section class="error-screen">
    <Icon
      name="material-symbols:warning"
      size="64"
    />

    <span>Ошибка</span>

    <p class="error-screen__description">
      Что-то пошло не так при получении данных с сайта Бориса Надеждина.
    </p>

    <button
      class="error-screen__btn"
      @click="emit('update')"
    >
      Повторить попытку
    </button>

    <a class="preloader__author" href="https://m4l3vich.ru/" target="_blank">
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
    color: black;
    text-align: center;
    max-width: 250px;
  }

  &__author {
    font-size: 12px;
    appearance: none;
    color: black;
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
  }
}
</style>
