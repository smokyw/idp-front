<script setup lang="ts">
import type { HttpResponse, TargetsTargetDetailsSuccessResponse } from "~/Api"

const props = defineProps<{
  /** `ID` сотрудника */
  employeeId?: number
  /** `ID цели` */
  id: number
}>()

const { t } = useI18n()

/** Информация о цели */
const target = ref<HttpResponse<TargetsTargetDetailsSuccessResponse>>()

/**
 * Функция для получения цели.
 */
async function getTarget() {
  target.value = await useApi().targets.targetsGetTargetDetails(
    toRefs(props).id.value,
    {
      employee_id: props.employeeId,
    },
    {
      headers: useAuth().generateHeaders(),
    }
  )
}

await getTarget()
</script>

<template>
  <HeadlessTabPanel as="div" class="flex flex-col gap-y-6">
    <div class="target-info-block">
      <h2>{{ t("ipr.targets.pageTitles.status") }}</h2>
      <TargetsStatusSelector
        :id="target?.data.data?.success?.id!"
        :status="target?.data.data?.success?.status"
        @status-updated="getTarget"
      />
    </div>
    <div class="target-info-block">
      <h2>{{ t("ipr.targets.pageTitles.name") }}</h2>
      <p>{{ target?.data.data?.success?.name }}</p>
    </div>
    <div class="target-info-block">
      <h2>{{ t("ipr.targets.pageTitles.deadline") }}</h2>
      <TargetsBadgeDate
        :badge="target?.data.data?.success?.deadline"
        :created-at="target?.data.data?.success?.created_at"
        is-increased-size
      />
    </div>
    <div class="target-info-block">
      <h2>{{ t("ipr.targets.pageTitles.priority") }}</h2>
      <TargetsBadge
        :badge="target?.data.data?.success?.priority"
        is-increased-size
        type="priority"
      />
    </div>
    <div class="target-info-block">
      <h2>{{ t("ipr.targets.pageTitles.description") }}</h2>
      <p>{{ target?.data.data?.success?.description }}</p>
    </div>
  </HeadlessTabPanel>
</template>
