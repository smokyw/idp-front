<script setup lang="ts">
defineProps<{
  /** Иконка */
  icon: string | undefined
  /** Является ли иконка круглой */
  isCircle?: boolean
  /** Название локализации */
  locale: string | undefined
}>()
</script>

<template>
  <Icon
    :class="{ rounded: !isCircle }"
    :name="isCircle ? `circle-flags:${icon}` : `flag:${icon}-1x1`"
  />
  <span class="text-neutral-900" :class="{ uppercase: !isCircle }">
    {{ locale }}
  </span>
</template>
