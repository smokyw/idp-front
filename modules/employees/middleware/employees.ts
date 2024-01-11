export default defineNuxtRouteMiddleware(() => {
  const localePath = useLocalePath()

  // Проверяем, если ли у пользователя право доступа к списку сотрудников
  if (!useUserStore().checkRight("app.employees.access_to_employees")) {
    // Если его нет, то редиректим на главную страницу
    return navigateTo(localePath("/"))
  }
})
