<script setup lang="ts">
import type { Option } from "@/types/Utils"

defineProps<{
  /** Счетчик */
  counter?: number
  /** Является ли кнопка компонентом `RadioGroupOption` */
  isRadioButton?: boolean
  /** Вкладка */
  tab: Option
}>()

const HeadlessRadioGroupOption = resolveComponent("HeadlessRadioGroupOption")
</script>

<template>
  <component
    :is="isRadioButton ? HeadlessRadioGroupOption : 'div'"
    class="flex h-8 items-center justify-center gap-x-1.5 rounded-full px-3 ui-checked:bg-white ui-not-checked:cursor-pointer ui-selected:bg-white ui-not-selected:cursor-pointer"
    :value="tab.id"
  >
    <span
      class="text-sm font-medium text-neutral ui-checked:text-neutral-900 ui-selected:text-neutral-900 sm:text-md"
    >
      {{ tab.title }}
    </span>
    <span
      v-if="counter"
      class="flex h-[1.125rem] items-center justify-center rounded bg-neutral-200 px-[0.3125rem] text-xs text-neutral"
    >
      {{ counter }}
    </span>
  </component>
</template>
