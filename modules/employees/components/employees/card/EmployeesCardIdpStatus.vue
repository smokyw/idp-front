<script setup lang="ts">
import type {
  EmployeesCollectionSuccessResponse,
  IdpIdpAttributeStatus,
} from "@/Api"

defineProps<{
  /** Сотрудник */
  employee: NonNullable<
    NonNullable<EmployeesCollectionSuccessResponse["data"]>["success"]
  >[number]
}>()

const { t } = useI18n()

/** Иконки статусов */
const statusIcons = {
  approval: "SvgoClock",
  approved: "SvgoCheckCircle",
  cancelled: "SvgoInfoCircle",
  draft: "",
  not_approved: "SvgoInfoCircle",
} as const satisfies Record<
  NonNullable<IdpIdpAttributeStatus["status"]>,
  string
>

const statusStyles = {
  approval: "bg-neutral-100",
  approved: "bg-success-100 text-success-600",
  cancelled: "bg-warning-100 text-warning-600",
  draft: "border border-neutral-300 text-neutral-400",
  not_approved: "bg-warning-100 text-warning-600",
  undefined: "border border-neutral-300 text-neutral-300",
} as const satisfies Record<
  NonNullable<IdpIdpAttributeStatus["status"]> | "undefined",
  string
>
</script>

<template>
  <div
    class="button sm !px-2 !py-1.5 !ring-0"
    :class="statusStyles[employee.idp?.status!]"
  >
    <LazyIcon
      v-if="employee.idp && employee.idp?.status !== 'draft'"
      class="fill-neutral-400"
      :name="statusIcons[employee.idp?.status!]"
      size="16"
    />
    <span>
      {{
        t(`employees.approvalStatuses.${employee.idp?.status}`, {
          approved: employee.idp?.last_attempt?.count_of_approved_stages,
          all: employee.idp?.last_attempt?.count_of_stages,
        })
      }}
    </span>
  </div>
</template>
