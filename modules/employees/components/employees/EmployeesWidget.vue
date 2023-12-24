<script setup lang="ts">
defineProps<{
  /** Иконка виджета */
  icon: string
  /** Процент */
  percent?: number
  /** Заголовок виджета */
  title: string
  /** Значение виджета */
  value: string
}>()
</script>

<template>
  <div class="flex items-center gap-x-4">
    <div
      class="h-9 w-9 rounded-xl p-0.5"
      :style="{
        background: `conic-gradient(#21C45D 0%, #21C45D ${
          percent ?? 0
        }%, #F3F4F6 ${percent ?? 0}%, #F3F4F6 100%)`,
      }"
    >
      <div
        class="flex h-full w-full items-center justify-center rounded-[.625rem] bg-white"
      >
        <Icon class="fill-neutral-400" :name="icon" size="16" />
      </div>
    </div>
    <div class="flex flex-col gap-y-1">
      <label class="text-xs text-neutral">{{ title }}</label>
      <h4 class="text-sm font-medium">{{ value }}</h4>
    </div>
  </div>
</template>
