<script setup lang="ts">
withDefaults(
  defineProps<{
    /** `ID` инпута */
    id: string
    /** Название инпута */
    label?: string
    /**
     * Максимальное количество символов.
     *
     * @defaultValue `500`
     */
    maxlength?: number
    /** Атрибут `placeholder` */
    placeholder?: string
    /**
     * Является ли поле обязательным для заполнения.
     *
     * @defaultValue `true`
     */
    required?: boolean
    /**
     * Количество строк.
     *
     * @defaultValue `4`
     */
    rows?: number
    /** Показывать ли счетчик символов */
    showCounter?: boolean
  }>(),
  {
    maxlength: 500,
    required: true,
    rows: 4,
  }
)

/** Значение инпута */
const modelValue = defineModel<string>({ default: "", local: true })
</script>

<template>
  <VField :id="id" :label="label" :required="required">
    <textarea
      :id="id"
      v-model="modelValue"
      data-test-id="modelValue"
      :maxlength="maxlength"
      :name="id"
      :placeholder="placeholder"
      :required="required"
      :rows="rows"
    />
    <span v-if="showCounter" class="-mb-1 text-sm text-neutral">
      {{ `${modelValue?.length}/${maxlength}` }}
    </span>
  </VField>
</template>
