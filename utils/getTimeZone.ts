/**
 * Получение и форматирование часового пояса.
 *
 * @returns `(+|-)HH:mm` - `HH` — часы, а `mm` — минуты.
 */
export default function getTimeZone() {
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
