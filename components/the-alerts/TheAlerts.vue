<script setup lang="ts">
import type { Alert } from "@/store/alerts"

defineProps<{
  /** Список ошибок */
  alerts: Alert[]
}>()
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <LazyTheAlertsCard
      v-for="alert in alerts"
      :key="alert.code"
      :alert="alert"
    />
  </div>
</template>
