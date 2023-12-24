import type { RouteLocationNormalized } from "#vue-router"
import type { BaseErrorCollectionResponse } from "@/Api"

export default defineNuxtRouteMiddleware(async (to) => {
  const localePath = useLocalePath()

  /** Токен сброса пароля */
  const token = (to as RouteLocationNormalized<"login-new-password-token___ru">)
    .params.token

  try {
    await useApi().auth.authResetPasswordCheckToken({ token })
  } catch (err) {
    // Если возникает ошибка в запросе
    const { error } = err as { error: BaseErrorCollectionResponse }

    useAlertsStore().appendErrors(error)

    // Редиректим пользователя на страницу авторизации
    return navigateTo(localePath("/login"))
  }
})
