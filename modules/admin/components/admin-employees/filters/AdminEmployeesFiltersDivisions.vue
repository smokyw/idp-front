<script setup lang="ts">
const { t } = useI18n()

/** Выбранные подразделения */
const selectedDivisions = defineModel<number[]>({
  required: true,
})

/** Открыто ли меню фильтрации по организационной структуре */
const isDivisionsOpened = ref(false)
</script>

<template>
  <HeadlessDisclosure
    as="div"
    class="flex flex-col gap-y-3 rounded-md border border-neutral-200 bg-white p-4"
    default-open
  >
    <HeadlessDisclosureButton class="flex w-full items-center justify-between">
      <span class="font-medium text-neutral-600">
        {{ t("admin.employees.filters.divisions.title") }}
      </span>
      <Icon
        class="fill-neutral-400 ui-open:rotate-180"
        name="SvgoChevronDown"
        size="20"
      />
    </HeadlessDisclosureButton>
    <HeadlessDisclosurePanel class="flex flex-col gap-y-2.5">
      <div
        class="flex cursor-pointer items-center gap-x-1 rounded-md border border-neutral-200 p-2 hover:bg-neutral-50"
        data-test-id="isDivisionsOpened"
        @click="isDivisionsOpened = true"
      >
        <Icon class="fill-neutral-400" name="SvgoDataflow" size="16" />
        <p class="text-neutral-600">
          {{ t("admin.employees.filters.divisions.selectDivision") }}
        </p>
      </div>
    </HeadlessDisclosurePanel>
    <LazyEmployeesFiltersDivisions
      v-if="isDivisionsOpened"
      :parent-selected-divisions="selectedDivisions"
      @close="isDivisionsOpened = false"
      @select-divisions="
        (divisions) => {
          selectedDivisions = divisions
          isDivisionsOpened = false
        }
      "
    />
  </HeadlessDisclosure>
</template>
