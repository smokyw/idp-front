<script setup lang="ts">
import type {
  BaseSort,
  EmployeesCollectionFilter,
  EmployeesCollectionSort,
} from "@/Api"
import type { PaginationModel } from "@/components/v-pagination/VPagination.vue"

const props = defineProps<{
  /** Отображать только тех сотрудников, для которых требуется действие */
  actionRequiredOnly?: boolean
  /** Подразделения */
  divisions: number[]
  /** Статусы ИПР */
  idpStatuses: EmployeesCollectionFilter["idp_statuses"]
  /** Поисковой запрос */
  search: string
  /** Статусы сотрудников */
  showArchive: boolean
  /** Год */
  year: number
}>()

const { t } = useI18n()

/** Количество результатов на текущей вкладке */
const currentActionStatusesTabCount = inject<Ref<number>>(
  "currentActionStatusesTabCount"
)

/** Сортировка */
const sort = ref<EmployeesCollectionSort>({
  attribute: "created_at",
  direction: "desc",
})

/**
 * Функция для выбора сортировки.
 *
 * Если текущий атрибут уже выбран, меняет направление сортировки.
 * Иначе выставляет новый атрибут.
 *
 * @param attribute - атрибут, по которому проводится сортировка.
 * @param direction - направление сортировки.
 */
function selectSort(
  attribute: EmployeesCollectionSort["attribute"],
  direction: BaseSort["direction"]
) {
  // Если текущий атрибут уже выбран
  if (sort.value.attribute === attribute) {
    // Меняем направление сортировки
    sort.value.direction = sort.value.direction === "asc" ? "desc" : "asc"
  } else {
    // Иначе выставляем новый атрибут
    sort.value = {
      attribute,
      direction,
    }
  }
}

/** Пагинация */
const pagination = ref<PaginationModel>({
  currentPage: 1,
  pageSize: 50,
})

/**
 * Функция для получения списка сотрудников.
 *
 * @returns список сотрудников.
 */
async function getEmployees() {
  const employees = await useApi().employees.employeesGetCollection(
    {
      filter: {
        action_required_only: toRefs(props).actionRequiredOnly.value,
        division_ids: toRefs(props).divisions.value,
        employee_statuses: toRefs(props).showArchive.value
          ? ["active", "archived"]
          : ["active"],
        idp_statuses: toRefs(props).idpStatuses.value,
        idp_year: toRefs(props).year.value,
        text_query: toRefs(props).search.value,
      },
      pagination: {
        page: pagination.value.currentPage,
        per_page: pagination.value.pageSize,
      },
      sort: sort.value,
    },
    {
      headers: useAuth().generateHeaders(),
    }
  )

  // Выставляем количество результатов на текущей вкладке
  currentActionStatusesTabCount!.value =
    employees.data.meta?.pagination?.total ?? 0

  return employees
}

/**
 * Функция для обновления списка сотрудников.
 */
async function updateEmployees() {
  // Показываем спиннер загрузки
  isLoading.value = true

  // Получаем список сотрудников
  employees.value = await getEmployees()

  // Скрываем спиннер загрузки
  isLoading.value = false
}

/** Список сотрудников */
const employees = ref(await getEmployees())
provide("employees", employees)

/** Список колонок таблицы */
const columns = {
  external_id: "desc",
  full_name: "asc",
  idp_status: "asc",
  idp_progress: "asc", // eslint-disable-line sort-keys-fix/sort-keys-fix
  idp_price: "desc", // eslint-disable-line sort-keys-fix/sort-keys-fix
  created_at: "desc", // eslint-disable-line sort-keys-fix/sort-keys-fix
} as const satisfies Partial<
  Record<
    NonNullable<EmployeesCollectionSort["attribute"]>,
    BaseSort["direction"]
  >
>

watch(
  [props, pagination, sort, () => useRoute().path],
  () => {
    if (useRoute().path === "/employees") {
      updateEmployees()
    }
  },
  {
    deep: true,
  }
)

