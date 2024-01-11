import type {
  AuthLoginRequest,
  AuthLoginSuccessResponse,
  BaseErrorCollectionResponse,
} from "@/Api"

/**
 * Функция для работы с авторизацией.
 *
 * @returns методы для работы с авторизацией.
 */
export default function () {
  const { auth } = useApi()
  const localePath = useLocalePath()

  /**
   * Функция для авторизации в аккаунт.
   *
   * @param event - событие отправки формы.
   * @param locale - выбранная авторизация.
   * @returns Список ошибок или `undefined`.
   */
  async function login(event: Event, locale: string) {
    /** Тело запроса */
    const requestBody = useBodyFormData<AuthLoginRequest>(event)

    try {
      // Делаем запрос к API
      const response = await auth.authAuthByLoginAndPassword(requestBody, {
        headers: {
          "Accept-Language": locale,
        },
      })

      // Выставляем токены от API
      await setTokens(response.data)

      // Выставляем данные пользователя
      const userStore = useUserStore()
      const user = await useApi().users.usersGetProfile({
        headers: generateHeaders(),
      })
      // Выставляем пользователя
      userStore.user = user.data.data?.success
      // Выставляем права доступа пользователя
      userStore.accessRights = user.data.data?.success?.access_rights

      // Редиректим на главную страницу
      void navigateTo(localePath("/"))
    } catch (err) {
      // Если возникает ошибка в запросе
      const { error } = err as { error: BaseErrorCollectionResponse }

      // Возвращаем список ошибок
      return error
    }
  }

  /**
   * Функция для выхода из аккаунта.
   *
   * - Отправляет запрос на выход из аккаунта
   * - Очищает `cookie` с токенами
   */
  async function logOut() {
    try {
      // Делаем запрос к API
      await auth.authLogout({
        headers: {
          Authorization: `Bearer ${useCookie("access_token").value}`,
        },
      })

      // Очищаем `cookie` с токенами
      clearTokens()

      // Редиректим на страницу авторизации
      void navigateTo(localePath("/login"))
    } catch (err) {
      // Если возникает ошибка в запросе
      const { error } = err as { error: BaseErrorCollectionResponse }

      useAlertsStore().appendErrors(error)
    }
  }

  /**
   * Функция для установки токенов в `cookie`.
   *
   * @param apiResponse - ответ от API с токенами.
   */
  async function setTokens(apiResponse: AuthLoginSuccessResponse) {
    const userStore = useUserStore()

    /** Объект с токенами от API */
    const tokens = apiResponse.data?.success

    /** `access`-токен */
    const accessToken = useCookie("access_token", {
      maxAge: userStore.rememberUser ? tokens?.expires_in : undefined,
      sameSite: "lax",
    })
    /** `refresh`-токен */
    const refreshToken = useCookie("refresh_token", {
      maxAge: userStore.rememberUser ? 60 * 60 * 24 * 90 : undefined, // 14 дней
      sameSite: "lax",
    })

    // Устанавливаем токены
    accessToken.value = tokens?.access_token
    refreshToken.value = tokens?.refresh_token
  }

  /**
   * Функция для очистки `cookie` с токенами.
   */
  function clearTokens() {
    /** `access`-токен */
    const accessToken = useCookie("access_token", { maxAge: 0 })
    /** `refresh`-токен */
    const refreshToken = useCookie("refresh_token", { maxAge: 0 })
    /** Хранилище `user` */
    const user = useCookie("user", { maxAge: 0 })

    // Очищаем `cookie`
    accessToken.value = ""
    refreshToken.value = ""
    user.value = ""
  }

  /**
   * Функция для получения объекта `headers` для запроса.
   *
   * @returns объект `headers`, который необходимо передать в запрос.
   * @example
   * ```ts
   * headers: useAuth().generateHeaders()
   *
   * // Если нужно добавить другие хедеры, можно раскрыть объект.
   * headers: {
   *   ...useAuth().generateHeaders(),
   *   // Другие хедеры
   * }
   * ```
   */
  function generateHeaders() {
    return {
      Authorization:
        "Bearer " + useCookie("access_token", { readonly: true }).value,
    }
  }

  return { clearTokens, generateHeaders, logOut, login, setTokens }
}
