<script setup lang="ts">
import type {
  MaterialsTreeItemCategory,
  MaterialsTreeItemMaterial,
} from "@/Api"

const props = defineProps<{
  /** Открыт ли пункт по умолчанию */
  isDefaultOpened?: boolean
  /** Материал */
  material: MaterialsTreeItemCategory | MaterialsTreeItemMaterial
  /** Поисковой запрос */
  searchQuery?: string
}>()

const LazyIcon = resolveComponent("LazyIcon")

/** Выбранные материалы */
const selectedMaterials =
  inject<Ref<Set<number | undefined>>>("targetMaterials")

/**
 * Данная функция нужна для выбора материалов.
 *
 * - При отсутствии этого материала в списке — она его добавляет.
 * - При наличии — удаляет.
 */
function selectMaterial() {
  // Закрываем поп-ап
  isPopupOpened.value = false

  // Проверяем, есть ли материал в списке выбранных
  if (isMaterialSelected.value) {
    // Если есть, то удаляем его
    selectedMaterials?.value.delete(props.material.id)
  } else {
    // Если нет, то добавляем
    selectedMaterials?.value.add(props.material.id)
  }
}

/** Выбран ли материал */
const isMaterialSelected = computed(() => {
  return selectedMaterials?.value.has(props.material.id)
})

/** Открыт ли попап материала */
const isPopupOpened = ref(false)
</script>

<template>
  <HeadlessDisclosure
    :default-open="(searchQuery?.length ?? 0) > 0 || isDefaultOpened"
  >
    <div
      class="grid h-10 min-w-max grid-cols-6 items-center divide-x divide-neutral-100 md:min-w-0"
    >
      <div
        class="col-span-4 flex items-center gap-x-2.5 px-2"
        :class="{
          'pl-20': material.type === 'material',
          'pl-8': material.type === 'category' && material.parent_id,
        }"
      >
        <HeadlessDisclosureButton
          v-if="material.type !== 'material'"
          :as="LazyIcon"
          class="cursor-pointer fill-neutral-400 ui-not-open:-rotate-90"
          name="SvgoChevronDown"
          size="16"
        />
        <input
          v-if="material.type === 'material'"
          :id="material.id?.toString()"
          :checked="isMaterialSelected"
          data-test-id="selectMaterial"
          type="checkbox"
          @input="selectMaterial"
        />
        <div
          class="flex gap-x-4 text-sm"
          :class="{ 'cursor-pointer': material.type === 'material' }"
          data-test-id="isPopupOpened"
          @click="isPopupOpened = true && material.type === 'material'"
        >
          <!-- eslint-disable vue/no-v-html -->
          <p
            class="line-clamp-1"
            :class="{
              'leading-loose decoration-neutral underline-offset-4 hover:underline':
                material.type === 'material',
            }"
            v-html="useHighlightedText(material.name ?? '', searchQuery ?? '')"
          />
          <LazyTargetsMaterialsPaid
            v-if="material.type === 'material' && material.is_paid"
          />
        </div>
      </div>
      <div class="col-span-2 flex h-full items-center px-2">
        <p
          v-if="material.type === 'material'"
          class="line-clamp-1 text-neutral-600"
        >
          {{ material.skills?.map((skill) => skill.name).join(", ") }}
        </p>
      </div>
    </div>
    <HeadlessDisclosurePanel class="divide-y divide-neutral-100">
      <TargetsEditMaterialsTreeCard
        v-for="childMaterial in material.children as (
          | MaterialsTreeItemCategory
          | MaterialsTreeItemMaterial
        )[]"
        :key="childMaterial.id"
        :material="childMaterial"
        :search-query="searchQuery"
      />
    </HeadlessDisclosurePanel>
  </HeadlessDisclosure>
  <LazyTargetsEditMaterialsTreeCardPage
    v-if="isPopupOpened"
    :id="material.id!"
    show-controls
    @close-popup="isPopupOpened = false"
    @select-material="selectMaterial"
  />
</template>
