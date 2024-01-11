<script setup lang="ts">
const { t } = useI18n()

/** Показывать ли архивных сотрудников */
const showArchive = defineModel({
  required: true,
})
</script>

<template>
  <div
    class="flex flex-col overflow-hidden rounded-md border border-neutral-200 bg-white"
  >
    <span
      v-for="(button, index) in [false, true]"
      :key="index"
      class="px-4 py-2.5"
      :class="[
        showArchive === button ? 'bg-primary text-white' : 'cursor-pointer',
      ]"
      data-test-id="showArchive"
      @click="showArchive = button"
    >
      {{ t(`admin.employees.filters.archive.${button}`) }}
    </span>
  </div>
</template>
