<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"

const props = defineProps<{
  /** Крайний срок цели */
  deadline?: string
  /** Год создания цели */
  idpId: number
  /** Год цели */
  year?: number
}>()

/** Год цели */
const year =
  props.year ??
  (
    await useApi().idp.idpGetIdpDetails(
      toRefs(props).idpId.value,
      {},
      {
        headers: useAuth().generateHeaders(),
      }
    )
  ).data.data?.success?.year

const { locale } = useI18n()

/** Текущий год */
const currentYear = new Date().getFullYear()

/** Первый день года */
const firstDayOfYear = new Date(year ?? currentYear, 0, 1) // 0 - январь, 1 - день

/** Последний день года */
const lastDayOfYear = new Date(year ?? currentYear, 11, 31) // 11 - декабрь, 31 - день

/** Начальная дата календаря */
const minDate = computed(() => {
  return year === currentYear ? new Date() : firstDayOfYear
})

/**
 * Выбранный крайний срок цели.
 *
 * По умолчанию - 31 декабря текущего года или крайний срок цели.
 */
const targetDeadline = defineModel<Date | undefined>({ required: true })

/**
 * Выставляем значение крайнего срока по умолчанию
 *
 * - Если передан крайний срок, то он является значением.
 * - Если не передан, то выставляется 31 декабря текущего года.
 */
targetDeadline.value = toRefs(props).deadline?.value
  ? useDateConverter().parseDate(toRefs(props).deadline?.value ?? "")
  : lastDayOfYear
</script>

<template>
  <VueDatePicker
    v-model="targetDeadline"
    auto-apply
    class="!w-max font-sans [&>div]:w-max"
    :clearable="false"
    data-test-id="targetDeadline"
    :enable-time-picker="false"
    format="dd.MM.yyyy"
    :locale="locale"
    :max-date="lastDayOfYear"
    :min-date="minDate"
    :month-change-on-scroll="false"
    required
    text-input
  />
</template>

<style>
:root {
  --dp-border-radius: 0.75rem; /* Радиус скругления границы */
  --dp-cell-border-radius: 0.375rem; /* Радиус скругления границы для ячейки календаря */

  /*Размеры*/
  --dp-button-height: 2rem; /* Размер для кнопок в оверлее */
  --dp-month-year-row-height: 2rem; /* Высота строки выбора месяца-года */
  --dp-month-year-row-button-size: 2rem; /*Специфическая высота для кнопок "следующий"/"предыдущий"*/
  --dp-button-icon-height: 1rem; /* Размер иконки в кнопках */
  --dp-cell-size: 2.25rem; /* Ширина и высота ячейки календаря */
  --dp-input-icon-padding: 1rem; /* Отступ слева в инпуте при наличии иконки */
  --dp-input-padding: 0.5rem 1rem; /* Отступ в поле ввода */
  --dp-row-margin: 0; /*Настройка промежутка между строками в календаре*/
  --dp-menu-padding: 1.25rem; /* Отступ меню выбора */

  /*Размеры шрифта*/
  --dp-font-size: 0.875rem; /*Размер шрифта по умолчанию*/
}

.dp__input_wrap {
  @apply w-44;
}

.dp__theme_light {
  --dp-primary-color: #0091ff;
  --dp-secondary-color: #9ba3af;
  --dp-border-color: #e5e7eb;
  --dp-menu-border-color: #e5e7eb;
}

.dp__calendar_header_separator {
  @apply hidden;
}

.dp__input {
  @apply transition-none focus:border-primary;
}

.dp__input_focus {
  @apply border-neutral-200;
}

.dp__input_icon {
  @apply right-0 h-5 w-5 fill-neutral-400 stroke-neutral-400;
  inset-inline-start: auto;
}

.dp__calendar_header_item {
  @apply font-medium text-neutral-400;
}

.dp__arrow_bottom,
.dp__arrow_top {
  @apply hidden;
}

.dp--menu-wrapper {
  @apply !left-0;
}

.dp__month_year_wrap {
  @apply order-first gap-x-2.5;
}

.dp__month_year_select {
  @apply w-max px-2 font-medium;
}

.dp__menu {
  @apply w-80 shadow-lg;
}

.dp__active_date {
  @apply relative before:absolute before:bottom-1 before:h-1 before:w-1 before:rounded-full before:bg-white;
}

.dp__calendar_row:first-child {
  @apply mt-0;
}

.dp__calendar_row:last-child {
  @apply mb-0;
}

.dp__overlay_cell_disabled {
  @apply !text-neutral-400;
}
</style>
