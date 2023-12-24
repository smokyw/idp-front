<script setup lang="ts">
import type {
  SkillsTreeItemCompetency,
  SkillsTreeItemCompetencyCluster,
  SkillsTreeItemSkill,
} from "@/Api"

const props = defineProps<{
  /** Поисковой запрос */
  search: string
}>()

const skills = ref<
  | Array<
      | SkillsTreeItemCompetencyCluster
      | SkillsTreeItemCompetency
      | SkillsTreeItemSkill
    >
  | undefined
>([])

/**
 * Функция для получения навыков.
 */
async function getSkills() {
  skills.value = (
    await useApi().skills.skillsGetTree(
      {
        filter: {
          name: props.search.length > 2 ? props.search : undefined,
        },
      },
      {},
      {
        headers: useAuth().generateHeaders(),
      }
    )
  ).data.data?.success
}

// Получаем навыки
await getSkills()

// Следим за изменением поискового запроса
watch(toRefs(props).search, () => {
  // При его изменении обновляем список навыков
  getSkills()
})
</script>

<template>
  <div class="flex flex-col divide-y divide-neutral-100">
    <!-- Ниже представлены два списка: один с поиском, второй без. Это сделано для того, чтобы при поиске список перерендеривался -->
    <template v-if="search.length > 2 && skills?.length">
      <!-- Список с поиском -->
      <TargetsEditSkillsTreeCard
        v-for="skill in skills"
        :key="skill.id"
        :search-query="search"
        :skill="skill"
      />
    </template>
    <template v-else-if="skills?.length">
      <!-- Список без поиска -->
      <TargetsEditSkillsTreeCard
        v-for="skill in skills"
        :key="skill.id"
        is-default-opened
        :skill="skill"
      />
    </template>
    <LazyTargetsEditEmptySearch v-else is-skill />
  </div>
</template>
