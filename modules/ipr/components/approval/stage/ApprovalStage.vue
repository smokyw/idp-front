<script setup lang="ts" generic="TType extends 'new' | 'old'">
import type {
  IdpApprovalStage,
  IdpRouteStageAttributeSerialNumber,
  IdpStartApprovalAttemptRequest,
} from "@/Api"

/** Типы этапов */
interface StageTypes {
  /** Новый этап */
  new: IdpStartApprovalAttemptRequest["stages"][number] &
    IdpRouteStageAttributeSerialNumber
  /** Старый этап */
  old: IdpApprovalStage
}

const props = defineProps<{
  /** Является ли этап текущим */
  isCurrent?: boolean
  /** Является ли этап последним */
  isLast?: boolean
  /** Этап согласования */
  stage: StageTypes[TType]
  /** Тип этапа */
  type: TType
}>()

/** `ID` плана развития */
const idpId = Number(useRoute("index-approval-id___ru").params.id)

/**
 * Сгенерированный этап.
 *
 * В него добавляются согласующие от API
 */
const generatedStage = asyncComputed<IdpApprovalStage>(async () => {
  if (props.type === "new") {
    /** Список согласующих */
    const approvers = await useApi().idp.idpSearchForApprovers(
      idpId,
      {
        filter: {
          stage_id: props.stage.serial_number!,
        },
        pagination: {
          after: "",
          limit: 250,
        },
      },
      {
        headers: useAuth().generateHeaders(),
      }
    )

    // Добавляем согласующих в этап
    return {
      ...toRefs(props).stage.value,
      approvers: (props.stage as StageTypes["new"]).approver_ids
        .filter((approverId) => approverId)
        .map(
          (approverId) =>
            approvers.data.data?.success?.find(
              (approver) => approver.id === approverId
            )
        ),
    }
  } else {
    return props.stage
  }
})

const { t } = useI18n()
</script>

<template>
  <div class="flex gap-x-4">
    <VStepper
      :is-last="isLast"
      :state="generatedStage?.status"
      :step="isCurrent ? '●' : generatedStage?.serial_number ?? ''"
    />
    <div class="mb-6 flex w-full flex-col gap-y-3">
      <div class="flex flex-col gap-y-1">
        <h3 class="text-lg font-medium">
          {{ generatedStage?.name }}
        </h3>
        <p class="text-xs text-neutral-400">
          {{ t(`ipr.approval.voteStrategy.${generatedStage?.vote_strategy}`) }}
        </p>
      </div>
      <ApprovalStageApprover
        v-for="approver in generatedStage?.approvers"
        :key="approver.id"
        :comment="approver.comment"
        :date="
          approver.status_changed_at
            ? useDateConverter().parseDate(approver.status_changed_at)
            : undefined
        "
        :first-letters="useUserDisplay(approver).getFirstLetters()"
        :is-current="isCurrent"
        :name="useUserDisplay(approver).getFullName(true)"
        show-avatar
        :status="approver.status"
      />
    </div>
  </div>
</template>
