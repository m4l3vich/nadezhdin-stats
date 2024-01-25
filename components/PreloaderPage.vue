<template>
  <section class="preloader">
    <Icon
      name="material-symbols:progress-activity"
      size="64"
    />

    <span>Загрузка</span>

    <a class="preloader__author" href="https://m4l3vich.ru/" target="_blank">
      made with 🖤 by m4l3vich
    </a>
  </section>
</template>

<style lang="scss">
.preloader {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;

  align-items: center;
  justify-content: center;
  color: var(--blue);

  .icon {
    animation: spinner 1s infinite linear;
  }

  font-size: 24px;
  font-weight: 500;

  &__author {
    font-size: 12px;
    appearance: none;
    color: var(--text);
    opacity: 0.5;
  }
}

@keyframes spinner {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
