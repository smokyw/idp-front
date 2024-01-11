<script setup lang="ts">
import type { DivisionsTreeItemBase } from "@/Api"

defineProps<{
  /** Открыты ли элементы по умолчанию */
  defaultOpen?: boolean
  /** Глубина вложенности */
  depth: number
  /** Подразделение организационной структуры */
  division: DivisionsTreeItemBase
  /** Поисковой запрос */
  searchQuery: string
}>()

/** Выбранные подразделения */
const selectedDivisions = inject<Ref<Set<number>>>("selectedDivisions")

/**
 * Выбрать подразделение.
 *
 * @param division - подразделение для выбора.
 * @param event - событие нажатия на чекбокс.
 */
function selectDivision(division: DivisionsTreeItemBase, event: Event) {
  // Если у подразделения есть дочерние элементы
  if (division.children?.length) {
    // Для каждого дочернего элемента запускаем функцию выбора.
    division.children.forEach((childDivision) => {
      selectDivision(childDivision, event)
    })
  } else {
    // Иначе выбираем один элемент
    if (
      selectedDivisions?.value.has(division.id!) && // Если элемент уже выбран
      !(event.target as HTMLInputElement).checked // И если родительский чекбокс перешел в состояние «Не выбран»
    ) {
      // То удаляем данное подразделение из списка выбранных
      selectedDivisions?.value.delete(division.id!)
    } else {
      // Иначе добавляем подразделение в список выбранных
      selectedDivisions?.value.add(division.id!)
    }
  }
}

/**
 * Функция для проверки, выбраны ли все дочерние элементы подразделения.
 *
 * @param division - подразделение.
 * @returns выбраны ли все дочерние элементы.
 */
function isAllChildrenSelected(division: DivisionsTreeItemBase): boolean {
  // Если у подразделения есть дочерние элементы
  if (division.children?.length) {
    // Для каждого дочернего элемента проверяем наличие всех выбранных элементов.
    return division.children.every((childDivision) =>
      isAllChildrenSelected(childDivision)
    )
  } else {
    // Иначе проверяем наличие самого элемента в списка выбранных.
    return selectedDivisions?.value.has(division.id!) ?? false
  }
}

/**
 * Функция для проверки, выбран ли хотя бы один дочерний элемент.
 *
 * @param division - подразделение.
 * @returns выбран ли хотя бы один дочерний элемент.
 */
function isSomeChildrenSelected(division: DivisionsTreeItemBase): boolean {
  // Если у подразделения есть дочерние элементы
  if (division.children?.length) {
    // Для каждого дочернего элемента проверяем наличие хотя бы одного выбранного элемента.
    return division.children.some((childDivision) =>
      isSomeChildrenSelected(childDivision)
    )
  } else {
    return selectedDivisions?.value.has(division.id!) ?? false
  }
}
</script>

<template>
  <HeadlessDisclosure :default-open="defaultOpen">
    <div class="flex items-center gap-x-2.5 px-2 py-3">
      <HeadlessDisclosureButton :style="{ paddingLeft: depth * 1.625 + 'rem' }">
        <Icon
          class="fill-neutral-400 ui-not-open:-rotate-90"
          :class="{
            'pointer-events-none opacity-0': !division.children?.length,
          }"
          name="SvgoChevronDown"
          size="16"
        />
      </HeadlessDisclosureButton>
      <input
        :checked="
          isAllChildrenSelected(division) ||
          selectedDivisions?.has(division.id!)
        "
        data-test-id="selectDivision"
        :indeterminate="
          isSomeChildrenSelected(division) && !isAllChildrenSelected(division)
        "
        type="checkbox"
        @change="selectDivision(division, $event)"
      />
      <!-- eslint-disable vue/no-v-html -->
      <h5
        class="text-sm"
        v-html="useHighlightedText(division.name!, searchQuery)"
      />
    </div>
    <HeadlessDisclosurePanel class="flex flex-col divide-y divide-neutral-100">
      <LazyEmployeesFiltersDivisionsCard
        v-for="childDivision in division.children"
        :key="childDivision.id"
        :default-open="defaultOpen"
        :depth="depth + 1"
        :division="childDivision"
        :search-query="searchQuery"
      />
    </HeadlessDisclosurePanel>
  </HeadlessDisclosure>
</template>
