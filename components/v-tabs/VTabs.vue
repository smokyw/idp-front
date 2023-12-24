<script setup lang="ts">
import type { Tab } from "@/types/Utils"

defineProps<{
  /** Вкладки */
  tabs: Tab[]
}>()

const modelValue = defineModel<Tab["id"]>({
  required: true,
})
</script>

<template>
  <HeadlessRadioGroup
    v-model="modelValue"
    as="div"
    class="flex w-max rounded-full bg-neutral-200 p-1"
    data-test-id="modelValue"
  >
    <VTabsCard
      v-for="tab in tabs"
      :key="tab.id"
      :counter="tab.counter"
      is-radio-button
      :tab="tab"
    />
  </HeadlessRadioGroup>
</template>
