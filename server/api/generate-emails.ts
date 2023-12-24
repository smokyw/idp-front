import { useCompiler } from "#vue-email"
import emails from "@/emails/emails"
import { writeFile } from "fs/promises"

// Функция для генерации писем
export default defineEventHandler(async () => {
  // Проходим по всем письмам
  for (const [key, email] of Object.entries(emails)) {
    // Генерируем шаблон
    const template = await useCompiler("EmailTemplate.vue", {
      props: email,
    })

    // Записываем в файл с соответствующим названием
    writeFile(`./emails/generated/${key}.html`, template.html)
  }

  return "Emails successfully generated!"
})
