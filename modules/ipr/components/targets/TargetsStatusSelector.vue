<script setup lang="ts">
import type { TargetsTargetBase } from "@/Api"
import type { Option } from "@/types/Utils"

const props = defineProps<{
  /** `ID` цели */
  id: number
  /** Статус цели */
  status: TargetsTargetBase["status"]
}>()

const emit = defineEmits<{
  statusUpdated: []
}>()

const { t } = useI18n()

/** Список опций */
const options: Option<TargetsTargetBase["status"]>[] = [
  {
    id: "not_started",
    title: t("ipr.targets.status.not_started"),
  },
  {
    id: "in_progress",
    title: t("ipr.targets.status.in_progress"),
  },
  {
    id: "done",
    title: t("ipr.targets.status.done"),
  },
  {
    id: "cancelled",
    title: t("ipr.targets.status.cancelled"),
  },
]

/** Значение статуса цели */
const targetStatus = ref(
  options.find((status) => status.id === props.status) ?? options[0]
)

watch(targetStatus, async () => {
  await useApi().targets.targetsUpdateStatus(
    toRefs(props).id.value,
    {
      status: targetStatus.value.id,
    },
    {
      headers: useAuth().generateHeaders(),
    }
  )

  emit("statusUpdated")
})
</script>

<template>
  <VSelect
    v-model="targetStatus"
    button-style="outlined"
    data-test-id="targetStatus"
    icon="SvgoChevronDown"
    is-title-custom
    :options="options"
  >
    <TargetsBadge :badge="targetStatus.id" type="status" />
  </VSelect>
</template>
