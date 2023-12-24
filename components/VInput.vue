<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Подсказка */
    hint?: string
    /** `ID` инпута */
    id: string
    /** Название инпута */
    label?: string
    /** Атрибут `placeholder` */
    placeholder?: string
    /**
     * Является ли поле обязательным для заполнения.
     *
     * @defaultValue `true`
     */
    required?: boolean
    /**
     * Тип поля.
     *
     * @defaultValue `text`
     */
    type?: "date" | "email" | "number" | "password" | "text"
  }>(),
  {
    required: true,
    type: "text",
  }
)

/** Значение инпута */
const modelValue = defineModel<Date | number | string>({ local: true })
</script>

<template>
  <VField :id="id" :label="label" :required="required">
    <input
      :id="id"
      :ref="id"
      v-model="modelValue"
      data-test-id="modelValue"
      :name="id"
      :placeholder="placeholder"
      :required="required"
      :type="type"
    />
    <span v-if="hint" class="-mt-1 text-sm text-neutral">{{ hint }}</span>
  </VField>
</template>
