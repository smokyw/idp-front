<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"

const { locale, t } = useI18n()

/** Выбранные даты */
const selectedDates = defineModel<{
  from: Date | undefined
  to: Date | undefined
}>({
  required: true,
})
</script>

<template>
  <HeadlessDisclosure
    as="div"
    class="flex flex-col gap-y-3 rounded-md border border-neutral-200 bg-white p-4"
    default-open
  >
    <HeadlessDisclosureButton class="flex w-full items-center justify-between">
      <span class="font-medium text-neutral-600">
        {{ t("admin.employees.filters.date") }}
      </span>
      <Icon
        class="fill-neutral-400 ui-open:rotate-180"
        name="SvgoChevronDown"
        size="20"
      />
    </HeadlessDisclosureButton>
    <HeadlessDisclosurePanel class="flex flex-col gap-y-2.5">
      <VueDatePicker
        v-model="selectedDates.from"
        auto-apply
        class="font-sans"
        data-test-id="selectedDates.from"
        :enable-time-picker="false"
        format="dd.MM.yyyy"
        :locale="locale"
        :month-change-on-scroll="false"
        :placeholder="t('system.from')"
        required
        text-input
      />
      <VueDatePicker
        v-model="selectedDates.to"
        auto-apply
        class="font-sans"
        data-test-id="selectedDates.to"
        :enable-time-picker="false"
        format="dd.MM.yyyy"
        :locale="locale"
        :month-change-on-scroll="false"
        :placeholder="t('system.to')"
        required
        text-input
      />
    </HeadlessDisclosurePanel>
  </HeadlessDisclosure>
</template>

<style>
:root {
  --dp-border-radius: 0.375rem; /* Радиус скругления границы */
  --dp-cell-border-radius: 0.375rem; /* Радиус скругления границы для ячейки календаря */

  /*Размеры*/
  --dp-button-height: 2rem; /* Размер для кнопок в оверлее */
  --dp-month-year-row-height: 2rem; /* Высота строки выбора месяца-года */
  --dp-month-year-row-button-size: 2rem; /*Специфическая высота для кнопок "следующий"/"предыдущий"*/
  --dp-button-icon-height: 1rem; /* Размер иконки в кнопках */
  --dp-cell-size: 2.25rem; /* Ширина и высота ячейки календаря */
  --dp-input-icon-padding: 2.5rem; /* Отступ слева в инпуте при наличии иконки */
  --dp-input-padding: 0.5rem 1rem; /* Отступ в поле ввода */
  --dp-row-margin: 0; /*Настройка промежутка между строками в календаре*/
  --dp-menu-padding: 1.25rem; /* Отступ меню выбора */

  /*Размеры шрифта*/
  --dp-font-size: 0.875rem; /*Размер шрифта по умолчанию*/
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
  @apply h-5 w-5 fill-neutral-400 stroke-neutral-400;
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
