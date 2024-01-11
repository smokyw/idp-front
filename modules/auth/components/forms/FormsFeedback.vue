<script setup lang="ts">
import type {
  BaseErrorCollectionResponse,
  FeedbackNewTicketRequest,
} from "@/Api"

const { t } = useI18n()

const emit = defineEmits<{
  /** Закрытие формы */
  closeForm: []
}>()

/** Форма */
const form = ref<HTMLFormElement>()

/** Валидна ли форма */
const isFormValid = ref(false)

/** Состояние загрузки */
const isLoading = ref(false)

/**
 * Функция для проверки валидности формы
 */
function checkForm() {
  isFormValid.value = form.value?.checkValidity() ?? false
}

/** Отправлено ли сообщение */
const isMessageSent = ref(false)
/** Почта, на которую было отправлено письмо */
const sentMessageEmail = ref("")

/**
 * Функция для отправки формы и обработки ответа.
 *
 * @param event - событие отправки формы.
 */
function submitForm(event: Event) {
  // Меняем состояние загрузки на `true`
  isLoading.value = true

  /** Тело запроса */
  const requestBody = useBodyFormData<FeedbackNewTicketRequest>(event)

  useApi()
    .feedback.feedbackSendFeedback(requestBody)
    .then(() => {
      // Меняем состояние загрузки на `false`
      isLoading.value = false

      isMessageSent.value = true
      sentMessageEmail.value = requestBody.email
    })
    .catch(({ error }: { error: BaseErrorCollectionResponse }) =>
      useAlertsStore().appendErrors(error)
    )
}
</script>

<template>
  <form
    ref="form"
    class="flex h-full flex-col justify-between gap-y-6 px-10 py-8"
    data-test-id="checkForm"
    @input="checkForm"
    @submit.prevent="submitForm"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-display-sm font-semibold">
        {{
          isMessageSent
            ? t("auth.feedback.messageSent")
            : t("auth.feedback.title")
        }}
      </h2>
      <SvgoXClose
        class="h-5 w-5 cursor-pointer fill-neutral"
        data-test-id="emit"
        @click="emit('closeForm')"
      />
    </div>
    <div
      v-if="isMessageSent"
      class="flex flex-col items-center gap-y-4 text-center text-lg text-neutral"
    >
      <div
        class="flex h-14 w-14 items-center justify-center rounded-full bg-success"
      >
        <SvgoCheck class="h-7 w-7 fill-white" />
      </div>
      <!-- eslint-disable-next-line vue/no-v-html @intlify/vue-i18n/no-v-html -->
      <p v-html="t('auth.feedback.answer', { email: sentMessageEmail })" />
    </div>
    <div
      v-else
      class="flex h-full flex-col justify-start gap-y-4 overflow-y-auto"
    >
      <VInput
        id="email"
        :hint="t('auth.feedback.emailHint')"
        :label="t('auth.feedback.email')"
        :placeholder="t('auth.feedback.emailPlaceholder')"
        type="email"
      />
      <VTextarea
        id="text"
        :label="t('auth.feedback.message')"
        :placeholder="t('auth.feedback.messagePlaceholder')"
        :rows="5"
        show-counter
      />
    </div>
    <button
      v-if="isMessageSent"
      class="button primary md w-full"
      data-test-id="emit"
      @click="emit('closeForm')"
    >
      {{ t("auth.feedback.thanks") }}
    </button>
    <button
      v-else
      class="button primary md w-full"
      :disabled="!isFormValid"
      type="submit"
    >
      <Icon v-if="isLoading" name="svg-spinners:270-ring" size="16" />
      <span v-else>{{ t("auth.feedback.sendRequest") }}</span>
    </button>
  </form>
</template>
