<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div
    class="flex h-48 flex-col items-center justify-center gap-y-6 rounded-2xl bg-white p-4 text-center"
  >
    <div class="flex flex-col gap-y-2">
      <h2 class="text-lg font-semibold">
        {{ t(`ipr.targets.noPlan.title`) }}
      </h2>
      <p class="text-neutral">
        {{ t(`ipr.targets.noPlan.description`) }}
      </p>
    </div>
  </div>
</template>
