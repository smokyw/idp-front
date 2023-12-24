<script setup lang="ts">
defineProps<{
  /** `ID` поля для выставления `for` */
  id: string
  /** Название поля */
  label?: string
  /** Является ли поле обязательным для заполнения */
  required?: boolean
}>()
</script>

<template>
  <div class="flex flex-col gap-y-3">
    <label v-if="label" class="text-sm font-medium" :for="id">
      <span>{{ label }}</span>
      <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
      <span v-if="required" class="text-error">*</span>
    </label>
    <slot />
  </div>
</template>
