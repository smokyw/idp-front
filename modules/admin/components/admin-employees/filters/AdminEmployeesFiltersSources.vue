<script setup lang="ts">
const { t } = useI18n()

/** Список доступных ролей */
const sources = await useApi().admin.adminPanelGetUserSources({
  headers: useAuth().generateHeaders(),
})

/** Выбранные роли */
const selectedSources = defineModel<Set<string>>({
  required: true,
})

/**
 * Функция для выбора всех интеграций.
 *
 * Если все интеграции из списка выбраны, очищаем выбранные интеграции.
 * Иначе добавляем все интеграции в список.
 */
function selectAll() {
  // Если все интеграции выбраны
  if (isAllSelected.value) {
    // Очищаем выбранные интеграции
    sources.data.data?.success?.forEach((source) =>
      selectedSources.value.delete(source)
    )
  } else {
    // Иначе добавляем все интеграции в список
    sources.data.data?.success?.forEach((source) =>
      selectedSources.value.add(source)
    )
  }
}

/** Выбраны ли все интеграции */
const isAllSelected = computed(() => {
  return sources.data.data?.success?.every((source) =>
    selectedSources.value.has(source)
  )
})
</script>

<template>
  <HeadlessDisclosure
    as="div"
    class="flex flex-col gap-y-3 rounded-md border border-neutral-200 bg-white p-4"
    default-open
  >
    <HeadlessDisclosureButton class="flex w-full items-center justify-between">
      <span class="font-medium text-neutral-600">
        {{ t("admin.employees.filters.sources.title") }}
      </span>
      <Icon
        class="fill-neutral-400 ui-open:rotate-180"
        name="SvgoChevronDown"
        size="20"
      />
    </HeadlessDisclosureButton>
    <HeadlessDisclosurePanel class="flex flex-col gap-y-2.5">
      <div class="flex gap-x-2" data-test-id="selectAll" @click="selectAll">
        <input :checked="isAllSelected" type="checkbox" />
        <span>{{ t("system.all") }}</span>
      </div>
      <div
        v-for="source in sources.data.data?.success"
        :key="source"
        class="flex gap-x-2"
      >
        <input
          :id="`source-${source}`"
          v-model="selectedSources"
          data-test-id="selectedSources"
          type="checkbox"
          :value="source"
        />
        <label :for="`source-${source}`">
          {{ t(`admin.employees.filters.sources.values.${source}`) }}
        </label>
      </div>
    </HeadlessDisclosurePanel>
  </HeadlessDisclosure>
</template>
