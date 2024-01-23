<script setup lang="ts">
const { regions } = defineProps<{
  updating: boolean,
  regions: {
    name: string
    count: number
  }[]
}>()

const emit = defineEmits<{(e: 'update'): void}>()

const totalCount = computed(
  () => regions.reduce((acc, e) => acc + e.count, 0)
)

const completeRegionsCount = computed(
  () => regions.filter(e => e.count > 2500).length
)

const quotaCount = computed(
  () => regions.reduce((acc, e) => acc + Math.min(e.count, 2500), 0)
)

const dialog = ref<HTMLDialogElement>()
const isDialogVisible = ref<boolean>(false)
</script>

<template>
  <section class="stats">
    <div class="stats__btns" :class="{ 'stats__btns_hidden': isDialogVisible }">
      <button
        class="stats__btn"
        @click="() => { isDialogVisible = true; dialog?.show() }"
      >
        <Icon name="material-symbols:insert-chart-outline-rounded" size="24" />
        Статистика
      </button>

      <button
        class="stats__btn stats__btn_gray stats__btn_icon"
        :class="{ 'stats__btn_disabled': updating, 'stats__btn_spin-icon': updating }"
        @click="() => emit('update')"
      >
        <Icon name="material-symbols:refresh-rounded" size="24" />
      </button>
    </div>

    <dialog ref="dialog" class="stats-dialog" @close="() => { isDialogVisible = false }">
      <header class="stats-dialog__header">
        Статистика
        <button class="stats-dialog__close-btn" @click="() => dialog?.close()">
          <Icon name="material-symbols:close-rounded" />
        </button>
      </header>

      <ul class="stats-dialog__grid">
        <li>
          <span class="stats-dialog__metric-title">Всего подписей</span>
          <span class="stats-dialog__metric" v-text="totalCount.toLocaleString()" />
        </li>
        <li>
          <span class="stats-dialog__metric-title">Подписи по квоте</span>
          <span class="stats-dialog__metric" v-text="quotaCount.toLocaleString()" />
        </li>
        <li>
          <span class="stats-dialog__metric-title">Регионы с 2500 подписями</span>
          <span class="stats-dialog__metric" v-text="completeRegionsCount" />
        </li>
      </ul>

      <button
        class="stats__btn stats__btn_flat stats__btn_gray"
        :class="{ 'stats__btn_disabled': updating, 'stats__btn_spin-icon': updating }"
        @click="() => emit('update')"
      >
        <Icon name="material-symbols:refresh-rounded" size="24" />
        Обновить
      </button>

      <a class="stats__author" href="https://m4l3vich.ru/" target="_blank">
        made with 🖤 by m4l3vich
      </a>
    </dialog>
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

  &__btn {
    border: none;
    background: var(--blue);
    cursor: pointer;
    box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.3);

    color: white;

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

    &_flat {
      box-shadow: none;
    }

    &_disabled {
      pointer-events: none;
      opacity: 0.5;
    }

    &_spin-icon .icon {
      animation: spinner 1s infinite linear;
    }
  }

  &__author {
    margin-top: 16px;
    font-size: 12px;
    appearance: none;
    color: black;
    opacity: 0.5;
    text-align: center;
    width: 100%;
    display: block;
  }
}

.stats-dialog {
  display: block;
  visibility: hidden;
  position: absolute;
  box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.2);

  display: flex;
  flex-direction: column;
  align-items: center;

  --dialog_margin: 24px;
  @media screen and (max-width: 640px) {
    --dialog_margin: 16px;
  }
  bottom: var(--dialog_margin);
  left: var(--dialog_margin);
  right: var(--dialog_margin);

  width: calc(100vw - calc(var(--dialog_margin) * 2));
  box-sizing: border-box;

  background: #d0deed;
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
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    gap: 24px;

    margin: 0;
    margin-top: 24px;
    padding: 32px 0;

    @media screen and (max-width: 640px) {
      display: flex;
      flex-wrap: wrap;
      padding: 0;
      padding-bottom: 16px;
    }

    li {
      flex: 1 0 auto;
      display: flex;
      list-style: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
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
  }
}

@keyframes spinner {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
