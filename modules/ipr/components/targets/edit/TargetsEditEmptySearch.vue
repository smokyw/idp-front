<script setup lang="ts">
defineProps<{
  /** Используется заглушка для навыка */
  isSkill?: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <div
    class="grid h-[calc(100vh-15.5rem)] min-w-max grid-cols-6 items-center divide-x divide-neutral-100 sm:h-[calc(100vh-16.5rem)] sm:min-w-0 lg:h-[31rem]"
  >
    <p
      class="col-span-4 flex justify-center text-sm font-medium text-neutral-400"
    >
      {{ t("system.emptySearch") }}
    </p>
    <div class="h-full" />
    <div v-if="isSkill" class="h-full" />
  </div>
</template>
