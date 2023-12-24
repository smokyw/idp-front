/**
 * Функция для преобразования `FormData` в `body` запроса.
 *
 * @param event - событие отправки формы.
 * @returns `body` запроса
 */
export default function <TBody>(event: Event) {
  /** Данные формы */
  const formData = new FormData(event.target as HTMLFormElement)

  /** Тело запроса */
  const requestBody = Object.fromEntries(formData.entries()) as TBody

  return requestBody
}
