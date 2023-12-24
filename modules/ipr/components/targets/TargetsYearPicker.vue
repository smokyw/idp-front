<script setup lang="ts">
import type { IdpIdpDetailsBriefView } from "@/Api"

const props = defineProps<{
  /** Год для выбора */
  desiredYear?: number
  /** `ID` сотрудника */
  employeeId?: number
}>()

/** Годы, доступные пользователю */
const years = await useApi().idp.idpGetCollection(
  {
    employee_id: toRefs(props).employeeId?.value,
  },
  {
    headers: useAuth().generateHeaders(),
  }
)

/** Выбранный год */
const modelValue = defineModel<IdpIdpDetailsBriefView | undefined>({
  required: true,
})

/**
 * Функция для получения года в списке.
 *
 * @param desiredYear - искомый год.
 * @returns год в списке.
 */
function getYearInList(desiredYear: number) {
  return years.data.data?.success?.find((year) => year.year === desiredYear)
}

/** Текущий год */
const currentYear = new Date().getFullYear()

// Если текущий год есть в списке лет
if (props.desiredYear && getYearInList(toRefs(props).desiredYear!.value!)) {
  // Выбираем его по умолчанию
  modelValue.value = getYearInList(props.desiredYear)
} else if (getYearInList(currentYear)) {
  // Или есть в списке есть год для выбора
  modelValue.value = getYearInList(currentYear)
} else {
  // Иначе выбираем первый год из списка
  modelValue.value = years.data.data?.success?.[0]
}
</script>

<template>
  <HeadlessListbox
    v-if="modelValue"
    v-model="modelValue"
    as="div"
    class="relative z-20"
    data-test-id="modelValue"
  >
    <HeadlessListboxButton class="flex items-center gap-x-1 outline-none">
      <span>{{ modelValue.year }}</span>
      <Icon class="fill-neutral-400" name="SvgoChevronDown" size="16" />
    </HeadlessListboxButton>
    <HeadlessListboxOptions
      class="absolute mt-1 w-full rounded-lg border border-neutral-100 bg-white py-2 outline-none"
    >
      <HeadlessListboxOption
        v-for="year in years.data.data?.success"
        :key="year.id"
        class="cursor-pointer border-l-2 border-white/0 px-4 py-2 text-sm font-regular ui-selected:border-primary ui-selected:bg-neutral-50"
        :value="year"
      >
        {{ year.year }}
      </HeadlessListboxOption>
    </HeadlessListboxOptions>
  </HeadlessListbox>
  <span v-else-if="desiredYear">{{ desiredYear }}</span>
</template>
