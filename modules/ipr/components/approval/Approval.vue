<script setup lang="ts">
import type {
  BaseErrorCollectionResponse,
  IdpGetIdpAccessRightsSuccessResponse,
  IdpIdpDetailsView,
  IdpStartApprovalAttemptRequest,
} from "@/Api"

const props = defineProps<{
  /** `ID` плана развития */
  idpId: number
  /** Права доступа */
  parentAccessRights?: NonNullable<
    IdpGetIdpAccessRightsSuccessResponse["data"]
  >["success"]
  /** Добавить ли в список попыток новую */
  parentAddNewAttempt?: boolean
  /** Открыт ли поп-ап подтверждения отмены согласования */
  parentCancelPopupOpened?: boolean
  /** ИПР */
  parentIdp: IdpIdpDetailsView
  /** Возвращать ли на главную страницу при закрытии окна */
  returnToHomePage?: boolean
}>()

const emit = defineEmits<{
  /** Закрыть окно */
  close: []
  /** ИПР отменен */
  idpCancelled: []
}>()

const { t } = useI18n()
const localePath = useLocalePath()

/** Состояние загрузки */
const isLoading = ref(false)

/**
 * Функция для получения ИПР.
 *
 * @returns текущий ИПР.
 */
async function getIdp() {
  return (
    await useApi().idp.idpGetIdpDetails(
      toRefs(props).idpId.value,
      {},
      {
        headers: useAuth().generateHeaders(),
      }
    )
  ).data.data?.success
}

/** Текущий ИПР */
const idp = ref(toRefs(props).parentIdp.value ?? (await getIdp()))

/**
 * Функция для получения списка попыток.
 *
 * @returns список попыток.
 */
async function getAttempts() {
  return await useApi().idp.idpGetApprovalAttempts(
    toRefs(props).idpId.value,
    {},
    {
      headers: useAuth().generateHeaders(),
    }
  )
}

/**
 * Функция для получения прав доступа ИПР.
 *
 * @returns права доступа ИПР.
 */
async function getAccessRights() {
  return (
    await useApi().idp.idpGetIdpAccessRights(toRefs(props).idpId.value, {
      headers: useAuth().generateHeaders(),
    })
  ).data.data?.success
}

/**
 * Функция для обновления данных от API.
 */
async function updateData() {
  // Обновляем все списки
  attempts.value = await getAttempts()
  idp.value = (await getIdp())!
  accessRights.value = await getAccessRights()
}

/** Права доступа для ИПР */
const accessRights = ref(
  toRefs(props).parentAccessRights?.value ?? (await getAccessRights())
)

/** Список попыток согласования */
const attempts = ref(await getAttempts())

/** Комментарий */
const comment = ref("")

/** Этапы согласования */
const stages = ref<IdpStartApprovalAttemptRequest["stages"]>([])
/** Открыто ли меню редактирования маршрута */
const isEditOpened = ref(false)
/** Добавить ли в список попыток новую */
const addNewAttempt = ref(toRefs(props).parentAddNewAttempt.value ?? false)

provide("approvalStages", stages)
provide("approvalEditOpened", isEditOpened)
provide("addNewAttempt", addNewAttempt)

watch(isEditOpened, async (newValue) => {
  if (!newValue) {
    await updateData()
  }
})

/**
 * Отправить план развития на согласование
 */
function submitAttempt() {
  useApi()
    .idp.idpStartApprovalAttempt(
      toRefs(props).idpId.value,
      {
        comment: comment.value,
        stages: stages.value,
      },
      {
        headers: useAuth().generateHeaders(),
      }
    )
    .then(() => {
      // Редиректим пользователя на главную страницу
      props.returnToHomePage ? navigateTo(localePath("/")) : emit("close")

      // Оповещаем об успешном изменении цели
      useAlertsStore().appendSuccess({
        code: "approvalStart.title",
      })
    })
    .catch(({ error }: { error: BaseErrorCollectionResponse }) =>
      useAlertsStore().appendErrors(error)
    )
    .finally(() => {
      // Меняем состояние загрузки на `false`
      isLoading.value = false
    })
}

/**
 * Отменить согласование.
 */
async function cancelAttempt() {
  await useApi()
    .idp.idpCancelApprovalAttempt(
      toRefs(props).idpId.value,
      lastAttempt.value?.id ?? 0,
      {
        headers: useAuth().generateHeaders(),
      }
    )
    .catch(({ error }: { error: BaseErrorCollectionResponse }) =>
      useAlertsStore().appendErrors(error)
    )

  // Закрываем окно подтверждения
  isCancelPopupOpened.value = false

  // Обновляем данные
  await updateData()

  emit("idpCancelled")
}

/**
 * Функция для принятия решения по согласованию плана.
 *
 * @param approve - согласовать ли план.
 */
async function decideApproval(approve: boolean) {
  if (approve) {
    await useApi()
      .idp.idpApproveStage(
        toRefs(props).idpId.value,
        lastAttempt.value?.id ?? 0,
        {
          comment: comment.value,
        },
        {
          headers: useAuth().generateHeaders(),
        }
      )
      .catch(({ error }: { error: BaseErrorCollectionResponse }) =>
        useAlertsStore().appendErrors(error)
      )
  } else {
    await useApi()
      .idp.idpRejectStage(
        toRefs(props).idpId.value,
        lastAttempt.value?.id ?? 0,
        {
          comment: comment.value,
        },
        {
          headers: useAuth().generateHeaders(),
        }
      )
      .catch(({ error }: { error: BaseErrorCollectionResponse }) =>
        useAlertsStore().appendErrors(error)
      )
  }

  // Сбрасываем комментарий
  comment.value = ""

  // Обновляем данные
  await updateData()
}

