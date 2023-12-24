<script setup lang="ts">
import type { TargetsFiltersStatusGroup } from "@/Api"

defineProps<{
  /** Год для фильтрации списка целей */
  idpId: number
  /** Статус целей */
  targetsStatus: TargetsFiltersStatusGroup["status_group"]
}>()

const { t } = useI18n()
</script>

<template>
  <div
    class="flex h-48 flex-col items-center justify-center gap-y-6 rounded-2xl bg-white p-4 text-center"
  >
    <div class="flex flex-col gap-y-2">
      <h2 class="text-lg font-semibold">
        {{ t(`ipr.targets.emptyState.${targetsStatus}.title`) }}
      </h2>
      <p class="text-neutral">
        {{ t(`ipr.targets.emptyState.${targetsStatus}.description`) }}
      </p>
    </div>
    <NuxtLinkLocale
      v-if="
        targetsStatus === 'active' &&
        useUserStore().checkRight('app.targets.create_own_target')
      "
      class="button primary lg"
      :to="{
        path: '/targets/new',
        query: {
          idpId,
        },
      }"
    >
      <Icon class="fill-white" name="SvgoPlusCircleOutline" />
      <span>{{ t("ipr.targets.new.add") }}</span>
    </NuxtLinkLocale>
  </div>
</template>
