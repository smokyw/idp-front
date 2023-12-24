<script setup lang="ts">
import type {
  AuthPasswordRequirementRegexp,
  BaseErrorCollectionResponse,
} from "@/Api"

const props = defineProps<{
  /** Токен сброса пароля */
  token: string
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()

const alertsStore = useAlertsStore()

/** Требования к пароля */
const passwordRequirements = await useApi().auth.authGetPasswordRequirements({
  headers: {
    "Accept-Language": locale.value,
  },
})

/** Состояние загрузки */
const isLoading = ref(false)

/** Пароль */
const password = ref("")

/**
 * Функция для отправки формы и обработки ответа.
 *
 * @param event - событие отправки формы.
 */
function submitForm(event: Event) {
  // Меняем состояние загрузки на `true`
  isLoading.value = true

  /** Тело запроса */
  const requestBody = useBodyFormData<{ password: string }>(event)

  useApi()
    .auth.authResetPasswordSaveNewPassword({
      ...requestBody,
      token: props.token,
    })
    .then(() => {
      // Редиректим пользователя на страницу авторизации
      void navigateTo(localePath("/login"))

      // Оповещаем об успешном создании цели
      alertsStore.appendSuccess({
        code: "passwordUpdated.title",
        message: "success.passwordUpdated.description",
      })
    })
    .catch(({ error }: { error: BaseErrorCollectionResponse }) =>
      alertsStore.appendErrors(error)
    )
    .finally(() => {
      // Меняем состояние загрузки на `false`
      isLoading.value = false
    })
}

// Фокусируемся на первом инпуте в компоненте
useFirstInputFocus()
</script>

<template>
  <h1 class="text-display-lg font-semibold">
    {{ t("auth.newPassword.title") }}
  </h1>
  <form class="flex flex-col gap-y-8" @submit.prevent="submitForm">
    <div class="flex flex-col gap-y-4">
      <VPassword
        v-model="password"
        autocomplete="new-password"
        data-test-id="password"
        :placeholder="t('auth.newPassword.placeholder')"
      />
      <FormsNewPasswordRequirements
        :password="password"
        :requirements="
          passwordRequirements.data.data
            ?.success as AuthPasswordRequirementRegexp[]
        "
      />
    </div>
    <button class="button primary md w-full">
      <Icon v-if="isLoading" name="svg-spinners:270-ring" size="16" />
      <span v-else>{{ t("auth.newPassword.set") }}</span>
    </button>
  </form>
</template>