/** Открыт ли поп-ап подтверждения отмены согласования */
const isCancelPopupOpened = ref(
  toRefs(props).parentCancelPopupOpened.value ?? false
)

/** Является ли сотрудник согласующим */
const isApprover = computed(() => {
  return (
    accessRights.value?.["app.idp.approve_stage"] === "granted" ||
    accessRights.value?.["app.idp.reject_stage"] === "granted"
  )
})

/** Последняя попытка */
const lastAttempt = computed(() => {
  return attempts.value.data.data?.success?.at(-1)
})
</script>

<template>
  <VPopup
    v-if="!parentCancelPopupOpened"
    close-explicitly
    is-full-screen
    :title="t('ipr.approval.stages')"
    window-classes="lg:max-w-[43.75rem] !w-full"
    @close="returnToHomePage ? navigateTo(localePath('/')) : emit('close')"
  >
    <template #header-left>
      <button
        v-if="
          !attempts.data.data?.success?.length ||
          addNewAttempt ||
          lastAttempt?.status === 'approval'
        "
        class="h-8 w-8 rounded-xl bg-neutral-50"
        data-test-id="isEditOpened"
        @click="isEditOpened = true"
      >
        <LazyIcon name="SvgoEdit" size="20" />
      </button>
    </template>
    <ApprovalAttempts
      :add-new-attempt="addNewAttempt"
      :attempts="isApprover ? [lastAttempt!] : attempts.data.data?.success!"
      :idp-id="idpId"
      @close="emit('close')"
    />
    <template
      v-if="
        ((!attempts.data.data?.success?.length || addNewAttempt) &&
          !isEditOpened) ||
        isApprover
      "
      #footer
    >
      <VTextarea
        id="comment"
        v-model="comment"
        data-test-id="comment"
        :placeholder="t('ipr.approval.comment')"
      />
    </template>
    <template #footerButtons>
      <template v-if="isApprover">
        <button
          v-if="accessRights?.['app.idp.reject_stage'] === 'granted'"
          class="button lg outlined"
          data-test-id="decideApproval"
          @click="decideApproval(false)"
        >
          <LazyIcon v-if="isLoading" name="svg-spinners:270-ring" size="16" />
          <span v-else>{{ t("ipr.approval.actions.reject") }}</span>
        </button>
        <button
          v-if="accessRights?.['app.idp.approve_stage'] === 'granted'"
          class="button lg primary"
          data-test-id="decideApproval"
          @click="decideApproval(true)"
        >
          <LazyIcon v-if="isLoading" name="svg-spinners:270-ring" size="16" />
          <span v-else>{{ t("ipr.approval.actions.approve") }}</span>
        </button>
      </template>
      <template
        v-else-if="
          (attempts.data.data?.success?.length && !addNewAttempt) ||
          accessRights?.['app.idp.cancel_approval'] === 'granted'
        "
      >
        <button
          v-if="
            idp?.last_attempt_status === 'approval' &&
            accessRights?.['app.idp.cancel_approval'] === 'granted'
          "
          class="button lg outlined"
          data-test-id="isCancelPopupOpened"
          @click="isCancelPopupOpened = true"
        >
          <LazyIcon v-if="isLoading" name="svg-spinners:270-ring" size="16" />
          <span v-else>{{ t("ipr.approval.actions.cancel") }}</span>
        </button>
        <button
          v-if="
            (idp?.last_attempt_status === 'cancelled' ||
              idp?.last_attempt_status === 'not_approved') &&
            accessRights?.['app.idp.start_approval'] === 'granted'
          "
          class="button lg primary"
          data-test-id="addNewAttempt"
          @click="addNewAttempt = true"
        >
          <LazyIcon v-if="isLoading" name="svg-spinners:270-ring" size="16" />
          <span v-else>{{ t("ipr.approval.actions.resend") }}</span>
        </button>
      </template>
      <template
        v-else-if="accessRights?.['app.idp.start_approval'] === 'granted'"
      >
        <NuxtLinkLocale class="button lg outlined" to="/">
          {{ t("system.cancel") }}
        </NuxtLinkLocale>
        <button
          class="button lg primary"
          data-test-id="submitAttempt"
          @click="submitAttempt"
        >
          <LazyIcon v-if="isLoading" name="svg-spinners:270-ring" size="16" />
          <span v-else>{{ t("system.send") }}</span>
        </button>
      </template>
    </template>
  </VPopup>
  <LazyVPopup
    v-if="isCancelPopupOpened"
    is-small
    :title="t('ipr.approval.cancel.title')"
    @click-outside="isCancelPopupOpened = false"
  >
    <p class="w-[24.5rem] text-neutral">
      {{ t("ipr.approval.cancel.description") }}
    </p>
    <template #footerButtons>
      <button
        class="button md outlined !text-error"
        data-test-id="cancelAttempt"
        @click="cancelAttempt"
      >
        {{ t("ipr.approval.cancel.yes") }}
      </button>
      <button
        class="button md primary"
        data-test-id="isCancelPopupOpened"
        @click="isCancelPopupOpened = false"
      >
        {{ t("ipr.approval.cancel.no") }}
      </button>
    </template>
  </LazyVPopup>
</template>
