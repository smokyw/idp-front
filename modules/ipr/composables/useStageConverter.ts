import type {
  IdpApprovalStage,
  IdpApprover,
  IdpRouteStage,
  IdpRouteUser,
} from "@/Api"

/** Конвертированный этап */
export type ConvertedStage = {
  approver_ids: string[]
  approvers?: IdpRouteUser[] & IdpApprover[]
  isEditable?: boolean | undefined
  name: string | undefined
  notEditableApproverIds?: string[]
  serial_number: number | undefined
  vote_strategy: "first" | "unanimous"
}

/**
 * Функция для преобразования этапов согласования для API.
 *
 * @param stages - этапы согласования из шаблона
 * @returns этапы согласования для API
 */
export default function (
  stages: (IdpRouteStage & IdpApprovalStage)[]
): ConvertedStage[] {
  return stages.map((stage) => {
    return {
      approver_ids: stage.approvers?.map((approver) => approver.id!) ?? [],
      approvers: stage.approvers,
      id: stage.id,
      isEditable: stage.is_editable,
      name: stage.name,
      notEditableApproverIds:
        stage.approvers
          ?.filter((approver: IdpApprover) => !approver.is_editable)
          .map((approver) => approver.id!) ?? [],
      serial_number: stage.serial_number,
      vote_strategy: stage.vote_strategy!,
    }
  })
}
