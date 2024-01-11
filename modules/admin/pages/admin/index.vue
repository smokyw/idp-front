<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin",
})

/** Показывать ли архивных сотрудников */
const showArchive = ref(false)
/** Выбранные роли */
const selectedRoles = ref(new Set<number>())
/** Выбранные интеграции */
const selectedSources = ref(new Set<string>())
/** Выбранные даты */
const selectedDates = ref<{
  from: Date | undefined
  to: Date | undefined
}>({
  from: undefined,
  to: undefined,
})
/** Выбранные подразделения */
const selectedDivisions = ref([])
</script>

<template>
  <div class="grid h-full grid-cols-[16.25rem_1fr] gap-x-4">
    <div class="flex flex-col gap-y-2">
      <AdminEmployeesFiltersArchive
        v-model="showArchive"
        data-test-id="showArchive"
      />
      <AdminEmployeesFiltersRoles
        v-model="selectedRoles"
        data-test-id="selectedRoles"
      />
      <AdminEmployeesFiltersDivisions
        v-model="selectedDivisions"
        data-test-id="selectedDivisions"
      />
      <AdminEmployeesFiltersDate
        v-model="selectedDates"
        data-test-id="selectedDates"
      />
      <AdminEmployeesFiltersSources
        v-model="selectedSources"
        data-test-id="selectedSources"
      />
    </div>
    <AdminEmployees
      :dates="selectedDates"
      :divisions="selectedDivisions"
      :roles="selectedRoles"
      :show-archive="showArchive"
      :sources="selectedSources"
    />
    <NuxtPage />
  </div>
</template>
