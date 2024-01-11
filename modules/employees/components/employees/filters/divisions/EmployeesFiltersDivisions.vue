<script setup lang="ts">
import { deepEqual } from "fast-equals"

const props = defineProps<{
  /** Выбранные подразделение от родительского компонента */
  parentSelectedDivisions: number[]
}>()

const emit = defineEmits<{
  /** Закрыть окно выбора подразделений */
  close: []
  /** Выбрать подразделения */
  selectDivisions: [number[]]
}>()

const { t } = useI18n()

/** Поисковой запрос */
const search = ref("")
/** Замедленный поисковой запрос */
const debouncedSearch = debouncedRef(search, 300)

/** Организационная структура */
const divisions = ref(await getDivisions())

/**
 * Функция для получения организационной структуры.
 *
 * @returns организационная структура.
 */
async function getDivisions() {
  return await useApi().divisions.divisionsGetTree(
    {
      filter: {
        name:
          debouncedSearch.value.length >= 3 ? debouncedSearch.value : undefined,
      },
    },
    {
      headers: useAuth().generateHeaders(),
    }
  )
}

/** Активна ли загрузка */
const isLoading = ref(false)

watch(debouncedSearch, async () => {
  // Устанавливаем значение загрузки на true
  isLoading.value = true

  // Обновляем список подразделений
  divisions.value = await getDivisions()

  // Устанавливаем значение загрузки на false
  isLoading.value = false
})

/** Выбранные подразделения */
const selectedDivisions = ref(
  new Set<number>(toRefs(props).parentSelectedDivisions.value)
)
provide("selectedDivisions", selectedDivisions)
</script>

<template>
  <VPopup
    is-full-screen
    :title="t('employees.filters.divisions.title')"
    window-classes="lg:!w-[960px]"
    @click-outside="emit('close')"
  >
    <div
      class="flex flex-col divide-y divide-neutral-100 rounded-2xl border border-neutral-100"
    >
      <div class="p-3">
        <input
          v-model="search"
          data-test-id="search"
          :placeholder="t('employees.filters.divisions.search')"
          type="text"
        />
      </div>
      <div v-if="isLoading" class="flex h-80 items-center justify-center">
        <LazyIcon class="text-neutral-200" name="svg-spinners:270-ring" />
      </div>
      <template v-else-if="divisions.data.data?.success?.length">
        <template v-if="debouncedSearch.length >= 3">
          <LazyEmployeesFiltersDivisionsCard
            v-for="division in divisions.data.data?.success"
            :key="division.id"
            default-open
            :depth="0"
            :division="division"
            :search-query="debouncedSearch"
          />
        </template>
        <template v-else>
          <LazyEmployeesFiltersDivisionsCard
            v-for="division in divisions.data.data?.success"
            :key="division.id"
            :depth="0"
            :division="division"
            :search-query="debouncedSearch"
          />
        </template>
      </template>
      <div
        v-else
        class="flex h-80 items-center justify-center text-sm text-neutral-400"
      >
        {{ t("system.emptySearch") }}
      </div>
    </div>
    <template #footerButtons>
      <button
        class="button md outlined"
        data-test-id="selectedAction"
        @click="
          () => {
            selectedDivisions.clear()
          }
        "
      >
        {{ t("system.reset") }}
      </button>
      <button
        class="button md primary"
        data-test-id="sendActionRequest"
        :disabled="
          deepEqual(Array.from(selectedDivisions), parentSelectedDivisions)
        "
        @click="emit('selectDivisions', Array.from(selectedDivisions))"
      >
        {{
          t("system.select", {
            number: selectedDivisions.size || undefined,
          })
        }}
      </button>
    </template>
  </VPopup>
</template>
