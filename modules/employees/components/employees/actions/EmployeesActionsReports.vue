<script setup lang="ts">
import type { IdpGenerateReportsRequest, TasksTaskAttributeType } from "@/Api"
import type { Option } from "@/types/Utils"

defineProps<{
  /** Год ИПР */
  year: number
}>()

const emit = defineEmits<{
  /** Закрыть окно */
  close: []
}>()

const { t } = useI18n()

/** Выбранные сотрудники */
const selectedEmployees = inject<Ref<Set<number>>>("selectedEmployees")

const reports = [
  "targets.report",
  "materials.report",
  "idp.status_report",
] as const satisfies TasksTaskAttributeType["type"][]

/** Выбранные отчеты */
const selectedReports = ref(new Set<TasksTaskAttributeType["type"]>())

/**
 * Функция для выбора всех отчетов.
 *
 * Если выбраны все отчеты, то выбор сбрасывается.
 * Иначе выбираются все отчеты.
 */
function selectAllReports() {
  // Если выбраны все отчеты
  if (selectedReports.value.size === reports.length) {
    // Выбор сбрасывается
    selectedReports.value.clear()
  } else {
    // Иначе выбираются все отчеты
    reports.forEach((report) => selectedReports.value.add(report))
  }
}

/** Выбранные годы отчетов */
const reportsYears = ref<
  Partial<Record<NonNullable<TasksTaskAttributeType["type"]>, Option<number>>>
>({})

/**
 * Функция для создания отчетов.
 */
async function generateReports() {
  /** Данные об отчетах */
  const reportsData: IdpGenerateReportsRequest = {
    employee_ids: Array.from(selectedEmployees!.value),
    reports: Array.from(selectedReports.value).map((reportKey) => {
      return {
        type: reportKey,
        years: reportsYears.value[reportKey!]?.id
          ? [reportsYears.value[reportKey!]!.id]
          : null,
      }
    }),
  }

  // Отправляем запрос на создание
  const tasks = await useApi().idp.idpGenerateReports(reportsData, {
    headers: useAuth().generateHeaders(),
  })

  /** Хранилище задач */
  const tasksStore = useTasksStore()
  tasks.data.data?.success?.forEach((task) => {
    tasksStore.generatingTasks[task.id!] = task
  })

  // Закрываем окно создания
  emit("close")
}

/** Доступные года */
const years = await useApi().idp.idpGetYearsOfAllEmployees({
  headers: useAuth().generateHeaders(),
})
</script>

<template>
  <VPopup
    close-explicitly
    :title="t('employees.actions.generateReport.title')"
    window-classes="!w-[40rem]"
    @close="emit('close')"
  >
    <div class="flex flex-col gap-y-3">
      <p class="text-neutral">
        {{
          t("employees.actions.generateReport.description", {
            number: selectedEmployees?.size,
          })
        }}
      </p>
      <div
        class="flex flex-col divide-y divide-neutral-100 rounded-2xl border border-neutral-50"
      >
        <div class="flex h-[3.25rem] items-center gap-x-8 px-4">
          <input
            :checked="selectedReports.size === reports.length"
            data-test-id="selectAllReports"
            :indeterminate="
              selectedReports.size > 0 &&
              selectedReports.size !== reports.length
            "
            type="checkbox"
            @click="selectAllReports"
          />
          <p class="text-neutral-400">
            {{ t("employees.actions.generateReport.columnTitle") }}
          </p>
        </div>
        <div
          v-for="report in reports"
          :key="report"
          class="flex h-[3.25rem] items-center gap-x-8 px-4"
        >
          <input
            v-model="selectedReports"
            data-test-id="selectedReports"
            type="checkbox"
            :value="report"
          />
          <p class="font-medium">
            {{ t(`employees.actions.generateReport.reports.${report}`) }}
          </p>
          <EmployeesFiltersYears
            v-if="selectedReports.has(report)"
            v-model="reportsYears[report]"
            all-option
            class="ml-auto"
            data-test-id="selectedYear"
            :desired-year="year"
            :years="years.data.data?.success"
          />
        </div>
      </div>
    </div>
    <template #footerButtons>
      <button
        class="button md outlined"
        data-test-id="emit"
        @click="emit('close')"
      >
        {{ t("system.cancel") }}
      </button>
      <button
        class="button md primary"
        data-test-id="createTargets"
        :disabled="!selectedReports.size"
        @click="generateReports"
      >
        {{
          t("employees.actions.generateReport.button", {
            number: selectedReports.size || undefined,
          })
        }}
      </button>
    </template>
  </VPopup>
</template>
