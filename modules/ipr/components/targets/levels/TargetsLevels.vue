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
  <div class="divide-y divide-neutral-100 rounded-md border border-neutral-100">
    <div
      v-for="level in levelsStore.levels"
      :key="level.id"
      class="grid h-10 grid-cols-5 divide-x divide-neutral-100"
    >
      <div class="flex h-full items-center px-3">
        <!--
          Если это не текущий и не требуемый уровень, то фон не выводится.

          Если уровень является текущим, то в currentLevel передаем текущий уровень, а в requiredLevel — требуемый.
          Иначе передаем в требуемый уровень сам уровень, не передавая при этом currentLevel.
        -->
        <TargetsLevelsCard
          :class="{
            'bg-transparent':
              level.id !== currentLevel && level.id !== requiredLevel,
          }"
          :current-level="level.id === currentLevel ? currentLevel : undefined"
          :required-level="level.id === currentLevel ? requiredLevel : level.id"
        />
      </div>
      <p class="col-span-4 flex h-full items-center px-2">
        {{ level.description }}
      </p>
    </div>
  </div>
</template>
