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
const compactView = ref<boolean>(false)
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

      <ul class="stats-dialog__grid" :class="{ 'stats-dialog__grid_small': compactView }">
        <li>
          <span class="stats-dialog__metric-title">
            {{ compactView ? 'Всего' : 'Всего подписей' }}
          </span>
          <span
            class="stats-dialog__metric"
            :class="{ 'stats-dialog__metric_small': compactView }"
            v-text="totalCount.toLocaleString()"
          />
        </li>
        <li>
          <span class="stats-dialog__metric-title">
            {{ compactView ? 'С квотой' : 'Подписи по квоте*' }}
          </span>
          <span
            class="stats-dialog__metric"
            :class="{ 'stats-dialog__metric_small': compactView }"
            v-text="quotaCount.toLocaleString()"
          />
        </li>
        <li>
          <span class="stats-dialog__metric-title">
            {{ compactView ? 'Регионы 2 500+' : 'Регионы с 2 500 подписями' }}
          </span>
          <span
            class="stats-dialog__metric"
            :class="{ 'stats-dialog__metric_small': compactView }"
            v-text="completeRegionsCount"
          />
        </li>
      </ul>

      <div class="stats-dialog__buttons">
        <button
          class="stats__btn stats__btn_flat stats__btn_gray"
          :class="{ 'stats__btn_disabled': updating, 'stats__btn_spin-icon': updating, 'stats__btn_small': compactView }"
          @click="() => emit('update')"
        >
          <Icon name="material-symbols:refresh-rounded" size="24" />
          <template v-if="!compactView">
            Обновить
          </template>
        </button>

        <button
          class="stats__btn stats__btn_flat stats__btn_gray stats__btn_icon stats-dialog__compact-btn"
          :class="{ 'stats__btn_small': compactView }"
          @click="() => { compactView = !compactView }"
        >
          <Icon v-if="compactView" name="material-symbols:expand-content-rounded" size="24" />
          <Icon v-else name="material-symbols:close-fullscreen-rounded" size="24" />
        </button>
      </div>

      <div v-if="!compactView" class="stats-dialog__footer">
        <p>*От одного региона засчитывается не более 2 500 подписей. Это число показывает количество подписей с учетом этого ограничения.</p>
        <p>
          Все данные берутся в реальном времени с
          <a href="https://nadezhdin2024.ru/addresses" target="_blank" style="color: var(--blue)">
            этой&nbsp;страницы
          </a>.
        </p>
        <a class="stats-dialog__author" href="https://m4l3vich.ru/" target="_blank">
          made with 🖤 by m4l3vich
        </a>
      </div>
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

    color: var(--background);

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

    &_small {
      padding: 4px;
    }

    &_spin-icon .icon {
      animation: spinner 1s infinite linear;
    }
  }
}

.stats-dialog {
  display: block;
  visibility: hidden;
  position: absolute;
  box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.2);

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

  width: calc(100vw - calc(var(--dialog_margin) * 2));
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

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    gap: 24px;
    flex: 1 0 auto;

    margin: 0;
    margin-top: 16px;
    padding: 16px 0;

    @media screen and (max-width: 640px) {
      display: flex;
      flex-wrap: wrap;
      padding: 0;
      padding-top: 16px;
    }

    @media screen and (min-width: 1200px) {
      margin-top: 0;
    }

    &_small {
      display: flex;
      margin-top: 0;

      & li {
        gap: 8px !important;
      }
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

@keyframes spinner {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
