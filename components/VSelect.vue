<script setup lang="ts">
import type { Option } from "@/types/Utils"

defineProps<{
  /** Стиль кнопки */
  buttonStyle: keyof typeof styles
  /** Иконка */
  icon?: string
  /** Является ли заголовок кастомным */
  isTitleCustom?: boolean
  /** Открывать ли меню влево */
  openToLeft?: boolean
  /** Открывать ли меню вверх */
  openToTop?: boolean
  /** Список опций */
  options: Option[]
}>()

/** Выбранное значение */
const modelValue = defineModel<Option>({ required: true })

/** Стили */
const styles = {
  none: "hover:!bg-white",
  outlined:
    "min-w-[11rem] justify-between gap-x-2 rounded-xl border border-neutral-200 px-4 py-2.5",
  secondary: "gap-x-1.5 rounded-lg px-2.5 py-2 shadow-base",
  squared: "!bg-transparent w-10 h-10 justify-center",
} as const
</script>

<template>
  <HeadlessListbox
    v-model="modelValue"
    as="div"
    class="relative"
    data-test-id="modelValue"
  >
    <HeadlessListboxButton
      class="flex items-center bg-white outline-none hover:bg-neutral-200"
      :class="styles[buttonStyle]"
    >
      <slot v-if="isTitleCustom" />
      <span v-else :class="{ 'text-sm': buttonStyle !== 'none' }">
        {{ modelValue.title }}
      </span>
      <LazyIcon v-if="icon" class="fill-neutral-400" :name="icon" size="16" />
    </HeadlessListboxButton>
    <HeadlessListboxOptions
      class="absolute z-20 mt-2 min-w-[16rem] rounded-lg border border-neutral-100 bg-white py-2 outline-none"
      :class="{
        'right-0': openToLeft,
        'bottom-full': openToTop,
        '!min-w-0': buttonStyle === 'none',
      }"
    >
      <HeadlessListboxOption
        v-for="(option, index) in options"
        :key="index"
        v-slot="{ selected, active }"
        :value="option"
      >
        <div
          class="cursor-pointer border-l-2 border-white/0 px-4 py-2 text-sm font-regular"
          :class="{ '!border-primary bg-neutral-50': selected || active }"
        >
          {{ option.title }}
        </div>
      </HeadlessListboxOption>
    </HeadlessListboxOptions>
  </HeadlessListbox>
</template>
