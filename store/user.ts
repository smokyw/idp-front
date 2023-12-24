import type {
  UsersProfileSuccessResponse,
  UsersUserAttributeAccessRights,
} from "@/Api"

export const useUserStore = defineStore(
  "user",
  () => {
    type UserData = NonNullable<UsersProfileSuccessResponse["data"]>

    /** Текущий пользователь */
    const user = ref<UserData["success"]>()

    /** Права доступа */
    const accessRights = ref<UsersUserAttributeAccessRights["access_rights"]>()

    /** Запомнить ли пользователя */
    const rememberUser = ref(true)

    /**
     * Функция для проверки наличия у пользователя определенного права.
     *
     * @param rightKey - ключ права доступа.
     * @returns есть ли у пользователя определенное право доступа.
     */
    function checkRight(
      rightKey: keyof NonNullable<
        UsersUserAttributeAccessRights["access_rights"]
      >
    ) {
      // Сравниваем право доступа с granted
      return accessRights.value?.[rightKey] === "granted"
    }

    return { accessRights, checkRight, rememberUser, user }
  },
  {
    persist: {
      paths: ["rememberUser"],
      storage: persistedState.cookiesWithOptions({
        maxAge: 60 * 60 * 24 * 14, // 14 дней FIXME: Вернуть на 90 дней после того, как будет исправлено https://github.com/nuxt/nuxt/pull/24253.
        path: "/",
        sameSite: "lax",
      }),
    },
  }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
