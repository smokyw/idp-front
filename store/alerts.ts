import type { BaseErrorCollectionResponse } from "@/Api"

export interface Alert {
  /**
   * Код ошибки
   *
   * @example "base.unknown_error"
   */
  code: string
  /** Код локализации сообщения уведомления */
  message?: string
  /** Тип уведомления */
  type: "error" | "success"
}

export const useAlertsStore = defineStore("alerts", () => {
  /** Список уведомлений */
  const alerts = ref<Alert[]>([])

  /**
   * Функция для выставления сообщений об ошибке.
   *
   * Она преобразует ответ от бекенда и добавляет его в хранилище.
   *
   * @param error - ошибка от бекенда.
   */
  function appendErrors(error: BaseErrorCollectionResponse) {
    // Выставление ошибок
    alerts.value =
      error.data?.errors?.map((error) => {
        return { code: error.code, message: "errors.tryAgain", type: "error" }
      }) ?? []
  }

  /**
   * Функция для выставления успешного сообщения.
   *
   * Выставляет одно успешное сообщение.
   *
   * @param success - код локализации успешного сообщения.
   */
  function appendSuccess(success: Omit<Alert, "type">) {
    // Выставление успешного сообщения
    alerts.value = [
      {
        code: success.code,
        message: success.message,
        type: "success",
      },
    ]
  }

  watch(alerts, () => {
    /** Время, которое уведомление будет на экране в `ms` */
    const timeout = 5000

    // Если есть уведомления
    if (alerts.value.length) {
      setTimeout(() => {
        // Очищаем массив уведомлений через промежуток времени
        alerts.value = []
      }, timeout)
    }
  })

  return { alerts, appendErrors, appendSuccess }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAlertsStore, import.meta.hot))
}
