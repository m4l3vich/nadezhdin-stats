<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    icon?: string | undefined
    label?: string | undefined
    outlined?: boolean
    small?: boolean
    progress?: boolean
    color?: 'blue' | 'grey'
  }>(),
  { color: 'blue', icon: undefined, label: undefined }
)

const button = ref<HTMLButtonElement>()
const spinIcon = ref<boolean>(props.progress)

watch(() => props.progress, (val) => {
  if (val) {
    spinIcon.value = true
  } else if (button.value) {
    const icon = button.value.querySelector('.icon')
    icon?.addEventListener('animationiteration', () => {
      spinIcon.value = false
    }, { once: true })
  }
})
</script>

<template>
  <button
    ref="button"
    type="button"
    class="v-button"
    :class="{
      'v-button_icon': !!icon && !label && !$slots.default,
      'v-button_outlined': outlined,
      'v-button_small': small,
      'v-button_progress': progress,
      'v-button_spin-icon': spinIcon,
      [`v-button_color_${color}`]: true
    }"
  >
    <Icon v-if="!!icon" :name="icon" size="24" />
    <Icon v-else-if="progress" name="material-symbols:progress-activity" size="24" />
    <template v-if="!!label">
      {{ label }}
    </template>
    <slot v-else />
  </button>
</template>

<style lang="scss">
.v-button {
  border: none;
  cursor: pointer;

  font-size: 18px;
  border-radius: 999px;
  padding: 8px 16px;

  display: flex;
  align-items: center;
  gap: 8px;

  background: var(--main_color);

  &_color {
    &_blue {
      --main_color: var(--blue);
      color: var(--background);
    }

    &_grey {
      --main_color: #6d8094;
      color: white;
    }
  }

  &_outlined {
    background: none !important;
    border: 1px solid var(--main_color);
    color: var(--main_color);
  }

  &_icon {
    padding: 8px;
  }

  &_progress {
    pointer-events: none;
    opacity: 0.5;
  }

  &_spin-icon {
    .icon {
      animation: spinner 1s infinite linear;
    }
  }

  &_small {
    padding: 4px;
  }
}

@keyframes spinner {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
