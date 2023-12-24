<script setup lang="ts">
import type { EmployeesEmployeeBriefDetailsSuccessResponse } from "@/Api"

defineProps<{
  /** Информация о сотруднике */
  employee: NonNullable<
    EmployeesEmployeeBriefDetailsSuccessResponse["data"]
  >["success"]
}>()

const { t } = useI18n()

/** Ссылки */
const links = [
  {
    id: "/",
    title: t("navigation.developmentPlan"),
  },
  {
    id: "/profile",
    title: t("employees.page.profile"),
  },
] as const
</script>

<template>
  <div class="flex flex-col gap-y-px">
    <div
      class="flex flex-col divide-y divide-neutral-100 rounded-2xl bg-white px-4 shadow-base"
    >
      <div class="py-4">
        <NuxtLinkLocale class="button sm outlined" to="/employees">
          <Icon class="fill-neutral-900" name="SvgoChevronLeft" size="16" />
          <span>{{ t("employees.page.return") }}</span>
        </NuxtLinkLocale>
      </div>
      <div class="flex items-center gap-x-4 py-4">
        <div
          class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-200 text-display-xs font-semibold text-neutral"
        >
          {{ useUserDisplay(employee).getFirstLetters() }}
        </div>
        <div class="flex flex-col gap-y-1">
          <h1 class="text-display-xs font-semibold">
            {{ useUserDisplay(employee).getFullName() }}
          </h1>
          <p
            class="w-max rounded-lg border border-neutral-100 px-2.5 py-1.5 text-xs text-neutral"
          >
            {{ `ID ${employee?.id}` }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-x-1 rounded-2xl bg-white p-4">
      <NuxtLinkLocale
        v-for="link in links"
        :key="link.id"
        class="rounded-xl p-2.5 text-neutral"
        exact-active-class="bg-neutral-100 text-neutral-900"
        :to="{
          path: `/employees/${employee?.id}${link.id}`,
          query: {
            year: useRoute().query.year,
          },
        }"
      >
        {{ link.title }}
      </NuxtLinkLocale>
    </div>
  </div>
</template>
