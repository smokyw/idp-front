<script setup lang="ts">
import type { NavigationLink } from "@/types/Utils"

defineProps<{
  /** Ссылка навигации */
  link: NavigationLink
}>()
</script>

<template>
  <LazyNuxtLinkLocale
    v-if="!link.accessRight || useUserStore().checkRight(link.accessRight!)"
    active-class="bg-white"
    class="group flex items-center gap-x-3 rounded-lg p-2.5 hover:bg-white lg:w-full"
    :to="link.url"
  >
    <LazyIcon
      class="fill-neutral-400 group-[.router-link-exact-active]:fill-primary"
      :name="link.icon"
    />
    <p
      class="hidden text-neutral group-[.router-link-exact-active]:text-neutral-800 lg:block"
    >
      {{ link.title }}
    </p>
  </LazyNuxtLinkLocale>
</template>
