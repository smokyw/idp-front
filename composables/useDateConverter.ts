import {
  formatDuration as formatDurationFn,
  intervalToDuration,
  intlFormatDistance,
  isToday,
  isYesterday,
} from "date-fns"
import { enGB as en, fr, ru } from "date-fns/locale"

/** Локализации */
const locales = {
  en,
  fr,
  ru,
} as const

/**
 * Функция для конвертации дат.
 *
 * @returns функции для работы с датами.
 */
export default function () {
  /**
   * Получение и форматирование часового пояса.
   *
   * @returns `(+|-)HH:mm` - `HH` — часы, а `mm` — минуты.
   */
  function getTimeZone() {
    const timezoneOffset = new Date().getTimezoneOffset()
    const offset = Math.abs(timezoneOffset)
    const offsetOperator = timezoneOffset < 0 ? "+" : "-"
    const offsetHours = Math.floor(offset / 60)
      .toString()
      .padStart(2, "0")
    const offsetMinutes = Math.floor(offset % 60)
      .toString()
      .padStart(2, "0")

    return `${offsetOperator}${offsetHours}:${offsetMinutes}`
  }

  /**
   * Функция для конвертации даты в формат `2023-12-31 00:00:00 +03:00`.
   *
   * @param date - объект даты.
   * @returns дата в формате `2023-12-31 00:00:00 +03:00`.
   */
  function formatDate(date: Date) {
    /** Дата с учетом часового пояса */
    const dateWithTimeZone = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )

    return (
      useDateFormat(dateWithTimeZone, "YYYY-MM-DD HH:mm:ss").value +
      " " +
      getTimeZone()
    )
  }

  /**
   *
   * @param date - дата в формате `2023-12-31 00:00:00 +03:00`.
   * @returns объект даты.
   */
  function parseDate(date: string) {
    /**
     * Дата, разделенная на части.
     *
     * 1. `2023-12-31`
     * 2. `00:00:00`
     * 3. `+03:00`
     */
    const dateParts = date.split(" ")

    return new Date(dateParts[0] + "T" + dateParts[1] + ".000" + dateParts[2])
  }

  /**
   * Функция для отображения даты в шаблоне.
   *
   * @param date - дата для отображения.
   * @returns форматированная дата.
   */
  function displayDate(date: Date) {
    const { locale } = useI18n()

    /** Форматированная дата новости */
    const relativeDate = intlFormatDistance(date, new Date(), {
      // @ts-expect-error - в i18n нет типизации локализации
      locale: locales[locale.value],
      unit: "day",
    })

    /** Абсолютная дата */
    const absoluteDate = date.toLocaleDateString(locale.value, {
      day: "2-digit",
      month: "long",
    })

    return `${
      isToday(date) || isYesterday(date) ? relativeDate : absoluteDate
    }, ${date.toLocaleTimeString(locale.value, {
      hour: "2-digit",
      minute: "2-digit",
    })}`
  }

  /**
   * Функция для форматирования промежутка времени от заданной даты до текущего времени.
   *
   * @param date - заданная дата.
   * @param end - конечная дата.
   * @returns форматированный промежуток времени.
   */
  function formatDuration(date: Date, end?: Date) {
    const { locale, t } = useI18n()

    /** Промежуток времени */
    const duration = intervalToDuration({
      end: end ?? new Date(),
      start: date,
    })

    /** Форматированный промежуток времени */
    const formattedDuration = formatDurationFn(duration, {
      delimiter: ", ",
      format: ["years", "months", "weeks", "days", "hours", "minutes"],
      // @ts-expect-error - в i18n нет типизации локализации
      locale: locales[locale.value],
    })

    return formattedDuration || t("ipr.approval.lessThanMinute")
  }
  return { displayDate, formatDate, formatDuration, getTimeZone, parseDate }
}
