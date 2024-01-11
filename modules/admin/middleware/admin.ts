export default defineNuxtRouteMiddleware(() => {
  const localePath = useLocalePath()

  // Проверяем, если ли у пользователя право входа в админ-панель
  if (!useUserStore().checkRight("app.admin.access_to_admin_panel")) {
    // Если его нет, то редиректим на главную страницу
    return navigateTo(localePath("/"))
  }
})
