/**
 * Функция для проверки строки регулярным выражением.
 *
 * @param testString - строка для проверки.
 * @param regExp - регулярное выражение.
 * @returns Результат проверки в `boolean`.
 */
export default function (testString: string, regExp: string) {
  /** Регулярное выражение */
  const re = new RegExp(regExp)

  // Возвращаем результат проверки
  return re.test(testString)
}
