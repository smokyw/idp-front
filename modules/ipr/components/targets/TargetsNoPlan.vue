<script setup lang="ts">
defineProps<{
  /** Текст на кнопке */
  button?: string
  /** Описание блока */
  description: string
  /** Показывать ли фон */
  showBackground?: boolean
  /** Заголовок блока */
  title: string
}>()

const emit = defineEmits<{
  /** Нажата кнопка */
  buttonClicked: []
}>()
</script>

<template>
  <div
    class="flex h-48 flex-col items-center justify-center gap-y-6 text-center"
    :class="{ 'rounded-2xl bg-white p-4': showBackground }"
  >
    <div class="flex flex-col gap-y-2">
      <h2 class="text-lg font-semibold">
        {{ title }}
      </h2>
      <p class="text-neutral">
        {{ description }}
      </p>
    </div>
    <button
      v-if="button"
      class="button primary md"
      data-test-id="isCreateIdpPopupOpened"
      @click="emit('buttonClicked')"
    >
      {{ button }}
    </button>
  </div>
</template>
