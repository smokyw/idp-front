<script setup lang="ts">
import type { SkillsSkillCollectionView } from "@/Api"

defineProps<{
  /** Материалы цели */
  skills: SkillsSkillCollectionView[] | undefined
}>()

const { t } = useI18n()
</script>

<template>
  <div class="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
    <div class="grid h-10 grid-cols-6 items-center divide-neutral-200">
      <p class="col-span-4 px-3 text-xs text-neutral">
        {{ t("ipr.targets.pageTitles.name") }}
      </p>
      <p class="px-3 text-xs text-neutral">
        {{ t("ipr.targets.skills.currentLevel") }}
      </p>
      <p class="px-3 text-xs text-neutral">
        {{ t("ipr.targets.skills.requiredLevel") }}
      </p>
    </div>
    <LazyTargetsSkillsCard
      v-for="skill in skills"
      :key="skill.id"
      :skill="skill"
    />
  </div>
</template>
