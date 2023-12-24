import type { SkillsLevelIndicator } from "@/Api"

export const useTargetsLevelsStore = defineStore("targetsLevels", () => {
  /** Список уровней владения навыками */
  const levels = ref<SkillsLevelIndicator[] | undefined>([])

  /** Стили уровней */
  const levelStyles = [
    "bg-neutral-100 text-neutral",
    "bg-primary-100 text-primary",
    "bg-secondary-100 text-secondary",
  ] as const

  /**
   * Функция для получения стилей уровня.
   *
   * @param currentLevel - `ID` текущего уровня.
   * @param requiredLevel - `ID` необходимого уровня.
   * @returns цвет текста и фона уровня.
   */
  function getLevelStyle(currentLevel?: number, requiredLevel?: number) {
    // Если передан текущий уровень
    if (currentLevel !== undefined) {
      /** Разница между уровнями */
      const levelsDifference = requiredLevel! - currentLevel

      return levelsDifference <= 0 ? levelStyles[1] : levelStyles[2]
    } else {
      // Если текущий уровень не передан, возвращаем стиль 1
      return levelStyles[0]
    }
  }

  /**
   * Функция для получения текста уровня.
   *
   * @param currentLevel - `ID` текущего уровня.
   * @param requiredLevel - `ID` необходимого уровня.
   * @returns текст уровня.
   */
  function getLevel(
    currentLevel?: number,
    requiredLevel?: number
  ): SkillsLevelIndicator | undefined {
    if (currentLevel === undefined) {
      if (requiredLevel) {
        // Если уровень не передан, возвращаем требуемый уровень
        return levels.value?.find((level) => level.id === requiredLevel)
      } else {
        return {
          label: "−",
        }
      }
    } else if (currentLevel === null) {
      // Если бекенд передает отсутствие уровня, возвращаем прочерк
      return {
        label: "−",
      }
    } else {
      // Если передан текущий уровень, возвращаем его из массива уровней
      return levels.value?.find((level) => level.id === currentLevel)
    }
  }

  // Записываем значение уровней
  useApi()
    .skills.skillsGetLevelIndicators({
      headers: useAuth().generateHeaders(),
    })
    .then((response) => {
      levels.value = response.data.data?.success
    })

  return { getLevel, getLevelStyle, levels }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useTargetsLevelsStore, import.meta.hot)
  )
}
