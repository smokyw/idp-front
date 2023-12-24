<script setup lang="ts">
import type { EmployeesCollectionSuccessResponse } from "@/Api"

const props = defineProps<{
  /** Сотрудник */
  employee: NonNullable<
    NonNullable<EmployeesCollectionSuccessResponse["data"]>["success"]
  >[number]
  /** Год ИПР */
  year: number
}>()

const { t } = useI18n()

/** Прогресс ИПР */
const idpProgress = computed(() => {
  return props.employee.idp?.count_of_targets_done !== undefined &&
    props.employee.idp?.count_of_targets
    ? Math.trunc(
        (100 * props.employee.idp?.count_of_targets_done) /
          props.employee.idp?.count_of_targets
      )
    : undefined
})

// МАССОВЫЕ ДЕЙСТВИЯ

/** Выбранные сотрудники */
const selectedEmployees = inject<Ref<Set<number>>>("selectedEmployees")
</script>

<template>
  <div
    class="flex flex-col gap-y-2 rounded-2xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between lg:grid lg:h-[3.25rem] lg:grid-cols-[3.25rem_5rem_20.25rem_13.25rem_8.5rem_9rem_7rem] lg:rounded-none lg:bg-transparent lg:p-0"
  >
    <div class="flex items-center justify-center">
      <input
        v-model="selectedEmployees"
        data-test-id="selectedEmployees"
        type="checkbox"
        :value="employee.id"
      />
    </div>
    <p
      class="line-clamp-1 hidden px-4 lg:grid"
      :class="{ 'text-neutral-400': employee.status === 'archived' }"
    >
      {{ employee.external_id }}
    </p>
    <NuxtLinkLocale
      class="flex items-center p-0 lg:h-[3.25rem] lg:px-4"
      :to="{
        path: `/employees/${employee.id}`,
        query: {
          year,
        },
      }"
    >
      <EmployeesCardUser :employee="employee" />
    </NuxtLinkLocale>
    <div class="p-0 lg:px-4">
      <EmployeesCardIdpStatus :employee="employee" />
    </div>
    <div
      class="group relative hidden items-center justify-between px-4 lg:flex"
    >
      <template
        v-if="
          props.employee.idp?.count_of_targets_done !== undefined &&
          props.employee.idp?.count_of_targets
        "
      >
        <span :class="{ 'text-neutral-400': employee.status === 'archived' }">
          {{
            t("system.percent", {
              number: idpProgress,
            })
          }}
        </span>
        <div
          class="relative h-1 w-16 overflow-hidden rounded-full bg-neutral-200"
        >
          <div
            class="h-full bg-primary"
            :class="{ '!bg-neutral-300': employee.status === 'archived' }"
            :style="{ width: idpProgress + '%' }"
          />
        </div>
      </template>
      <div
        class="absolute left-full top-full -ml-3 -mt-2 hidden w-max items-center gap-x-2 rounded-lg bg-white p-2.5 shadow-lg group-hover:flex"
      >
        <p class="text-xs">{{ t("employees.targetsCompleted") }}</p>
        <div
          class="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1"
        >
          <Icon name="SvgoTarget" size="14" />
          <span class="text-xs text-neutral-600">
            {{
              props.employee.idp?.count_of_targets_done +
              "/" +
              props.employee.idp?.count_of_targets
            }}
          </span>
        </div>
      </div>
    </div>
    <div
      class="hidden px-4 lg:block"
      :class="{ 'text-neutral-400': employee.status === 'archived' }"
    >
      <template v-if="employee.idp?.price">
        {{ usePriceFormatter(employee.idp?.price) }}
      </template>
    </div>
    <div
      class="hidden px-4 lg:block"
      :class="{ 'text-neutral-400': employee.status === 'archived' }"
    >
      {{
        useDateConverter().parseDate(employee.created_at!).toLocaleDateString()
      }}
    </div>
  </div>
</template>
