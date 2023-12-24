<script setup lang="ts">
import type { EmployeesCollectionFilter } from "@/Api"
import type { Tab } from "@/types/Utils"

const props = defineProps<{
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

/** Доступные ID вкладок */
export type tabId = "actionRequired" | "all"

/** Список вкладок */
const tabs = ref<Tab<tabId>[]>([
  {
    id: "actionRequired",
    title: t("employees.actionStatuses.required"),
  },
  {
    id: "all",
    title: t("employees.actionStatuses.all"),
  },
])

/** Выбранная вкладка */
const selectedTab = defineModel<tabId>({
  required: true,
})

/** Количество результатов на текущей вкладке */
const currentActionStatusesTabCount = inject<Ref<number>>(
  "currentActionStatusesTabCount"
)

// Следим за изменением вкладки
watch(
  () => currentActionStatusesTabCount?.value,
  () => {
    // При изменении вкладки меняем на новой вкладке количество результатов
    tabs.value.find((tab) => tab.id === selectedTab.value)!.counter =
      currentActionStatusesTabCount?.value
  },
  {
    immediate: true,
  }
)

watch(
  [props],
  async () => {
    // Загружаем количество результатов на невыбранную вкладку
    tabs.value[selectedTab.value === "actionRequired" ? 1 : 0].counter = (
      await useApi().employees.employeesGetCount(
        {
          filter: {
            action_required_only: selectedTab.value !== "actionRequired",
            division_ids: toRefs(props).divisions.value,
            employee_statuses: toRefs(props).showArchive.value
              ? ["active", "archived"]
              : ["active"],
            idp_statuses: toRefs(props).idpStatuses.value,
            idp_year: toRefs(props).year.value,
            text_query:
              toRefs(props).search.value.length >= 3
                ? toRefs(props).search.value
                : "",
          },
        },
        {
          headers: useAuth().generateHeaders(),
        }
      )
    ).data.data?.success?.count
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <VTabs
    v-model="selectedTab"
    class="grid !w-full grid-cols-2 sm:flex sm:!w-max"
    data-test-id="selectedTab"
    :tabs="tabs"
  />
</template>
