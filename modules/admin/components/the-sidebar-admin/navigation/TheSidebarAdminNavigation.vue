<script setup lang="ts">
import type { NavigationLink } from "@/types/Utils"

const { t } = useI18n()

/** Список страниц в навигации */
const navigation: NavigationLink[] = [
  {
    icon: "SvgoUsersAdmin",
    title: t("navigation.employees"),
    url: "/admin",
  },
]
</script>

<template>
  <nav
    class="flex h-full items-center justify-around lg:h-auto lg:flex-col lg:items-start lg:justify-normal lg:gap-y-2"
  >
    <TheSidebarAdminNavigationCard
      v-for="link in navigation"
      :key="link.url"
      :link="link"
    />
  </nav>
</template>
