<script setup lang="ts">
import type {
  BaseConfigurationResponse,
  BaseErrorCollectionResponse,
  HttpResponse,
} from "@/Api"

const { locale, t } = useI18n()

const { login } = useAuth()

/** Запомнить ли пользователя */
const rememberMe = storeToRefs(useUserStore()).rememberUser
rememberMe.value = true // Присваиваем значение `true` чтобы сбросить предыдущее значение от пользователя

/** Состояние загрузки */
const isLoading = ref(false)

/**
 * Функция для отправки формы и обработки ответа.
 *
 * Если в результате авторизации произойдет ошибка, сообщение об этом будет выведено на экран.
 *
 * @param event - событие отправки формы.
 */
async function submitForm(event: Event) {
  // Меняем состояние загрузки на `true`
  isLoading.value = true

  /**
   * Ответ от API.
   *
   * Он возвращается только в том случае, если при авторизации произошла ошибка.
   *
   * Иначе возвращается `undefined`.
   */
  const response = await login(event, locale.value)

  // Меняем состояние загрузки на `false`
  isLoading.value = false

  if (response) {
    // Выставление ошибок
    useAlertsStore().appendErrors(response)
  }
}

// Фокусируемся на первом инпуте в компоненте
useFirstInputFocus()

/** Конфигурация компании */
const configuration = (await useApi()
  .configuration.baseGetConfiguration()
  .catch(({ error }: { error: BaseErrorCollectionResponse }) =>
    useAlertsStore().appendErrors(error)
  )) as HttpResponse<BaseConfigurationResponse>
</script>

<template>
  <h1 class="text-display-lg font-semibold">{{ t("auth.signIn") }}</h1>
  <form class="flex flex-col gap-y-8" @submit.prevent="submitForm">
    <div class="flex flex-col gap-y-4">
      <VInput id="login" :placeholder="t('auth.login')" />
      <VPassword :placeholder="t('auth.password')" />
      <div class="flex justify-between">
        <LazyVCheckbox
          v-if="configuration?.data.data?.success?.feature_flags?.remember_me"
          id="remember-me"
          v-model="rememberMe"
          data-test-id="rememberMe"
          :label="t('auth.remember')"
        />
        <LazyNuxtLinkLocale
          v-if="
            configuration?.data.data?.success?.feature_flags?.reset_password
          "
          to="/login/reset-password"
        >
          {{ t("auth.reset") }}
        </LazyNuxtLinkLocale>
      </div>
    </div>
    <button class="button primary md w-full" type="submit">
      <Icon v-if="isLoading" name="svg-spinners:270-ring" size="16" />
      <span v-else>{{ t("auth.signIn") }}</span>
    </button>
  </form>
</template>
