import type { RouteLocationNormalized } from "#vue-router"

export default defineNuxtRouteMiddleware(async (to) => {
  const localePath = useLocalePath()

  const { clearTokens, setTokens } = useAuth()

  /**
   * Функция для получения названия группы страниц, удалив локализацию.
   *
   * @param path - информация о странице.
   * @returns Название группы страниц с удаленной локализацией.
   * @example Если в группу передать `login-reset-password___ru`, вернется `login`.
   */
  function getPathName(path: RouteLocationNormalized) {
    /**
     * Название страницы без локализации.
     *
     * Страницы называются по примеру `login___ru` или `login-reset-password___ru`.
     */
    const pathName = path.name.split("___")[0]

    /**
     * Группа страниц.
     *
     * Если страницы лежат в одной папке, они обладают одним префиксом.
     *
     * @example Например, в `login-reset-password` берется префикс `login`.
     */
    const pathGroup = pathName.split("-")[0]

    return pathGroup
  }

  /** `access`-токен */
  const accessToken = useCookie("access_token")
  /** `refresh`-токен */
  const refreshToken = useCookie("refresh_token")

  // Если у пользователя есть `access`-токен
  if (accessToken.value) {
    // Если пользователь пытается перейти на страницу авторизации
    if (getPathName(to) === "login") {
      return navigateTo(localePath("/"))
    }
  } else if (refreshToken.value) {
    // Если нет `access`-токена (истек по времени), но есть `refresh`-токен
    // Пытаемся обновить токен
    try {
      // Делаем запрос к API
      const response = await useApi().auth.authRefreshPairOfTokens({
        refresh_token: refreshToken.value,
      })

      // Выставляем токены от API
      setTokens(response.data)
    } catch (err) {
      // Если возникает ошибка в запросе, очищаем `cookie`
      clearTokens()

      // Перенаправляем на страницу авторизации
      return navigateTo(localePath("/login"))
    }
  } else if (getPathName(to) !== "login") {
    // Если у пользователя нет токенов, и он пытается зайти в приложение
    // Редиректим его на страницу логина
    return navigateTo(localePath("/login"))
  }
})
