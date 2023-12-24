<script setup lang="ts">
import type { NoSidebarLayoutOptions } from "@/layouts/no-sidebar.vue"
import type { Filters } from "@/modules/employees/components/employees/filters/EmployeesFilters.vue"
import type { tabId } from "@/modules/employees/components/employees/filters/EmployeesFiltersStatuses.vue"
import type { Option } from "~/types/Utils"

const { t } = useI18n()

useSeoMeta({
  title: t("navigation.employees"),
})

definePageMeta({
  layout: "no-sidebar",
})

// Экспозим параметры для layout
defineExpose<NoSidebarLayoutOptions>({ fixed: true })

/** Выбранный год */
const selectedYear = ref<Option<number>>()

/** Поисковой запрос */
const search = ref("")
/** Замедленный поисковой запрос */
const debouncedSearch = debouncedRef(search, 300)

/** Выбранная вкладка по необходимости действия */
const actionStatusesTab = ref<tabId>("actionRequired")
/** Количество результатов на текущей вкладке */
const currentActionStatusesTabCount = ref<number>()
provide("currentActionStatusesTabCount", currentActionStatusesTabCount)

/** Фильтры */
const filters = ref<Filters>({
  divisions: [],
  showArchive: false,
  statuses: [],
})
</script>

<template>
  <div>
    <h1 class="page-title">
      {{ t("navigation.employees") }}
    </h1>
    <div
      class="flex flex-col justify-between gap-y-4 sm:flex-row sm:items-center"
    >
      <LazyEmployeesFiltersStatuses
        v-if="selectedYear"
        v-model="actionStatusesTab"
        data-test-id="actionStatusesTab"
        :divisions="filters.divisions"
        :idp-statuses="filters.statuses"
        :search="debouncedSearch.length > 2 ? debouncedSearch : ''"
        :show-archive="filters.showArchive"
        :year="selectedYear?.id"
      />
      <div class="flex h-8 justify-between gap-x-2 sm:justify-normal">
        <div class="relative hidden w-[17rem] items-center md:flex">
          <input
            v-model.trim="search"
            class="h-8 rounded-lg px-3 text-sm"
            data-test-id="search"
            :placeholder="t('employees.search')"
            type="text"
          />
          <LazyIcon
            v-if="search.length"
            class="absolute right-3 cursor-pointer fill-neutral-400"
            data-test-id="search"
            name="SvgoXClose"
            size="16"
            @click="search = ''"
          />
        </div>
        <EmployeesFiltersYears
          v-model="selectedYear"
          data-test-id="selectedYear"
        />
        <EmployeesFilters
          :applied-filters="filters"
          @apply-filters="filters = $event"
        />
      </div>
    </div>
    <LazyEmployees
      v-if="selectedYear"
      :action-required-only="actionStatusesTab === 'actionRequired'"
      :divisions="filters.divisions"
      :idp-statuses="filters.statuses"
      :search="debouncedSearch.length > 2 ? debouncedSearch : ''"
      :show-archive="filters.showArchive"
      :year="selectedYear?.id"
    />
  </div>
</template>
