<script setup lang="ts">
import type {
  SkillsTreeItemCompetency,
  SkillsTreeItemCompetencyCluster,
  SkillsTreeItemSkill,
} from "@/Api"

const props = defineProps<{
  /** Открыт ли пункт по умолчанию */
  isDefaultOpened?: boolean
  /** Поисковой запрос */
  searchQuery?: string
  /** Навык */
  skill:
    | SkillsTreeItemCompetencyCluster
    | SkillsTreeItemCompetency
    | SkillsTreeItemSkill
}>()

const LazyIcon = resolveComponent("LazyIcon")

/** Выбранные навыки */
const selectedSkills = inject<Ref<Set<number | undefined>>>("targetSkills")

/**
 * Данная функция нужна для выбора навыков.
 *
 * Если в нее передан единичный навык:
 * - При отсутствии этого навыка в списке — она его добавляет.
 * - При наличии — удаляет.
 *
 * Если в нее передана компетенция:
 * - При наличии всех элементов в списке — она их удаляет.
 * - При наличии хотя бы одного — добавляет остальные.
 * - При наличии всех — удаляет все.
 */
function selectSkill() {
  // Закрываем поп-ап
  isPopupOpened.value = false

  /** Является ли навык компетенцией */
  const isCompetency = props.skill.type === "competency"

  // Проверяем, является ли навык компетенцией
  if (isCompetency) {
    // Если выбраны все дочерние элементы
    if (isAllChildrenSelected.value) {
      // Удаляем их из списка выбранных
      props.skill.children?.forEach(
        (childSkill) => selectedSkills?.value.delete(childSkill.id)
      )
    } else {
      // Иначе добавляем все дочерние элементы в список выбранных
      props.skill.children?.forEach(
        (childSkill) => selectedSkills?.value.add(childSkill.id)
      )
    }
  } else {
    // Если навык не является компетенцией
    // Проверяем, есть ли навык в списке выбранных
    if (isSkillSelected.value) {
      // Если есть, то удаляем его
      selectedSkills?.value.delete(props.skill.id)
    } else {
      // Если нет, то добавляем
      selectedSkills?.value.add(props.skill.id)
    }
  }
}

/** Выбран ли навык */
const isSkillSelected = computed(() => {
  if (props.skill.type === "competency") {
    return (
      (props.skill.children?.filter(
        (childSkill) => selectedSkills?.value.has(childSkill.id)
      ).length ?? 0) > 0
    )
  } else {
    return selectedSkills?.value.has(props.skill.id)
  }
})

/** Выбраны ли все дочерние элементы */
const isAllChildrenSelected = computed(() => {
  return (
    (props.skill.children?.filter(
      (childSkill) => selectedSkills?.value.has(childSkill.id)
    ).length ?? 0) === props.skill.children?.length
  )
})

/** Открыт ли попап навыка */
const isPopupOpened = ref(false)
</script>

<template>
  <HeadlessDisclosure
    :default-open="(searchQuery?.length ?? 0) > 2 || isDefaultOpened"
  >
    <div
      class="grid h-10 min-w-max grid-cols-6 items-center divide-x divide-neutral-100 lg:min-w-0"
    >
      <div
        class="col-span-4 flex items-center gap-x-2.5 px-2"
        :class="{
          'pl-20': skill.type === 'skill',
          'pl-8': skill.type === 'competency',
        }"
      >
        <HeadlessDisclosureButton
          v-if="skill.type !== 'skill'"
          :as="LazyIcon"
          class="shrink-0 cursor-pointer fill-neutral-400 ui-not-open:-rotate-90"
          name="SvgoChevronDown"
          size="16"
        />
        <input
          v-if="skill.type !== 'competency_cluster'"
          :id="skill.id?.toString()"
          :checked="isSkillSelected && isAllChildrenSelected"
          data-test-id="selectSkill"
          :indeterminate="isSkillSelected && !isAllChildrenSelected"
          type="checkbox"
          @input="selectSkill"
        />
        <!-- eslint-disable vue/no-v-html -->
        <p
          class="line-clamp-1 cursor-pointer text-sm leading-loose decoration-neutral underline-offset-4 hover:underline"
          data-test-id="isPopupOpened"
          @click="isPopupOpened = true"
          v-html="useHighlightedText(skill.name ?? '', searchQuery ?? '')"
        />
      </div>
      <div class="flex h-full items-center px-2">
        <LazyTargetsLevelsCard
          v-if="skill.type === 'skill'"
          :current-level="skill.current_level_indicator_id"
          :required-level="skill.required_level_indicator_id"
        />
      </div>
      <div class="flex h-full items-center px-2">
        <LazyTargetsLevelsCard
          v-if="skill.type === 'skill'"
          :required-level="skill.required_level_indicator_id"
        />
      </div>
    </div>
    <HeadlessDisclosurePanel class="divide-y divide-neutral-100">
      <TargetsEditSkillsTreeCard
        v-for="childSkill in skill.children as (
          | SkillsTreeItemCompetency
          | SkillsTreeItemSkill
        )[]"
        :key="childSkill.id"
        :search-query="searchQuery"
        :skill="childSkill"
      />
    </HeadlessDisclosurePanel>
  </HeadlessDisclosure>
  <LazyTargetsEditSkillsTreeCardPage
    v-if="isPopupOpened"
    :id="skill.id!"
    show-controls
    @close-popup="isPopupOpened = false"
    @select-skill="selectSkill"
  />
</template>
