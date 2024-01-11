<script setup lang="ts">
import type {
  BaseErrorCollectionResponse,
  IdpApprovalAttempt,
  IdpRoute,
} from "@/Api"
import type { ConvertedStage } from "@/modules/ipr/composables/useStageConverter"
import { klona } from "klona/json"

const props = defineProps<{
  /** Попытка согласования */
  attempt?: IdpApprovalAttempt
  /** Маршрут по умолчанию */
  defaultRoute: IdpRoute
  /** `ID` плана развития */
  idpId: number
  /** Является ли попытка новой */
  newAttempt?: boolean
}>()

const emit = defineEmits<{
  /** Закрыть окно согласования */
  closeWindow: []
}>()

const { t } = useI18n()
const { formatDuration, parseDate } = useDateConverter()

/** Этапы согласования */
const stages: Ref<ConvertedStage[]> = inject("approvalStages")!
/** Редактируется ли маршрут */
const isEditOpened = inject<Ref<boolean>>("approvalEditOpened")
/** Добавить ли в список попыток новую */
const addNewAttempt = inject<Ref<boolean>>("addNewAttempt")

const { commit, reset } = useManualRefHistory(stages, {
  clone: klona,
})

if (
  !props.defaultRoute?.stages?.length &&
  (addNewAttempt?.value || props.newAttempt)
) {
  isEditOpened!.value = true
}

// Следим за изменением попытки
watch(toRefs(props).attempt, (newValue) => {
  // Добавляем этапы из попытки
  stages.value = useStageConverter(newValue!.stages!)
})

// Если попытка согласования новая
if (!props.attempt) {
  // Используем для нее маршрут по умолчанию
  stages.value = useStageConverter(props.defaultRoute?.stages ?? [])
} else if (props.attempt.status === "approval") {
  // Иначе добавляем в нее этапы из попытки
  stages.value = useStageConverter(props.attempt.stages!)
}

// Сохраняем значение в историю
commit()

/** Текущий этап */
const currentStage = computed(() => {
  return props.attempt?.status === "approval"
    ? (props.attempt?.stages?.findIndex((stage) => stage.status === "none") ??
        -2) + 1
    : -1
})

/**
 * Функция для добавления нового этапа согласования.
 */
function addStage() {
  stages.value.push({
    approver_ids: [],
    name: "",
    serial_number: stages.value.length + 1,
    vote_strategy: "first",
  })
}

/**
 * Функция для удаления этапа из списка.
 *
 * @param serialNumber - серийный номер этапа.
 */
function deleteStage(serialNumber: number) {
  // Удаляем этап из списка
  stages.value.splice(
    stages.value.findIndex((stage) => stage.serial_number === serialNumber),
    1
  )

  // Обновляем серийные номера этапов
  stages.value.map((stage, i) => {
    stage.serial_number = i + 1
  })
}

/**
 * Функция для закрытия поп-апа.
 */
function closeEditPopup() {
  // Сбрасываем историю до предыдущего состояния
  reset()

  // Закрываем окно редактирования
  isEditOpened!.value = false

  // Если этапов нет
  if (!stages.value.length) {
    // Убираем новую попытку из списка
    addNewAttempt!.value = false

    // Эмитим закрытие окна согласования
    emit("closeWindow")
  }
}

/**
 * Функция для сохранения этапов попытки.
 */
async function saveStages() {
  if (props.attempt) {
    await useApi()
      .idp.idpUpdateApprovalAttemptRoute(
        toRefs(props).idpId.value,
        props.attempt.id!,
        {
          stages: stages.value,
        },
        {
          headers: useAuth().generateHeaders(),
        }
      )
      .then(() => {
        // Закрываем окно редактирования
        isEditOpened!.value = false
      })
      .catch(({ error }: { error: BaseErrorCollectionResponse }) =>
        useAlertsStore().appendErrors(error)
      )
  } else {
    // Удаляем пустых согласующих
    stages.value = stages.value.map((stage) => {
      return {
        ...stage,
        approver_ids: stage.approver_ids.filter((approverId) => approverId),
      }
    })

    // Сохраняем состояние в истории
    commit()

    // Закрываем окно редактирования
    isEditOpened!.value = false
  }
}
</script>

<template>
  <LazyVPopup
    v-if="isEditOpened && (!attempt || attempt?.status === 'approval')"
    is-full-screen
    :title="t('ipr.approval.edit.title')"
    window-classes="lg:max-w-[43.75rem] !w-full"
    @click-outside="closeEditPopup"
  >
    <LazyApprovalEditStage
      v-for="(stage, index) in stages"
      :key="index"
      v-model="stages[index]"
      data-test-id="stages.index"
      :default-route="defaultRoute"
      :stage="stage"
      @delete-stage="deleteStage(stage.serial_number!)"
    />
    <button
      class="button lg outlined mt-1.5 w-full"
      data-test-id="addStage"
      @click="addStage"
    >
      <Icon class="fill-neutral-900" name="SvgoPlus" size="16" />
      <span>{{ t("ipr.approval.edit.addStage") }}</span>
    </button>
    <template #footerButtons>
      <button
        class="button lg outlined"
        data-test-id="closeEditPopup"
        @click="closeEditPopup"
      >
        {{ t("system.cancel") }}
      </button>
      <button
        class="button lg primary"
        data-test-id="saveStages"
        :disabled="
          !stages.length ||
          stages.some(
            (stage) =>
              !stage.name ||
              !stage.approver_ids.length ||
              stage.approver_ids.includes('')
          )
        "
        @click="saveStages"
      >
        {{ t("system.save") }}
      </button>
    </template>
  </LazyVPopup>
  <div v-else class="flex flex-col gap-y-1.5">
    <div class="flex gap-x-4">
      <VStepper
        :is-last="attempt?.status === 'cancelled'"
        :state="
          attempt
            ? attempt?.status === 'cancelled'
              ? 'cancelled'
              : 'approved'
            : undefined
        "
        step="●"
      />
      <div class="mb-6 flex w-full min-w-0 flex-col gap-y-3">
        <div class="flex flex-col gap-x-0.5">
          <h3 class="text-lg font-medium">
            {{
              t(
                attempt
                  ? `ipr.approval.status.${attempt?.status}`
                  : "ipr.approval.send"
              )
            }}
          </h3>
          <p v-if="attempt" class="text-xs text-neutral-400">
            {{
              t("ipr.approval.onApprove", {
                date: formatDuration(
                  parseDate(attempt?.initiated_at!),
                  attempt?.finished_at
                    ? parseDate(attempt?.finished_at)
                    : undefined
                ),
              })
            }}
          </p>
        </div>
        <LazyApprovalStageApprover
          v-if="attempt"
          :comment="attempt.initiator_comment!"
          :date="parseDate(attempt.initiated_at!)"
          :name="useUserDisplay(attempt.initiator).getFullName(true)"
        />
      </div>
    </div>
    <template v-if="attempt?.status !== 'cancelled'">
      <LazyApprovalStage
        v-for="stage in attempt ? attempt.stages : stages"
        :key="stage.serial_number"
        :is-current="stage.serial_number === currentStage"
        :is-last="
          stage.serial_number ===
            (attempt ? attempt?.stages?.length : stages.length) &&
          attempt?.status !== 'approved'
        "
        :stage="stage"
        :type="attempt ? 'old' : 'new'"
      />
    </template>
    <template v-if="attempt?.status === 'approved'">
      <div class="flex gap-x-4">
        <VStepper is-last state="approved" step="" />
        <h3 class="text-lg font-medium">
          {{ t("ipr.approval.approved") }}
        </h3>
      </div>
    </template>
  </div>
</template>
