<script setup lang="ts">
import type { IdpIdpDetailsView } from "@/Api"

const props = defineProps<{
  /** Может ли текущий пользователь удалить ИПР */
  canDeleteIdp: boolean
  /** Информация об ИПР */
  idp: IdpIdpDetailsView | undefined
}>()

const emit = defineEmits<{
  deleteIdp: []
  updateIdp: []
}>()

const { t } = useI18n()

/** Иконки кнопки согласования */
const approvalButtonIcons = {
  approval: "SvgoClock",
  approved: "SvgoCheckCircle",
  cancelled: "SvgoInfoCircle",
  not_approved: "SvgoInfoCircle",
} as const satisfies Record<
  NonNullable<IdpIdpDetailsView["last_attempt_status"]>,
  string
>

/** Открыт ли поп-ап согласования */
const isApprovalPopupOpened = ref(false)

/**
 * Функция для получения прав доступа.
 *
 * @returns права доступа.
 */
async function getAccessRights() {
  return await useApi().idp.idpGetIdpAccessRights(
    toRefs(props).idp.value?.id ?? 0,
    {
      headers: useAuth().generateHeaders(),
    }
  )
}

/** Права доступа */
const accessRights = ref(await getAccessRights())

watch(isApprovalPopupOpened, async (value) => {
  if (!value) {
    accessRights.value = await getAccessRights()
    emit("updateIdp")
  }
})

/** Открыть ли окно добавления новой попытки */
const addNewAttempt = ref(false)
/** Открыт ли поп-ап подтверждения отмены согласования */
const cancelAttempt = ref(false)

/** Количество целей */
const targetsCount = inject<Ref<number>>("targetsCount")

/** Открыт ли поп-ап отчетов */
const isReportsPopupOpened = ref(false)

/** Выбранные сотрудники */
const selectedEmployees = ref(
  new Set([Number(useRoute("employees-id___ru").params.id)])
)
provide("selectedEmployees", selectedEmployees)
</script>

<template>
  <HeadlessMenu as="div" class="relative ml-auto">
    <HeadlessMenuButton
      class="button sm group relative outline-none"
      :class="[
        accessRights.data.data?.success?.['app.idp.approve_stage'] === 'granted'
          ? 'primary ui-open:bg-primary-600'
          : 'outlined',
      ]"
    >
      <LazyIcon
        v-if="idp?.last_attempt_status"
        :class="[
          accessRights.data.data?.success?.['app.idp.approve_stage'] ===
          'granted'
            ? 'fill-white'
            : 'fill-neutral-400',
        ]"
        :name="
          accessRights.data.data?.success?.['app.idp.approve_stage'] ===
          'granted'
            ? 'SvgoClock'
            : approvalButtonIcons[idp?.last_attempt_status]
        "
        size="16"
      />
      <span>
        {{
          t(
            accessRights.data.data?.success?.["app.idp.approve_stage"] ===
              "granted"
              ? "employees.approvalStatuses.needApproval"
              : `employees.approvalStatuses.${idp?.last_attempt_status}`,
            {
              approved: idp?.last_attempt_count_of_approved_stages,
              all: idp?.last_attempt_count_of_stages,
            }
          )
        }}
      </span>
      <Icon
        :class="[
          accessRights.data.data?.success?.['app.idp.approve_stage'] ===
          'granted'
            ? 'fill-white'
            : 'fill-neutral-900',
        ]"
        name="SvgoChevronDown"
        size="16"
      />
      <div
        class="absolute right-0 top-full mt-2 hidden w-max rounded-lg bg-neutral-900 p-1.5 text-sm text-white group-hover:block ui-open:group-hover:hidden"
      >
        {{ t("employees.page.showActions") }}
      </div>
    </HeadlessMenuButton>
    <HeadlessMenuItems
      class="absolute right-0 top-full mt-2 flex flex-col divide-y divide-neutral-100 overflow-hidden rounded-lg border border-neutral-100 bg-white shadow-lg outline-none"
    >
      <div class="flex flex-col">
        <LazyEmployeesPageStatusButton
          v-if="
            accessRights.data.data?.success?.['app.idp.start_approval'] ===
              'granted' && targetsCount
          "
          data-test-id="isApprovalPopupOpened"
          icon="SvgoClockRewind"
          :title="t('employees.page.statusButtons.startApproval')"
          @click="
            () => {
              isApprovalPopupOpened = true
              addNewAttempt = true
            }
          "
        />
        <LazyEmployeesPageStatusButton
          v-if="
            accessRights.data.data?.success?.['app.idp.approve_stage'] ===
            'granted'
          "
          data-test-id="isApprovalPopupOpened"
          icon="SvgoCheckDone"
          is-primary
          :title="t('employees.page.statusButtons.openApproval')"
          @click="isApprovalPopupOpened = true"
        />
        <LazyEmployeesPageStatusButton
          v-else-if="idp?.status !== 'draft'"
          data-test-id="isApprovalPopupOpened"
          icon="SvgoTrajectory"
          :title="
            t(
              `employees.page.statusButtons.${
                idp?.status === 'approved' ? 'history' : 'approvalRoute'
              }`
            )
          "
          @click="isApprovalPopupOpened = true"
        />
      </div>
      <div class="flex flex-col">
        <LazyEmployeesPageStatusButton
          v-if="
            idp?.status === 'approval' &&
            accessRights.data.data?.success?.['app.idp.cancel_approval'] ===
              'granted'
          "
          data-test-id="isApprovalPopupOpened"
          icon="SvgoRefresh"
          :title="t('system.reset')"
          @click="
            () => {
              isApprovalPopupOpened = true
              cancelAttempt = true
            }
          "
        />
        <EmployeesPageStatusButton
          data-test-id="isReportsPopupOpened"
          icon="SvgoFileDownload"
          :title="t('employees.page.statusButtons.generateReport')"
          @click="isReportsPopupOpened = true"
        />
      </div>
      <LazyEmployeesPageStatusButton
        v-if="canDeleteIdp"
        data-test-id="emit"
        icon="SvgoTrash"
        :title="t('employees.page.statusButtons.deleteIpr')"
        @click="emit('deleteIdp')"
      />
    </HeadlessMenuItems>
  </HeadlessMenu>
  <LazyApproval
    v-if="isApprovalPopupOpened"
    :idp-id="idp?.id!"
    :parent-access-rights="accessRights.data.data?.success"
    :parent-add-new-attempt="addNewAttempt"
    :parent-cancel-popup-opened="cancelAttempt"
    :parent-idp="idp!"
    @close="
      () => {
        isApprovalPopupOpened = false
        addNewAttempt = false
        cancelAttempt = false
      }
    "
    @idp-cancelled="
      () => {
        isApprovalPopupOpened = false
        addNewAttempt = false
        cancelAttempt = false
      }
    "
  />
  <LazyEmployeesActionsReports
    v-if="isReportsPopupOpened"
    :year="idp?.year!"
    @close="
      () => {
        isReportsPopupOpened = false
      }
    "
  />
</template>
