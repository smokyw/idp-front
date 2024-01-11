<script setup lang="ts">
defineProps<{
  /** `ID` инпута */
  id: string
  /** Название инпута */
  label: string
}>()

/** Значение чекбокса */
const modelValue = defineModel()
</script>

<template>
  <div class="flex items-center gap-x-2">
    <input
      :id="id"
      v-model="modelValue"
      data-test-id="modelValue"
      type="checkbox"
    />
    <label class="cursor-pointer" :for="id">{{ label }}</label>
  </div>
</template>
