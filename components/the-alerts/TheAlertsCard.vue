<script setup lang="ts">
import type { Alert } from "@/store/alerts"

defineProps<{
  /** Ошибка */
  alert: Alert
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex w-full gap-x-2 rounded-2xl bg-white p-4 shadow-base">
    <Icon
      :name="alert.type === 'error' ? 'SvgoAlertTriangle' : 'SvgoCheckCircle'"
      size="16"
    />
    <div class="flex flex-col gap-y-1.5">
      <h6 class="font-medium">
        {{
          t(`${alert.type === "error" ? "errors" : "success"}.${alert.code}`)
        }}
      </h6>
      <p v-if="alert.message" class="text-xs font-medium text-neutral-400">
        {{ t(alert.message) }}
      </p>
    </div>
  </div>
</template>
