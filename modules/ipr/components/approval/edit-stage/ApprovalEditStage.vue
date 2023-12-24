<script setup lang="ts">
import type { IdpRoute } from "@/Api"
import type { ConvertedStage } from "@/modules/ipr/composables/useStageConverter"
import type { MoveEvent } from "sortablejs"
import { VueDraggableNext } from "vue-draggable-next"

const props = defineProps<{
  /** Маршрут по умолчанию */
  defaultRoute: IdpRoute
  /** Этап согласования */
  stage: ConvertedStage
}>()

const emit = defineEmits<{
  deleteStage: []
}>()

const { t } = useI18n()

/** Этап в маршруте по умолчанию */
const stageInDefaultRoute = computed(() => {
  return useStageConverter(props.defaultRoute.stages!).find(
    (stage) => stage.serial_number === props.stage.serial_number
  )
})

const modelValue = defineModel<typeof props.stage>({
  local: true,
  required: true,
})
modelValue.value = toRefs(props).stage.value

// Если название этапа не заполнено (то есть этап новый)
if (!modelValue.value.name) {
  // Фокусируемся на названии этапа
  useFirstInputFocus(`#stage-name-${toRefs(props).stage.value.serial_number}`)
}

/**
 * Отключен ли согласующий.
 *
 * @param approver - ID согласующего.
 * @returns отключен ли согласующий
 */
function isApproverDisabled(approver: string) {
  return (
    stageInDefaultRoute.value?.approver_ids.includes(approver) ||
    props.stage.notEditableApproverIds?.includes(approver)
  )
}

/** `ID` плана развития */
const idpId = Number(useRoute("index-approval-id___ru").params.id)

/** Стандартные согласующие */
const defaultApprovers = await useApi().idp.idpSearchForApprovers(
  idpId,
  {
    filter: {
      stage_id: toRefs(props).stage.value.serial_number!,
    },
  },
  {
    headers: useAuth().generateHeaders(),
  }
)
</script>

<template>
  <div class="flex gap-x-4">
    <VStepper :step="modelValue.serial_number!" />
    <div class="mb-6 flex w-full flex-col gap-y-3">
      <div class="flex flex-col gap-y-2">
        <h4 class="text-md font-medium">
          {{ t("ipr.approval.edit.stageTitle") }}
        </h4>
        <div class="flex items-center gap-x-3">
          <input
            :id="`stage-name-${stage.serial_number}`"
            v-model="modelValue.name"
            data-test-id="modelValue.name"
            :disabled="!!stageInDefaultRoute || stage.isEditable === false"
            :placeholder="t('ipr.approval.edit.stageName')"
            type="text"
          />
          <LazyIcon
            v-if="!stageInDefaultRoute && stage.isEditable !== false"
            class="cursor-pointer"
            data-test-id="emit"
            name="SvgoTrash"
            size="20"
            @click="emit('deleteStage')"
          />
        </div>
        <ApprovalEditStageVoteStrategy
          v-model="modelValue.vote_strategy"
          data-test-id="modelValue.vote_strategy"
          :disabled="!!stageInDefaultRoute || stage.isEditable === false"
        />
      </div>
      <div class="flex flex-col gap-y-2">
        <h4 v-if="modelValue.approver_ids.length" class="text-md font-medium">
          {{ t("ipr.approval.edit.approvers") }}
        </h4>
        <div class="flex flex-col gap-y-3">
          <VueDraggableNext
            v-model="modelValue.approver_ids"
            class="flex flex-col gap-y-3"
            data-test-id="modelValue.approver_ids"
            filter=".disable-sort"
            ghost-class="opacity-0"
            handle=".handle"
            :move="
              (event: MoveEvent) =>
                !event.related.classList.contains('disable-sort')
            "
          >
            <div
              v-for="(approver, index) in modelValue.approver_ids"
              :key="index"
              class="flex w-full items-center rounded-xl bg-white sm:w-max"
              :class="{
                'disable-sort': isApproverDisabled(approver),
              }"
            >
              <div
                class="handle flex h-[2.375rem] w-[2.375rem] items-center justify-center"
                :class="[
                  isApproverDisabled(approver)
                    ? 'cursor-not-allowed'
                    : 'cursor-grab',
                ]"
              >
                <Icon name="Svgo6DotsVertical" size="20" />
              </div>
              <LazyApprovalEditStageApprover
                v-model="modelValue.approver_ids[index]"
                :approver-ids="modelValue.approver_ids"
                data-test-id="modelValue.approver_ids.index"
                :disabled="isApproverDisabled(approver)"
                :parent-approvers="defaultApprovers.data.data?.success!"
                :stage-id="stage.serial_number!"
              />
              <LazyIcon
                v-if="!isApproverDisabled(approver)"
                class="mx-3 shrink-0 cursor-pointer"
                data-test-id="modelValue"
                name="SvgoTrash"
                size="20"
                @click="modelValue.approver_ids.splice(index, 1)"
              />
            </div>
          </VueDraggableNext>
          <button
            class="button lg outlined"
            data-test-id="modelValue"
            @click="modelValue.approver_ids.push('')"
          >
            <Icon class="fill-neutral-900" name="SvgoPlus" size="16" />
            <span>{{ t("ipr.approval.edit.addApprover") }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
