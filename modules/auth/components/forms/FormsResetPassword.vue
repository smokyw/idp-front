<script setup lang="ts">
import type {
  AuthResetPasswordForgotPasswordRequest,
  BaseErrorCollectionResponse,
} from "@/Api"

const { t } = useI18n()

/** Состояние загрузки */
const isLoading = ref(false)

/** Отправлено ли сообщение */
const isMessageSent = ref(false)

/**
 * Функция для отправки формы и обработки ответа.
 *
 * @param event - событие отправки формы.
 */
function submitForm(event: Event) {
  // Меняем состояние загрузки на `true`
  isLoading.value = true

  /** Тело запроса */
  const requestBody =
    useBodyFormData<AuthResetPasswordForgotPasswordRequest>(event)

  useApi()
    .auth.authResetPasswordForgotPassword(requestBody)
    .then(() => {
      // Меняем состояние загрузки на `false`
      isLoading.value = false

      isMessageSent.value = true
    })
    .catch(({ error }: { error: BaseErrorCollectionResponse }) =>
      useAlertsStore().appendErrors(error)
    )
}

// Фокусируемся на первом инпуте в компоненте
useFirstInputFocus()
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <h1 class="text-display-lg font-semibold">
      {{
        isMessageSent
          ? t("auth.resetPassword.checkEmail")
          : t("auth.resetPassword.title")
      }}
    </h1>
    <form class="flex flex-col gap-y-2" @submit.prevent="submitForm">
      <div v-if="isMessageSent">
        <!-- eslint-disable-next-line vue/no-v-html @intlify/vue-i18n/no-v-html -->
        <p class="text-neutral" v-html="t('auth.resetPassword.success')" />
      </div>
      <div v-else class="flex flex-col gap-y-6">
        <p class="text-neutral">{{ t("auth.resetPassword.hint") }}</p>
        <VInput id="login" :placeholder="t('auth.login')" />
      </div>
      <div class="mt-6 flex flex-col gap-y-2">
        <button
          v-if="!isMessageSent"
          class="button primary md w-full"
          type="submit"
        >
          <Icon v-if="isLoading" name="svg-spinners:270-ring" size="16" />
          <span v-else>{{ t("auth.resetPassword.title") }}</span>
        </button>
        <NuxtLinkLocale
          class="button md w-full"
          :class="[isMessageSent ? 'primary' : 'outlined']"
          to="/login"
        >
          {{ t("auth.resetPassword.return") }}
        </NuxtLinkLocale>
      </div>
    </form>
  </div>
</template>
