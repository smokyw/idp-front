<script setup lang="ts">
import type {
  EmployeesCollectionSuccessResponse,
  HttpResponse,
  TargetsTargetToCreate,
  TargetsTargetToUpdate,
} from "@/Api"

const props = defineProps<{
  /** Год ИПР */
  year: number
}>()

const emit = defineEmits<{
  /** Закрыть окно */
  close: []
}>()

const { t } = useI18n()

/** Список сотрудников */
const employees =
  inject<Ref<HttpResponse<EmployeesCollectionSuccessResponse>>>("employees")
/** Выбранные сотрудники */
const selectedEmployees = inject<Ref<Set<number>>>("selectedEmployees")

/** Отфильтрованный список сотрудников */
const filteredEmployees = computed(() => {
  return employees?.value.data.data?.success?.filter(
    (employee) => selectedEmployees?.value.has(employee.id!)
  )
})

/** Открыт ли поп-ап создания цели */
const isPopupOpened = ref(false)

/** Список целей */
const targets = ref<Array<TargetsTargetToUpdate | TargetsTargetToCreate>>([])

/**
 * Функция для добавления цели в список.
 *
 * @param target - цель для добавления.
 */
function addTarget(target: TargetsTargetToUpdate | TargetsTargetToCreate) {
  // Добавляем цель в список
  targets.value.push(target)

  // Закрываем окно создания
  isPopupOpened.value = false
}

/**
 * Функция для создания целей.
 */
async function createTargets() {
  await useApi().targets.targetsCreateTargetCollection(
    {
      employee_ids: Array.from(selectedEmployees!.value),
      targets: targets.value,
      year: props.year,
    },
    {
      headers: useAuth().generateHeaders(),
    }
  )

  // Закрываем окно создания целей
  emit("close")

  // Оповещаем об успешном выполнении действия
  useAlertsStore().appendSuccess({
    code: "idpCollection.addTarget.title",
  })
}
</script>

<template>
  <VPopup
    close-explicitly
    :title="
      t('employees.actions.addTarget.title', {
        number: selectedEmployees?.size,
      })
    "
    window-classes="!w-[40rem]"
    @close="emit('close')"
  >
    <div class="flex flex-col gap-y-6">
      <div class="flex items-center justify-between">
        <h5 class="text-lg font-semibold">
          {{
            t("employees.actions.addTarget.targets", {
              number: targets.length,
            })
          }}
        </h5>
        <button
          class="button sm primary"
          data-test-id="isPopupOpened"
          @click="isPopupOpened = true"
        >
          <Icon class="fill-white" name="SvgoPlusCircleOutline" size="16" />
          <span>{{ t("ipr.targets.new.title") }}</span>
        </button>
      </div>
      <div
        v-if="
          filteredEmployees?.some(
            (employee) => employee.idp?.status === 'approved'
          )
        "
        class="flex gap-x-4 rounded-lg border border-warning-200 bg-warning-100 px-4 py-3"
      >
        <LazyIcon
          class="shrink-0 fill-warning"
          name="SvgoAlertTriangleWarning"
          size="16"
        />
        <div class="flex flex-col gap-y-1">
          <h6 class="text-sm font-semibold">
            {{ t("employees.actions.addTarget.warning.title") }}
          </h6>
          <p class="text-sm text-neutral-600">
            {{ t("employees.actions.addTarget.warning.description") }}
          </p>
        </div>
      </div>
      <div
        v-if="targets.length"
        class="flex flex-col divide-y divide-neutral-100 rounded-2xl border border-neutral-50"
      >
        <LazyTargetsCard
          v-for="(target, index) in targets"
          :key="index"
          :idp-id="0"
          not-clickable
          :target="target"
        />
      </div>
      <div v-else class="h-14" />
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
        :disabled="!targets.length"
        @click="createTargets"
      >
        {{ t("employees.actions.addTarget.button") }}
      </button>
    </template>
    <LazyTargetsEdit
      v-if="isPopupOpened"
      :idp-id="0"
      return-target-locally
      :year="year"
      @close="isPopupOpened = false"
      @target-created="addTarget"
    />
  </VPopup>
</template>
