<script setup lang="ts">
import type { Option } from "~/types/Utils"

const props = defineProps<{
  /** Опция для выбора всех лет */
  allOption?: boolean
  /** Требуемый для выбора год */
  desiredYear?: number
  /** Выключены ли стили кнопки */
  isButtonStyleDisabled?: boolean
  /** Ключ выбора года. */
  yearPickerKey?: number
  /** Список лет для выбора */
  years?: number[]
}>()

const { t } = useI18n()

/**
 * Функция для получения списка лет.
 *
 * @returns список лет.
 */
async function getYears() {
  return (
    await useApi().idp.idpGetYearsOfAllEmployees({
      headers: useAuth().generateHeaders(),
    })
  ).data.data?.success
}

/** Доступные года */
const years = ref(toRefs(props).years.value ?? (await getYears()))

watch(
  () => props.yearPickerKey,
  async () => {
    years.value = await getYears()

    // Если список доступных лет не пустой
    if (yearOptions.value?.length) {
      /**
       * Выбираем значение по умолчанию.
       *
       * - Если есть требуемый год, пытаемся выбрать его.
       * - Если текущий год есть в списке, выбираем его.
       * - Иначе выбираем первый год в списке.
       */
      selectedYear.value =
        getYearInList(props.desiredYear) ??
        getYearInList(currentYear) ??
        yearOptions.value?.[0]
    }
  }
)

/** Доступные года, преобразованные в список для `VSelect` */
const yearOptions = computed<Option<number>[] | undefined>(() => {
  const generatedYears = years.value?.map((year) => {
    return {
      id: year,
      title: year.toString(),
    }
  })

  if (props.allOption) {
    generatedYears?.push({
      // @ts-expect-error - ID типизирован как null для того, чтобы была возможность выбора всех лет
      id: null,
      title: t("employees.actions.generateReport.reports.allTime"),
    })
  }

  return generatedYears
})

/** Текущий год */
const currentYear = new Date().getFullYear()

/**
 * Функция для получения года в списке лет.
 *
 * @param desiredYear - требуемый год.
 * @returns требуемый год из списка лет.
 */
function getYearInList(desiredYear: number | undefined) {
  // Получаем год из списка
  return yearOptions.value?.find((year) => year.id === desiredYear)
}

/** Выбранный год */
const selectedYear = defineModel<Option<number> | undefined>({
  required: true,
}) as Ref<Option<number>>

// Если список доступных лет не пустой
if (yearOptions.value?.length) {
  /**
   * Выбираем значение по умолчанию.
   *
   * - Если есть требуемый год, пытаемся выбрать его.
   * - Если текущий год есть в списке, выбираем его.
   * - Иначе выбираем первый год в списке.
   */
  selectedYear.value =
    getYearInList(props.desiredYear) ??
    getYearInList(currentYear) ??
    yearOptions.value?.[0]
}
</script>

<template>
  <LazyVSelect
    v-if="yearOptions?.length"
    v-model="selectedYear"
    :button-style="isButtonStyleDisabled ? 'none' : 'secondary'"
    :class="{ 'h-8': !isButtonStyleDisabled }"
    data-test-id="selectedYear"
    icon="SvgoChevronDown"
    open-to-left
    :options="yearOptions"
  />
</template>
