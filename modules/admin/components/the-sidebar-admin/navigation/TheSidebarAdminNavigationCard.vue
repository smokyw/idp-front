<script setup lang="ts">
import type { NavigationLink } from "@/types/Utils"

defineProps<{
  /** Ссылка навигации */
  link: NavigationLink
}>()
</script>

<template>
  <NuxtLinkLocale
    active-class="bg-primary-50 border-primary-200"
    class="group flex items-center gap-x-3 rounded-lg border p-2.5 lg:w-full"
    :to="link.url"
  >
    <Icon
      class="fill-neutral-400 group-[.router-link-exact-active]:fill-primary"
      :name="link.icon"
      size="20"
    />
  </NuxtLinkLocale>
</template>
