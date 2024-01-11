<script setup lang="ts">
import { vMaska } from "maska"

withDefaults(
  defineProps<{
    /** Подсказка */
    hint?: string
    /** `ID` инпута */
    id?: string
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
  }>(),
  {
    id: "phone",
    placeholder: "+7",
    required: true,
    type: "text",
  }
)

/** Маска для ввода телефона */
const mask = "+7 ### ###-##-##"

/** Значение инпута */
const modelValue = defineModel<string>()
</script>

<template>
  <VField :id="id" :label="label" :required="required">
    <input
      :id="id"
      :ref="id"
      v-model="modelValue"
      v-maska
      autocomplete="tel"
      :data-maska="mask"
      data-test-id="modelValue"
      maxlength="16"
      :name="id"
      pattern="\+\d \d{3} \d{3}-\d{2}-\d{2}"
      :placeholder="placeholder"
      :required="required"
      type="text"
    />
    <span v-if="hint" class="-mt-1 text-sm text-neutral">{{ hint }}</span>
  </VField>
</template>
