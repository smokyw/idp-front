<script setup lang="ts">
defineProps<{
  /** Иконка кнопки */
  icon: string
  /** Является ли действие основным. Если передано `true`, то кнопка будет окрашена в основной цвет. */
  isPrimary?: boolean
  /** Заголовок кнопки */
  title: string
}>()
</script>

<template>
  <HeadlessMenuItem
    as="div"
    class="flex w-full cursor-pointer items-center gap-x-2.5 p-3 ui-active:bg-neutral-200"
  >
    <Icon
      :class="[isPrimary ? 'fill-primary-600' : 'fill-neutral']"
      :name="icon"
      size="16"
    />
    <span class="w-max" :class="{ 'text-primary-600': isPrimary }">
      {{ title }}
    </span>
  </HeadlessMenuItem>
</template>
