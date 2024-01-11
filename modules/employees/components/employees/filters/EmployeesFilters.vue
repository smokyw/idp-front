<script setup lang="ts">
import type { EmployeesCollectionFilter } from "@/Api"
import { deepEqual } from "fast-equals"
import { klona } from "klona/json"

defineProps<{
  /** Примененные фильтры */
  appliedFilters: Filters
}>()

const emit = defineEmits<{
  applyFilters: [filters: Filters]
}>()

const { t } = useI18n()

/** Фильтры */
export interface Filters {
  /** Организационная структура */
  divisions: number[]
  /** Показывать ли уволенных сотрудников */
  showArchive: boolean
  /** Статусы */
  statuses: NonNullable<EmployeesCollectionFilter["idp_statuses"]>
}

/** Фильтры по умолчанию */
const defaultFilters = {
  divisions: [],
  showArchive: false,
  statuses: [],
}

/** Статусы ИПР */
const idpStatuses: Record<string, Filters["statuses"]> = {
  approval: ["approval"],
  approved: ["approved"],
  draft: ["draft"],
  no_idp: ["no_idp"],
  not_approved: ["not_approved", "cancelled"],
}

/** Фильтры */
const filters = ref<Filters>(klona(defaultFilters))

/**
 * Выбранные статусы ИПР.
 *
 * Функция собирает все данные от массива `statuses` и возвращает массив статусов ИПР.
 */
const selectedIdpStatuses = computed(() => {
  return filters.value.statuses
    .map((status) => idpStatuses[status])
    .flat()
    .filter(Boolean)
})

/** Открыто ли меню фильтрации по организационной структуре */
const isDivisionsOpened = ref(false)
</script>

<template>
  <HeadlessPopover
    v-slot="{ open }"
    class="relative"
    @vue:updated="filters = klona(appliedFilters)"
  >
    <HeadlessPopoverButton class="button secondary sm relative outline-none">
      <Icon name="SvgoFilterFunnel" size="16" />
      <div
        v-if="!deepEqual(appliedFilters, defaultFilters)"
        class="absolute right-0 top-0 h-2 w-2 rounded-full bg-secondary"
      />
    </HeadlessPopoverButton>
    <div v-if="open" class="fixed inset-0 z-10 bg-neutral-900/25 lg:hidden" />
    <HeadlessPopoverPanel>
      <div
        class="fixed left-1/2 top-1/2 z-20 mt-2 flex -translate-x-1/2 -translate-y-1/2 flex-col divide-y divide-neutral-100 rounded-2xl bg-white shadow-lg lg:absolute lg:left-auto lg:right-0 lg:top-full lg:translate-x-0 lg:translate-y-0"
      >
        <div class="flex items-center justify-between gap-x-10 p-4">
          <HeadlessPopoverButton
            as="button"
            class="font-medium text-primary hover:text-primary-600"
            data-test-id="filters"
            @click="
              () => {
                filters = klona(defaultFilters)
                emit('applyFilters', klona(filters))
              }
            "
          >
            {{ t("system.reset") }}
          </HeadlessPopoverButton>
          <h5 class="text-lg font-semibold">{{ t("system.filters") }}</h5>
          <HeadlessPopoverButton
            as="button"
            class="font-medium text-primary hover:text-primary-600"
            data-test-id="emit"
            @click="
              emit(
                'applyFilters',
                klona({
                  ...filters,
                  statuses: selectedIdpStatuses,
                })
              )
            "
          >
            {{ t("system.apply") }}
          </HeadlessPopoverButton>
        </div>
        <HeadlessDisclosure
          v-slot="{ open: statusOpened }"
          as="div"
          class="flex flex-col gap-y-3 p-4"
          default-open
        >
          <HeadlessDisclosureButton class="flex items-center justify-between">
            <h6 class="mb-1 font-medium">
              {{ t("employees.columns.idp_status") }}
            </h6>
            <Icon
              class="fill-neutral-400"
              :class="{ 'rotate-180': statusOpened }"
              name="SvgoChevronDown"
              size="16"
            />
          </HeadlessDisclosureButton>
          <HeadlessDisclosurePanel class="flex flex-col gap-y-3">
            <div
              v-for="(_, key) in idpStatuses"
              :key="key"
              class="flex items-center gap-x-2"
            >
              <input
                :id="key"
                v-model="filters.statuses"
                data-test-id="filters.statuses"
                type="checkbox"
                :value="key"
              />
              <label :for="key">
                {{ t(`employees.filters.statuses.${key}`) }}
              </label>
            </div>
          </HeadlessDisclosurePanel>
        </HeadlessDisclosure>
        <div class="p-4">
          <div
            class="relative flex cursor-pointer items-center justify-between rounded-lg border border-neutral-200 p-2 hover:bg-neutral-50"
            data-test-id="isDivisionsOpened"
            @click="isDivisionsOpened = true"
          >
            <p>{{ t("employees.filters.divisions.title") }}</p>
            <div class="flex gap-x-2">
              <LazyIcon
                v-if="filters.divisions.length"
                class="fill-neutral-400"
                data-test-id="filters"
                name="SvgoXClose"
                size="16"
                @click.stop="filters.divisions = []"
              />
              <Icon class="fill-neutral-400" name="SvgoDataflow" size="16" />
            </div>
            <div
              v-if="filters.divisions.length"
              class="absolute right-[.1875rem] top-[.1875rem] h-2 w-2 rounded-full bg-secondary"
            />
          </div>
        </div>
        <VSwitch
          v-model="filters.showArchive"
          class="px-4 py-3"
          data-test-id="filters.showArchive"
          :label="t('employees.filters.showAchieved')"
        />
      </div>
      <LazyEmployeesFiltersDivisions
        v-if="isDivisionsOpened"
        :parent-selected-divisions="filters.divisions"
        @close="isDivisionsOpened = false"
        @select-divisions="
          (selectedDivisions) => {
            filters.divisions = selectedDivisions
            isDivisionsOpened = false
          }
        "
      />
    </HeadlessPopoverPanel>
  </HeadlessPopover>
</template>
