<script setup lang="ts">
defineProps<{
  /** `ID` поля для выставления `for` */
  id: string
  /** Название поля */
  label?: string
  /** Является ли поле обязательным для заполнения */
  required?: boolean
}>()

/** Слоты компонента */
const slots = useSlots()
</script>

<template>
  <div class="flex flex-col gap-y-3">
    <label
      v-if="label"
      class="field-label flex items-center text-sm font-medium"
      :for="id"
    >
      <span>{{ label }}</span>
      <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
      <span v-if="required" class="text-error">*</span>
      <div v-if="slots.label" class="ml-auto">
        <slot name="label" />
      </div>
    </label>
    <slot />
  </div>
</template>
