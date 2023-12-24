<script setup lang="ts">
defineProps<{
  /** `ID` текущего уровня */
  currentLevel?: number
  /** `ID` требуемого уровня */
  requiredLevel: number | undefined
}>()

const levelsStore = useTargetsLevelsStore()
</script>

<template>
  <div
    class="flex h-6 w-6 items-center justify-center rounded-full text-md"
    :class="levelsStore.getLevelStyle(currentLevel, requiredLevel)"
  >
    {{ levelsStore.getLevel(currentLevel, requiredLevel)?.label }}
  </div>
</template>
