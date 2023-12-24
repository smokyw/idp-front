<script setup lang="ts">
import type { TargetsTargetMaterialCollectionView } from "@/Api"

defineProps<{
  /** Материалы цели */
  materials: TargetsTargetMaterialCollectionView[] | undefined
  /** `ID` цели, к которой привязан материал */
  targetId: number
}>()

const { t } = useI18n()
</script>

<template>
  <div class="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
    <div class="grid h-10 grid-cols-6 items-center">
      <p class="px-3 text-xs text-neutral">
        {{ t("ipr.targets.pageTitles.status") }}
      </p>
      <p class="col-span-5 px-3 text-xs text-neutral">
        {{ t("ipr.targets.pageTitles.name") }}
      </p>
    </div>
    <LazyTargetsMaterialsCard
      v-for="material in materials"
      :key="material.id"
      :material="material"
      :target-id="targetId"
    />
  </div>
</template>