/** Показывать ли спиннер загрузки */
const isLoading = ref(false)

// МАССОВЫЕ ДЕЙСТВИЯ

/** Выбранные сотрудники */
const selectedEmployees = ref(new Set<number>())
provide("selectedEmployees", selectedEmployees)

/**
 * Функция для выбора всех сотрудников.
 *
 * Если все сотрудники из списка выбраны, очищаем выбранных сотрудников.
 * Иначе добавляем всех сотрудников в список.
 */
function selectAll() {
  // Если все сотрудники выбраны
  if (isAllSelected.value) {
    // Очищаем выбранных сотрудников
    employees.value.data.data?.success?.forEach((employee) =>
      selectedEmployees.value.delete(employee.id!)
    )
  } else {
    // Иначе добавляем всех сотрудников в список
    employees.value.data.data?.success?.forEach((employee) =>
      selectedEmployees.value.add(employee.id!)
    )
  }
}

/** Выбраны ли все сотрудники */
const isAllSelected = computed(() => {
  return (
    !!employees.value.data.data?.success?.length &&
    employees.value.data.data?.success?.every((employee) =>
      selectedEmployees.value.has(employee.id!)
    )
  )
})

/** Выбран ли хотя бы один сотрудник */
const isSomeSelected = computed(() => {
  return employees.value.data.data?.success?.some((employee) =>
    selectedEmployees.value.has(employee.id!)
  )
})
</script>

<template>
  <div
    class="relative flex flex-col gap-y-2 lg:block lg:h-full lg:w-full lg:divide-y lg:divide-neutral-100 lg:overflow-auto lg:rounded-2xl lg:bg-white"
  >
    <div
      class="sticky top-0 z-10 hidden grid-cols-[3.25rem_5rem_20.25rem_13.25rem_8.5rem_9rem_7rem] bg-white lg:grid"
    >
      <div class="flex items-center justify-center">
        <input
          :checked="isAllSelected"
          data-test-id="selectAll"
          :indeterminate="isSomeSelected && !isAllSelected"
          type="checkbox"
          @input="selectAll"
        />
      </div>
      <div
        v-for="(direction, column) in columns"
        :key="column"
        class="relative flex w-max cursor-pointer items-center gap-x-1 p-4"
        data-test-id="selectSort"
        @click="selectSort(column, direction)"
      >
        <span class="text-md font-medium text-neutral">
          {{ t(`employees.columns.${column}`) }}
        </span>
        <LazyIcon
          v-if="column === sort.attribute"
          class="shrink-0 fill-primary"
          :class="[sort.direction === 'asc' ? 'rotate-90' : '-rotate-90']"
          name="SvgoArrowLeft"
          size="12"
        />
      </div>
    </div>
    <div
      v-if="isLoading"
      class="flex h-full w-full flex-col items-center justify-center"
    >
      <LazyIcon class="text-neutral-200" name="svg-spinners:270-ring" />
    </div>
    <template v-else-if="employees.data.data?.success?.length">
      <LazyEmployeesCard
        v-for="employee in employees.data.data?.success"
        :key="employee.id"
        :employee="employee"
        :year="year"
      />
    </template>
    <div
      v-else
      class="flex h-full w-full flex-col items-center justify-center gap-y-8 text-center text-neutral-400"
    >
      <p
        v-for="line in ['emptySearch', 'emptyFilters']"
        :key="line"
        class="max-w-[26.25rem]"
      >
        {{ t(`system.${line}`) }}
      </p>
    </div>
  </div>
  <VPagination
    v-model="pagination"
    data-test-id="pagination"
    :pagination="employees.data.meta?.pagination"
  />
  <LazyEmployeesActions
    v-if="selectedEmployees.size"
    :selected-employees="selectedEmployees"
    :year="year"
    @clear-employees="selectedEmployees.clear()"
    @update-employees="updateEmployees"
  />
</template>
