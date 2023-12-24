<script setup lang="ts">
import type { TargetsFiltersStatusGroup } from "@/Api"
import type { Tab } from "@/types/Utils"

const props = defineProps<{
  /** `ID` сотрудника */
  employeeId?: number
  /** Год для фильтрации списка статусов */
  idpId: number
}>()

const { t } = useI18n()

/**
 * Функция выбирает первый из возможных статусов
 */
function selectFirstStatus() {
  modelValue.value = tabs.value[0].id
}

/**
 * Функция для получения статусов от API
 *
 * @returns Сортированный список статусов
 */
async function getStatuses() {
  /** Несортированный список статусов */
  const unsortedStatuses = await useApi().targets.targetsGetStatusGroups(
    {
      filter: {
        idp_id: props.idpId,
      },
    },
    {
      employee_id: props.employeeId,
    },
    {
      headers: useAuth().generateHeaders(),
    }
  )

  // Возвращаем список статусов
  return unsortedStatuses.data.data?.success
}

/** Список статусов */
const statuses = ref(await getStatuses())

/** Вкладки */
const tabs = computed<Tab<TargetsFiltersStatusGroup["status_group"]>[]>(() => {
  return [
    {
      counter:
        statuses.value?.find((status) => status.id === "active")
          ?.count_of_targets ?? 0,
      id: "active",
      title: t("ipr.targets.statusGroups.active"),
    },
    {
      counter:
        statuses.value?.find((status) => status.id === "completed")
          ?.count_of_targets ?? 0,
      id: "completed",
      title: t("ipr.targets.statusGroups.completed"),
    },
  ]
})

/** Выбранный статус */
const modelValue = defineModel<TargetsFiltersStatusGroup["status_group"]>({
  required: true,
})

// При загрузке страницы выбираем первый статус
selectFirstStatus()

watch(
  () => [props.idpId, useRoute().path],
  async (newValue, oldValue) => {
    if (
      newValue[1] === "/" ||
      (newValue[1].split("/")[1] === "employees" &&
        newValue[1].split("/").length === 3 &&
        newValue[0] !== oldValue[0])
    ) {
      // Обновляем доступные статусы
      statuses.value = await getStatuses()

      if (!statuses.value?.find((status) => status.id === modelValue.value)) {
        // Если выбранный статус не доступен, то выбираем первый
        selectFirstStatus()
      }
    }
  }
)
</script>

<template>
  <VTabs v-model="modelValue" data-test-id="modelValue" :tabs="tabs" />
</template>
