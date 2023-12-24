import type {
  EmployeesEmployeeAttributeFirstName,
  EmployeesEmployeeAttributeID,
  EmployeesEmployeeAttributeLastName,
  UsersUserAttributeFirstName,
  UsersUserAttributeID,
  UsersUserAttributeLastName,
} from "@/Api"

/**
 * Функция для форматирования ФИ пользователя.
 *
 * @param user - объект пользователя, в который входят имя и фамилия.
 * @returns функции для форматирования ФИ пользователя.
 */
export default function (
  user:
    | ((UsersUserAttributeFirstName | EmployeesEmployeeAttributeFirstName) &
        (UsersUserAttributeLastName | EmployeesEmployeeAttributeLastName) &
        (UsersUserAttributeID | EmployeesEmployeeAttributeID))
    | undefined
) {
  const { t } = useI18n()

  /**
   * Функция для возвращения полного ФИ пользователя.
   *
   * @param checkCurrent - проверить, является ли пользователь текущим. Если да, то добавить в строку «(Вы)».
   * @returns полное ФИ пользователя.
   */
  function getFullName(checkCurrent?: boolean) {
    /** Полное ИФ пользователя */
    const userName = `${user?.first_name} ${user?.last_name}`

    /** `ID` текущего пользователя */
    const currentUserId = useUserStore().user?.id

    return user?.id === currentUserId && checkCurrent
      ? userName + ` (${t("ipr.targets.comments.you")})`
      : userName
  }

  /**
   * Функция для возвращения первых букв ФИ пользователя.
   *
   * @returns первые буквы ФИ пользователя.
   */
  function getFirstLetters() {
    return `${user?.first_name?.[0]}${user?.last_name?.[0]}`
  }

  return { getFirstLetters, getFullName }
}
