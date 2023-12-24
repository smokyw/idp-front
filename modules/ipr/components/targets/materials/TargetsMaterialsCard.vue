<script setup lang="ts">
import type { TargetsTargetMaterialCollectionView } from "@/Api"

defineProps<{
  /** Материалы цели */
  material: TargetsTargetMaterialCollectionView
  /** `ID` цели, к которой привязан материал */
  targetId: number
}>()

/** Открыт ли попап навыка */
const isPopupOpened = ref(false)
</script>

<template>
  <div class="grid grid-cols-6">
    <div class="p-3">
      <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
      <!-- TODO: Переделать, когда определимся, что такое статус материала -->
      Статус
    </div>
    <div
      class="col-span-5 flex cursor-pointer flex-col gap-y-2 p-3"
      data-test-id="isPopupOpened"
      @click="isPopupOpened = true"
    >
      <h3 class="line-clamp-1 text-md">{{ material.name }}</h3>
      <LazyTargetsMaterialsPaid v-if="material.is_paid" />
    </div>
  </div>
  <LazyTargetsEditMaterialsTreeCardPage
    v-if="isPopupOpened"
    :id="material.id!"
    :target-id="targetId"
    @close-popup="isPopupOpened = false"
  />
</template>
