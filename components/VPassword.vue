<script setup lang="ts">
withDefaults(
  defineProps<{
    /**
     * Параметр `autocomplete`.
     */
    autocomplete?: "current-password" | "new-password"
    /** Подсказка */
    hint?: string
    /**
     * `ID` инпута.
     *
     * @defaultValue `password`
     */
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
    id: "password",
    required: true,
  }
)

/** Значение инпута */
const modelValue = defineModel<string>({ local: true })

/** Показан ли пароль */
const isPasswordShown = ref(false)
</script>

<template>
  <VField :id="id" :label="label" :required="required">
    <div class="relative flex items-center">
      <input
        :id="id"
        v-model="modelValue"
        :autocomplete="autocomplete"
        data-test-id="modelValue"
        :name="id"
        :placeholder="placeholder"
        :required="required"
        :type="isPasswordShown ? 'text' : 'password'"
      />
      <div
        class="absolute right-4 flex cursor-pointer items-center justify-center rounded-lg p-1 hover:bg-neutral-200"
        data-test-id="isPasswordShown"
        @click="isPasswordShown = !isPasswordShown"
      >
        <Icon
          :name="isPasswordShown ? 'SvgoEyeOffOutline' : 'SvgoEyeDuotone'"
        />
      </div>
    </div>
    <span v-if="hint" class="-mb-1 text-sm text-neutral">{{ hint }}</span>
  </VField>
</template>
