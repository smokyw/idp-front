<script setup lang="ts">
import type {
  EmployeesAccessRightsByEmployeeSuccessResponse,
  IdpIdpDetailsBriefView,
  TargetsCollectionSort,
  TargetsFiltersStatusGroup,
} from "@/Api"
import type { Option } from "@/types/Utils"

const { t } = useI18n()

const props = defineProps<{
  /** Права доступа */
  accessRights: NonNullable<
    EmployeesAccessRightsByEmployeeSuccessResponse["data"]
  >["success"]
  /** `ID` сотрудника */
  employeeId: number
  /** Выбранный ИПР */
  selectedIdp: IdpIdpDetailsBriefView
}>()

/** Количество целей */
const targetsCount = inject<Ref<number>>("targetsCount")

// ФИЛЬТРАЦИЯ ПО СТАТУСУ

/** Выбранный статус */
const selectedStatus = ref<TargetsFiltersStatusGroup["status_group"]>("active")

// СОРТИРОВКА

/** Опция сортировки */
interface SortOption extends Option {
  /** Направление сортировки */
  direction?: TargetsCollectionSort["direction"]
  id: TargetsCollectionSort["attribute"]
}

/** Опции для сортировки */
const sortOptions: SortOption[] = [
  {
    id: "priority",
    title: t("ipr.targets.sortOptions.priority"),
  },
  {
    direction: "asc",
    id: "deadline",
    title: t("ipr.targets.sortOptions.deadline"),
  },
  {
    direction: "desc",
    id: "created_at",
    title: t("ipr.targets.sortOptions.created_at-asc"),
  },
  {
    direction: "asc",
    id: "created_at",
    title: t("ipr.targets.sortOptions.created_at-desc"),
  },
]

/** Выбранная опция сортировки */
const selectedSortOption = ref(sortOptions[0])

// СПИСОК ЦЕЛЕЙ

/**
 * Функция для получения целей от API
 *
 * @returns Список целей
 */
async function getTargets() {
  return useApi().targets.targetsGetCollection(
    {
      filter: {
        idp_id: props.selectedIdp?.id ?? 0,
        status_group: selectedStatus.value,
      },
      sort: {
        attribute: selectedSortOption.value.id,
        direction: selectedSortOption.value.direction,
      },
    },
    {
      employee_id: props.employeeId,
    },
    {
      headers: useAuth().generateHeaders(),
    }
  )
}

/** Список целей */
const targets = ref(await getTargets())
targetsCount!.value = targets.value.data.data?.success?.length ?? 0

watch(
  () => [selectedStatus.value, selectedSortOption.value, props.selectedIdp],
  async () => {
    targets.value = await getTargets()
    targetsCount!.value = targets.value.data.data?.success?.length ?? 0
  }
)
</script>

<template>
  <div class="flex flex-col gap-y-4 rounded-2xl bg-white py-4">
    <div class="flex items-center justify-between px-4">
      <h2 class="h-[2.125rem] text-display-xs font-semibold">
        {{ t("employees.page.targets") }}
      </h2>
      <LazyNuxtLinkLocale
        v-if="
          accessRights?.['app.targets.create_target'] === 'granted' &&
          selectedStatus === 'active'
        "
        class="button sm"
        :class="[targets.data.data?.success?.length ? 'outlined' : 'primary']"
        :to="{
          path: `/employees/${employeeId}/targets/new`,
          query: {
            idpId: selectedIdp?.id,
          },
        }"
      >
        {{ t("ipr.targets.new.title") }}
      </LazyNuxtLinkLocale>
    </div>
    <div
      class="-mb-4 flex items-center gap-x-1 border-b border-neutral-100 px-4 pb-4"
    >
      <TargetsStatuses
        v-model="selectedStatus"
        data-test-id="selectedStatus"
        :employee-id="employeeId"
        :idp-id="selectedIdp.id!"
      />
      <LazyVSelect
        v-if="targets.data.data?.success?.length"
        v-model="selectedSortOption"
        button-style="squared"
        data-test-id="selectedSortOption"
        icon="SvgoSortLines"
        is-title-custom
        :options="sortOptions"
      />
    </div>
    <div
      v-if="targets.data.data?.success?.length"
      class="flex flex-col divide-y divide-neutral-100"
    >
      <LazyTargetsCard
        v-for="target in targets.data.data.success"
        :key="target.id"
        class="rounded-none !shadow-transparent"
        :employee-id="employeeId"
        :idp-id="selectedIdp.id!"
        :target="target"
      />
    </div>
    <div v-else class="flex h-48 items-center justify-center text-center">
      <div class="flex flex-col gap-y-2">
        <h2 class="text-lg font-semibold">
          {{ t(`ipr.targets.emptyState.${selectedStatus}.employeesTitle`) }}
        </h2>
        <p class="text-neutral">
          {{ t(`ipr.targets.emptyState.${selectedStatus}.description`) }}
        </p>
      </div>
    </div>
  </div>
</template>
