<script setup lang="ts">
defineProps<{
  /** Иконка */
  icon?: string
  /** Активна ли кнопка */
  isActive?: boolean
  /** Выбрана ли кнопка */
  isSelected?: boolean
  /** Заголовок */
  title?: string | number
}>()
</script>

<template>
  <div
    class="button md secondary h-9 w-9 !p-0"
    :class="{ '!bg-neutral-200': isSelected }"
  >
    <LazyIcon
      v-if="icon"
      :class="[isActive ? 'fill-neutral-900' : 'fill-neutral-300']"
      :name="icon"
      size="16"
    />
    <p v-else :class="[isSelected ? 'font-semibold' : '!font-regular']">
      {{ title }}
    </p>
  </div>
</template>
