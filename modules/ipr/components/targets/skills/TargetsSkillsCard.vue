<script setup lang="ts">
import type { SkillsSkillCollectionView } from "@/Api"

defineProps<{
  /** Навык */
  skill: SkillsSkillCollectionView
}>()

/** Открыт ли попап навыка */
const isPopupOpened = ref(false)
</script>

<template>
  <div
    class="grid cursor-pointer grid-cols-6 items-center"
    data-test-id="isPopupOpened"
    @click="isPopupOpened = true"
  >
    <h3 class="col-span-4 line-clamp-1 p-3 text-md">
      {{ skill.name }}
    </h3>
    <div class="p-3">
      <TargetsLevelsCard
        :current-level="skill.current_level_indicator_id"
        :required-level="skill.required_level_indicator_id"
      />
    </div>
    <div class="p-3">
      <TargetsLevelsCard :required-level="skill.required_level_indicator_id" />
    </div>
  </div>
  <LazyTargetsEditSkillsTreeCardPage
    v-if="isPopupOpened"
    :id="skill.id!"
    @close-popup="isPopupOpened = false"
  />
</template>
