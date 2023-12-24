<script setup lang="ts">
import type {
  MaterialsTreeItemCategory,
  MaterialsTreeItemMaterial,
} from "@/Api"

const props = defineProps<{
  /** Поисковой запрос */
  search: string
}>()

const materials = ref<
  Array<MaterialsTreeItemCategory | MaterialsTreeItemMaterial> | undefined
>([])

/**
 * Функция для получения навыков.
 */
async function getMaterials() {
  materials.value = (
    await useApi().materials.materialsGetTree(
      {
        filter: {
          name: props.search.length ? props.search : undefined,
        },
      },
      {
        headers: useAuth().generateHeaders(),
      }
    )
  ).data.data?.success
}

// Получаем навыки
await getMaterials()

// Следим за изменением поискового запроса
watch(toRefs(props).search, () => {
  // При его изменении обновляем список навыков
  getMaterials()
})
</script>

<template>
  <div class="flex flex-col divide-y divide-neutral-100">
    <!-- Ниже представлены два списка: один с поиском, второй без. Это сделано для того, чтобы при поиске список перерендеривался -->
    <template v-if="search.length && materials?.length">
      <!-- Список с поиском -->
      <TargetsEditMaterialsTreeCard
        v-for="material in materials"
        :key="material.id"
        :material="material"
        :search-query="search"
      />
    </template>
    <template v-else-if="materials?.length">
      <!-- Список без поиска -->
      <TargetsEditMaterialsTreeCard
        v-for="material in materials"
        :key="material.id"
        is-default-opened
        :material="material"
      />
    </template>
    <LazyTargetsEditEmptySearch v-else />
  </div>
</template>
